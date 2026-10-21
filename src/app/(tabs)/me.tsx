import { router } from 'expo-router';

import { Button, Placeholder } from '@/components';

/** 25 · Me. */
export default function Me() {
  return (
    <Placeholder title="Me" accent="Me" screen="25">
      {__DEV__ ? <Button label="Open kitchen sink" variant="outline" onPress={() => router.push('/dev/kitchen-sink')} /> : null}
    </Placeholder>
  );
}
