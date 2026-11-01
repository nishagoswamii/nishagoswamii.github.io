import { withBase } from '@/lib/utils';
export const MOOD_PATH = withBase('/Images/moods');

// `origin` is where each mood's accent shapes sit, as a percentage of the sticker.
export const MOODS = {
  smile: { origin: null },
  thumbs: { origin: '11% 47%' },
  think: { origin: '14% 25%' },
  laugh: { origin: '14% 32%' },
  sparkle: { origin: '15% 28%' },
  wow: { origin: '15% 26%' },
} as const;

export type Mood = keyof typeof MOODS;
