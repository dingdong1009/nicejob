# Environment Setup Guide

## Environment Variables

Copy the `env.template` file to `.env.local` and fill in your actual values:

```bash
cp env.template .env.local
```

### Required Environment Variables

1. **Supabase Configuration**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

2. **OpenAI API**
   - `OPENAI_API_KEY`: Your OpenAI API key for CV analysis and interview questions

3. **Stripe (for payments)**
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

4. **Authentication**
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)

### Optional Environment Variables

- Email configuration for transactional emails
- Redis configuration for rate limiting
- Google Analytics for tracking

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Code Quality

- Format code: `npm run format`
- Check formatting: `npm run format:check`
- Lint code: `npm run lint`
- Fix linting issues: `npm run lint:fix`
- Type check: `npm run type-check` 