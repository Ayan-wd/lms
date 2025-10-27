import "server-only"
import Stripe from "stripe"

// Use a dummy key for development/build if not configured
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover', // Latest API version from types
      // This instance will only be used for type checking and build
      typescript: true,
    })
