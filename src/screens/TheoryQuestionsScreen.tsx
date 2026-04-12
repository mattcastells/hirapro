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

const QUESTION_WORDS = [
  { word: 'なに / なん', romaji: 'nani / nan', meaning: 'qué' },
  { word: 'どこ', romaji: 'doko', meaning: 'dónde' },
  { word: 'だれ', romaji: 'dare', meaning: 'quién' },
  { word: 'いつ', romaji: 'itsu', meaning: 'cuándo' },
  { word: 'どれ', romaji: 'dore', meaning: 'cuál (de varios)' },
  { word: 'どの', romaji: 'dono', meaning: 'cuál + sustantivo' },
  { word: 'どう', romaji: 'dō', meaning: 'cómo' },
  { word: 'なぜ / どうして', romaji: 'naze / dōshite', meaning: 'por qué' },
  { word: 'いくら', romaji: 'ikura', meaning: 'cuánto (precio)' },
  { word: 'いくつ', romaji: 'ikutsu', meaning: 'cuántos (cantidad / edad)' },
];

export function TheoryQuestionsScreen({
  navigation,
}: RootStackScreenProps<'TheoryQuestions'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <ScreenHeader
        title="Hacer preguntas"
        eyebrow="Gramática japonesa"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>

        {/* ── Partícula か ── */}
        <GlassCard glowColor={activeTheme.colors.accentBlue} contentStyle={styles.cardContent}>
          <View style={styles.particleHeader}>
            <View
              style={[
                styles.particleBadge,
                {
                  backgroundColor: hexToRgba(
                    activeTheme.colors.accentBlue,
                    Platform.OS === 'android' ? 0.2 : 0.12,
                  ),
                },
              ]}
            >
              <AppText
                variant="kana"
                style={{ color: activeTheme.colors.accentBlue, fontSize: 36, lineHeight: 44 }}
              >
                か
              </AppText>
            </View>
            <View style={styles.particleHeaderText}>
              <AppText variant="overline" color={activeTheme.colors.accentBlue}>
                partícula
              </AppText>
              <AppText variant="title" color={activeTheme.colors.textPrimary}>
                ka
              </AppText>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              FUNCIÓN
            </AppText>
            <AppText variant="body" color={activeTheme.colors.textPrimary} style={styles.infoText}>
              Se añade al final de cualquier oración afirmativa para convertirla en pregunta. No hace falta cambiar el orden de las palabras, a diferencia del español o inglés.
            </AppText>
          </View>

          <View style={styles.infoBlock}>
            <AppText variant="label" color={activeTheme.colors.textMuted}>
              ESTRUCTURA
            </AppText>
            <View
              style={[
                styles.structureBox,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.accentBlue, 0.07),
                  borderColor: hexToRgba(activeTheme.colors.accentBlue, 0.18),
                },
              ]}
            >
              <AppText
                variant="bodyStrong"
                style={{ color: activeTheme.colors.accentBlue, textAlign: 'center' }}
              >
                [oración afirmativa] か
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: hexToRgba(activeTheme.colors.accentBlue, 0.12) }]} />

          <AppText variant="label" color={activeTheme.colors.textMuted} style={styles.sectionLabel}>
            EJEMPLOS
          </AppText>
          <View style={styles.examplesList}>
            <ExampleRow
              japanese="学生ですか"
              romaji="gakusei desu ka"
              translation="¿Eres estudiante?"
              accentColor={activeTheme.colors.accentBlue}
            />
            <ExampleRow
              japanese="日本語を話しますか"
              romaji="nihongo wo hanashimasu ka"
              translation="¿Hablás japonés?"
              accentColor={activeTheme.colors.accentBlue}
            />
            <ExampleRow
              japanese="これは本ですか"
              romaji="kore wa hon desu ka"
              translation="¿Esto es un libro?"
              accentColor={activeTheme.colors.accentBlue}
            />
          </View>
        </GlassCard>

        {/* ── はい / いいえ ── */}
        <GlassCard glowColor={activeTheme.colors.accentGreen} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentGreen}>
            Responder sí / no
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            はい · いいえ
          </AppText>

          <View style={styles.yesNoRow}>
            <View
              style={[
                styles.yesNoBadge,
                {
                  flex: 1,
                  backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.1),
                  borderColor: hexToRgba(activeTheme.colors.accentGreen, 0.3),
                },
              ]}
            >
              <AppText
                variant="title"
                style={{ color: activeTheme.colors.accentGreen, textAlign: 'center' }}
              >
                はい
              </AppText>
              <AppText
                variant="bodySmall"
                color={activeTheme.colors.textSecondary}
                style={{ textAlign: 'center' }}
              >
                hai · sí
              </AppText>
            </View>
            <View
              style={[
                styles.yesNoBadge,
                {
                  flex: 1,
                  backgroundColor: hexToRgba(activeTheme.colors.error, 0.08),
                  borderColor: hexToRgba(activeTheme.colors.error, 0.25),
                },
              ]}
            >
              <AppText
                variant="title"
                style={{ color: activeTheme.colors.error, textAlign: 'center' }}
              >
                いいえ
              </AppText>
              <AppText
                variant="bodySmall"
                color={activeTheme.colors.textSecondary}
                style={{ textAlign: 'center' }}
              >
                iie · no
              </AppText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.12) }]} />

          <AppText variant="label" color={activeTheme.colors.textMuted} style={styles.sectionLabel}>
            EJEMPLO DE DIÁLOGO
          </AppText>
          <View
            style={[
              styles.exampleRow,
              { borderLeftColor: hexToRgba(activeTheme.colors.accentGreen, 0.6), marginBottom: theme.spacing.sm },
            ]}
          >
            <AppText variant="bodyStrong" style={{ color: activeTheme.colors.accentGreen }}>
              学生ですか
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              gakusei desu ka  ·  ¿Eres estudiante?
            </AppText>
          </View>
          <View style={styles.replyRow}>
            <View
              style={[
                styles.replyBubble,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.07),
                  borderColor: hexToRgba(activeTheme.colors.accentGreen, 0.2),
                },
              ]}
            >
              <AppText variant="bodySmall" color={activeTheme.colors.accentGreen}>
                ✓  はい、学生です。
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                Sí, soy estudiante.
              </AppText>
            </View>
            <View
              style={[
                styles.replyBubble,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.error, 0.06),
                  borderColor: hexToRgba(activeTheme.colors.error, 0.18),
                },
              ]}
            >
              <AppText variant="bodySmall" color={activeTheme.colors.error}>
                ✗  いいえ、学生じゃありません。
              </AppText>
              <AppText variant="bodySmall" color={activeTheme.colors.textMuted}>
                No, no soy estudiante.
              </AppText>
            </View>
          </View>
        </GlassCard>

        {/* ── Palabras interrogativas ── */}
        <GlassCard glowColor={activeTheme.colors.accentOrange} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentOrange}>
            Palabras interrogativas
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            疑問詞
          </AppText>

          {QUESTION_WORDS.map((qw, i) => (
            <View
              key={i}
              style={[
                styles.wordRow,
                i < QUESTION_WORDS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: hexToRgba(activeTheme.colors.accentOrange, 0.1),
                },
              ]}
            >
              <AppText
                variant="bodyStrong"
                style={{ color: activeTheme.colors.accentOrange, width: 110 }}
              >
                {qw.word}
              </AppText>
              <View style={{ flex: 1 }}>
                <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
                  {qw.romaji}
                </AppText>
                <AppText variant="body" color={activeTheme.colors.textPrimary}>
                  {qw.meaning}
                </AppText>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* ── Ejemplos con interrogativas ── */}
        <GlassCard glowColor={activeTheme.colors.accentCyan} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentCyan}>
            Preguntas en contexto
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            Ejemplos
          </AppText>
          <View style={styles.examplesList}>
            <ExampleRow
              japanese="これは何ですか"
              romaji="kore wa nan desu ka"
              translation="¿Qué es esto?"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="どこに行きますか"
              romaji="doko ni ikimasu ka"
              translation="¿A dónde vas?"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="お名前は何ですか"
              romaji="o-namae wa nan desu ka"
              translation="¿Cuál es tu nombre?"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="いくらですか"
              romaji="ikura desu ka"
              translation="¿Cuánto cuesta?"
              accentColor={activeTheme.colors.accentCyan}
            />
            <ExampleRow
              japanese="どうしてですか"
              romaji="dōshite desu ka"
              translation="¿Por qué?"
              accentColor={activeTheme.colors.accentCyan}
            />
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
  particleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  particleBadge: {
    width: 72,
    height: 72,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particleHeaderText: {
    flex: 1,
    gap: 2,
  },
  infoBlock: {
    gap: theme.spacing.xs,
  },
  infoText: {
    lineHeight: 22,
  },
  structureBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginVertical: theme.spacing.xs,
  },
  sectionLabel: {
    marginBottom: theme.spacing.xs,
  },
  examplesList: {
    gap: theme.spacing.md,
  },
  exampleRow: {
    borderLeftWidth: 3,
    paddingLeft: theme.spacing.md,
    gap: 2,
  },
  yesNoRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  yesNoBadge: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  replyRow: {
    gap: theme.spacing.sm,
  },
  replyBubble: {
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: 2,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
});
