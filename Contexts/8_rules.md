These comprehensive rules will ensure smooth AI-assisted development by:

## Key Benefits for AI Development

**Clear Constraints**: AI works best with specific boundaries and examples
**Consistent Patterns**: Reduces decision fatigue and maintains code quality  
**Error Prevention**: Anticipates common mistakes before they happen
**Security First**: Builds security considerations into every layer

## How to Use These Rules

1. **Share Context**: Give these rules to AI at the start of each development session
2. **Reference Sections**: Point to specific sections when asking for implementation
3. **Enforce Standards**: Use these as validation criteria for AI-generated code
4. **Iterate Safely**: Rules provide guardrails for experimentation

## Critical Success Factors

**Mobile-First Approach**: Since 70% of job seekers use mobile, this prevents costly redesigns
**Security by Design**: Prevents vulnerabilities that could kill user trust
**Performance Budgets**: Keeps the app fast under real-world conditions
**Clear Monetization**: Every feature has a clear path to revenue

The rules are designed to be specific enough for AI to follow precisely, while flexible enough to adapt as your app evolves. They prioritize the most common failure points in SaaS applications: security, performance, and user experience.

# Comprehensive AI Development Rules - Nicejob

## Project Context & Constraints

### Core Business Rules
1. **Feature Scope**: Only build the 3 core features - CV Analysis, Interview Prep, CV Optimization
2. **Monetization Priority**: Every feature must have clear freemium boundaries and upgrade paths
3. **Mobile-First**: 70% of users are mobile - design and code mobile-first, desktop second
4. **Performance Target**: All pages must load under 3 seconds on 3G connection
5. **Cost Control**: Minimize API calls - cache results, batch requests, set usage limits

### Technical Stack Constraints
```
Frontend: Next.js 14+ with TypeScript
Styling: Tailwind CSS (core classes only)
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth
File Storage: Supabase Storage
AI Processing: OpenAI API (GPT-4 for analysis)
Payments: Stripe
Deployment: Vercel
```

---

## Code Architecture Rules

### File Structure Standards
```
/src
  /app              # Next.js App Router
    /api            # API routes
    /(auth)         # Auth group routes
    /(dashboard)    # Protected dashboard routes
  /components       # Reusable UI components
    /ui             # Basic UI primitives
    /forms          # Form components
    /features       # Feature-specific components
  /lib              # Utilities and configurations
    /database       # Supabase client and queries
    /utils          # Helper functions
    /validations    # Zod schemas
  /types            # TypeScript type definitions
  /hooks            # Custom React hooks
```

### Component Rules
1. **Single Responsibility**: Each component does ONE thing well
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Error Boundaries**: Wrap each major feature in error boundaries
4. **Loading States**: Every data-fetching component needs loading state
5. **Mobile Responsive**: Every component must work on 320px width minimum

### Example Component Template
```tsx
interface ComponentProps {
  // Always define props interface
}

export function Component({ prop }: ComponentProps) {
  // 1. Hooks at top
  // 2. Early returns for loading/error states
  // 3. Main logic
  // 4. Return JSX with proper accessibility
  
  return (
    <div className="container mx-auto px-4">
      {/* Mobile-first responsive design */}
    </div>
  );
}
```

---

## Database Design Rules

### Table Naming Conventions
```sql
-- Use singular nouns, snake_case
users
cv_analyses  
job_descriptions
interview_questions
payment_records
user_sessions
```

