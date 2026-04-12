import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { hexToRgba, theme } from '../theme/theme';
import { useAppTheme } from '../theme/AppThemeProvider';
import { RootStackScreenProps } from '../types/navigation';

type NumberEntry = {
  num: number | string;
  kanji: string;
  reading: string;
  romaji: string;
  note?: string;
};

const UNITS: NumberEntry[] = [
  { num: 0, kanji: '零 / ゼロ', reading: 'れい / ゼロ', romaji: 'rei / zero' },
  { num: 1, kanji: '一', reading: 'いち', romaji: 'ichi' },
  { num: 2, kanji: '二', reading: 'に', romaji: 'ni' },
  { num: 3, kanji: '三', reading: 'さん', romaji: 'san' },
  { num: 4, kanji: '四', reading: 'し・よん', romaji: 'shi / yon', note: 'よん es más común en la vida cotidiana' },
  { num: 5, kanji: '五', reading: 'ご', romaji: 'go' },
  { num: 6, kanji: '六', reading: 'ろく', romaji: 'roku' },
  { num: 7, kanji: '七', reading: 'しち・なな', romaji: 'shichi / nana', note: 'なな es más claro en teléfonos y direcciones' },
  { num: 8, kanji: '八', reading: 'はち', romaji: 'hachi' },
  { num: 9, kanji: '九', reading: 'く・きゅう', romaji: 'ku / kyū', note: 'く suena como 苦 (sufrimiento), evitado en contextos formales' },
  { num: 10, kanji: '十', reading: 'じゅう', romaji: 'jū' },
];

const TENS: NumberEntry[] = [
  { num: 20, kanji: '二十', reading: 'にじゅう', romaji: 'ni-jū' },
  { num: 30, kanji: '三十', reading: 'さんじゅう', romaji: 'san-jū' },
  { num: 40, kanji: '四十', reading: 'よんじゅう', romaji: 'yon-jū' },
  { num: 50, kanji: '五十', reading: 'ごじゅう', romaji: 'go-jū' },
  { num: 60, kanji: '六十', reading: 'ろくじゅう', romaji: 'roku-jū' },
  { num: 70, kanji: '七十', reading: 'ななじゅう', romaji: 'nana-jū' },
  { num: 80, kanji: '八十', reading: 'はちじゅう', romaji: 'hachi-jū' },
  { num: 90, kanji: '九十', reading: 'きゅうじゅう', romaji: 'kyū-jū' },
  { num: 100, kanji: '百', reading: 'ひゃく', romaji: 'hyaku' },
];

const NATIVE: { num: number; kana: string; romaji: string }[] = [
  { num: 1, kana: 'ひとつ', romaji: 'hitotsu' },
  { num: 2, kana: 'ふたつ', romaji: 'futatsu' },
  { num: 3, kana: 'みっつ', romaji: 'mittsu' },
  { num: 4, kana: 'よっつ', romaji: 'yottsu' },
  { num: 5, kana: 'いつつ', romaji: 'itsutsu' },
  { num: 6, kana: 'むっつ', romaji: 'muttsu' },
  { num: 7, kana: 'ななつ', romaji: 'nanatsu' },
  { num: 8, kana: 'やっつ', romaji: 'yattsu' },
  { num: 9, kana: 'ここのつ', romaji: 'kokonotsu' },
  { num: 10, kana: 'とお', romaji: 'tō' },
];

