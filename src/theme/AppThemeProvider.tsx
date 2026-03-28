import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import {
  AppTheme,
  BackgroundChoice,
  backgroundChoice,
  createTheme,
} from './theme';

type AppThemeContextValue = {
  theme: AppTheme;
  backgroundChoice: BackgroundChoice;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const currentTheme = useMemo(() => createTheme(), []);

  const value = useMemo(
    () => ({
      theme: currentTheme,
      backgroundChoice,
    }),
    [currentTheme],
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
