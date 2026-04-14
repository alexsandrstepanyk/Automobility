import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, Lock, LogIn } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', email);
    login();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.foreground} />
          <Text style={styles.backText}>Назад</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Вхід у кабінет</Text>
          <Text style={styles.subtitle}>Ласкаво просимо до Automobility</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <Mail size={20} color={COLORS.muted} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.iconContainer}>
              <Lock size={20} color={COLORS.muted} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor={COLORS.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotText}>Забули пароль?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Увійти</Text>
            <LogIn size={20} color={COLORS.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ще не маєте кабінету? </Text>
          <TouchableOpacity onPress={() => console.log('Register press')}>
            <Text style={styles.registerLink}>Замовити послугу без реєстрації</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backText: {
    color: COLORS.foreground,
    marginLeft: 4,
    fontSize: 16,
  },
  header: {
    marginBottom: SPACING.xl * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    height: 60,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 16,
  },
  forgotPass: {
    alignItems: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotText: {
    color: COLORS.accent,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: COLORS.accent,
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonText: {
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
