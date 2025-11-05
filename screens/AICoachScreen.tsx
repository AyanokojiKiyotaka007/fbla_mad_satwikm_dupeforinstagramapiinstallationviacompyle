import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { generateAIResponse, getMotivationalQuote, Message } from '../utils/ai';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';
import { SPACING, TYPOGRAPHY, SHADOWS } from '../constants/theme';

interface AICoachScreenProps {
  navigation: any;
}

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export default function AICoachScreen({ navigation }: AICoachScreenProps) {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [showQuote, setShowQuote] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load motivational quote on mount
  useEffect(() => {
    loadMotivationalQuote();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, streamingText]);

  const loadMotivationalQuote = async () => {
    const quote = await getMotivationalQuote();
    setMotivationalQuote(quote);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setShowQuote(false);
    Keyboard.dismiss();

    // Add user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    // Create streaming placeholder
    const streamingMessageId = (Date.now() + 1).toString();
    const streamingMessage: ChatMessage = {
      id: streamingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, streamingMessage]);
    setStreamingText('');

    // Get chat history for context
    const chatHistory: Message[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate AI response with streaming
    const response = await generateAIResponse(
      userMessage,
      chatHistory,
      (chunk) => {
        setStreamingText(prev => prev + chunk);
      }
    );

    // Replace streaming message with final response
    setMessages(prev => 
      prev.map(msg => 
        msg.id === streamingMessageId 
          ? { ...msg, content: response, isStreaming: false }
          : msg
      )
    );

    setStreamingText('');
    setIsLoading(false);

    // Check if user asked about events and show recommendations
    if (userMessage.toLowerCase().includes('event')) {
      recommendEvents();
    }
  };

  const recommendEvents = () => {
    // Simple recommendation: show upcoming registered events
    const upcoming = mockEvents.filter(e => e.isRegistered).slice(0, 3);
    setRecommendedEvents(upcoming);
  };

  const handleEventPress = (event: Event) => {
    navigation.navigate('EventDetail', { event });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    const isUser = message.role === 'user';
    const displayContent = message.isStreaming ? streamingText : message.content;

    return (
      <Animated.View
        key={message.id}
        entering={FadeInUp.delay(index * 50).springify()}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer
        ]}
      >
        <BlurView
          intensity={isDarkMode ? 50 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={styles.messageBlur}
        >
          <View
            style={[
              styles.messageInner,
              {
                borderColor: isUser 
                  ? (isDarkMode ? 'rgba(90, 159, 238, 0.6)' : 'rgba(0, 61, 165, 0.4)')
                  : (isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.8)'),
                borderWidth: 1.5,
                backgroundColor: isUser
                  ? (isDarkMode ? 'rgba(90, 159, 238, 0.2)' : 'rgba(0, 61, 165, 0.1)')
                  : (isDarkMode ? 'rgba(26, 31, 46, 0.6)' : 'rgba(255, 255, 255, 0.95)')
              }
            ]}
          >
            {!isUser && (
              <View style={[styles.aiIconContainer]}>
                <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="psychology" size={18} color="#FFFFFF" />
                </View>
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                { 
                  color: isUser ? (isDarkMode ? '#FFFFFF' : colors.primary) : colors.text,
                  textAlign: isUser ? 'right' : 'left'
                }
              ]}
            >
              {displayContent}
              {message.isStreaming && (
                <Text style={{ color: colors.primary }}>▊</Text>
              )}
            </Text>
          </View>
        </BlurView>
      </Animated.View>
    );
  };

  const renderEventCard = (event: Event, index: number) => (
    <Animated.View
      key={event.id}
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.eventCardWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => handleEventPress(event)}
      >
        <BlurView
          intensity={isDarkMode ? 50 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.eventCard, SHADOWS.medium]}
        >
          <View
            style={[
              styles.eventCardInner,
              {
                borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1.5,
                backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.6)' : 'rgba(255, 255, 255, 0.95)'
              }
            ]}
          >
            <View style={styles.eventCardHeader}>
              <View style={[styles.eventIconSmall, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="event" size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.eventCardTitle, { color: colors.text }]} numberOfLines={2}>
                {event.title}
              </Text>
            </View>
            <View style={styles.eventCardDetails}>
              <MaterialIcons name="calendar-today" size={14} color={colors.textSecondary} />
              <Text style={[styles.eventCardDate, { color: colors.textSecondary }]}>
                {event.date}
              </Text>
            </View>
            <View style={styles.viewMoreButton}>
              <Text style={[styles.viewMoreText, { color: colors.primary }]}>View Details</Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F1419' : '#D4E3F7' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="psychology" size={32} color={colors.primary} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>AI Coach</Text>
          </View>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Chat Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Welcome Message */}
            {messages.length === 0 && showQuote && (
              <Animated.View entering={FadeIn.delay(400).springify()} style={styles.welcomeContainer}>
                <BlurView
                  intensity={isDarkMode ? 50 : 95}
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.welcomeBlur, SHADOWS.large]}
                >
                  <View
                    style={[
                      styles.welcomeInner,
                      {
                        borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                        borderWidth: 2,
                        backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.6)' : 'rgba(255, 255, 255, 0.95)'
                      }
                    ]}
                  >
                    <View style={[styles.welcomeIcon, { backgroundColor: colors.primary }]}>
                      <MaterialIcons name="psychology" size={36} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                      Welcome, {user?.name?.split(' ')[0] || 'Member'}!
                    </Text>
                    <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                      Your AI Coach for leadership growth, event prep, and competition guidance.
                    </Text>
                    {motivationalQuote && (
                      <View style={styles.quoteContainer}>
                        <MaterialIcons name="format-quote" size={24} color={colors.primary} style={styles.quoteIcon} />
                        <Text style={[styles.quoteText, { color: colors.primary }]}>
                          {motivationalQuote}
                        </Text>
                      </View>
                    )}
                    <Text style={[styles.welcomePrompt, { color: colors.textLight }]}>
                      Ask me anything about FBLA events, leadership tips, or competition strategies!
                    </Text>
                  </View>
                </BlurView>
              </Animated.View>
            )}

            {/* Messages */}
            {messages.map((message, index) => renderMessage(message, index))}

            {/* Recommended Events */}
            {recommendedEvents.length > 0 && (
              <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.recommendationsContainer}>
                <Text style={[styles.recommendationsTitle, { color: colors.text }]}>
                  Recommended Events
                </Text>
                {recommendedEvents.map((event, index) => renderEventCard(event, index))}
              </Animated.View>
            )}
          </ScrollView>

          {/* Input Area */}
          <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.inputContainer}>
            <BlurView
              intensity={isDarkMode ? 60 : 95}
              tint={isDarkMode ? 'dark' : 'light'}
              style={[styles.inputBlur, SHADOWS.large]}
            >
              <View
                style={[
                  styles.inputInner,
                  {
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                    borderWidth: 2,
                    backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.7)' : 'rgba(255, 255, 255, 0.98)'
                  }
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Ask your AI Coach..."
                  placeholderTextColor={colors.textLight}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  editable={!isLoading}
                  onSubmitEditing={handleSendMessage}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  activeOpacity={0.7}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor: (!inputText.trim() || isLoading) 
                        ? colors.textLight 
                        : colors.primary
                    }
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialIcons name="send" size={22} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 44,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  welcomeContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  welcomeBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    width: '100%',
  },
  welcomeInner: {
    padding: SPACING.xl * 1.5,
    alignItems: 'center',
    borderRadius: 28,
  },
  welcomeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  quoteContainer: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: SPACING.xs,
    opacity: 0.7,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  welcomePrompt: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  messageContainer: {
    marginBottom: SPACING.lg,
    width: '100%',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBlur: {
    borderRadius: 22,
    overflow: 'hidden',
    maxWidth: '82%',
  },
  messageInner: {
    padding: SPACING.lg,
    borderRadius: 22,
  },
  aiIconContainer: {
    marginBottom: SPACING.sm,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  recommendationsContainer: {
    marginTop: SPACING.xl * 1.5,
    marginBottom: SPACING.lg,
  },
  recommendationsTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  eventCardWrapper: {
    marginBottom: SPACING.lg,
  },
  eventCard: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  eventCardInner: {
    padding: SPACING.lg,
    borderRadius: 22,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  eventIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  eventCardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  eventCardDate: {
    fontSize: 14,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
  },
  inputBlur: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.md,
    borderRadius: 28,
    gap: SPACING.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    lineHeight: 22,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});