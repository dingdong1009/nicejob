'use client'

import { useState } from 'react'

import { 
  DocumentMagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  StarIcon,
  CheckIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const { user } = useAuth()

  // Core features based on Contexts/2_core_functionalities.md
  const coreFeatures = [
    {
      icon: DocumentMagnifyingGlassIcon,
      title: 'CV-Job Match Analysis',
      description: 'Upload your CV and paste any job description. Get instant compatibility scoring with detailed gap analysis and improvement recommendations.',
      features: ['90% accuracy', 'Instant results', 'ATS-friendly'],
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Interview Question Generator',
      description: 'Creates 8-12 tailored questions focusing on CV gaps and job requirements. Get question frameworks and tips on what employers want to hear.',
      features: ['Behavioral questions', 'Technical prep', 'Answer frameworks'],
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: ArrowPathIcon,
      title: 'One-Click CV Optimizer',
      description: 'Auto-suggests specific rewrites for better job matching. Get side-by-side before/after CV with highlighted changes and exact improvements.',
      features: ['Phrase optimization', 'Keyword enhancement', 'Section reordering'],
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ]

  // Testimonials for social proof
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      content: 'Increased my CV match score from 65% to 92%. Landed my dream job in just 3 weeks!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager at Stripe',
      content: 'The interview questions were spot-on. I felt completely prepared and confident.',
      rating: 5
    },
    {
      name: 'Jessica Park',
      role: 'Data Scientist at Meta',
      content: 'CV optimization suggestions were incredibly specific. Worth every penny.',
      rating: 5
    }
  ]

  // Company logos for trust indicators
  const trustedCompanies = [
    'Google', 'Microsoft', 'Meta', 'Stripe', 'Airbnb', 'Spotify'
  ]

  const handleGetStarted = () => {
    setAuthMode('signup')
    setIsAuthModalOpen(true)
  }

  const handleSeeExample = () => {
    // TODO: Open example modal or navigate to example page
    setAuthMode('signin')
    setIsAuthModalOpen(true)
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Following Contexts/7_ui_design.md specifications */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-green-400 to-emerald-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-4xl py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Main headline following exact specifications */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Perfect Your CV Match{' '}
              <span className="text-green-600">Scale to any job</span>
            </h1>
            
            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-gray-600 max-w-2xl mx-auto">
              NiceJob is an AI-powered CV optimization platform. 
              Start with intelligent CV analysis, get personalized feedback, 
              interview preparation, and targeted job matching.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <a href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </a>
              ) : (
                <>
                  <Button 
                    size="lg"
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-sm"
                  >
                    Analyze My CV for Free
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleSeeExample}
                    className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    See Example Report
                  </Button>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <span>100% Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5 text-green-600" />
                <span>50,000+ Job Seekers Trust Us</span>
              </div>
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-green-600" />
                <span>1 Free Analysis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration bottom */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-green-400 to-emerald-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Social Proof Section - Following Contexts/7_ui_design.md */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-600 mb-8">
            Trusted by job seekers at fast-growing companies worldwide
          </p>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {trustedCompanies.map((company) => (
              <div key={company} className="flex justify-center">
                <div className="text-gray-400 font-semibold text-lg opacity-60 hover:opacity-100 transition-opacity">
                  {company}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Features Section - Following Contexts/7_ui_design.md */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              3 Core Tools That Work Together
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Analyze → Prepare → Optimize. Each feature feeds into the next for complete job search success.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {coreFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex flex-col">
                    {/* Icon area */}
                    <div className={`self-start rounded-2xl ${feature.iconBg} p-6`}>
                      <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="mt-6 text-xl font-semibold leading-7 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-gray-600">
                      {feature.description}
                    </p>
                    
                    {/* Feature list */}
                    <ul className="mt-6 space-y-2">
                      {feature.features.map((item) => (
                        <li key={item} className="flex items-center text-sm text-gray-600">
                          <CheckIcon className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Following Contexts/6_ui_ux.md social proof requirements */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Join 50,000+ Successful Job Seekers
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Real results from real people who landed their dream jobs using NiceJob.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-900/5">
                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-900 text-sm leading-6">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                
                <div className="mt-6">
                  <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Preview Section - Following Contexts/3_subscription_model.md */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Pay only when you need it. No hidden fees, no long-term commitments.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
            {/* Free Trial */}
            <div className="rounded-3xl p-8 ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Free Trial</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">Perfect for testing our platform</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$0</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  1 CV analysis per month
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Basic match score
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Summary recommendations
                </li>
              </ul>
            </div>

            {/* Pay Per Use */}
            <div className="rounded-3xl p-8 ring-2 ring-green-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold leading-8 text-green-600">Pay Per Analysis</h3>
                <p className="rounded-full bg-green-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-green-600">Most Popular</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">Perfect for active job searching</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$5.99</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">per analysis</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Detailed CV analysis
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Interview questions
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  CV optimization
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  PDF downloads
                </li>
              </ul>
            </div>

            {/* Job Search Bundle */}
            <div className="rounded-3xl p-8 ring-1 ring-gray-200">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Job Search Bundle</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">For intensive job searching</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$24.99</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">6 months</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Unlimited analyses
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Priority support
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Advanced insights
                </li>
                <li className="flex gap-x-3">
                  <CheckIcon className="h-6 w-5 flex-none text-green-600" />
                  Application tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section - Following Contexts/5_user_flow.md conversion optimization */}
      {!user && (
        <div className="bg-green-600">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Land Your Dream Job?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-green-100">
                Join 50,000+ successful job seekers. Start with your free CV analysis and see immediate improvements to your job search strategy.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-50"
                  onClick={handleGetStarted}
                >
                  Start Free Analysis
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-green-600"
                  onClick={() => {
                    setAuthMode('signin')
                    setIsAuthModalOpen(true)
                  }}
                >
                  Sign In
                </Button>
              </div>
              
              {/* Final trust indicators */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-green-100">
                <span>✓ No credit card required</span>
                <span>✓ Results in under 30 seconds</span>
                <span>✓ 100% secure and private</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}
