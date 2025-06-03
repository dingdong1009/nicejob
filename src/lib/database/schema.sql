-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  usage_limits JSONB DEFAULT '{"cvAnalysis": 0, "interviewQuestions": 0, "cvOptimization": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV documents table
CREATE TABLE public.cv_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job descriptions table
CREATE TABLE public.job_descriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV analyses table
CREATE TABLE public.cv_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cv_document_id UUID REFERENCES public.cv_documents(id) ON DELETE CASCADE NOT NULL,
  job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
  analysis_result JSONB NOT NULL,
  match_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview questions table
CREATE TABLE public.interview_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE CASCADE NOT NULL,
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV optimizations table
CREATE TABLE public.cv_optimizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cv_document_id UUID REFERENCES public.cv_documents(id) ON DELETE CASCADE NOT NULL,
  job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
  optimization_suggestions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment records table for Stripe integration
CREATE TABLE public.payment_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled', 'refunded')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('subscription', 'one_time')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table for usage tracking
CREATE TABLE public.user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('cv_analysis', 'interview_questions', 'cv_optimization', 'login', 'logout')),
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- CV documents policies
CREATE POLICY "Users can view own CV documents" ON public.cv_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV documents" ON public.cv_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CV documents" ON public.cv_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CV documents" ON public.cv_documents
  FOR DELETE USING (auth.uid() = user_id);

-- Job descriptions policies
CREATE POLICY "Users can view own job descriptions" ON public.job_descriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job descriptions" ON public.job_descriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job descriptions" ON public.job_descriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job descriptions" ON public.job_descriptions
  FOR DELETE USING (auth.uid() = user_id);

-- CV analyses policies
CREATE POLICY "Users can view own CV analyses" ON public.cv_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV analyses" ON public.cv_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interview questions policies
CREATE POLICY "Users can view own interview questions" ON public.interview_questions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview questions" ON public.interview_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CV optimizations policies
CREATE POLICY "Users can view own CV optimizations" ON public.cv_optimizations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own CV optimizations" ON public.cv_optimizations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment records policies
CREATE POLICY "Users can view own payment records" ON public.payment_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment records" ON public.payment_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User sessions policies
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cv_documents_updated_at BEFORE UPDATE ON public.cv_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at BEFORE UPDATE ON public.job_descriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_records_updated_at BEFORE UPDATE ON public.payment_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Database indexes for common queries
-- User-based queries
CREATE INDEX idx_cv_documents_user_id ON public.cv_documents(user_id);
CREATE INDEX idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX idx_cv_analyses_user_id ON public.cv_analyses(user_id);
CREATE INDEX idx_interview_questions_user_id ON public.interview_questions(user_id);
CREATE INDEX idx_cv_optimizations_user_id ON public.cv_optimizations(user_id);
CREATE INDEX idx_payment_records_user_id ON public.payment_records(user_id);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);

-- Time-based queries
CREATE INDEX idx_cv_documents_created_at ON public.cv_documents(created_at DESC);
CREATE INDEX idx_job_descriptions_created_at ON public.job_descriptions(created_at DESC);
CREATE INDEX idx_cv_analyses_created_at ON public.cv_analyses(created_at DESC);
CREATE INDEX idx_interview_questions_created_at ON public.interview_questions(created_at DESC);
CREATE INDEX idx_cv_optimizations_created_at ON public.cv_optimizations(created_at DESC);
CREATE INDEX idx_payment_records_created_at ON public.payment_records(created_at DESC);
CREATE INDEX idx_user_sessions_created_at ON public.user_sessions(created_at DESC);

-- Relationship-based queries
CREATE INDEX idx_cv_analyses_cv_document_id ON public.cv_analyses(cv_document_id);
CREATE INDEX idx_cv_analyses_job_description_id ON public.cv_analyses(job_description_id);
CREATE INDEX idx_interview_questions_job_description_id ON public.interview_questions(job_description_id);
CREATE INDEX idx_cv_optimizations_cv_document_id ON public.cv_optimizations(cv_document_id);
CREATE INDEX idx_cv_optimizations_job_description_id ON public.cv_optimizations(job_description_id);

-- Stripe-related queries
CREATE INDEX idx_payment_records_stripe_customer_id ON public.payment_records(stripe_customer_id);
CREATE INDEX idx_payment_records_stripe_subscription_id ON public.payment_records(stripe_subscription_id);
CREATE INDEX idx_payment_records_status ON public.payment_records(status);
CREATE INDEX idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_stripe_subscription_id ON public.profiles(stripe_subscription_id);

-- Session tracking queries
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX idx_user_sessions_activity_type ON public.user_sessions(activity_type);

-- Composite indexes for common query patterns
CREATE INDEX idx_cv_analyses_user_created ON public.cv_analyses(user_id, created_at DESC);
CREATE INDEX idx_payment_records_user_status ON public.payment_records(user_id, status);
CREATE INDEX idx_user_sessions_user_activity ON public.user_sessions(user_id, activity_type, created_at DESC); 