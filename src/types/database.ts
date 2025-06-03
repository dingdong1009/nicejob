export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: 'free' | 'premium'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          usage_limits: {
            cvAnalysis: number
            interviewQuestions: number
            cvOptimization: number
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          usage_limits?: {
            cvAnalysis: number
            interviewQuestions: number
            cvOptimization: number
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: 'free' | 'premium'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          usage_limits?: {
            cvAnalysis: number
            interviewQuestions: number
            cvOptimization: number
          }
          created_at?: string
          updated_at?: string
        }
      }
      cv_documents: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          file_url: string | null
          file_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          file_url?: string | null
          file_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          file_url?: string | null
          file_type?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_descriptions: {
        Row: {
          id: string
          user_id: string
          title: string
          company: string | null
          description: string
          requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          company?: string | null
          description: string
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          company?: string | null
          description?: string
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cv_analyses: {
        Row: {
          id: string
          user_id: string
          cv_document_id: string
          job_description_id: string | null
          analysis_result: CVAnalysisResult
          match_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cv_document_id: string
          job_description_id?: string | null
          analysis_result: CVAnalysisResult
          match_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cv_document_id?: string
          job_description_id?: string | null
          analysis_result?: CVAnalysisResult
          match_score?: number | null
          created_at?: string
        }
      }
      interview_questions: {
        Row: {
          id: string
          user_id: string
          job_description_id: string
          questions: InterviewQuestions
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_description_id: string
          questions: InterviewQuestions
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_description_id?: string
          questions?: InterviewQuestions
          created_at?: string
        }
      }
      cv_optimizations: {
        Row: {
          id: string
          user_id: string
          cv_document_id: string
          job_description_id: string | null
          optimization_suggestions: CVOptimizationSuggestions
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cv_document_id: string
          job_description_id?: string | null
          optimization_suggestions: CVOptimizationSuggestions
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cv_document_id?: string
          job_description_id?: string | null
          optimization_suggestions?: CVOptimizationSuggestions
          created_at?: string
        }
      }
      payment_records: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded'
          payment_type: 'subscription' | 'one_time'
          metadata: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          amount: number
          currency?: string
          status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded'
          payment_type: 'subscription' | 'one_time'
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded'
          payment_type?: 'subscription' | 'one_time'
          metadata?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string | null
          session_id: string
          ip_address: string | null
          user_agent: string | null
          activity_type: 'cv_analysis' | 'interview_questions' | 'cv_optimization' | 'login' | 'logout'
          activity_data: Record<string, any> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id: string
          ip_address?: string | null
          user_agent?: string | null
          activity_type: 'cv_analysis' | 'interview_questions' | 'cv_optimization' | 'login' | 'logout'
          activity_data?: Record<string, any> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string
          ip_address?: string | null
          user_agent?: string | null
          activity_type?: 'cv_analysis' | 'interview_questions' | 'cv_optimization' | 'login' | 'logout'
          activity_data?: Record<string, any> | null
          created_at?: string
        }
      }
    }
  }
}

// OpenAI response types
export interface CVAnalysisResult {
  matchScore: number
  keywordMatch: {
    matched: string[]
    missing: string[]
  }
  strengths: string[]
  improvements: string[]
  atsCompatibility: {
    score: number
    issues: string[]
  }
}

export interface InterviewQuestions {
  behavioral: string[]
  technical: string[]
  situational: string[]
  roleSpecific: string[]
}

export interface CVOptimizationSuggestions {
  suggestions: Array<{
    section: string
    original: string
    improved: string
    reason: string
  }>
  keywordEnhancements: string[]
  structuralChanges: string[]
}

// Utility types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CVDocument = Database['public']['Tables']['cv_documents']['Row']
export type JobDescription = Database['public']['Tables']['job_descriptions']['Row']
export type CVAnalysis = Database['public']['Tables']['cv_analyses']['Row']
export type InterviewQuestion = Database['public']['Tables']['interview_questions']['Row']
export type CVOptimization = Database['public']['Tables']['cv_optimizations']['Row']
export type PaymentRecord = Database['public']['Tables']['payment_records']['Row']
export type UserSession = Database['public']['Tables']['user_sessions']['Row'] 