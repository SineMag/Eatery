import { Logo } from '@/components/logo';
import { useStaffAuth } from '@/hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function StaffLoginScreen() {
  const [staffId, setStaffId] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signInWithStaffCredentials } = useStaffAuth();

  const handleLogin = async () => {
    if (!staffId || !fullName || !password) {
      Alert.alert('Error', 'Please fill in Staff ID, Full Name and Password');
      return;
    }
    setLoading(true);
    const { error } = await signInWithStaffCredentials(staffId, fullName, password);
    setLoading(false);
    if (error) {
      Alert.alert('Login Error', error);
      return;
    }
    router.replace('/admin/dashboard' as any);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="large" />
        </View>
        <Text style={styles.title}>Staff Login</Text>
        <Text style={styles.subtitle}>Use your company credentials</Text>

        <TextInput
          style={styles.input}
          placeholder="Staff ID"
          value={staffId}
          onChangeText={setStaffId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <Text style={styles.helper}>No registration required. Ask your manager if you don't have credentials.</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}>Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#11181C', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  button: { backgroundColor: '#11181C', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  helper: { color: '#6b7280', fontSize: 12, textAlign: 'center', marginBottom: 12 },
  linkText: { color: '#6b7280', fontSize: 14, textAlign: 'center' },
});
