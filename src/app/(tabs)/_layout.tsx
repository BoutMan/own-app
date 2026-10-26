import { Redirect, Tabs } from 'expo-router';

import { TabBar } from '@/components';
import { isUnlocked } from '@/features/subscription/model';
import { useSubscription } from '@/features/subscription/SubscriptionProvider';
import { colors } from '@/theme';

export default function TabsLayout() {
  // Hard paywall: a trial or plan that ended sends her back to the paywall. Her data stays on the phone.
  if (!isUnlocked(useSubscription().state)) return <Redirect href="/paywall" />;
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.white } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="programme" options={{ title: 'Programme' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="me" options={{ title: 'Me' }} />
    </Tabs>
  );
}
