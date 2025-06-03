/**
 * Authentication System Tests
 * 
 * This file contains tests for:
 * - AuthContext functionality
 * - AuthModal component
 * - Authentication flow
 * - User session management
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { createClient } from '@/lib/supabase'

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      }))
    }))
  }))
}))

// Test component to use AuthContext
function TestComponent() {
  const { user, profile, loading, signIn, signUp, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <div data-testid="profile">{profile ? profile.full_name : 'no profile'}</div>
      <button data-testid="signin" onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button data-testid="signup" onClick={() => signUp('test@example.com', 'password', { full_name: 'Test User' })}>
        Sign Up
      </button>
      <button data-testid="signout" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('provides initial loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
    expect(screen.getByTestId('user')).toHaveTextContent('no user')
  })

  test('handles sign in functionality', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ error: null })
    const mockClient = createClient()
    mockClient.auth.signInWithPassword = mockSignIn

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('signin'))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      })
    })
  })

  test('handles sign up functionality', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ error: null })
    const mockClient = createClient()
    mockClient.auth.signUp = mockSignUp

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('signup'))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: {
          data: { full_name: 'Test User' }
        }
      })
    })
  })

  test('handles sign out functionality', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    const mockClient = createClient()
    mockClient.auth.signOut = mockSignOut

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    fireEvent.click(screen.getByTestId('signout'))

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
    })
  })
})

describe('AuthModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    initialMode: 'signin' as const
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders sign in form by default', () => {
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  test('switches to sign up mode', () => {
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    fireEvent.click(screen.getByText('Sign up'))

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  test('switches to reset password mode', () => {
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    fireEvent.click(screen.getByText('Forgot your password?'))

    expect(screen.getByText('Reset Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument()
  })

  test('validates email format', async () => {
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(signInButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  test('validates password requirements in sign up', async () => {
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    // Switch to sign up mode
    fireEvent.click(screen.getByText('Sign up'))

    const passwordInput = screen.getByLabelText('Password')
    const createButton = screen.getByRole('button', { name: 'Create Account' })

    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })
  })

  test('validates password confirmation match', async () => {
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    // Switch to sign up mode
    fireEvent.click(screen.getByText('Sign up'))

    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const createButton = screen.getByRole('button', { name: 'Create Account' })

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument()
    })
  })

  test('closes modal when close button is clicked', () => {
    const onClose = jest.fn()
    
    render(
      <AuthProvider>
        <AuthModal {...defaultProps} onClose={onClose} />
      </AuthProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })

  test('displays loading state during authentication', async () => {
    const mockSignIn = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    )
    const mockClient = createClient()
    mockClient.auth.signInWithPassword = mockSignIn

    render(
      <AuthProvider>
        <AuthModal {...defaultProps} />
      </AuthProvider>
    )

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(signInButton)

    // Check for loading state
    expect(signInButton).toBeDisabled()
  })
})

describe('Authentication Flow Integration', () => {
  test('complete sign up flow', async () => {
    const mockSignUp = jest.fn().mockResolvedValue({ error: null })
    const mockClient = createClient()
    mockClient.auth.signUp = mockSignUp

    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={jest.fn()} initialMode="signup" />
      </AuthProvider>
    )

    // Fill out sign up form
    fireEvent.change(screen.getByLabelText('Full Name'), { 
      target: { value: 'John Doe' } 
    })
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'john@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'password123' } 
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), { 
      target: { value: 'password123' } 
    })

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          data: { full_name: 'John Doe' }
        }
      })
    })
  })

  test('handles authentication errors', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ 
      error: { message: 'Invalid login credentials' } 
    })
    const mockClient = createClient()
    mockClient.auth.signInWithPassword = mockSignIn

    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={jest.fn()} />
      </AuthProvider>
    )

    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'test@example.com' } 
    })
    fireEvent.change(screen.getByLabelText('Password'), { 
      target: { value: 'wrongpassword' } 
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeInTheDocument()
    })
  })
})

export {} 