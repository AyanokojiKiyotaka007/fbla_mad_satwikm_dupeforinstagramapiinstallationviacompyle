// Simple AI utility using direct fetch API calls
// This bypasses the problematic AI SDK dependencies

import Constants from 'expo-constants';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Helper function to chunk text into words
const chunkTextIntoWords = (text: string): string[] => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

// Helper function to simulate streaming with delays
const simulateStreaming = async (words: string[], onChunk: (chunk: string) => void) => {
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay between words
    onChunk(word + ' '); // Add space after each word
  }
};

// System prompt for FBLA AI Coach
const FBLA_SYSTEM_PROMPT = `You are an AI Coach for FBLA (Future Business Leaders of America), a professional and motivational mentor focused on leadership development, business skills, event preparation, and career readiness.

Your role is to:
- Provide guidance on FBLA competitive events and preparation strategies
- Offer leadership and business skill development advice
- Help with event planning and deadline management
- Share motivational insights about entrepreneurship and career growth
- Answer questions about FBLA programs, competitions, and opportunities
- Suggest relevant events based on member interests

Tone: Professional yet friendly, motivational, and supportive. Keep responses concise (2-4 sentences) unless more detail is specifically requested. Use business terminology appropriately and inspire confidence in members' abilities.

Focus areas: Leadership, business strategy, competition preparation, networking, career development, time management, and FBLA-specific guidance.`;

// Hardcoded fallback values (from .env.local)
const FALLBACK_BASE_URL = 'https://kiki-unkey-proxy.chris-d9a.workers.dev';
const FALLBACK_API_KEY = 'proj_f2af9daa_3ZR2SDrop5YD4nSLzVq5ANbj';

// Helper function to validate and get environment variables
const getEnvVar = (key: string): string => {
  let value: string | undefined;

  // Try process.env first (most reliable)
  if (key === 'EXPO_PUBLIC_KIKI_BASE_URL') {
    value = process.env.EXPO_PUBLIC_KIKI_BASE_URL;
  } else if (key === 'EXPO_PUBLIC_KIKI_API_KEY') {
    value = process.env.EXPO_PUBLIC_KIKI_API_KEY;
  }

  // Validate the value
  if (value && value.trim() !== '' && !value.includes('"router"')) {
    return value.trim();
  }

  // Try expoConfig.extra as fallback
  const extra = Constants.expoConfig?.extra;
  if (extra && typeof extra === 'object' && key in extra) {
    const extraValue = extra[key];
    if (typeof extraValue === 'string' && extraValue.trim() !== '' && !extraValue.includes('"router"')) {
      return extraValue.trim();
    }
  }

  // Use hardcoded fallback
  if (key === 'EXPO_PUBLIC_KIKI_BASE_URL') {
    console.warn('⚠️ Using fallback base URL');
    return FALLBACK_BASE_URL;
  } else if (key === 'EXPO_PUBLIC_KIKI_API_KEY') {
    console.warn('⚠️ Using fallback API key');
    return FALLBACK_API_KEY;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

// Helper function to properly construct API URL
const constructApiUrl = (baseURL: string): string => {
  // Remove trailing slash if present
  const cleanBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  
  // Validate URL format
  try {
    new URL(cleanBase);
  } catch {
    throw new Error(`Invalid base URL format: ${cleanBase}`);
  }
  
  // Add the endpoint path
  return `${cleanBase}/v1/chat/completions`;
};

// Generate AI response with chat history using direct API call
export const generateAIResponse = async (
  userMessage: string, 
  chatHistory: Message[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    // Get environment variables with fallbacks
    const baseURL = getEnvVar('EXPO_PUBLIC_KIKI_BASE_URL');
    const apiKey = getEnvVar('EXPO_PUBLIC_KIKI_API_KEY');

    // Validate we have values
    if (!baseURL || baseURL.trim() === '') {
      return "I'm unable to connect to the AI service. Configuration error. Please contact support.";
    }

    if (!apiKey || apiKey.trim() === '') {
      return "I'm unable to connect to the AI service. Authentication error. Please contact support.";
    }

    // Construct API URL
    const apiUrl = constructApiUrl(baseURL);

    // Create messages array
    const messages = [
      {
        role: 'system',
        content: FBLA_SYSTEM_PROMPT
      },
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];

    // Make API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      // Handle error responses
      if (response.status === 404) {
        return "I'm having trouble connecting to the AI service. Please try again later.";
      } else if (response.status === 401 || response.status === 403) {
        return "I'm having trouble authenticating with the AI service. Please contact support.";
      } else if (response.status >= 500) {
        return "The AI service is temporarily unavailable. Please try again in a moment.";
      }
      
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";

    // Simulate streaming if callback provided
    if (onChunk) {
      const words = chunkTextIntoWords(aiResponse);
      await simulateStreaming(words, onChunk);
    }

    return aiResponse;
  } catch (error) {
    // Log error for debugging but return user-friendly message
    console.error('AI Error:', error instanceof Error ? error.message : 'Unknown error');
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Curated motivational quotes - no API call needed
const MOTIVATIONAL_QUOTES = [
  'Great leaders inspire action through vision and purpose.',
  'Success is built on preparation, dedication, and continuous learning.',
  'Leadership is about empowering others to achieve their best.',
  'Innovation starts with curiosity and courage to try.',
  'Your network is your net worth in business.',
  'Excellence is not an act, but a habit.',
  'The best way to predict the future is to create it.',
  'Opportunities multiply as they are seized.',
];

// Get motivational quote - now uses curated list instead of API
export const getMotivationalQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};