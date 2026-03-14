import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ImageSize = 'small' | 'medium' | 'large';
export type FontSize = 'small' | 'medium' | 'large';
export type DarkModePreference = 'system' | 'light' | 'dark';

interface SettingsState {
  darkModePreference: DarkModePreference;
  imageSize: ImageSize;
  fontSize: FontSize;
  zoomLevel: number; // 0.8 to 1.5 (80% to 150%)
  setDarkModePreference: (preference: DarkModePreference) => void;
  setImageSize: (size: ImageSize) => void;
  setFontSize: (size: FontSize) => void;
  setZoomLevel: (level: number) => void;
  // Computed: actual dark mode state based on preference
  getDarkMode: () => boolean;
}

// Helper to detect system dark mode
const getSystemDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkModePreference: 'system',
      imageSize: 'medium',
      fontSize: 'medium',
      zoomLevel: 1.0,
      setDarkModePreference: (preference) => set({ darkModePreference: preference }),
      setImageSize: (size) => set({ imageSize: size }),
      setFontSize: (size) => set({ fontSize: size }),
      setZoomLevel: (level) => set({ zoomLevel: Math.max(0.8, Math.min(1.5, level)) }),
      getDarkMode: () => {
        const { darkModePreference } = get();
        if (darkModePreference === 'system') {
          return getSystemDarkMode();
        }
        return darkModePreference === 'dark';
      },
    }),
    {
      name: 'herts-marketplace-settings',
    }
  )
);
