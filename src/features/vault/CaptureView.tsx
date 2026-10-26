import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, CircleButton, Pill, Txt } from '@/components';
import { colors } from '@/theme';

type CaptureViewProps = {
  title: string;
  cue: string;
  /** Last photo of the same pose, shown as a ghost to match the pose and framing. */
  ghost: string | null;
  onKeep: (tempUri: string) => void;
  onClose: () => void;
};

/**
 * Guided camera for vault photos: ghost of the previous photo, keep or retake. The capture stays
 * in the app: it is never written to the photo library.
 */
export function CaptureView({ title, cue, ghost, onKeep, onClose }: CaptureViewProps) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [shot, setShot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const take = async () => {
    if (!camera.current || busy) return;
    setBusy(true);
    try {
      // Web preview keeps a small JPEG (data URI) in its database; the phone keeps a file.
      const p = await camera.current.takePictureAsync({ quality: Platform.OS === 'web' ? 0.5 : 0.8, scale: 0.4, shutterSound: false });
      setShot(p.uri);
    } finally {
      setBusy(false);
    }
  };

  if (!permission) return <View style={styles.root} />;
  if (!permission.granted) {
    return (
      <View style={[styles.root, styles.ask, { paddingTop: insets.top + 20 }]}>
        <Txt variant="h2" color={colors.white} style={{ textAlign: 'center' }}>
          The camera stays in Own
        </Txt>
        <Txt variant="body" color="rgba(255,255,255,0.8)" style={{ textAlign: 'center' }}>
          Your photos go straight into the locked vault on this phone. Not your camera roll, never a server.
        </Txt>
        <Button
          label={permission.canAskAgain ? 'Allow the camera' : 'Open Settings'}
          onPress={() => (permission.canAskAgain ? void requestPermission() : void Linking.openSettings())}
        />
        <Button label="Not now" variant="ghost" onPress={onClose} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {shot ? (
        <Image source={{ uri: shot }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        <>
          <CameraView ref={camera} style={StyleSheet.absoluteFill} facing={facing} animateShutter={false} />
          {ghost ? <Image source={{ uri: ghost }} style={[StyleSheet.absoluteFill, styles.ghost]} contentFit="cover" pointerEvents="none" /> : null}
        </>
      )}
      <View style={[styles.top, { top: insets.top + 12 }]}>
        <CircleButton icon="close" surface="white" accessibilityLabel="Close" onPress={onClose} />
        <Pill label={title} dot size="sm" />
        {shot ? <View style={{ width: 44 }} /> : <CircleButton icon="repeat" surface="white" accessibilityLabel="Switch camera" onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))} />}
      </View>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        <Txt variant="meta" color={colors.white} style={{ textAlign: 'center' }}>
          {shot ? 'Only you will see it.' : ghost ? `${cue} Line up with the ghost.` : cue}
        </Txt>
        {shot ? (
          <View style={styles.row}>
            <Button label="Retake" variant="ghost" style={{ flex: 1 }} onPress={() => setShot(null)} />
            <Button label="Keep it" style={{ flex: 1 }} onPress={() => onKeep(shot)} />
          </View>
        ) : (
          <Pressable accessibilityRole="button" accessibilityLabel="Take photo" onPress={take} style={styles.shutter}>
            <View style={styles.shutterInner} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111111' },
  ask: { paddingHorizontal: 28, justifyContent: 'center', gap: 16 },
  ghost: { opacity: 0.32 },
  top: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 0, gap: 16, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.white },
});
