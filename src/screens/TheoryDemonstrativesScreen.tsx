import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { hexToRgba, theme } from '../theme/theme';
import { useAppTheme } from '../theme/AppThemeProvider';
import { RootStackScreenProps } from '../types/navigation';

function ExampleRow({
  japanese,
  romaji,
  translation,
  accentColor,
}: {
  japanese: string;
  romaji: string;
  translation: string;
  accentColor: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <View style={[styles.exampleRow, { borderLeftColor: hexToRgba(accentColor, 0.6) }]}>
      <AppText variant="title" style={{ color: accentColor }}>
        {japanese}
      </AppText>
      <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
        {romaji}
      </AppText>
      <AppText variant="body" color={activeTheme.colors.textPrimary}>
        {translation}
      </AppText>
    </View>
  );
}

// Grid de こそあど
const KOSOAD0_ROWS = [
  { prefix: 'こ', pronoun: 'これ', place: 'ここ', adj: 'この', meaning: 'cerca de mí' },
  { prefix: 'そ', pronoun: 'それ', place: 'そこ', adj: 'その', meaning: 'cerca de vos' },
  { prefix: 'あ', pronoun: 'あれ', place: 'あそこ', adj: 'あの', meaning: 'lejos de ambos' },
  { prefix: 'ど', pronoun: 'どれ', place: 'どこ', adj: 'どの', meaning: '¿cuál? (pregunta)' },
];

