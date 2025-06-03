import { loadStripe, Stripe } from '@stripe/stripe-js'
import StripeServer from 'stripe'

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Server-side Stripe instance
export const stripe = new StripeServer(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

// Pricing configuration
export const PRICING = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '1 CV analysis per month',
      'Basic interview questions',
      'Limited CV optimization suggestions'
    ],
    limits: {
      cvAnalysis: 1,
      interviewQuestions: 5,
      cvOptimization: 1
    }
  },
  PREMIUM: {
    name: 'Premium',
    price: 9.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Unlimited CV analyses',
      'Advanced interview questions',
      'Full CV optimization suite',
      'Export to PDF/Word',
      'Priority support'
    ],
    limits: {
      cvAnalysis: -1, // unlimited
      interviewQuestions: -1,
      cvOptimization: -1
    }
  }
}

// Helper function to create checkout session
export async function createCheckoutSession({
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    })

    return { success: true, session }
  } catch (error) {
    console.error('Stripe checkout session error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    }
  }
}

// Helper function to retrieve subscription
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return { success: true, subscription }
  } catch (error) {
    console.error('Stripe subscription retrieval error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve subscription'
    }
  }
} 