function NumberRow({
  entry,
  accentColor,
  isLast,
}: {
  entry: NumberEntry;
  accentColor: string;
  isLast: boolean;
}) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <View
      style={[
        styles.numberRow,
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: hexToRgba(accentColor, 0.1),
        },
      ]}
    >
      <View
        style={[
          styles.numBadge,
          { backgroundColor: hexToRgba(accentColor, Platform.OS === 'android' ? 0.18 : 0.1) },
        ]}
      >
        <AppText variant="bodyStrong" style={{ color: accentColor, textAlign: 'center' }}>
          {entry.num}
        </AppText>
      </View>

      <AppText
        variant="title"
        style={{ color: accentColor, width: 80, fontSize: 16 }}
      >
        {entry.kanji}
      </AppText>

      <View style={{ flex: 1 }}>
        <AppText variant="body" color={activeTheme.colors.textPrimary}>
          {entry.reading}
        </AppText>
        <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
          {entry.romaji}
        </AppText>
        {entry.note ? (
          <AppText variant="bodySmall" color={activeTheme.colors.accentOrange}>
            ⚠ {entry.note}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

export function TheoryNumbersScreen({
  navigation,
}: RootStackScreenProps<'TheoryNumbers'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <ScreenHeader
        title="Números"
        eyebrow="Gramática japonesa"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>

        {/* ── 0 al 10 ── */}
        <GlassCard glowColor={activeTheme.colors.accentBlue} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentBlue}>
            Base
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            0 · 10
          </AppText>

          {UNITS.map((entry, i) => (
            <NumberRow
              key={i}
              entry={entry}
              accentColor={activeTheme.colors.accentBlue}
              isLast={i === UNITS.length - 1}
            />
          ))}
        </GlassCard>

        {/* ── Patrón 11-19 ── */}
        <GlassCard glowColor={activeTheme.colors.accentCyan} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentCyan}>
            Patrón
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            11 · 19
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            A partir del 11, los números se forman combinando las unidades con 十 (jū).
          </AppText>

          <View
            style={[
              styles.structureBox,
              {
                backgroundColor: hexToRgba(activeTheme.colors.accentCyan, 0.07),
                borderColor: hexToRgba(activeTheme.colors.accentCyan, 0.18),
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            <AppText
              variant="bodyStrong"
              style={{ color: activeTheme.colors.accentCyan, textAlign: 'center' }}
            >
              十 (jū) + [unidad]
            </AppText>
          </View>

          {[
            { num: 11, kanji: '十一', reading: 'じゅういち', romaji: 'jū-ichi' },
            { num: 12, kanji: '十二', reading: 'じゅうに', romaji: 'jū-ni' },
            { num: 13, kanji: '十三', reading: 'じゅうさん', romaji: 'jū-san' },
            { num: 14, kanji: '十四', reading: 'じゅうし・じゅうよん', romaji: 'jū-shi / jū-yon' },
            { num: 15, kanji: '十五', reading: 'じゅうご', romaji: 'jū-go' },
            { num: 19, kanji: '十九', reading: 'じゅうく・じゅうきゅう', romaji: 'jū-ku / jū-kyū' },
          ].map((entry, i, arr) => (
            <NumberRow
              key={i}
              entry={entry}
              accentColor={activeTheme.colors.accentCyan}
              isLast={i === arr.length - 1}
            />
          ))}
        </GlassCard>

        {/* ── Decenas ── */}
        <GlassCard glowColor={activeTheme.colors.accentGreen} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentGreen}>
            Decenas
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            20 · 100
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            Las decenas se forman multiplicando: [unidad] + 十.
          </AppText>

          <View
            style={[
              styles.structureBox,
              {
                backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.07),
                borderColor: hexToRgba(activeTheme.colors.accentGreen, 0.18),
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            <AppText
              variant="bodyStrong"
              style={{ color: activeTheme.colors.accentGreen, textAlign: 'center' }}
            >
              [unidad] + 十 (jū) = decena
            </AppText>
          </View>

          {TENS.map((entry, i) => (
            <NumberRow
              key={i}
              entry={entry}
              accentColor={activeTheme.colors.accentGreen}
              isLast={i === TENS.length - 1}
            />
          ))}
        </GlassCard>

        {/* ── Combinaciones ── */}
        <GlassCard glowColor={activeTheme.colors.accentOrange} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentOrange}>
            Combinando
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            Cualquier número
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            Para cualquier número entre 21 y 99, se suma la decena y la unidad.
          </AppText>

          {[
            { num: 21, kanji: '二十一', reading: 'にじゅういち', romaji: 'ni-jū-ichi' },
            { num: 35, kanji: '三十五', reading: 'さんじゅうご', romaji: 'san-jū-go' },
            { num: 47, kanji: '四十七', reading: 'よんじゅうなな', romaji: 'yon-jū-nana' },
            { num: 58, kanji: '五十八', reading: 'ごじゅうはち', romaji: 'go-jū-hachi' },
            { num: 64, kanji: '六十四', reading: 'ろくじゅうよん', romaji: 'roku-jū-yon' },
            { num: 73, kanji: '七十三', reading: 'ななじゅうさん', romaji: 'nana-jū-san' },
            { num: 99, kanji: '九十九', reading: 'きゅうじゅうきゅう', romaji: 'kyū-jū-kyū' },
          ].map((entry, i, arr) => (
            <NumberRow
              key={i}
              entry={entry}
              accentColor={activeTheme.colors.accentOrange}
              isLast={i === arr.length - 1}
            />
          ))}
        </GlassCard>

        {/* ── Contador nativo ── */}
        <GlassCard glowColor={activeTheme.colors.accentPink} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentPink}>
            Conteo nativo
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            ひとつ · とお
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            El japonés tiene un sistema de conteo propio (yamato-kotoba) para contar objetos generales sin un contador específico. Solo existe del 1 al 10.
          </AppText>

          {NATIVE.map((n, i) => (
            <View
              key={i}
              style={[
                styles.numberRow,
                i < NATIVE.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: hexToRgba(activeTheme.colors.accentPink, 0.1),
                },
              ]}
            >
              <View
                style={[
                  styles.numBadge,
                  {
                    backgroundColor: hexToRgba(
                      activeTheme.colors.accentPink,
                      Platform.OS === 'android' ? 0.18 : 0.1,
                    ),
                  },
                ]}
              >
                <AppText
                  variant="bodyStrong"
                  style={{ color: activeTheme.colors.accentPink, textAlign: 'center' }}
                >
                  {n.num}
                </AppText>
              </View>
              <AppText
                variant="title"
                style={{ color: activeTheme.colors.accentPink, width: 80 }}
              >
                {n.kana}
              </AppText>
              <AppText variant="body" color={activeTheme.colors.textSecondary}>
                {n.romaji}
              </AppText>
            </View>
          ))}

          <View
            style={[
              styles.noteBox,
              {
                marginTop: theme.spacing.xs,
                backgroundColor: hexToRgba(activeTheme.colors.accentOrange, 0.07),
                borderColor: hexToRgba(activeTheme.colors.accentOrange, 0.22),
              },
            ]}
          >
            <AppText variant="bodySmall" color={activeTheme.colors.accentOrange}>
              ⚠ Este sistema se usa para contar cosas sin un contador específico: りんごがひとつ (una manzana), ふたつください (dos, por favor). A partir del 11 se usan los números chino-japoneses con contador.
            </AppText>
          </View>
        </GlassCard>

        {/* ── Practicar ── */}
        <PrimaryButton
          title="PRACTICAR NÚMEROS"
          onPress={() => navigation.navigate('NumbersGame')}
          variant="accent"
          style={{ marginTop: theme.spacing.xs }}
        />

      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  cardContent: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  numBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  structureBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  noteBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
  },
});
