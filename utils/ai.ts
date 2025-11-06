// AI utility using AI SDK v4 with proper configuration
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import Constants from 'expo-constants';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Request tracking for debugging
let requestCounter = 0;

// Cache for last successful response
let lastSuccessfulResponse: string | null = null;

// Helper function to chunk text into words
const chunkTextIntoWords = (text: string): string[] => {
  return text.split(/\s+/).filter(word => word.length > 0);
};

// Helper function to simulate streaming with delays
const simulateStreaming = async (words: string[], onChunk: (chunk: string) => void) => {
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50));
    onChunk(word + ' ');
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

// Helper to mask sensitive data for logging
const maskToken = (token: string): string => {
  if (!token || token.length < 8) return '***';
  return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
};

// Get environment variables with proper fallbacks
const getEnvVar = (key: string): string => {
  const requestId = requestCounter;
  console.log(`\n🔍 [Request ${requestId}] Getting env var: ${key}`);
  
  // Hardcoded fallback values
  const FALLBACK_BASE_URL = 'https://kiki-unkey-proxy.chris-d9a.workers.dev';
  const FALLBACK_API_KEY = 'proj_f2af9daa_3ZR2SDrop5YD4nSLzVq5ANbj';
  
  let value: string | undefined;

  // Try process.env first
  if (key === 'EXPO_PUBLIC_KIKI_BASE_URL') {
    value = process.env.EXPO_PUBLIC_KIKI_BASE_URL;
  } else if (key === 'EXPO_PUBLIC_KIKI_API_KEY') {
    value = process.env.EXPO_PUBLIC_KIKI_API_KEY;
  }

  console.log(`  📋 process.env.${key}:`, 
    key.includes('API_KEY') ? (value ? maskToken(value) : 'undefined') : (value ? `"${value}"` : 'undefined')
  );

  // Validate the value - must be at least 10 characters
  if (value && value.trim().length > 10 && !value.includes('"router"') && !value.includes('{"origin"')) {
    console.log(`  ✅ Valid value found in process.env`);
    return value.trim();
  }

  // Try expoConfig.extra as fallback
  console.log(`  🔄 Checking Constants.expoConfig.extra...`);
  const extra = Constants.expoConfig?.extra;
  
  if (extra && typeof extra === 'object' && key in extra) {
    const extraValue = extra[key];
    console.log(`  📋 expoConfig.extra.${key}:`, 
      key.includes('API_KEY') ? maskToken(String(extraValue)) : `"${extraValue}"`
    );
    
    if (typeof extraValue === 'string' && 
        extraValue.trim().length > 10 &&
        !extraValue.includes('"router"') &&
        !extraValue.includes('{"origin"')) {
      console.log(`  ✅ Valid value found in expoConfig.extra`);
      return extraValue.trim();
    }
  }

  // Use hardcoded fallback
  console.log(`  🔄 Using hardcoded fallback value`);
  if (key === 'EXPO_PUBLIC_KIKI_BASE_URL') {
    console.log(`  ✅ Fallback base URL: ${FALLBACK_BASE_URL}`);
    return FALLBACK_BASE_URL;
  } else if (key === 'EXPO_PUBLIC_KIKI_API_KEY') {
    console.log(`  ✅ Fallback API key: ${maskToken(FALLBACK_API_KEY)}`);
    return FALLBACK_API_KEY;
  }

  throw new Error(`Missing required environment variable: ${key}`);
};

// Create custom OpenAI provider
const createCustomProvider = () => {
  const baseURL = getEnvVar('EXPO_PUBLIC_KIKI_BASE_URL');
  const apiKey = getEnvVar('EXPO_PUBLIC_KIKI_API_KEY');
  
  console.log(`\n🔧 Creating custom OpenAI provider`);
  console.log(`  🌐 Base URL: ${baseURL}`);
  console.log(`  🔑 API Key: ${maskToken(apiKey)}`);
  
  return createOpenAI({
    compatibility: 'strict',
    baseURL: baseURL,
    apiKey: apiKey
  });
};

// Generate AI response with chat history
export const generateAIResponse = async (
  userMessage: string, 
  chatHistory: Message[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  const requestId = ++requestCounter;
  
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🚀 [Request ${requestId}] Starting AI request`);
  console.log(`${'='.repeat(80)}`);
  
  try {
    // Create custom provider
    const customProvider = createCustomProvider();
    
    // Create messages array
    const messages = [
      {
        role: 'system' as const,
        content: FBLA_SYSTEM_PROMPT
      },
      ...chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { 
        role: 'user' as const, 
        content: userMessage 
      }
    ];

    console.log(`\n📤 [Request ${requestId}] Generating response`);
    console.log(`  📨 Messages count: ${messages.length}`);
    console.log(`  📝 User message: "${userMessage.substring(0, 50)}..."`);

    // Generate complete response using AI SDK
    const startTime = Date.now();
    const response = await generateText({
      model: customProvider('gpt-4o'),
      messages: messages,
      temperature: 0.7,
      maxTokens: 500
    });
    
    const duration = Date.now() - startTime;
    console.log(`\n📥 [Request ${requestId}] Response received (${duration}ms)`);
    console.log(`  ✅ Response length: ${response.text.length} chars`);
    console.log(`  📝 Response preview: "${response.text.substring(0, 100)}..."`);

    // Simulate streaming if callback provided
    if (onChunk) {
      console.log(`  🌊 Simulating streaming response...`);
      const words = chunkTextIntoWords(response.text);
      await simulateStreaming(words, onChunk);
    }

    // Cache successful response
    lastSuccessfulResponse = response.text;

    console.log(`\n✅ [Request ${requestId}] Request completed successfully`);
    console.log(`${'='.repeat(80)}\n`);
    
    return response.text;
    
  } catch (error) {
    console.error(`\n❌ [Request ${requestId}] Error:`, error);
    console.log(`${'='.repeat(80)}\n`);
    
    // Return user-friendly message with cached response if available
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`  📋 Error message: ${errorMessage}`);
    
    if (lastSuccessfulResponse) {
      console.log(`  💾 Returning last successful response as fallback`);
      return lastSuccessfulResponse;
    }
    
    // Return specific error messages
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return "I'm having trouble connecting to the AI service. Please try again in a moment.";
    } else if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('Authentication')) {
      return "I'm having trouble authenticating with the AI service. Please contact support.";
    } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return "Too many requests. Please wait a moment and try again.";
    } else if (errorMessage.includes('timeout')) {
      return "The request took too long. Please check your internet connection and try again.";
    }
    
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

// Curated motivational quotes
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

// Get motivational quote
export const getMotivationalQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};