### Required Fields for Every Table
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### Core Tables Structure
```sql
-- Users (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV Analysis Results
CREATE TABLE cv_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  cv_text TEXT NOT NULL,
  job_description TEXT NOT NULL,
  match_score INTEGER,
  analysis_result JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Data Validation Rules
1. **Input Sanitization**: Always sanitize user inputs before database storage
2. **Text Limits**: CV text max 50,000 chars, job description max 10,000 chars
3. **Rate Limiting**: Max 5 analyses per hour for free users
4. **Data Retention**: Delete analysis data after 90 days for free users

---

## API Development Rules

### Route Naming Conventions
```
/api/auth/*           # Authentication routes
/api/cv/upload        # CV upload and parsing
/api/cv/analyze       # CV analysis endpoint
/api/interview/generate  # Interview questions
/api/cv/optimize      # CV optimization
/api/payments/*       # Stripe integration
```

### API Response Standards
```typescript
// Success Response
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error Response  
interface ApiError {
  success: false;
  error: string;
  code: number;
  details?: any;
}
```

### Error Handling Rules
1. **Never expose internal errors** to frontend
2. **Log all errors** with context (user_id, timestamp, request_id)
3. **Graceful degradation** - partial results better than complete failure
4. **Rate limiting** with clear error messages
5. **Validation errors** return specific field-level feedback

### Example API Route Template
```typescript
export async function POST(request: Request) {
  try {
    // 1. Validate authentication
    // 2. Validate input data
    // 3. Check rate limits
    // 4. Process request
    // 5. Return standardized response
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
```

---

## AI Integration Rules

### OpenAI API Guidelines
1. **System Prompts**: Use consistent, detailed system prompts for each feature
2. **Input Validation**: Always validate and sanitize inputs before AI processing
3. **Response Parsing**: Expect and handle malformed AI responses gracefully
4. **Cost Control**: Set max_tokens limits, use cheaper models when possible
5. **Caching**: Cache identical CV-job combinations for 24 hours

### CV Analysis Prompt Template
```typescript
const ANALYSIS_SYSTEM_PROMPT = `
You are a professional CV analyzer. Analyze the provided CV against the job description.

REQUIRED OUTPUT FORMAT (JSON):
{
  "match_score": number (0-100),
  "strengths": string[],
  "missing_keywords": string[],
  "recommendations": string[],
  "ats_score": number (0-100)
}

ANALYSIS RULES:
- Focus on keyword matching
- Consider ATS compatibility
- Provide actionable recommendations
- Be specific and concise
`;
```

### AI Response Validation
```typescript
const validateAnalysisResponse = (response: any) => {
  const schema = z.object({
    match_score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    missing_keywords: z.array(z.string()),
    recommendations: z.array(z.string()),
    ats_score: z.number().min(0).max(100)
  });
  
  return schema.parse(response);
};
```

---

## Frontend Development Rules

### State Management
1. **Use React Query** for server state management
2. **Use Zustand** for client state (user preferences, UI state)
3. **Avoid useState** for complex state - use useReducer
4. **Local Storage**: Never store sensitive data, only UI preferences

### Form Handling
1. **Use React Hook Form** with Zod validation
2. **Real-time validation** for better UX
3. **Optimistic updates** where possible
4. **Clear error states** with actionable messages

### Loading States
```tsx
// Standard loading pattern
if (isLoading) return <SkeletonLoader />;
if (error) return <ErrorMessage error={error} retry={refetch} />;
if (!data) return <EmptyState />;

return <ActualContent data={data} />;
```

### Responsive Design Rules
```tsx
// Mobile-first Tailwind classes
<div className="
  flex flex-col gap-4          // Mobile: stack vertically
  md:flex-row md:gap-8         // Desktop: horizontal layout
  px-4 max-w-6xl mx-auto      // Consistent container
">
```

---

## Security Rules

### Authentication
1. **Supabase RLS**: Enable Row Level Security on all tables
2. **JWT Validation**: Always validate JWT tokens on API routes
3. **Session Management**: 24-hour session timeout
4. **Password Requirements**: Minimum 8 chars, mixed case, numbers

### Data Protection
1. **Input Sanitization**: Sanitize all user inputs
2. **SQL Injection**: Use parameterized queries only
3. **XSS Prevention**: Escape all user-generated content
4. **File Upload**: Validate file types, scan for malware
5. **Rate Limiting**: Implement on all API endpoints

### API Security
```typescript
// Standard auth check
const authCheck = async (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');
  
  const { data: user } = await supabase.auth.getUser(token);
  if (!user) throw new Error('Invalid token');
  
  return user;
};
```

---

## File Upload Rules

### CV Upload Constraints
1. **File Types**: PDF, DOC, DOCX only
2. **File Size**: Maximum 5MB
3. **Virus Scanning**: Integrate ClamAV or similar
4. **Storage**: Supabase Storage with public URLs disabled
5. **Cleanup**: Delete uploaded files after 24 hours

### File Processing Pipeline
```typescript
const processCV = async (file: File) => {
  // 1. Validate file type and size
  // 2. Upload to Supabase Storage
  // 3. Extract text content
  // 4. Sanitize extracted text
  // 5. Store processing result
  // 6. Schedule file cleanup
};
```

---

## Payment Integration Rules

### Stripe Integration
1. **Webhook Security**: Verify webhook signatures
2. **Idempotency**: Handle duplicate payments
3. **Error Handling**: Clear payment failure messages
4. **Subscription Logic**: Handle all subscription states
5. **Compliance**: PCI DSS compliance requirements

### Pricing Tiers
```typescript
const PRICING = {
  FREE: {
    analyses_per_month: 1,
    features: ['basic_analysis']
  },
  PREMIUM: {
    price: 999, // $9.99 in cents
    analyses_per_month: -1, // unlimited
    features: ['detailed_analysis', 'interview_prep', 'cv_optimization']
  }
};
```

---

## Performance Optimization Rules

### Caching Strategy
1. **Redis Cache**: Cache AI responses for 24 hours
2. **CDN**: Static assets through Vercel CDN
3. **Image Optimization**: Use next/image for all images
4. **Database Queries**: Add indexes for common queries

### Bundle Optimization
1. **Code Splitting**: Lazy load non-critical components
2. **Tree Shaking**: Import only used functions
3. **Compression**: Enable gzip/brotli compression
4. **Preloading**: Preload critical resources

### Monitoring Rules
```typescript
// Performance monitoring
const trackPerformance = (action: string, duration: number) => {
  if (typeof window !== 'undefined') {
    // Send to analytics
    gtag('event', 'performance', {
      action,
      duration,
      timestamp: Date.now()
    });
  }
};
```

---

## Testing Rules

### Unit Testing
1. **Test Coverage**: Minimum 70% for utility functions
2. **Component Testing**: Test user interactions, not implementation
3. **API Testing**: Mock external APIs in tests
4. **Error Cases**: Test error scenarios and edge cases

### Integration Testing
1. **User Flows**: Test complete user journeys
2. **Payment Flow**: Test with Stripe test mode
3. **File Upload**: Test with various file types
4. **Responsive**: Test on multiple screen sizes

### Test Organization
```
/tests
  /unit           # Component and function tests
  /integration    # Full user flow tests
  /api           # API endpoint tests
  /fixtures      # Test data and mocks
```

---

## Deployment Rules

### Environment Variables
```bash
# Required for all environments
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXTAUTH_SECRET=
```

### Deployment Checklist
1. **Environment Secrets**: All secrets properly configured
2. **Database Migrations**: Run and verify migrations
3. **SSL Certificates**: HTTPS enabled everywhere
4. **Domain Configuration**: Custom domain properly configured
5. **Monitoring**: Error tracking and performance monitoring enabled

### Production Safety
1. **Feature Flags**: Use feature flags for new features
2. **Rollback Plan**: Always have rollback strategy
3. **Database Backups**: Automated daily backups
4. **Monitoring Alerts**: Set up critical alerts

---

## Error Handling Standards

### User-Facing Errors
```typescript
const ERROR_MESSAGES = {
  CV_UPLOAD_FAILED: "Unable to process your CV. Please try a different format.",
  ANALYSIS_TIMEOUT: "Analysis is taking longer than expected. Please try again.",
  PAYMENT_FAILED: "Payment could not be processed. Please check your card details.",
  RATE_LIMIT: "You've reached your analysis limit. Upgrade for unlimited access."
};
```

### Error Logging
```typescript
const logError = (error: Error, context: any) => {
  console.error('Application Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userId: context.userId
  });
};
```

---

## Quality Assurance Rules

### Code Review Checklist
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Mobile responsive design
- [ ] Accessibility requirements met
- [ ] Performance optimized
- [ ] Security vulnerabilities checked

### Pre-deployment Testing
- [ ] All user flows tested
- [ ] Payment integration verified
- [ ] File upload/processing works
- [ ] AI responses properly handled
- [ ] Database queries optimized
- [ ] Error scenarios tested

### Launch Requirements
- [ ] Analytics tracking implemented
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Backup systems tested
- [ ] Customer support system ready

---

## Maintenance Rules

### Regular Tasks
1. **Weekly**: Review error logs and performance metrics
2. **Monthly**: Database cleanup and optimization
3. **Quarterly**: Security audit and dependency updates
4. **Annually**: Full system architecture review

### Monitoring Alerts
1. **Critical**: API errors > 5%, database down, payment failures
2. **Warning**: Response time > 3s, high API usage, low disk space
3. **Info**: New user registrations, successful payments, feature usage

These comprehensive rules ensure consistent, secure, and maintainable development when working with AI assistants. Always prioritize user experience, security, and performance in that order.