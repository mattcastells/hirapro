import { Platform, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { hexToRgba, theme } from '../theme/theme';
import { useAppTheme } from '../theme/AppThemeProvider';
import { RootStackScreenProps } from '../types/navigation';

type ExampleRowProps = {
  japanese: string;
  romaji: string;
  translation: string;
  accentColor: string;
};

function ExampleRow({ japanese, romaji, translation, accentColor }: ExampleRowProps) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <View
      style={[
        styles.exampleRow,
        { borderLeftColor: hexToRgba(accentColor, 0.6) },
      ]}
    >
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

type ParticleSectionProps = {
  particle: string;
  name: string;
  accentColor: string;
  role: string;
  structure: string;
  note?: string;
  examples: ExampleRowProps[];
};

function ParticleSection({
  particle,
  name,
  accentColor,
  role,
  structure,
  note,
  examples,
}: ParticleSectionProps) {
  const { theme: activeTheme } = useAppTheme();
  return (
    <GlassCard glowColor={accentColor} contentStyle={styles.cardContent}>
      {/* Encabezado de partícula */}
      <View style={styles.particleHeader}>
        <View
          style={[
            styles.particleBadge,
            { backgroundColor: hexToRgba(accentColor, Platform.OS === 'android' ? 0.2 : 0.12) },
          ]}
        >
          <AppText variant="kana" style={{ color: accentColor, fontSize: 36, lineHeight: 44 }}>
            {particle}
          </AppText>
        </View>
        <View style={styles.particleHeaderText}>
          <AppText variant="overline" color={accentColor}>
            partícula
          </AppText>
          <AppText variant="title" color={activeTheme.colors.textPrimary}>
            {name}
          </AppText>
        </View>
      </View>

      {/* Función */}
      <View style={styles.infoBlock}>
        <AppText variant="label" color={activeTheme.colors.textMuted}>
          FUNCIÓN
        </AppText>
        <AppText variant="body" color={activeTheme.colors.textPrimary} style={styles.infoText}>
          {role}
        </AppText>
      </View>

      {/* Estructura */}
      <View style={styles.infoBlock}>
        <AppText variant="label" color={activeTheme.colors.textMuted}>
          ESTRUCTURA
        </AppText>
        <View
          style={[
            styles.structureBox,
            {
              backgroundColor: hexToRgba(accentColor, 0.07),
              borderColor: hexToRgba(accentColor, 0.18),
            },
          ]}
        >
          <AppText
            variant="bodyStrong"
            style={{ color: accentColor, textAlign: 'center' }}
          >
            {structure}
          </AppText>
        </View>
      </View>

      {/* Nota opcional */}
      {note ? (
        <View
          style={[
            styles.noteBox,
            {
              backgroundColor: hexToRgba(activeTheme.colors.accentOrange, 0.08),
              borderColor: hexToRgba(activeTheme.colors.accentOrange, 0.25),
            },
          ]}
        >
          <AppText variant="bodySmall" color={activeTheme.colors.accentOrange}>
            {note}
          </AppText>
        </View>
      ) : null}

      {/* Divisor */}
      <View
        style={[styles.divider, { backgroundColor: hexToRgba(accentColor, 0.12) }]}
      />

      {/* Ejemplos */}
      <AppText variant="label" color={activeTheme.colors.textMuted} style={styles.examplesLabel}>
        EJEMPLOS
      </AppText>
      <View style={styles.examplesList}>
        {examples.map((ex, i) => (
          <ExampleRow key={i} {...ex} accentColor={accentColor} />
        ))}
      </View>
    </GlassCard>
  );
}

export function TheoryParticlesScreen({
  navigation,
}: RootStackScreenProps<'TheoryParticles'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <ScreenHeader
        title="Partículas"
        eyebrow="Gramática japonesa"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <ParticleSection
          particle="の"
          name="no"
          accentColor={activeTheme.colors.accentBlue}
          role="Conecta dos sustantivos para indicar posesión, pertenencia o relación. Equivale al 'de' del español."
          structure="[A] の [B]  →  B de A"
          examples={[
            {
              japanese: '私の本',
              romaji: 'watashi no hon',
              translation: 'Mi libro  (el libro de mí)',
            },
            {
              japanese: '日本語の先生',
              romaji: 'nihongo no sensei',
              translation: 'Maestro/a de japonés',
            },
            {
              japanese: '友達の名前',
              romaji: 'tomodachi no namae',
              translation: 'El nombre de mi amigo/a',
            },
          ]}
        />

        <ParticleSection
          particle="は"
          name="wa"
          accentColor={activeTheme.colors.accentPink}
          role="Marca el tema principal de la oración. Todo lo que sigue es un comentario sobre ese tema."
          structure="[TEMA] は [comentario]"
          note="⚠ Aunque el kanji は se lee normalmente 'ha', cuando se usa como partícula se pronuncia 'wa'."
          examples={[
            {
              japanese: '私は学生です',
              romaji: 'watashi wa gakusei desu',
              translation: 'Yo soy estudiante',
            },
            {
              japanese: 'これは本です',
              romaji: 'kore wa hon desu',
              translation: 'Esto es un libro',
            },
            {
              japanese: '猫は動物です',
              romaji: 'neko wa dōbutsu desu',
              translation: 'El gato es un animal',
            },
          ]}
        />

        {/* Diferencia clave */}
        <GlassCard
          glowColor={activeTheme.colors.accentGreen}
          contentStyle={styles.cardContent}
        >
          <AppText variant="overline" color={activeTheme.colors.accentGreen}>
            Diferencia clave
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={styles.differenceTitle}
          >
            の vs は
          </AppText>

          <View style={styles.differenceRow}>
            <View
              style={[
                styles.differenceBadge,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.accentBlue, 0.1),
                  borderColor: hexToRgba(activeTheme.colors.accentBlue, 0.25),
                },
              ]}
            >
              <AppText variant="bodyStrong" color={activeTheme.colors.accentBlue}>
                の
              </AppText>
            </View>
            <AppText
              variant="body"
              color={activeTheme.colors.textSecondary}
              style={styles.differenceText}
            >
              Une sustantivos. Siempre va entre dos cosas.
            </AppText>
          </View>

          <View style={styles.differenceRow}>
            <View
              style={[
                styles.differenceBadge,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.accentPink, 0.1),
                  borderColor: hexToRgba(activeTheme.colors.accentPink, 0.25),
                },
              ]}
            >
              <AppText variant="bodyStrong" color={activeTheme.colors.accentPink}>
                は
              </AppText>
            </View>
            <AppText
              variant="body"
              color={activeTheme.colors.textSecondary}
              style={styles.differenceText}
            >
              Introduce el tema de la frase. Va después del sujeto o tema.
            </AppText>
          </View>

          <View
            style={[styles.divider, { backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.12) }]}
          />

          <AppText variant="label" color={activeTheme.colors.textMuted} style={styles.examplesLabel}>
            JUNTAS EN UNA ORACIÓN
          </AppText>
          <View
            style={[
              styles.combinedExample,
              {
                backgroundColor: hexToRgba(activeTheme.colors.accentGreen, 0.07),
                borderColor: hexToRgba(activeTheme.colors.accentGreen, 0.2),
              },
            ]}
          >
            <AppText
              variant="title"
              style={{ color: activeTheme.colors.accentGreen, textAlign: 'center' }}
            >
              私の猫は白いです
            </AppText>
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textSecondary}
              style={{ textAlign: 'center', marginTop: 4 }}
            >
              watashi no neko wa shiroi desu
            </AppText>
            <AppText
              variant="body"
              color={activeTheme.colors.textPrimary}
              style={{ textAlign: 'center', marginTop: 2 }}
            >
              Mi gato es blanco
            </AppText>
          </View>
        </GlassCard>

        {/* を */}
        <ParticleSection
          particle="を"
          name="wo"
          accentColor={activeTheme.colors.accentOrange}
          role="Marca el objeto directo de un verbo. Indica qué o a quién afecta la acción."
          structure="[SUJETO] は [OBJETO] を [VERBO]"
          note="⚠ を se escribe con el hiragana を (wo) pero en japonés moderno se pronuncia 'o'."
          examples={[
            {
              japanese: '本を読みます',
              romaji: 'hon wo yomimasu',
              translation: 'Leo un libro',
            },
            {
              japanese: '水を飲みます',
              romaji: 'mizu wo nomimasu',
              translation: 'Bebo agua',
            },
            {
              japanese: '音楽を聞きます',
              romaji: 'ongaku wo kikimasu',
              translation: 'Escucho música',
            },
          ]}
        />

        {/* が */}
        <ParticleSection
          particle="が"
          name="ga"
          accentColor={activeTheme.colors.accentCyan}
          role="Marca el sujeto gramatical de la oración. Identifica quién o qué realiza la acción, con énfasis en ese elemento específico."
          structure="[SUJETO] が [predicado]"
          examples={[
            {
              japanese: '猫がいます',
              romaji: 'neko ga imasu',
              translation: 'Hay un gato (existe aquí)',
            },
            {
              japanese: '雨が降っています',
              romaji: 'ame ga futte imasu',
              translation: 'Está lloviendo',
            },
            {
              japanese: '誰が来ましたか',
              romaji: 'dare ga kimashita ka',
              translation: '¿Quién vino?',
            },
          ]}
        />

        {/* Comparación は vs が */}
        <GlassCard
          glowColor={activeTheme.colors.accentOrange}
          contentStyle={styles.cardContent}
        >
          <AppText variant="overline" color={activeTheme.colors.accentOrange}>
            Diferencia clave
          </AppText>
          <AppText
            variant="title"
            color={activeTheme.colors.textPrimary}
            style={styles.differenceTitle}
          >
            は vs が
          </AppText>

          <View style={styles.differenceRow}>
            <View
              style={[
                styles.differenceBadge,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.accentPink, 0.1),
                  borderColor: hexToRgba(activeTheme.colors.accentPink, 0.25),
                },
              ]}
            >
              <AppText variant="bodyStrong" color={activeTheme.colors.accentPink}>
                は
              </AppText>
            </View>
            <AppText
              variant="body"
              color={activeTheme.colors.textSecondary}
              style={styles.differenceText}
            >
              Presenta el tema. Puede implicar contraste con otras cosas.
            </AppText>
          </View>

          <View style={styles.differenceRow}>
            <View
              style={[
                styles.differenceBadge,
                {
                  backgroundColor: hexToRgba(activeTheme.colors.accentCyan, 0.1),
                  borderColor: hexToRgba(activeTheme.colors.accentCyan, 0.25),
                },
              ]}
            >
              <AppText variant="bodyStrong" color={activeTheme.colors.accentCyan}>
                が
              </AppText>
            </View>
            <AppText
              variant="body"
              color={activeTheme.colors.textSecondary}
              style={styles.differenceText}
            >
              Identifica el sujeto con énfasis. Responde a "¿quién?" o "¿qué?".
            </AppText>
          </View>

          <View
            style={[styles.divider, { backgroundColor: hexToRgba(activeTheme.colors.accentOrange, 0.12) }]}
          />

          <AppText variant="label" color={activeTheme.colors.textMuted} style={styles.examplesLabel}>
            COMPARACIÓN
          </AppText>
          <View
            style={[
              styles.exampleRow,
              { borderLeftColor: hexToRgba(activeTheme.colors.accentPink, 0.6) },
            ]}
          >
            <AppText variant="title" style={{ color: activeTheme.colors.accentPink }}>
              犬は好きです
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              inu wa suki desu
            </AppText>
            <AppText variant="body" color={activeTheme.colors.textPrimary}>
              En cuanto a los perros, me gustan (implica contraste con otros animales)
            </AppText>
          </View>
          <View
            style={[
              styles.exampleRow,
              { borderLeftColor: hexToRgba(activeTheme.colors.accentCyan, 0.6), marginTop: theme.spacing.sm },
            ]}
          >
            <AppText variant="title" style={{ color: activeTheme.colors.accentCyan }}>
              犬が好きです
            </AppText>
            <AppText variant="bodySmall" color={activeTheme.colors.textSecondary}>
              inu ga suki desu
            </AppText>
            <AppText variant="body" color={activeTheme.colors.textPrimary}>
              Son los perros los que me gustan (énfasis en los perros específicamente)
            </AppText>
          </View>
        </GlassCard>

        {/* に */}
        <ParticleSection
          particle="に"
          name="ni"
          accentColor={activeTheme.colors.accentGreen}
          role="Indica destino, dirección, momento en el tiempo o lugar de existencia. Es la partícula más versátil del japonés básico."
          structure="[LUGAR / TIEMPO] に [verbo]"
          note="に vs で: に indica dónde algo existe (います / あります) o el destino de un movimiento. で indica dónde ocurre una acción."
          examples={[
            {
              japanese: '学校に行きます',
              romaji: 'gakkō ni ikimasu',
              translation: 'Voy a la escuela',
            },
            {
              japanese: '7時に起きます',
              romaji: 'shichi-ji ni okimasu',
              translation: 'Me levanto a las 7',
            },
            {
              japanese: '机の上に本があります',
              romaji: 'tsukue no ue ni hon ga arimasu',
              translation: 'Hay un libro sobre el escritorio',
            },
          ]}
        />

        {/* で */}
        <ParticleSection
          particle="で"
          name="de"
          accentColor={activeTheme.colors.accentBlue}
          role="Indica el lugar donde ocurre una acción, o el medio e instrumento con el que se realiza algo."
          structure="[LUGAR / MEDIO] で [acción]"
          examples={[
            {
              japanese: '図書館で勉強します',
              romaji: 'toshokan de benkyō shimasu',
              translation: 'Estudio en la biblioteca',
            },
            {
              japanese: 'バスで来ました',
              romaji: 'basu de kimashita',
              translation: 'Vine en autobús',
            },
            {
              japanese: '箸でご飯を食べます',
              romaji: 'hashi de gohan wo tabemasu',
              translation: 'Como arroz con palillos',
            },
          ]}
        />

        {/* も */}
        <ParticleSection
          particle="も"
          name="mo"
          accentColor={activeTheme.colors.accentPink}
          role="Reemplaza a は o が para indicar 'también' o 'tampoco'. Extiende el comentario a otro elemento."
          structure="[TEMA] も [predicado]"
          examples={[
            {
              japanese: '私も学生です',
              romaji: 'watashi mo gakusei desu',
              translation: 'Yo también soy estudiante',
            },
            {
              japanese: '猫もいます',
              romaji: 'neko mo imasu',
              translation: 'También hay un gato',
            },
            {
              japanese: '何も食べません',
              romaji: 'nani mo tabemasen',
              translation: 'No como nada',
            },
          ]}
        />

        {/* と */}
        <ParticleSection
          particle="と"
          name="to"
          accentColor={activeTheme.colors.accentOrange}
          role="Une sustantivos de forma exhaustiva ('A y B') o indica compañía ('con A'). A diferencia de や, と lista todos los elementos sin implicar que hay más."
          structure="[A] と [B]  /  [persona] と [acción]"
          examples={[
            {
              japanese: '猫と犬が好きです',
              romaji: 'neko to inu ga suki desu',
              translation: 'Me gustan los gatos y los perros',
            },
            {
              japanese: '友達と映画を見ました',
              romaji: 'tomodachi to eiga wo mimashita',
              translation: 'Vi una película con mi amigo/a',
            },
            {
              japanese: '先生と話しました',
              romaji: 'sensei to hanashimashita',
              translation: 'Hablé con el/la profesor/a',
            },
          ]}
        />

        {/* から・まで */}
        <ParticleSection
          particle="から"
          name="kara · made"
          accentColor={activeTheme.colors.accentCyan}
          role="から indica origen o punto de partida (lugar o tiempo). まで indica límite o punto final. Se usan solos o juntos para expresar 'desde… hasta…'."
          structure="[origen] から [destino] まで"
          examples={[
            {
              japanese: '9時から5時まで働きます',
              romaji: 'ku-ji kara go-ji made hatarakimasu',
              translation: 'Trabajo de 9 a 5',
            },
            {
              japanese: '東京から大阪まで',
              romaji: 'Tōkyō kara Ōsaka made',
              translation: 'De Tokio a Osaka',
            },
            {
              japanese: '家から学校まで歩きます',
              romaji: 'ie kara gakkō made arukimasu',
              translation: 'Camino desde casa hasta la escuela',
            },
          ]}
        />

        {/* へ */}
        <ParticleSection
          particle="へ"
          name="e"
          accentColor={activeTheme.colors.accentGreen}
          role="Indica dirección o destino. Similar a に pero más formal y literario. Frecuente en correspondencia y registros escritos."
          structure="[DESTINO] へ [verbo de movimiento]"
          note="⚠ El hiragana へ se lee normalmente 'he', pero como partícula se pronuncia 'e'."
          examples={[
            {
              japanese: '日本へ行きます',
              romaji: 'nihon e ikimasu',
              translation: 'Voy a Japón',
            },
            {
              japanese: '東京へようこそ',
              romaji: 'Tōkyō e yōkoso',
              translation: 'Bienvenido/a a Tokio',
            },
            {
              japanese: '空へ飛びたい',
              romaji: 'sora e tobitai',
              translation: 'Quiero volar hacia el cielo',
            },
          ]}
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
  noteBox: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    marginVertical: theme.spacing.xs,
  },
  examplesLabel: {
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
  differenceTitle: {
    marginBottom: theme.spacing.xs,
  },
  differenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  differenceText: {
    flex: 1,
  },
  differenceBadge: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  combinedExample: {
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
});
