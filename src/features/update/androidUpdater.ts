import { Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { Directory, File, Paths } from 'expo-file-system';

import { AppRelease } from './releaseClient';

const APK_MIME_TYPE = 'application/vnd.android.package-archive';
const VIEW_ACTION = 'android.intent.action.VIEW';
const FLAG_GRANT_READ_URI_PERMISSION = 1;

export async function downloadAndInstallRelease(release: AppRelease) {
  if (Platform.OS !== 'android') {
    throw new Error('Las actualizaciones in-app solo estan disponibles en Android.');
  }

  const updatesDirectory = new Directory(Paths.cache, 'updates');

  if (!updatesDirectory.exists) {
    updatesDirectory.create({ idempotent: true, intermediates: true });
  }

  const destinationFile = new File(updatesDirectory, release.apkAsset.name);
  const downloadedFile = await File.downloadFileAsync(
    release.apkAsset.browser_download_url,
    destinationFile,
    { idempotent: true },
  );

  await IntentLauncher.startActivityAsync(VIEW_ACTION, {
    data: downloadedFile.contentUri,
    flags: FLAG_GRANT_READ_URI_PERMISSION,
    type: APK_MIME_TYPE,
  });
}
