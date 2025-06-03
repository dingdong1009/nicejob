import OpenAI from 'openai'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Prompts for different features
export const PROMPTS = {
  CV_ANALYSIS: `You are an expert career consultant and ATS (Applicant Tracking System) specialist. 
Analyze the provided CV against the job description and provide a detailed assessment.

Please provide your analysis in the following JSON format:
{
  "matchScore": number (0-100),
  "keywordMatch": {
    "matched": string[],
    "missing": string[]
  },
  "strengths": string[],
  "improvements": string[],
  "atsCompatibility": {
    "score": number (0-100),
    "issues": string[]
  }
}`,

  INTERVIEW_QUESTIONS: `You are an experienced hiring manager and interview expert.
Generate relevant interview questions based on the job description and role requirements.

Please provide your response in the following JSON format:
{
  "behavioral": string[],
  "technical": string[],
  "situational": string[],
  "roleSpecific": string[]
}`,

  CV_OPTIMIZATION: `You are a professional CV writer and career consultant.
Analyze the provided CV and suggest specific improvements to better match the job description.

Please provide your response in the following JSON format:
{
  "suggestions": [
    {
      "section": string,
      "original": string,
      "improved": string,
      "reason": string
    }
  ],
  "keywordEnhancements": string[],
  "structuralChanges": string[]
}`
}

// Helper function to make OpenAI API calls with error handling
export async function makeOpenAIRequest(
  prompt: string,
  userContent: string,
  maxTokens: number = 1500
) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: userContent
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    })

    return {
      success: true,
      content: response.choices[0]?.message?.content || '',
      usage: response.usage
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      content: ''
    }
  }
} 