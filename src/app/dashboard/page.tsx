'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    { name: 'CVs Uploaded', value: '0', icon: DocumentTextIcon },
    { name: 'Jobs Analyzed', value: '0', icon: BriefcaseIcon },
    { name: 'Match Score', value: '-', icon: ChartBarIcon },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {profile?.avatar_url ? (
                    <img
                      className="h-16 w-16 rounded-full"
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                    />
                  ) : (
                    <UserCircleIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <div className="ml-5">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {profile?.full_name || 'User'}!
                  </h1>
                  <p className="text-gray-500">{profile?.email}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Subscription: {profile?.subscription_status === 'premium' ? 'Premium' : 'Free'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          {stats.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {item.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload CV</p>
                    <p className="text-sm text-gray-500">Start by uploading your CV</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <BriefcaseIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Add Job</p>
                    <p className="text-sm text-gray-500">Add a job description to analyze</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Analysis</p>
                    <p className="text-sm text-gray-500">Check your CV analysis results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            🚀 Getting Started
          </h3>
          <p className="text-blue-700 mb-4">
            Welcome to NiceJob! Here's how to get started with optimizing your job search:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Upload your CV using the "Upload CV" button above</li>
            <li>Add job descriptions you're interested in</li>
            <li>Get AI-powered analysis and optimization suggestions</li>
            <li>Generate interview questions for better preparation</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 