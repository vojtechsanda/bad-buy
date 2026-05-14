import { signIn } from '@features/auth/service';
import { Button, ButtonText } from '@shared/components/ui/button';
import { useRouter } from 'expo-router';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(app)/home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message.toLowerCase() : '';
      if (message.includes('invalid') || message.includes('credentials')) {
        setError('Email or password is incorrect.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-50"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Pressable onPress={() => router.back()} className="px-5 py-3">
        <ChevronLeft size={24} color="#2C2A26" strokeWidth={1.75} />
      </Pressable>

      <View className="flex-1 gap-6 px-5 pt-6">
        <Text className="font-nunito-bold text-display-md text-typography-900">Welcome back</Text>

        <View className="gap-3">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#9A938A"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            className="h-12 rounded-lg border border-outline-300 bg-background-0 px-4 font-nunito text-body text-typography-900"
          />

          <View className="relative">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9A938A"
              secureTextEntry={!showPassword}
              autoComplete="password"
              className="h-12 rounded-lg border border-outline-300 bg-background-0 px-4 pr-12 font-nunito text-body text-typography-900"
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 w-12 items-center justify-center">
              {showPassword ? (
                <EyeOff size={20} color="#6B6660" strokeWidth={1.75} />
              ) : (
                <Eye size={20} color="#6B6660" strokeWidth={1.75} />
              )}
            </Pressable>
          </View>

          {error ? <Text className="font-nunito text-body-sm text-error-600">{error}</Text> : null}
        </View>

        <View className="gap-4">
          <Button size="lg" action="primary" onPress={handleLogin} isDisabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#FBF9F5" /> : <ButtonText>Log in</ButtonText>}
          </Button>

          <View className="flex-row justify-center gap-1">
            <Text className="font-nunito text-body text-typography-600">
              Don&apos;t have an account?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text className="font-nunito-semibold text-body text-primary-500">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
