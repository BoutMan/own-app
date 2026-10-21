import { Stack } from 'expo-router';

import { colors } from '@/theme';

export default function SessionLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.white } }} />;
}
