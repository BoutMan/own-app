import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircleButton, Pill } from '@/components';
import { exerciseVideo } from '@/content/exerciseMedia';
import { photos, type PhotoKey } from '@/content/photos';

type DemoVideoProps = {
  exerciseId: string;
  title: string;
  /** Shown behind the video while it loads, and instead of it when the move has no video yet. */
  poster: PhotoKey;
  visible: boolean;
  onClose: () => void;
  /** Sound on in the guided session ("play demo with sound"), muted in the library. */
  sound?: boolean;
};

/** Full-screen exercise demo, looping, from the videos bundled in the app. */
export function DemoVideo({ exerciseId, title, poster, visible, onClose, sound = false }: DemoVideoProps) {
  const source = exerciseVideo(exerciseId);
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} presentationStyle="fullScreen">
      {visible && source ? <Player source={source} poster={poster} title={title} onClose={onClose} sound={sound} /> : null}
    </Modal>
  );
}

function Player({ source, poster, title, onClose, sound }: { source: number; poster: PhotoKey; title: string; onClose: () => void; sound: boolean }) {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = !sound;
    p.play();
  });
  return (
    <View style={styles.root}>
      <Image source={photos[poster]} style={StyleSheet.absoluteFill} contentFit="cover" />
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      <View style={[styles.top, { top: insets.top + 12 }]}>
        <CircleButton icon="close" surface="white" accessibilityLabel="Close demo" onPress={onClose} />
        <Pill label={title} dot size="sm" />
      </View>
    </View>
  );
}

export function hasDemo(exerciseId: string | null | undefined): boolean {
  return exerciseVideo(exerciseId) !== null;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#111111' },
  top: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
