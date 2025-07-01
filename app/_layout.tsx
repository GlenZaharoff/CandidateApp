import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const { path, queryParams } = Linking.parse(url);
      console.log('🔗 Received deep link:', path, queryParams);

      if (path === 'reset/password' && queryParams && queryParams.token) {
        router.push({
          pathname: '/reset/password',
          params: { token: queryParams.token },
        });
      }
    });

    return () => subscription.remove();
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="login" />
        <Stack.Screen name="CandidateDashboard" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="forgot-password" />
        {/* ❌ НЕ добавляй "reset-password" здесь — он через listener */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
