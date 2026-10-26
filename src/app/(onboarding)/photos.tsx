import { router } from 'expo-router';
import { useState } from 'react';

import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { CaptureView } from '@/features/vault/CaptureView';
import { keepCapture } from '@/features/vault/files';
import { POSES } from '@/features/vault/poses';

/** 07 bis · Day-0 photos during onboarding: front, side, back, straight into the vault. */
export default function OnboardingPhotos() {
  const { answers, update } = useOnboarding();
  const [index, setIndex] = useState(() => Math.max(0, POSES.findIndex((p) => !answers.photos[p.id])));
  const pose = POSES[index]!;
  return (
    <CaptureView
      key={pose.id}
      title={`Day 0 · ${pose.label}`}
      cue={pose.cue}
      ghost={null}
      onClose={() => router.back()}
      onKeep={async (uri) => {
        const kept = await keepCapture(uri, `day0-${pose.id}-${Date.now()}`);
        const photos = { ...answers.photos, [pose.id]: kept };
        update('photos', photos);
        const next = POSES.findIndex((p) => !photos[p.id]);
        if (next < 0) router.back();
        else setIndex(next);
      }}
    />
  );
}
