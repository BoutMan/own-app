import type { ImageSource } from 'expo-image';

/**
 * Mood photos from the design handoff. NOT cleared for commercial use (see design/photos/README.md):
 * fine for development, must be replaced before any store build, screenshot or ad.
 */
export const photos = {
  hipThrust: require('../../assets/photos/02-hip-thrust.jpg'),
  splashGirl: require('../../assets/photos/03-splash-girl.jpg'),
  gymMachineSelfie: require('../../assets/photos/05-gym-machine-selfie.jpg'),
  dumbbellRow: require('../../assets/photos/06-dumbbell-row.jpg'),
  waterGlass: require('../../assets/photos/10-water-glass.jpg'),
  sheetMask: require('../../assets/photos/11-sheet-mask.jpg'),
  eggsAvocado: require('../../assets/photos/12-eggs-avocado-berries.jpg'),
  morningWalk: require('../../assets/photos/13-morning-walk-coffee.jpg'),
  iceSkincare: require('../../assets/photos/15-ice-skincare.jpg'),
  seatedStretch: require('../../assets/photos/16-seated-stretch.jpg'),
  gymMirror: require('../../assets/photos/18-gym-mirror.jpg'),
  reverseLunge: require('../../assets/photos/19-reverse-lunge.jpg'),
  mealPrep: require('../../assets/photos/20-meal-prep-fridge.jpg'),
  greySetStretch: require('../../assets/photos/21-grey-set-stretch.jpg'),
  streetAbsMatcha: require('../../assets/photos/23-street-abs-matcha.jpg'),
  trackStretch: require('../../assets/photos/25-track-stretch.jpg'),
  treadmill: require('../../assets/photos/26-treadmill.jpg'),
  fruitBowl: require('../../assets/photos/27-fruit-bowl.jpg'),
  matchaBowl: require('../../assets/photos/31-matcha-bowl.jpg'),
  backFlexRed: require('../../assets/photos/35-back-flex-red.jpg'),
  kettlebellPink: require('../../assets/photos/38-kettlebell-pink-top.jpg'),
  kettlebellPink2: require('../../assets/photos/39-kettlebell-pink-top-2.jpg'),
} satisfies Record<string, ImageSource>;

export type PhotoKey = keyof typeof photos;
