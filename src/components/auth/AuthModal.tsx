'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
})

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

type SignUpFormData = z.infer<typeof signUpSchema>
type SignInFormData = z.infer<typeof signInSchema>
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup' | 'reset'
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { signIn, signUp, resetPassword } = useAuth()

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const handleSignIn = async (data: SignInFormData) => {
    setLoading(true)
    setMessage('')

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setMessage(error.message)
    } else {
      onClose()
      signInForm.reset()
    }

    setLoading(false)
  }

  const handleSignUp = async (data: SignUpFormData) => {
    setLoading(true)
    setMessage('')

    const { error } = await signUp(data.email, data.password, {
      full_name: data.fullName
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Please check your email to verify your account')
      signUpForm.reset()
    }

    setLoading(false)
  }

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true)
    setMessage('')

    const { error } = await resetPassword(data.email)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset email sent! Please check your inbox.')
      resetForm.reset()
    }

    setLoading(false)
  }

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode)
    setMessage('')
    signInForm.reset()
    signUpForm.reset()
    resetForm.reset()
  }

  const handleClose = () => {
    onClose()
    switchMode('signin')
  }

  return (
    <Transition show={isOpen}>
      <Dialog onClose={handleClose} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md bg-white rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b">
                <DialogTitle className="text-lg font-semibold">
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Reset Password'}
                </DialogTitle>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {message && (
                  <div className={`mb-4 p-3 rounded-md text-sm ${
                    message.includes('error') || message.includes('Error') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {message}
                  </div>
                )}

                {mode === 'signin' && (
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      leftIcon={<EnvelopeIcon />}
                      error={signInForm.formState.errors.email?.message}
                      {...signInForm.register('email')}
                    />
                    
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      leftIcon={<LockClosedIcon />}
                      error={signInForm.formState.errors.password?.message}
                      {...signInForm.register('password')}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      loading={loading}
                    >
                      Sign In
                    </Button>

                    <div className="text-center space-y-2">
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Forgot your password?
                      </button>
                      
                      <div>
                        <span className="text-sm text-gray-600">Don't have an account? </span>
                        <button
                          type="button"
                          onClick={() => switchMode('signup')}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Sign up
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {mode === 'signup' && (
                  <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      leftIcon={<UserIcon />}
                      error={signUpForm.formState.errors.fullName?.message}
                      {...signUpForm.register('fullName')}
                    />
                    
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      leftIcon={<EnvelopeIcon />}
                      error={signUpForm.formState.errors.email?.message}
                      {...signUpForm.register('email')}
                    />
                    
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Create a password"
                      leftIcon={<LockClosedIcon />}
                      error={signUpForm.formState.errors.password?.message}
                      helperText="Must be at least 8 characters long"
                      {...signUpForm.register('password')}
                    />
                    
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      leftIcon={<LockClosedIcon />}
                      error={signUpForm.formState.errors.confirmPassword?.message}
                      {...signUpForm.register('confirmPassword')}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      loading={loading}
                    >
                      Create Account
                    </Button>

                    <div className="text-center">
                      <span className="text-sm text-gray-600">Already have an account? </span>
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                )}

                {mode === 'reset' && (
                  <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      leftIcon={<EnvelopeIcon />}
                      error={resetForm.formState.errors.email?.message}
                      helperText="We'll send you a password reset link"
                      {...resetForm.register('email')}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      loading={loading}
                    >
                      Send Reset Link
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => switchMode('signin')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
} 