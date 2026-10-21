import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

const tabIcons: Record<string, IconName> = {
  index: 'home',
  programme: 'calendar',
  progress: 'trend',
  me: 'person',
};

/** 84px bar, four tabs: Today, Programme, Progress, Me. Active tab in ink, others grey. */
export function TabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 22) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const options = descriptors[route.key]?.options;
        const label = typeof options?.title === 'string' ? options.title : route.name;
        const color = focused ? colors.ink : colors.grey;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={() => {
              const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigateToTab(route.key);
            }}
            style={styles.tab}
          >
            <Icon name={tabIcons[route.name] ?? 'home'} size={22} strokeWidth={focused ? 1.7 : 1.6} color={color} />
            <Txt variant="tab" weight={focused ? 600 : 400} color={color}>
              {label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
});
