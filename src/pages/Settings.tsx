import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Image, Type, ZoomIn, ZoomOut, Monitor } from 'lucide-react';
import { useSettingsStore, type ImageSize, type FontSize, type DarkModePreference } from '@/store/settingsStore';
import BottomNav from '@/components/BottomNav';

export default function Settings() {
  const navigate = useNavigate();
  const {
    darkModePreference,
    imageSize,
    fontSize,
    zoomLevel,
    setDarkModePreference,
    setImageSize,
    setFontSize,
    setZoomLevel,
    getDarkMode,
  } = useSettingsStore();

  const currentDarkMode = getDarkMode();

  // Settings are applied globally in App.tsx, no need to apply here

  const imageSizeOptions: { value: ImageSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-target -ml-2"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Appearance Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
          
          {/* Dark Mode Preference */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                {currentDarkMode ? (
                  <Moon size={20} className="text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun size={20} className="text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">Appearance</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {darkModePreference === 'system' 
                      ? `Following system (${currentDarkMode ? 'Dark' : 'Light'})`
                      : darkModePreference === 'dark'
                      ? 'Dark mode'
                      : 'Light mode'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {(['system', 'light', 'dark'] as DarkModePreference[]).map((pref) => (
                <button
                  key={pref}
                  onClick={() => setDarkModePreference(pref)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    darkModePreference === pref
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {pref === 'system' && <Monitor size={16} />}
                  {pref === 'light' && <Sun size={16} />}
                  {pref === 'dark' && <Moon size={16} />}
                  {pref === 'system' ? 'System' : pref === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Level */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <ZoomIn size={20} className="text-gray-600 dark:text-gray-400" />
              <div className="flex-1">
                <p className="text-base font-medium text-gray-900 dark:text-white">Zoom Level</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adjust overall screen size ({Math.round(zoomLevel * 100)}%)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setZoomLevel(zoomLevel - 0.1)}
                disabled={zoomLevel <= 0.8}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                aria-label="Zoom out"
              >
                <ZoomOut size={18} />
              </button>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() => setZoomLevel(zoomLevel + 0.1)}
                disabled={zoomLevel >= 1.5}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                aria-label="Zoom in"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content</h2>
          
          {/* Image Size */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Image size={20} className="text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white">Image Size</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Control how large images appear
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {imageSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setImageSize(option.value)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    imageSize === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-4">
              <Type size={20} className="text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white">Font Size</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Adjust text size for readability
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    fontSize === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
