import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface SignUpScreenProps {
  navigation: any;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    chapter: '',
    position: 'Member',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { signUp } = useAuth();
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const handleSignUp = async () => {
    // Reset errors
    setErrors({});

    // Validation
    let hasError = false;
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      hasError = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      hasError = true;
    }

    if (!formData.chapter.trim()) {
      newErrors.chapter = 'Chapter name is required';
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Attempt sign up
    const success = await signUp(formData);
    if (!success) {
      Alert.alert('Error', 'Email already exists. Please use a different email.');
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join FBLA Connect today
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.name ? colors.error : colors.border }]}>
                <MaterialIcons name="person" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textLight}
                  value={formData.name}
                  onChangeText={(text) => updateField('name', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.email ? colors.error : colors.border }]}>
                <MaterialIcons name="email" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textLight}
                  value={formData.email}
                  onChangeText={(text) => updateField('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.phone ? colors.error : colors.border }]}>
                <MaterialIcons name="phone" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="(555) 123-4567"
                  placeholderTextColor={colors.textLight}
                  value={formData.phone}
                  onChangeText={(text) => updateField('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Chapter Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Chapter Name *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.chapter ? colors.error : colors.border }]}>
                <MaterialIcons name="school" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your chapter name"
                  placeholderTextColor={colors.textLight}
                  value={formData.chapter}
                  onChangeText={(text) => updateField('chapter', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.chapter ? <Text style={styles.errorText}>{errors.chapter}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.password ? colors.error : colors.border }]}>
                <MaterialIcons name="lock" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textLight}
                  value={formData.password}
                  onChangeText={(text) => updateField('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={colors.textLight}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm Password *</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.confirmPassword ? colors.error : colors.border }]}>
                <MaterialIcons name="lock" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textLight}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateField('confirmPassword', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8}>
              <LinearGradient
                colors={['#003DA5', '#1E5BC6']}
                style={styles.signUpButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.signUpButtonText}>Create Account</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: '#003DA5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003DA5',
  },
});