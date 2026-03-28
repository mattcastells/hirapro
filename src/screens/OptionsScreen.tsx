import { useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Platform, StyleSheet, View } from 'react-native';
import * as Application from 'expo-application';

import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { AppText } from '../components/ui/AppText';
import { downloadAndInstallRelease } from '../features/update/androidUpdater';
import {
  compareVersions,
  fetchLatestRelease,
  type AppRelease,
} from '../features/update/releaseClient';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';

type UpdateState =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'up-to-date'; currentVersion: string }
  | { kind: 'available'; currentVersion: string; release: AppRelease }
  | { kind: 'installing'; currentVersion: string; release: AppRelease }
  | { kind: 'error'; currentVersion: string; message: string };

export function OptionsScreen() {
  const { theme: activeTheme } = useAppTheme();
  const installedVersion = useMemo(
    () => Application.nativeApplicationVersion ?? '0.1.0',
    [],
  );
  const [updateState, setUpdateState] = useState<UpdateState>({ kind: 'idle' });

  const checkForUpdates = async () => {
    if (Platform.OS !== 'android') {
      setUpdateState({
        kind: 'error',
        currentVersion: installedVersion,
        message: 'Este flujo de actualizacion esta disponible solo en Android.',
      });
      return;
    }

    setUpdateState({ kind: 'checking' });

    try {
      const release = await fetchLatestRelease();
      const hasUpdate = compareVersions(release.version, installedVersion) > 0;

      if (!hasUpdate) {
        setUpdateState({
          kind: 'up-to-date',
          currentVersion: installedVersion,
        });
        return;
      }

      setUpdateState({
        kind: 'installing',
        currentVersion: installedVersion,
        release,
      });
      await downloadAndInstallRelease(release);
      setUpdateState({
        kind: 'available',
        currentVersion: installedVersion,
        release,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo buscar ni descargar la actualizacion.';

      setUpdateState({
        kind: 'error',
        currentVersion: installedVersion,
        message,
      });
    }
  };

  const statusTone = getStatusTone(updateState.kind);
  const latestVersion =
    updateState.kind === 'available' || updateState.kind === 'installing'
      ? updateState.release.version
      : null;
  const releasePageUrl =
    updateState.kind === 'available' || updateState.kind === 'installing'
      ? updateState.release.pageUrl
      : null;

  return (
    <ScreenBackground bottomNavActive="options">
      <ScreenHeader
        title="Opciones"
        subtitle="Busca releases nuevas desde GitHub e instala la ultima APK disponible."
      />

      <GlassCard contentStyle={styles.cardContent}>
        <View style={styles.section}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            Version instalada
          </AppText>
          <AppText variant="headline">{installedVersion}</AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="label" color={activeTheme.colors.textMuted}>
            Estado
          </AppText>
          <View
            style={[
              styles.statusPill,
              {
                borderColor: hexToRgba(statusTone, 0.42),
                backgroundColor: hexToRgba(statusTone, 0.12),
              },
            ]}
          >
            {updateState.kind === 'checking' || updateState.kind === 'installing' ? (
              <ActivityIndicator color={statusTone} size="small" />
            ) : null}
            <AppText variant="bodyStrong" color={statusTone} style={styles.statusText}>
              {getStatusLabel(updateState, installedVersion)}
            </AppText>
          </View>
        </View>

        {latestVersion ? (
          <View style={styles.section}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              Ultima release encontrada
            </AppText>
            <AppText variant="bodyStrong">{latestVersion}</AppText>
          </View>
        ) : null}

        {updateState.kind === 'error' ? (
          <AppText variant="bodySmall" color={activeTheme.colors.error}>
            {updateState.message}
          </AppText>
        ) : null}

        <PrimaryButton
          title={
            updateState.kind === 'checking'
              ? 'BUSCANDO...'
              : updateState.kind === 'installing'
                ? 'DESCARGANDO...'
                : 'BUSCAR ACTUALIZACIONES'
          }
          onPress={checkForUpdates}
          disabled={
            updateState.kind === 'checking' || updateState.kind === 'installing'
          }
          style={styles.primaryAction}
        />

        {releasePageUrl ? (
          <PrimaryButton
            title="VER RELEASE EN GITHUB"
            variant="secondary"
            size="compact"
            onPress={() => {
              void Linking.openURL(releasePageUrl);
            }}
          />
        ) : null}

        <AppText variant="bodySmall" color={activeTheme.colors.textMuted} style={styles.note}>
          Si Android bloquea la instalacion, habilita &quot;Instalar apps desconocidas&quot;
          para Hirapro o para el instalador del sistema.
        </AppText>
      </GlassCard>
    </ScreenBackground>
  );
}

function getStatusLabel(state: UpdateState, installedVersion: string) {
  switch (state.kind) {
    case 'checking':
      return 'Buscando release nueva...';
    case 'up-to-date':
      return `Ya estas en ${installedVersion}`;
    case 'available':
      return `APK ${state.release.version} lista para instalar`;
    case 'installing':
      return `Descargando ${state.release.version}...`;
    case 'error':
      return 'No se pudo actualizar';
    case 'idle':
    default:
      return 'Sin verificar';
  }
}

function getStatusTone(kind: UpdateState['kind']) {
  switch (kind) {
    case 'error':
      return theme.colors.error;
    case 'up-to-date':
      return theme.colors.success;
    case 'available':
    case 'installing':
      return theme.colors.accentBlue;
    case 'checking':
      return theme.colors.warning;
    case 'idle':
    default:
      return theme.colors.textSecondary;
  }
}

const styles = StyleSheet.create({
  cardContent: {
    gap: theme.spacing.md,
  },
  section: {
    gap: theme.spacing.xs,
  },
  statusPill: {
    minHeight: 44,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusText: {
    flexShrink: 1,
  },
  primaryAction: {
    marginTop: theme.spacing.xs,
  },
  note: {
    lineHeight: 18,
  },
});
