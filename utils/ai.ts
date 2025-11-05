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

// Helper function to get environment variables with fallbacks
const getEnvVar = (key: string): string | undefined => {
  // Try multiple sources for environment variables
  const sources = [
    process.env[key],
    Constants.expoConfig?.extra?.[key],
    Constants.manifest?.extra?.[key],
    Constants.manifest2?.extra?.expoClient?.extra?.[key]
  ];
  
  const value = sources.find(v => v !== undefined && v !== null && v !== '');
  return value;
};

// Helper function to properly construct API URL
const constructApiUrl = (baseURL: string): string => {
  if (!baseURL || baseURL.trim() === '') {
    throw new Error('Base URL is empty or invalid');
  }
  
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
    // Get environment variables with multiple fallback methods
    const baseURL = getEnvVar('EXPO_PUBLIC_KIKI_BASE_URL');
    const apiKey = getEnvVar('EXPO_PUBLIC_KIKI_API_KEY');

    // Debug logging to see what we're getting
    console.log('🔍 Environment Variables Check:');
    console.log('  - Base URL:', baseURL);
    console.log('  - API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'MISSING');

    // Validate environment variables with detailed error messages
    if (!baseURL || baseURL.trim() === '') {
      console.error('❌ Base URL is missing or empty');
      return "I'm unable to connect to the AI service right now. The API configuration is missing. Please contact support.";
    }

    if (!apiKey || apiKey.trim() === '') {
      console.error('❌ API Key is missing or empty');
      return "I'm unable to connect to the AI service right now. The API key is missing. Please contact support.";
    }

    // Construct proper API URL with validation
    let apiUrl: string;
    try {
      apiUrl = constructApiUrl(baseURL);
      console.log('✅ Constructed API URL:', apiUrl);
    } catch {
      console.error('❌ Failed to construct API URL');
      return "I'm having trouble with the API configuration. Please contact support.";
    }

    // Create messages array with system message and chat history
    const messages = [
      {
        role: 'system',
        content: FBLA_SYSTEM_PROMPT
      },
      ...chatHistory,
      { role: 'user', content: userMessage }
    ];

    console.log('📤 Making API request...');
    console.log('  - URL:', apiUrl);
    console.log('  - Messages count:', messages.length);

    // Make direct API call
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

    console.log('📥 API Response received:');
    console.log('  - Status:', response.status);
    console.log('  - Status Text:', response.statusText);
    console.log('  - OK:', response.ok);

    if (!response.ok) {
      // Get error details
      const errorText = await response.text();
      console.error('❌ API Error Response:');
      console.error('  - Status:', response.status);
      console.error('  - Body:', errorText);
      
      // Provide user-friendly error messages based on status code
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
    console.log('✅ API Response parsed successfully');
    
    const aiResponse = data.choices?.[0]?.message?.content || "I'm having trouble responding right now.";

    // Simulate streaming if callback provided
    if (onChunk) {
      const words = chunkTextIntoWords(aiResponse);
      await simulateStreaming(words, onChunk);
    }

    return aiResponse;
  } catch {
    // Return user-friendly message
    console.error('❌ Unexpected error in generateAIResponse');
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
