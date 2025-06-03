# Development Environment Setup

This guide will help you set up the development environment for the Job Preparation App.

## Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account
- An OpenAI account
- A Stripe account (for payment processing)

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd nicejob
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Development
NODE_ENV=development
```

## Service Configuration

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and keys
3. Run the database schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `src/lib/database/schema.sql`
   - Execute the SQL to create tables and policies
4. Set up Storage bucket for CV uploads:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `cv-uploads`
   - Set appropriate access policies

### OpenAI Setup

1. Create an account at [OpenAI](https://platform.openai.com)
2. Generate an API key from the API keys section
3. Add the key to your `.env.local` file

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable and secret keys from the dashboard
3. Create products and prices for your subscription tiers
4. Set up webhooks for subscription events
5. Add all keys to your `.env.local` file

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── database/       # Database schema and utilities
│   │   ├── schema.sql  # Complete database schema
│   │   └── backup.ts   # Backup and maintenance utilities
│   ├── utils/          # General utilities
│   ├── validations/    # Zod validation schemas
│   ├── supabase.ts     # Supabase client configuration
│   ├── openai.ts       # OpenAI client and prompts
│   └── stripe.ts       # Stripe configuration
├── types/              # TypeScript type definitions
│   └── database.ts     # Database type definitions
└── ...
```

## Database Schema

The application uses the following main tables:

- `profiles` - User profiles extending Supabase auth
- `cv_documents` - Uploaded CV documents with file storage
- `job_descriptions` - Job postings for analysis
- `cv_analyses` - AI analysis results with JSONB data
- `interview_questions` - Generated interview questions by category
- `cv_optimizations` - CV improvement suggestions
- `payment_records` - Stripe payment and subscription tracking
- `user_sessions` - User activity and session tracking

### Database Features

- **Row Level Security (RLS)** enabled on all tables
- **Optimized indexes** for common query patterns
- **Automated backups** and maintenance functions
- **GDPR compliance** with data retention policies
- **Performance monitoring** and health checks

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

## API Integration

### OpenAI Integration

The app uses OpenAI's GPT-3.5-turbo model for:
- CV analysis against job descriptions
- Interview question generation
- CV optimization suggestions

### Stripe Integration

Stripe handles:
- Subscription management
- Payment processing
- Usage tracking and limits

### Supabase Integration

Supabase provides:
- User authentication
- Database storage with RLS
- Real-time subscriptions
- File storage (for CV uploads)
- Automated backups

## Database Maintenance

The application includes automated maintenance tasks:

### Data Cleanup
- Guest sessions older than 24 hours
- CV files for free users older than 30 days  
- Analysis results for free users older than 90 days

### Health Monitoring
- Database connection tests
- Table accessibility checks
- Performance metrics collection

### Usage in API Routes
```typescript
import { databaseMaintenance, databaseHealthCheck } from '@/lib/database/backup'

// Run maintenance tasks
const results = await databaseMaintenance.runMaintenanceTasks()

// Check database health
const health = await databaseHealthCheck.checkHealth()
```

## Development Tips

1. Use the TypeScript types defined in `src/types/database.ts`
2. All database operations should use the Supabase client
3. API routes should handle errors gracefully
4. Use the validation schemas in `src/lib/validations/`
5. Follow the existing code patterns for consistency
6. Monitor database health regularly in production
7. Run maintenance tasks on a schedule (daily/weekly)

## Troubleshooting

### Common Issues

1. **Environment variables not loading**: Make sure your `.env.local` file is in the root directory
2. **Database connection issues**: Verify your Supabase URL and keys
3. **OpenAI API errors**: Check your API key and usage limits
4. **Stripe webhook issues**: Ensure webhook endpoints are configured correctly
5. **Database performance**: Check the health endpoint for metrics

### Getting Help

- Check the Next.js documentation
- Review Supabase docs for database issues
- Consult OpenAI API documentation
- Check Stripe documentation for payment issues
- Use the database health check for diagnostics 