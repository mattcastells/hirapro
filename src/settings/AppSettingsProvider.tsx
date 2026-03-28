import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { File, Paths } from 'expo-file-system';

type AppSettings = {
  hapticsEnabled: boolean;
};

type AppSettingsContextValue = {
  settings: AppSettings;
  setHapticsEnabled: (enabled: boolean) => void;
};

const DEFAULT_SETTINGS: AppSettings = {
  hapticsEnabled: false,
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const settingsFile = getSettingsFile();

        if (!settingsFile.exists) {
          return;
        }

        const fileContents = await settingsFile.text();
        const parsed = JSON.parse(fileContents);

        if (!cancelled) {
          setSettings(normalizeSettings(parsed));
        }
      } catch {
        if (!cancelled) {
          setSettings(DEFAULT_SETTINGS);
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const setHapticsEnabled = useCallback((enabled: boolean) => {
    setSettings((currentSettings) => {
      const nextSettings = {
        ...currentSettings,
        hapticsEnabled: enabled,
      };

      void persistSettings(nextSettings);
      return nextSettings;
    });
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setHapticsEnabled,
    }),
    [setHapticsEnabled, settings],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }

  return context;
}

function getSettingsFile() {
  return new File(Paths.document, 'app-settings.json');
}

function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SETTINGS;
  }

  const candidate = value as Partial<AppSettings>;

  return {
    hapticsEnabled: candidate.hapticsEnabled === true,
  };
}

async function persistSettings(settings: AppSettings) {
  try {
    const settingsFile = getSettingsFile();
    settingsFile.create({ intermediates: true, overwrite: true });
    settingsFile.write(JSON.stringify(settings), { encoding: 'utf8' });
  } catch {
    // Ignore persistence failures and keep the in-memory setting.
  }
}
