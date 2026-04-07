import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { useAppSettings } from '../settings/AppSettingsProvider';
import {
  AppTheme,
  BackgroundChoice,
  createTheme,
  getBackgroundForMode,
  ThemeMode,
} from './theme';

type AppThemeContextValue = {
  theme: AppTheme;
  backgroundChoice: BackgroundChoice;
  mode: ThemeMode;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const {
    settings: { themeMode },
  } = useAppSettings();

  const currentTheme = useMemo(() => createTheme(themeMode), [themeMode]);
  const bg = useMemo(() => getBackgroundForMode(themeMode), [themeMode]);

  const value = useMemo(
    () => ({
      theme: currentTheme,
      backgroundChoice: bg,
      mode: themeMode,
    }),
    [currentTheme, bg, themeMode],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }

  return context;
}
