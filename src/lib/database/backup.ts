import { createAdminClient } from '../supabase'

// Backup configuration for Supabase
export interface BackupConfig {
  retentionDays: number
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  includeTables: string[]
  excludeColumns?: Record<string, string[]>
}

export const DEFAULT_BACKUP_CONFIG: BackupConfig = {
  retentionDays: 30,
  backupFrequency: 'daily',
  includeTables: [
    'profiles',
    'cv_documents',
    'job_descriptions',
    'cv_analyses',
    'interview_questions',
    'cv_optimizations',
    'payment_records',
    'user_sessions'
  ],
  excludeColumns: {
    // Exclude sensitive data from backups
    profiles: ['stripe_customer_id', 'stripe_subscription_id'],
    payment_records: ['stripe_payment_intent_id', 'metadata'],
    user_sessions: ['ip_address', 'user_agent']
  }
}

/**
 * Data cleanup functions for GDPR compliance and storage optimization
 */
export class DatabaseMaintenance {
  private supabase = createAdminClient()

  /**
   * Clean up expired guest sessions (older than 24 hours)
   */
  async cleanupGuestSessions(): Promise<{ deleted: number; error?: string }> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { count, error } = await this.supabase
        .from('user_sessions')
        .delete({ count: 'exact' })
        .is('user_id', null)
        .lt('created_at', twentyFourHoursAgo)

      if (error) throw error

      return { deleted: count || 0 }
    } catch (error) {
      return { 
        deleted: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Clean up old CV files for free users (older than 30 days)
   */
  async cleanupOldCVFiles(): Promise<{ deleted: number; error?: string }> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      // First get free users' IDs
      const { data: freeUsers, error: usersError } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('subscription_status', 'free')

      if (usersError) throw usersError
      if (!freeUsers || freeUsers.length === 0) {
        return { deleted: 0 }
      }

      const freeUserIds = freeUsers.map(user => user.id)

      // Get free users' old CV documents
      const { data: oldCVs, error: fetchError } = await this.supabase
        .from('cv_documents')
        .select('id, user_id, file_url')
        .lt('created_at', thirtyDaysAgo)
        .in('user_id', freeUserIds)

      if (fetchError) throw fetchError

      if (!oldCVs || oldCVs.length === 0) {
        return { deleted: 0 }
      }

      // Delete files from storage if they exist
      const filesToDelete = oldCVs
        .filter(cv => cv.file_url)
        .map(cv => cv.file_url!)

      if (filesToDelete.length > 0) {
        const { error: storageError } = await this.supabase.storage
          .from('cv-uploads')
          .remove(filesToDelete)

        if (storageError) {
          console.warn('Some files could not be deleted from storage:', storageError)
        }
      }

      // Delete database records
      const { count, error: deleteError } = await this.supabase
        .from('cv_documents')
        .delete({ count: 'exact' })
        .in('id', oldCVs.map(cv => cv.id))

      if (deleteError) throw deleteError

      return { deleted: count || 0 }
    } catch (error) {
      return { 
        deleted: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Archive old analysis results (older than 90 days) for free users
   */
  async archiveOldAnalyses(): Promise<{ archived: number; error?: string }> {
    try {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      
      // First get free users' IDs
      const { data: freeUsers, error: usersError } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('subscription_status', 'free')

      if (usersError) throw usersError
      if (!freeUsers || freeUsers.length === 0) {
        return { archived: 0 }
      }

      const freeUserIds = freeUsers.map(user => user.id)

      // For now, we'll just delete old analyses for free users
      // In production, you might want to move them to a separate archive table
      const { count, error } = await this.supabase
        .from('cv_analyses')
        .delete({ count: 'exact' })
        .lt('created_at', ninetyDaysAgo)
        .in('user_id', freeUserIds)

      if (error) throw error

      return { archived: count || 0 }
    } catch (error) {
      return { 
        archived: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Run all maintenance tasks
   */
  async runMaintenanceTasks(): Promise<{
    guestSessions: { deleted: number; error?: string }
    oldCVFiles: { deleted: number; error?: string }
    oldAnalyses: { archived: number; error?: string }
  }> {
    const [guestSessions, oldCVFiles, oldAnalyses] = await Promise.all([
      this.cleanupGuestSessions(),
      this.cleanupOldCVFiles(),
      this.archiveOldAnalyses()
    ])

    return {
      guestSessions,
      oldCVFiles,
      oldAnalyses
    }
  }
}

/**
 * Database health check functions
 */
export class DatabaseHealthCheck {
  private supabase = createAdminClient()

  /**
   * Check database connection and basic functionality
   */
  async checkHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    checks: Record<string, boolean>
    metrics?: Record<string, number>
  }> {
    const checks: Record<string, boolean> = {}
    const metrics: Record<string, number> = {}

    try {
      // Test basic connection
      const start = Date.now()
      const { error: connectionError } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      checks.connection = !connectionError
      metrics.connectionTime = Date.now() - start

      // Check table sizes
      const tables = ['profiles', 'cv_documents', 'cv_analyses', 'payment_records']
      for (const table of tables) {
        try {
          const { count, error } = await this.supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
          
          checks[`${table}_accessible`] = !error
          if (count !== null) {
            metrics[`${table}_count`] = count
          }
        } catch {
          checks[`${table}_accessible`] = false
        }
      }

      // Determine overall status
      const passedChecks = Object.values(checks).filter(Boolean).length
      const totalChecks = Object.values(checks).length
      
      let status: 'healthy' | 'degraded' | 'unhealthy'
      if (passedChecks === totalChecks) {
        status = 'healthy'
      } else if (passedChecks >= totalChecks * 0.7) {
        status = 'degraded'
      } else {
        status = 'unhealthy'
      }

      return { status, checks, metrics }
    } catch {
      return {
        status: 'unhealthy',
        checks: { connection: false },
        metrics: {}
      }
    }
  }
}

// Export instances for use in API routes
export const databaseMaintenance = new DatabaseMaintenance()
export const databaseHealthCheck = new DatabaseHealthCheck() 