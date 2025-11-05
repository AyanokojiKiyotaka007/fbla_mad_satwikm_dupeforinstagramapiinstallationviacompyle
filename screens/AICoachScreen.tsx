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
          intensity={isDarkMode ? 40 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[
            styles.messageBlur,
            isUser ? styles.userMessageBlur : styles.aiMessageBlur
          ]}
        >
          <View
            style={[
              styles.messageInner,
              {
                borderColor: isUser 
                  ? (isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(0, 61, 165, 0.3)')
                  : (isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)'),
                borderWidth: 1.5,
                backgroundColor: isUser
                  ? (isDarkMode ? 'rgba(90, 159, 238, 0.15)' : 'rgba(0, 61, 165, 0.08)')
                  : (isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)')
              }
            ]}
          >
            {!isUser && (
              <View style={[styles.aiIcon, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="psychology" size={16} color="#FFFFFF" />
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                { color: isUser ? (isDarkMode ? '#FFFFFF' : colors.primary) : colors.text }
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
          intensity={isDarkMode ? 40 : 95}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[styles.eventCard, SHADOWS.medium]}
        >
          <View
            style={[
              styles.eventCardInner,
              {
                borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                borderWidth: 1.5,
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
              }
            ]}
          >
            <View style={styles.eventCardHeader}>
              <View style={[styles.eventIconSmall, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="event" size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.eventCardTitle, { color: colors.text }]} numberOfLines={2}>
                {event.title}
              </Text>
            </View>
            <View style={styles.eventCardDetails}>
              <MaterialIcons name="calendar-today" size={12} color={colors.textSecondary} />
              <Text style={[styles.eventCardDate, { color: colors.textSecondary }]}>
                {event.date}
              </Text>
            </View>
            <View style={styles.viewMoreButton}>
              <Text style={[styles.viewMoreText, { color: colors.primary }]}>View More</Text>
              <MaterialIcons name="arrow-forward" size={14} color={colors.primary} />
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
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="psychology" size={28} color={colors.primary} />
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
                  intensity={isDarkMode ? 40 : 95}
                  tint={isDarkMode ? 'dark' : 'light'}
                  style={[styles.welcomeBlur, SHADOWS.medium]}
                >
                  <View
                    style={[
                      styles.welcomeInner,
                      {
                        borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.4)' : 'rgba(255, 255, 255, 0.7)',
                        borderWidth: 1.5,
                        backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.9)'
                      }
                    ]}
                  >
                    <View style={[styles.welcomeIcon, { backgroundColor: colors.primary }]}>
                      <MaterialIcons name="psychology" size={32} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                      Welcome, {user?.name?.split(' ')[0] || 'Member'}!
                    </Text>
                    <Text style={[styles.welcomeSubtitle, { color: colors.textSecondary }]}>
                      I'm your AI Coach, here to help with leadership growth, event prep, and competition guidance.
                    </Text>
                    {motivationalQuote && (
                      <View style={styles.quoteContainer}>
                        <Text style={[styles.quoteText, { color: colors.primary }]}>
                          "{motivationalQuote}"
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
                  Recommended Events for You
                </Text>
                {recommendedEvents.map((event, index) => renderEventCard(event, index))}
              </Animated.View>
            )}
          </ScrollView>

          {/* Input Area */}
          <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.inputContainer}>
            <BlurView
              intensity={isDarkMode ? 50 : 95}
              tint={isDarkMode ? 'dark' : 'light'}
              style={[styles.inputBlur, SHADOWS.large]}
            >
              <View
                style={[
                  styles.inputInner,
                  {
                    borderColor: isDarkMode ? 'rgba(90, 159, 238, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1.5,
                    backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.5)' : 'rgba(255, 255, 255, 0.95)'
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
                    <MaterialIcons name="send" size={20} color="#FFFFFF" />
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
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 24,
  },
  headerSpacer: {
    width: 40,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  welcomeContainer: {
    marginBottom: SPACING.xl,
  },
  welcomeBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  welcomeInner: {
    padding: SPACING.xl,
    alignItems: 'center',
    borderRadius: 24,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  welcomeTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  quoteContainer: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  quoteText: {
    ...TYPOGRAPHY.bodyMedium,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  welcomePrompt: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    maxWidth: '85%',
  },
  userMessageBlur: {
    borderRadius: 20,
  },
  aiMessageBlur: {
    borderRadius: 20,
  },
  messageInner: {
    padding: SPACING.md,
    borderRadius: 20,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  messageText: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  recommendationsContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  recommendationsTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  eventCardWrapper: {
    marginBottom: SPACING.md,
  },
  eventCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  eventCardInner: {
    padding: SPACING.md,
    borderRadius: 20,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  eventIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCardTitle: {
    ...TYPOGRAPHY.h4,
    fontSize: 16,
    flex: 1,
  },
  eventCardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  eventCardDate: {
    ...TYPOGRAPHY.bodySmall,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
  },
  viewMoreText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  },
  inputBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.sm,
    borderRadius: 24,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    maxHeight: 100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});