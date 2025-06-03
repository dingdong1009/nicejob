// Core user types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'premium';
  usage_count: number;
  created_at: string;
}

// CV Analysis types
export interface CVAnalysis {
  id: string;
  user_id: string;
  cv_text: string;
  job_description: string;
  match_score: number;
  analysis_result: AnalysisResult;
  is_paid: boolean;
  created_at: string;
}

export interface AnalysisResult {
  match_score: number;
  strengths: string[];
  missing_keywords: string[];
  recommendations: string[];
  ats_score: number;
}

// Interview Question types
export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'situational';
  difficulty: 'entry' | 'mid' | 'senior';
  answer_framework?: string;
  tips?: string[];
  common_mistakes?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: number;
  details?: any;
}

// Form types
export interface CVUploadForm {
  file: File;
  job_description: string;
}

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  company: string;
  description: string;
  created_at: string;
}

// Payment types
export interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  stripe_payment_intent_id: string;
  created_at: string;
}

// Subscription types
export interface Subscription {
  tier: 'free' | 'premium';
  analyses_per_month: number;
  features: string[];
  price?: number;
} 