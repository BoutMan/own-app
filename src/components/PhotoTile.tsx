import { Image, type ImageContentPosition, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius } from '@/theme';

import { Pill } from './Pill';

type PhotoTileProps = {
  source: ImageSource;
  label?: string;
  height: number;
  focus?: ImageContentPosition;
  rounded?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Rounded photo with a white pill bottom-left. */
export function PhotoTile({ source, label, height, focus = 'center', rounded = radius.tile, onPress, style }: PhotoTileProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.tile, { height, borderRadius: rounded }, style]}
    >
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={focus} />
      {label ? (
        <View style={styles.pill}>
          <Pill label={label} size={height < 140 ? 'sm' : 'md'} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { overflow: 'hidden' },
  pill: { position: 'absolute', left: 10, bottom: 10 },
});
