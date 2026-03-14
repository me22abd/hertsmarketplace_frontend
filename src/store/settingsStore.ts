import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ImageSize = 'small' | 'medium' | 'large';
export type FontSize = 'small' | 'medium' | 'large';

interface SettingsState {
  darkMode: boolean;
  imageSize: ImageSize;
  fontSize: FontSize;
  zoomLevel: number; // 0.8 to 1.5 (80% to 150%)
  toggleDarkMode: () => void;
  setImageSize: (size: ImageSize) => void;
  setFontSize: (size: FontSize) => void;
  setZoomLevel: (level: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      imageSize: 'medium',
      fontSize: 'medium',
      zoomLevel: 1.0,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setImageSize: (size) => set({ imageSize: size }),
      setFontSize: (size) => set({ fontSize: size }),
      setZoomLevel: (level) => set({ zoomLevel: Math.max(0.8, Math.min(1.5, level)) }),
    }),
    {
      name: 'herts-marketplace-settings',
    }
  )
);