function KosoadoGrid({ colors }: { colors: string[] }) {
  const { theme: activeTheme } = useAppTheme();
  const headers = ['', 'cosa', 'lugar', '+ sust.'];

  return (
    <View style={styles.grid}>
      {/* Header */}
      <View style={styles.gridRow}>
        {headers.map((h, i) => (
          <View key={i} style={[styles.gridCell, styles.gridHeaderCell]}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              {h.toUpperCase()}
            </AppText>
          </View>
        ))}
      </View>

      {/* Rows */}
      {KOSOAD0_ROWS.map((row, i) => (
        <View
          key={i}
          style={[
            styles.gridRow,
            i < KOSOAD0_ROWS.length - 1 && {
              borderBottomWidth: 1,
              borderBottomColor: hexToRgba(colors[i], 0.12),
            },
          ]}
        >
          {/* Prefix badge */}
          <View style={[styles.gridCell, styles.gridPrefixCell]}>
            <View
              style={[
                styles.prefixBadge,
                {
                  backgroundColor: hexToRgba(colors[i], Platform.OS === 'android' ? 0.18 : 0.1),
                  borderColor: hexToRgba(colors[i], 0.3),
                },
              ]}
            >
              <AppText
                variant="kana"
                style={{ color: colors[i], fontSize: 22, lineHeight: 28 }}
              >
                {row.prefix}
              </AppText>
            </View>
          </View>

          <View style={[styles.gridCell, { flex: 1 }]}>
            <AppText variant="bodyStrong" style={{ color: colors[i] }}>
              {row.pronoun}
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
              {row.meaning}
            </AppText>
          </View>

          <View style={[styles.gridCell, { flex: 1 }]}>
            <AppText variant="bodyStrong" style={{ color: colors[i] }}>
              {row.place}
            </AppText>
          </View>

          <View style={[styles.gridCell, { flex: 1 }]}>
            <AppText variant="bodyStrong" style={{ color: colors[i] }}>
              {row.adj}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

export function TheoryDemonstrativesScreen({
  navigation,
}: RootStackScreenProps<'TheoryDemonstratives'>) {
  const { theme: activeTheme } = useAppTheme();

  const gridColors = [
    activeTheme.colors.accentBlue,
    activeTheme.colors.accentCyan,
    activeTheme.colors.accentGreen,
    activeTheme.colors.accentOrange,
  ];

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <ScreenHeader
        title="Demostrativos"
        eyebrow="Gramática japonesa"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>

        {/* ── El sistema こそあど ── */}
        <GlassCard glowColor={activeTheme.colors.accentBlue} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentBlue}>
            El sistema
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            こ · そ · あ · ど
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            El japonés usa cuatro series de palabras según la distancia de los objetos respecto del hablante y el oyente.
          </AppText>

          <KosoadoGrid colors={gridColors} />
        </GlassCard>

        {/* ── これ / それ / あれ / どれ ── */}
        <GlassCard glowColor={activeTheme.colors.accentCyan} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentCyan}>
            Pronombres de cosa
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            これ · それ · あれ · どれ
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            Se usan solos, sin un sustantivo detrás. Reemplazan al objeto.
          </AppText>

          <View style={[styles.divider, { backgroundColor: hexToRgba(activeTheme.colors.accentCyan, 0.12) }]} />

          <View style={styles.examplesList}>
            <ExampleRow
              japanese="これは何ですか"
              romaji="kore wa nan desu ka"
              translation="¿Qué es esto? (cerca de mí)"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="それは私の本です"
              romaji="sore wa watashi no hon desu"
              translation="Eso es mi libro (cerca de vos)"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="あれは何ですか"
              romaji="are wa nan desu ka"
              translation="¿Qué es aquello? (lejos de ambos)"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="どれがあなたの傘ですか"
              romaji="dore ga anata no kasa desu ka"
              translation="¿Cuál es tu paraguas?"
              accentColor={activeTheme.colors.accentCyan}
            />
          </View>
        </GlassCard>

        {/* ── この / その / あの / どの ── */}
        <GlassCard glowColor={activeTheme.colors.accentGreen} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentGreen}>
            Adjetivos demostrativos
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            この · その · あの · どの
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            Siempre van seguidos de un sustantivo. Nunca se usan solos.
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
              この / その / あの / どの + [sustantivo]
            </AppText>
          </View>

          <View style={styles.examplesList}>
            <ExampleRow
              japanese="この本は面白いです"
              romaji="kono hon wa omoshiroi desu"
              translation="Este libro es interesante"
              accentColor={activeTheme.colors.accentGreen}
            />
            <ExampleRow
              japanese="その映画を見ました"
              romaji="sono eiga wo mimashita"
              translation="Vi esa película"
              accentColor={activeTheme.colors.accentGreen}
            />
            <ExampleRow
              japanese="あの人は誰ですか"
              romaji="ano hito wa dare desu ka"
              translation="¿Quién es aquella persona?"
              accentColor={activeTheme.colors.accentGreen}
            />
            <ExampleRow
              japanese="どの電車に乗りますか"
              romaji="dono densha ni norimasu ka"
              translation="¿En qué tren viajás?"
              accentColor={activeTheme.colors.accentGreen}
            />
          </View>
        </GlassCard>

        {/* ── ここ / そこ / あそこ / どこ ── */}
        <GlassCard glowColor={activeTheme.colors.accentOrange} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentOrange}>
            Lugares
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            ここ · そこ · あそこ · どこ
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            Indican un lugar, no un objeto. Equivalen a "aquí / ahí / allá / dónde".
          </AppText>

          <View style={styles.examplesList}>
            <ExampleRow
              japanese="ここはどこですか"
              romaji="koko wa doko desu ka"
              translation="¿Dónde estamos? (lit. ¿Este lugar dónde es?)"
              accentColor={activeTheme.colors.accentOrange}
            />
            <ExampleRow
              japanese="そこに座ってください"
              romaji="soko ni suwatte kudasai"
              translation="Por favor, siéntese ahí"
              accentColor={activeTheme.colors.accentOrange}
            />
            <ExampleRow
              japanese="あそこにコンビニがあります"
              romaji="asoko ni konbini ga arimasu"
              translation="Allá hay un konbini"
              accentColor={activeTheme.colors.accentOrange}
            />
          </View>
        </GlassCard>

        {/* ── Diferencia これ vs この ── */}
        <GlassCard glowColor={activeTheme.colors.accentPink} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentPink}>
            Diferencia clave
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            これ vs この
          </AppText>

          <View style={styles.compareRow}>
            <View
              style={[
                styles.compareBadge,
                {
                  flex: 1,
                  backgroundColor: hexToRgba(activeTheme.colors.accentCyan, 0.08),
                  borderColor: hexToRgba(activeTheme.colors.accentCyan, 0.25),
                },
              ]}
            >
              <AppText
                variant="bodyStrong"
                style={{ color: activeTheme.colors.accentCyan, marginBottom: 4 }}
              >
                これ
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                Pronombre. Solo.
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textPrimary} style={{ marginTop: 6 }}>
                これは本です
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                Esto es un libro.
              </AppText>
            </View>
            <View
              style={[
                styles.compareBadge,
                {
                  flex: 1,
                  backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.08),
                  borderColor: hexToRgba(activeTheme.colors.accentGreen, 0.25),
                },
              ]}
            >
              <AppText
                variant="bodyStrong"
                style={{ color: activeTheme.colors.accentGreen, marginBottom: 4 }}
              >
                この
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                Adjetivo. + sustantivo.
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textPrimary} style={{ marginTop: 6 }}>
                この本は面白い
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                Este libro es interesante.
              </AppText>
            </View>
          </View>
        </GlassCard>

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
  divider: {
    height: 1,
    marginVertical: theme.spacing.xs,
  },
  examplesList: {
    gap: theme.spacing.md,
  },
  exampleRow: {
    borderLeftWidth: 3,
    paddingLeft: theme.spacing.md,
    gap: 2,
  },
  structureBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  grid: {
    borderRadius: theme.radii.sm,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  gridHeaderCell: {
    paddingBottom: theme.spacing.xs,
  },
  gridCell: {
    width: 72,
    paddingHorizontal: 4,
  },
  gridPrefixCell: {
    width: 54,
    alignItems: 'center',
  },
  prefixBadge: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  compareBadge: {
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
});
