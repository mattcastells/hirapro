# Release And Versioning

Este documento define el flujo oficial de versiones y releases de HiraPro. La idea es que cualquier agente o persona pueda seguir siempre el mismo proceso sin romper el upgrade path de Android.

## Resumen corto

- Las releases se publican manualmente con tags Git: `vX.Y.Z`.
- GitHub Actions compila y publica la APK release.
- La app consulta la última release publicada en GitHub desde la pantalla de opciones.
- Para que las actualizaciones in-app funcionen, todas las APKs publicadas tienen que estar firmadas con la misma key.

## Fuente de verdad de la versión

- La versión pública sigue formato semver: `major.minor.patch`.
- El tag Git debe tener prefijo `v`: `v0.1.0`, `v0.1.1`, etc.
- Durante la release, el workflow toma la versión desde el tag y actualiza:
  - `package.json`
  - `app.json`
- El helper que hace esto es [set-release-version.mjs](/Users/matiasgulincastells/Documents/hirapro/scripts/set-release-version.mjs).

## Regla de versionCode Android

- `versionCode` se deriva automáticamente desde semver.
- Fórmula actual:

```text
major * 10000 + minor * 100 + patch
```

Ejemplos:

- `0.1.0` -> `100`
- `0.1.1` -> `101`
- `0.2.0` -> `200`
- `1.0.0` -> `10000`

No cambies esta fórmula sin una razón fuerte. Android necesita que `versionCode` crezca siempre para permitir upgrades.

## Pipeline actual

El workflow oficial está en [android-release.yml](/Users/matiasgulincastells/Documents/hirapro/.github/workflows/android-release.yml).

Hace esto:

1. Se dispara con un push de tag `v*.*.*`.
2. Instala dependencias.
3. Aplica la versión derivada del tag.
4. Corre `expo prebuild --platform android --no-install --clean`.
5. Ajusta el proyecto Android generado con [configure-android-release.mjs](/Users/matiasgulincastells/Documents/hirapro/scripts/configure-android-release.mjs).
6. Compila una APK release `arm64-v8a`.
7. Publica una GitHub Release con la APK adjunta.

## Qué optimizaciones de Android no hay que romper

La release actual está pensada para pruebas reales en un celular Android moderno y prioriza tamaño razonable sin romper el flujo:

- Sólo compila `arm64-v8a`.
- Activa `minify` en release.
- Activa `shrinkResources` en release.
- Mantiene `debug` separado de `release`.

Si tocás este flujo:

- no vuelvas a mezclar la firma de `debug` con la de `release`
- no vuelvas a habilitar ABIs de emulador salvo que sea intencional
- no conviertas el flujo en dependiente de una carpeta `android/` commiteada

## Firma y upgrades

Este es el punto más importante de todo el sistema.

- Android sólo instala una actualización encima de otra APK si ambas están firmadas con la misma key.
- Las releases publicadas por GitHub Actions usan el keystore definido en los secrets del repo.
- Si instalás una build local firmada distinto y después intentás actualizar desde la app, Android va a rechazar la instalación.

### Secrets requeridos

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

### Regla operativa

- La primera APK que se instala para probar updates debe venir desde GitHub Release, o desde una build local firmada con exactamente la misma key.
- No cambies de keystore entre versiones publicadas.
- No pierdas ese keystore. Si se pierde, se rompe la cadena de upgrades.

## Proyecto nativo Android

- La carpeta `/android` está ignorada en Git porque es generada por Expo.
- El workflow la regenera con `expo prebuild --clean`.
- Si un agente necesita cambiar comportamiento de release Android, debe hacerlo en:
  - `app.json`
  - `scripts/configure-android-release.mjs`
  - `.github/workflows/android-release.yml`

No dependas de cambios manuales persistentes dentro de `/android`, porque no forman parte del repo.

## Flujo de publicación

### Publicar una nueva release

1. Confirmar que `main` tenga lo que querés publicar.
2. Crear el tag semver con prefijo `v`.
3. Push del tag a `origin`.

Ejemplo:

```bash
git tag v0.1.0
git push origin v0.1.0
```

### Verificación esperada

- GitHub Actions corre el workflow `Android Release`.
- Aparece una GitHub Release con el mismo tag.
- La release adjunta una APK arm64.

## Flujo de prueba de updates

1. Publicar `v0.1.0`.
2. Instalar en el teléfono la APK descargada desde esa release.
3. Hacer cambios y publicar `v0.1.1`.
4. Abrir la app instalada.
5. Ir a Opciones.
6. Tocar `Buscar actualizaciones`.

La pantalla de opciones vive en [OptionsScreen.tsx](/Users/matiasgulincastells/Documents/hirapro/src/screens/OptionsScreen.tsx) y el cliente de releases en [releaseClient.ts](/Users/matiasgulincastells/Documents/hirapro/src/features/update/releaseClient.ts).

## Cuándo tocar la versión en el repo

Hay dos casos válidos:

- Caso 1: dejar que el workflow derive la versión sólo desde el tag.
- Caso 2: correr localmente `npm run release:set-version <x.y.z>` y commitear ese cambio antes de taggear.

Ambos funcionan. Si un agente cambia esto, tiene que hacerlo de forma consistente con el workflow.

## Checklist para agentes

Antes de tocar el sistema de releases:

- leer este documento
- revisar [android-release.yml](/Users/matiasgulincastells/Documents/hirapro/.github/workflows/android-release.yml)
- revisar [set-release-version.mjs](/Users/matiasgulincastells/Documents/hirapro/scripts/set-release-version.mjs)
- revisar [configure-android-release.mjs](/Users/matiasgulincastells/Documents/hirapro/scripts/configure-android-release.mjs)
- no asumir que `/android` está versionado
- no romper la compatibilidad de firma entre releases

## Estado inicial conocido

- Primera versión preparada con este flujo: `0.1.0`
- Canal actual de publicación: GitHub Releases
- Plataforma objetivo del updater: Android
