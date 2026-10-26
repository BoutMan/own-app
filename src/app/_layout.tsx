import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
  useFonts,
} from '@expo-google-fonts/instrument-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DbProvider } from '@/db/DbProvider';
import { CalendarSync } from '@/features/calendar/useCalendarSync';
import { ReminderSync } from '@/features/reminders/useReminderSync';
import { SubscriptionProvider } from '@/features/subscription/SubscriptionProvider';
import { VaultLockProvider } from '@/features/vault/VaultLock';
import { PreviewInsets } from '@/lib/PreviewInsets';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <PreviewInsets>
        <DbProvider>
          <SubscriptionProvider>
            <VaultLockProvider>
              <ReminderSync />
              <CalendarSync />
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }}>
                <Stack.Screen name="index" options={{ animation: 'fade' }} />
                <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
                <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              </Stack>
            </VaultLockProvider>
          </SubscriptionProvider>
        </DbProvider>
      </PreviewInsets>
    </SafeAreaProvider>
  );
}
