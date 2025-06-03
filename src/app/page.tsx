'use client'

import { useState } from 'react'
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user } = useAuth()

  const features = [
    {
      icon: DocumentTextIcon,
      title: 'CV Analysis & Optimization',
      description: 'AI-powered analysis of your CV against job requirements with personalized improvement suggestions.'
    },
    {
      icon: BriefcaseIcon,
      title: 'Interview Question Generator',
      description: 'Generate role-specific interview questions to help you prepare and practice effectively.'
    },
    {
      icon: ChartBarIcon,
      title: 'Match Score Analysis',
      description: 'Get detailed match scores between your CV and job postings to identify the best opportunities.'
    },
    {
      icon: SparklesIcon,
      title: 'AI-Powered Insights',
      description: 'Leverage advanced AI to identify skill gaps and optimization opportunities in your job search.'
    }
  ]

  const benefits = [
    'Upload and manage multiple CV versions',
    'AI-powered CV analysis and optimization',
    'Generate interview questions for any role',
    'Track your job application progress',
    'Get personalized improvement recommendations',
    'Access premium AI features'
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-cyan-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Land Your Dream Job with{' '}
              <span className="text-blue-600">AI-Powered</span> Preparation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Optimize your CV, generate interview questions, and get AI-powered insights 
              to stand out in today's competitive job market.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <a href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </a>
              ) : (
                <>
                  <Button 
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-400 to-cyan-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              AI-powered job preparation tools
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our comprehensive suite of AI tools helps you optimize every aspect of your job search, 
              from CV optimization to interview preparation.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                      <Icon className="h-5 w-5 flex-none text-blue-600" />
                      {feature.title}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why choose NiceJob?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join thousands of job seekers who have successfully landed their dream jobs 
              using our AI-powered platform.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-6 w-6 flex-none text-green-600 mt-1" />
                  <span className="ml-3 text-lg text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-blue-600">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to accelerate your job search?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Start optimizing your CV and preparing for interviews with our AI-powered tools. 
                Join thousands of successful job seekers today.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}
