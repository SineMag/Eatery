import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { CartProvider } from '@/src/contexts/CartContext';
import { OrderProvider } from '@/src/contexts/OrderContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
              <Stack.Screen name="auth/register" options={{ presentation: 'modal' }} />
              <Stack.Screen name="item/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="checkout" options={{ presentation: 'card' }} />
              <Stack.Screen name="order/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="admin" options={{ presentation: 'card' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
