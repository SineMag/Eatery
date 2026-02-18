import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { CloseIcon } from '@/src/components/Icons';

const COMPANY_DOMAIN = 'company.com';

export default function StaffEntryScreen() {
  const router = useRouter();
  const { loginStaff, user, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading || !user) return;

    if (user.isAdmin || user.isStaff) {
      router.replace('/admin');
      return;
    }

    router.replace('/');
  }, [isLoading, router, user]);

  const handleStaffLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }

    setLoading(true);
    const result = await loginStaff(email.trim(), password, staffId.trim());
    setLoading(false);

    if (!result.success) {
      Alert.alert('Staff Sign In Failed', result.error || 'Invalid credentials');
      return;
    }

    router.dismissAll();
    router.replace('/admin');
  };

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <CloseIcon size={28} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image source={require('@/assets/images/EateryLogo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Staff Entry</Text>
            <Text style={styles.subtitle}>Use your company staff credentials</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>Default Admin</Text>
              <Text style={styles.hintText}>Email: admin@{COMPANY_DOMAIN}</Text>
              <Text style={styles.hintText}>Password: Admin456</Text>
              <Text style={styles.hintFootnote}>Staff ID is optional for admin login.</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company Email</Text>
              <TextInput
                style={styles.input}
                placeholder={`name.surname@${COMPANY_DOMAIN}`}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Staff ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Example: ID59025K"
                value={staffId}
                onChangeText={(value) => setStaffId(value.toUpperCase())}
                autoCapitalize="characters"
              />
              <Text style={styles.helper}>Required for non-admin staff accounts.</Text>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleStaffLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Enter Staff Dashboard'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  form: {
    gap: 16,
  },
  hintCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 14,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#374151',
    marginBottom: 2,
  },
  hintFootnote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
  },
  inputGroup: {},
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#11181C',
  },
  helper: {
    marginTop: 6,
    color: '#6b7280',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#11181C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
