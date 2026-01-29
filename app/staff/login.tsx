import { Logo } from '@/components/logo';
import { useStaffAuth } from '@/hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function StaffLoginScreen() {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { signInWithStaffCredentials } = useStaffAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!staffId.trim()) {
      newErrors.staffId = 'Staff ID is required';
    } else if (!/^[A-Z]{2}\d{4}$/.test(staffId.toUpperCase())) {
      newErrors.staffId = 'Staff ID format: ID0001 (2 letters + 4 numbers)';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain lowercase letters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain uppercase letters';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await signInWithStaffCredentials(staffId.toUpperCase(), password);
      if (error) {
        Alert.alert('Login Error', error);
        return;
      }
      router.replace('/admin/dashboard' as any);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    if (field === 'staffId') setStaffId(value);
    else setPassword(value);

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo size="large" />
          </View>
          <Text style={styles.title}>Staff Entry</Text>
          <Text style={styles.subtitle}>Use your company credentials</Text>

          <View>
            <TextInput
              style={[styles.input, errors.staffId && styles.inputError]}
              placeholder="Staff ID (e.g., ID0001)"
              value={staffId}
              onChangeText={(value) => updateField('staffId', value.toUpperCase())}
              autoCapitalize="characters"
              placeholderTextColor="#9ca3af"
            />
            {errors.staffId && <Text style={styles.errorText}>{errors.staffId}</Text>}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              value={password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry
              placeholderTextColor="#9ca3af"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementTitle}>Password must contain:</Text>
            <Text style={[styles.requirement, /[a-z]/.test(password) && styles.requirementMet]}>
              ✓ Lowercase letters (a-z)
            </Text>
            <Text style={[styles.requirement, /[A-Z]/.test(password) && styles.requirementMet]}>
              ✓ Uppercase letters (A-Z)
            </Text>
            <Text style={[styles.requirement, /\d/.test(password) && styles.requirementMet]}>
              ✓ Numbers (0-9)
            </Text>
            <Text style={[styles.requirement, password.length >= 8 && styles.requirementMet]}>
              ✓ At least 8 characters
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <Text style={styles.helper}>No registration required. Ask your manager if you don't have credentials.</Text>

          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.linkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#11181C', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 4,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#11181C',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 12,
    marginTop: -12,
  },
  passwordRequirements: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  requirementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  requirement: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  requirementMet: {
    color: '#10b981',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#11181C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  helper: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginBottom: 12 },
  linkText: { color: '#6b7280', fontSize: 14, textAlign: 'center', textDecorationLine: 'underline' },
});
