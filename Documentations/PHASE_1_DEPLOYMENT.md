# Vercel Deployment Guide

This guide walks you through deploying the Job Preparation App to Vercel.

## Prerequisites

- Vercel account (free): [vercel.com](https://vercel.com)
- GitHub repository with your code
- Production environment variables ready

## Step 1: Prepare for Deployment

### 1.1 Test Local Build

Before deploying, ensure your application builds successfully:

```bash
npm run build
npm start
```

### 1.2 Commit Your Code

```bash
git add .
git commit -m "feat: complete Phase 1 - ready for deployment"
```

## Step 2: Connect GitHub Repository

### 2.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `nicejob` or your preferred name
3. Set it to **Public** or **Private** (your choice)
4. Do **NOT** initialize with README (we already have code)

### 2.2 Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/nicejob.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the `nicejob` repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### 3.2 Configure Environment Variables

In the Vercel dashboard, go to **Settings > Environment Variables** and add:

#### Production Supabase
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
```

#### OpenAI
```
OPENAI_API_KEY=your_openai_api_key
```

#### Production Stripe (Use Production Keys)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (production webhook)
```

#### App Configuration
```
NEXTAUTH_SECRET=your_strong_production_secret
NEXTAUTH_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be available at `https://nicejob.vercel.app`

## Step 4: Set Up Production Webhooks

### 4.1 Create Production Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click **"Add endpoint"**
3. Enter your production URL: `https://nicejob.app/api/webhooks/stripe`
4. Select the same events as development:
   - `customer.created`, `customer.updated`, `customer.deleted`
   - `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - `payment_intent.succeeded`, `payment_intent.payment_failed`
   - `invoice.payment_succeeded`, `invoice.payment_failed`
5. Copy the webhook secret and update it in Vercel environment variables

### 4.2 Update Production Supabase

1. Create a new Supabase project for production (or use the same one with different environment)
2. Run the database schema from `src/lib/database/schema.sql`
3. Configure production URL and keys in Vercel environment variables

## Step 5: Verify Deployment

### 5.1 Test Core Functionality

1. Visit your deployed app
2. Check that the homepage loads
3. Test environment variable loading
4. Verify database connections
5. Test API routes

### 5.2 Monitor Deployment

- Check Vercel **Functions** tab for API route logs
- Monitor **Analytics** for performance metrics
- Set up **Integrations** for monitoring (optional)

## Step 6: Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "feat: add new feature"
git push origin main
# Vercel will automatically deploy the changes
```

## Environment Management

### Development
- Use `.env.local` for local development
- Test data and Stripe test mode

### Production
- Environment variables set in Vercel dashboard
- Production Stripe keys and live data
- Production Supabase project

## Troubleshooting

### Build Errors
- Check Vercel **Functions** tab for detailed logs
- Verify all environment variables are set
- Test build locally: `npm run build`

### Runtime Errors
- Check Vercel **Functions** tab for runtime logs
- Verify database connections
- Check API route responses

### Environment Issues
- Ensure all required environment variables are set in Vercel
- Verify production URLs are correct
- Check that secrets are properly formatted

## Security Checklist

- [ ] All environment variables are set in Vercel (not in code)
- [ ] Production Stripe keys are being used
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database RLS policies are enabled
- [ ] API routes have proper error handling
- [ ] No sensitive data in client-side code

## Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure proper caching headers
- [ ] Optimize images with Next.js Image component
- [ ] Enable compression
- [ ] Monitor Core Web Vitals

## Next Steps After Deployment

1. Set up monitoring and alerting
2. Configure custom domain (optional)
3. Set up backup and disaster recovery
4. Implement analytics tracking
5. Add error tracking (Sentry, etc.)

---

**Your app is now live and ready for users!** 🚀 