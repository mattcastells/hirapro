import { StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { hexToRgba, theme } from '../theme/theme';
import { useAppTheme } from '../theme/AppThemeProvider';
import { RootStackScreenProps } from '../types/navigation';

function PhraseRow({
  japanese,
  romaji,
  translation,
  note,
  accentColor,
}: {
  japanese: string;
  romaji: string;
  translation: string;
  note?: string;
  accentColor: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <View style={[styles.phraseRow, { borderLeftColor: hexToRgba(accentColor, 0.55) }]}>
      <AppText variant="title" style={{ color: accentColor }}>
        {japanese}
      </AppText>
      <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
        {romaji}
      </AppText>
      <AppText variant="body" color={activeTheme.colors.textPrimary}>
        {translation}
      </AppText>
      {note ? (
        <AppText variant="bodySmall" color={activeTheme.colors.accentOrange}>
          {note}
        </AppText>
      ) : null}
    </View>
  );
}

export function TheoryPresentationsScreen({
  navigation,
}: RootStackScreenProps<'TheoryPresentations'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <ScreenHeader
        title="Presentaciones y frases"
        eyebrow="Gramática japonesa"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>

        {/* ── Autopresentación completa ── */}
        <GlassCard glowColor={activeTheme.colors.accentPink} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentPink}>
            Autopresentación
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.xs }}
          >
            自己紹介
          </AppText>
          <AppText variant="body" color={activeTheme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
            Estructura estándar para presentarse por primera vez.
          </AppText>

          <View
            style={[
              styles.scriptBox,
              {
                backgroundColor: hexToRgba(activeTheme.colors.accentPink, 0.06),
                borderColor: hexToRgba(activeTheme.colors.accentPink, 0.2),
              },
            ]}
          >
            <AppText variant="title" style={{ color: activeTheme.colors.accentPink }}>
              はじめまして。
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              Hajimemashite. ·  Mucho gusto (al conocerse por primera vez).
            </AppText>

            <View style={styles.scriptDivider} />

            <AppText variant="title" style={{ color: activeTheme.colors.accentPink }}>
              [名前] です。
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              [nombre] desu. ·  Soy [nombre].
            </AppText>

            <View style={styles.scriptDivider} />

            <AppText variant="title" style={{ color: activeTheme.colors.accentPink }}>
              [国] から来ました。
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              [país] kara kimashita. · Vengo de [país].
            </AppText>

            <View style={styles.scriptDivider} />

            <AppText variant="title" style={{ color: activeTheme.colors.accentPink }}>
              どうぞよろしくお願いします。
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              Dōzo yoroshiku onegaishimasu. · Es un placer conocerle. (fórmula de cierre)
            </AppText>
          </View>

          <View
            style={[
              styles.noteBox,
              {
                backgroundColor: hexToRgba(activeTheme.colors.accentOrange, 0.07),
                borderColor: hexToRgba(activeTheme.colors.accentOrange, 0.22),
              },
            ]}
          >
            <AppText variant="bodySmall" color={activeTheme.colors.accentOrange}>
              ⚠ よろしくおねがいします tiene muchos usos: presentarse, pedir un favor, despedirse de un colega. Es una de las frases más versátiles del japonés.
            </AppText>
          </View>
        </GlassCard>

        {/* ── Saludos por hora del día ── */}
        <GlassCard glowColor={activeTheme.colors.accentBlue} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentBlue}>
            Saludos
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            Por hora del día
          </AppText>

          <View style={styles.phraseList}>
            <PhraseRow
              japanese="おはようございます"
              romaji="ohayō gozaimasu"
              translation="Buenos días (formal)"
              note="Informal: おはよう (ohayō)"
              accentColor={activeTheme.colors.accentBlue}
            />
            <PhraseRow
              japanese="こんにちは"
              romaji="konnichiwa"
              translation="Buen día / Hola (mediodía y tarde)"
              accentColor={activeTheme.colors.accentBlue}
            />
            <PhraseRow
              japanese="こんばんは"
              romaji="konbanwa"
              translation="Buenas noches (al llegar)"
              accentColor={activeTheme.colors.accentBlue}
            />
            <PhraseRow
              japanese="おやすみなさい"
              romaji="oyasumi nasai"
              translation="Buenas noches (al acostarse)"
              note="Informal: おやすみ (oyasumi)"
              accentColor={activeTheme.colors.accentBlue}
            />
          </View>
        </GlassCard>

        {/* ── Frases esenciales del día a día ── */}
        <GlassCard glowColor={activeTheme.colors.accentGreen} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentGreen}>
            Frases esenciales
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            Del día a día
          </AppText>

          <View style={styles.phraseList}>
            <PhraseRow
              japanese="ありがとうございます"
              romaji="arigatō gozaimasu"
              translation="Muchas gracias (formal)"
              note="Informal: ありがとう (arigatō)"
              accentColor={activeTheme.colors.accentGreen}
            />
            <PhraseRow
              japanese="どういたしまして"
              romaji="dō itashimashite"
              translation="De nada"
              accentColor={activeTheme.colors.accentGreen}
            />
            <PhraseRow
              japanese="すみません"
              romaji="sumimasen"
              translation="Disculpe / perdón / excuse me"
              note="Muy versátil: para llamar la atención, pedir paso, disculparse levemente."
              accentColor={activeTheme.colors.accentGreen}
            />
            <PhraseRow
              japanese="ごめんなさい"
              romaji="gomen nasai"
              translation="Lo siento (disculpa sincera)"
              note="Informal: ごめん (gomen)"
              accentColor={activeTheme.colors.accentGreen}
            />
            <PhraseRow
              japanese="大丈夫です"
              romaji="daijōbu desu"
              translation="Está bien / No hay problema / Estoy bien"
              accentColor={activeTheme.colors.accentGreen}
            />
            <PhraseRow
              japanese="わかりました"
              romaji="wakarimashita"
              translation="Entendido / Lo entendí"
              accentColor={activeTheme.colors.accentGreen}
            />
          </View>
        </GlassCard>

        {/* ── Al no entender ── */}
        <GlassCard glowColor={activeTheme.colors.accentCyan} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentCyan}>
            Cuando no entendés
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            Frases de apoyo
          </AppText>

          <View style={styles.phraseList}>
            <PhraseRow
              japanese="わかりません"
              romaji="wakarimasen"
              translation="No entiendo"
              accentColor={activeTheme.colors.accentCyan}
            />
            <PhraseRow
              japanese="もう一度言ってください"
              romaji="mō ichido itte kudasai"
              translation="Por favor, repita"
              accentColor={activeTheme.colors.accentCyan}
            />
            <PhraseRow
              japanese="ゆっくり話してください"
              romaji="yukkuri hanashite kudasai"
              translation="Por favor, hable más despacio"
              accentColor={activeTheme.colors.accentCyan}
            />
            <PhraseRow
              japanese="日本語が少し話せます"
              romaji="nihongo ga sukoshi hanasemasu"
              translation="Hablo un poco de japonés"
              accentColor={activeTheme.colors.accentCyan}
            />
            <PhraseRow
              japanese="英語を話せますか"
              romaji="eigo wo hanasemasu ka"
              translation="¿Habla inglés?"
              accentColor={activeTheme.colors.accentCyan}
            />
          </View>
        </GlassCard>

        {/* ── Al entrar y salir ── */}
        <GlassCard glowColor={activeTheme.colors.accentOrange} contentStyle={styles.cardContent}>
          <AppText variant="overline" color={activeTheme.colors.accentOrange}>
            Al entrar y salir
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={{ marginBottom: theme.spacing.md }}
          >
            行ってきます y compañía
          </AppText>

          <View style={styles.phraseList}>
            <PhraseRow
              japanese="いってきます"
              romaji="itte kimasu"
              translation="Me voy (y ya vuelvo)"
              note="Lo dice quien sale de casa."
              accentColor={activeTheme.colors.accentOrange}
            />
            <PhraseRow
              japanese="いってらっしゃい"
              romaji="itte rasshai"
              translation="Que te vaya bien"
              note="Lo dice quien se queda en casa."
              accentColor={activeTheme.colors.accentOrange}
            />
            <PhraseRow
              japanese="ただいま"
              romaji="tadaima"
              translation="Ya llegué"
              note="Lo dice quien vuelve a casa."
              accentColor={activeTheme.colors.accentOrange}
            />
            <PhraseRow
              japanese="おかえり"
              romaji="okaeri"
              translation="Bienvenido/a (de vuelta)"
              note="Lo dice quien recibe al que llegó."
              accentColor={activeTheme.colors.accentOrange}
            />
            <PhraseRow
              japanese="いただきます"
              romaji="itadakimasu"
              translation="Buen provecho (antes de comer)"
              accentColor={activeTheme.colors.accentOrange}
            />
            <PhraseRow
              japanese="ごちそうさまでした"
              romaji="gochisōsama deshita"
              translation="Estuvo delicioso (después de comer)"
              accentColor={activeTheme.colors.accentOrange}
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
  phraseList: {
    gap: theme.spacing.md,
  },
  phraseRow: {
    borderLeftWidth: 3,
    paddingLeft: theme.spacing.md,
    gap: 2,
  },
  scriptBox: {
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  scriptDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: theme.spacing.xs,
  },
  noteBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
  },
});
