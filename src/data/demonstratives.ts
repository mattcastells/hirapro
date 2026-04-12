export type DemonstrativesQuestion = {
  id: string;
  prompt: string;
  subtext?: string;
  options: { id: string; text: string; subtext?: string }[];
  correctOptionId: string;
};

// ── これ / それ / あれ / どれ ──────────────────────────────────────────────────
const koreQuestions: DemonstrativesQuestion[] = [
  {
    id: 'kore-01',
    prompt: '¿Cuál usás para señalar algo que está cerca de vos?',
    options: [
      { id: 'o1', text: 'これ', subtext: 'kore' },
      { id: 'o2', text: 'それ', subtext: 'sore' },
      { id: 'o3', text: 'あれ', subtext: 'are' },
      { id: 'o4', text: 'どれ', subtext: 'dore' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'kore-02',
    prompt: '¿Cuál usás para señalar algo cerca de quien te escucha?',
    options: [
      { id: 'o1', text: 'これ', subtext: 'kore' },
      { id: 'o2', text: 'それ', subtext: 'sore' },
      { id: 'o3', text: 'あれ', subtext: 'are' },
      { id: 'o4', text: 'どれ', subtext: 'dore' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'kore-03',
    prompt: '¿Cuál usás para señalar algo lejos de los dos?',
    options: [
      { id: 'o1', text: 'これ', subtext: 'kore' },
      { id: 'o2', text: 'それ', subtext: 'sore' },
      { id: 'o3', text: 'あれ', subtext: 'are' },
      { id: 'o4', text: 'どれ', subtext: 'dore' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'kore-04',
    prompt: '¿Cómo decís "¿Qué es esto?" en japonés (objeto cerca de vos)?',
    subtext: '___はなんですか',
    options: [
      { id: 'o1', text: 'これ', subtext: 'kore' },
      { id: 'o2', text: 'それ', subtext: 'sore' },
      { id: 'o3', text: 'あれ', subtext: 'are' },
      { id: 'o4', text: 'どれ', subtext: 'dore' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'kore-05',
    prompt: '"¿Cuál es tu paraguas?" — la frase busca identificar cuál entre varios',
    subtext: '___があなたのかさですか',
    options: [
      { id: 'o1', text: 'これ', subtext: 'kore' },
      { id: 'o2', text: 'それ', subtext: 'sore' },
      { id: 'o3', text: 'あれ', subtext: 'are' },
      { id: 'o4', text: 'どれ', subtext: 'dore' },
    ],
    correctOptionId: 'o4',
  },
  {
    id: 'kore-06',
    prompt: '¿Qué significa これ?',
    options: [
      { id: 'o1', text: 'esto (cerca de mí)' },
      { id: 'o2', text: 'eso (cerca de vos)' },
      { id: 'o3', text: 'aquello (lejos)' },
      { id: 'o4', text: '¿cuál?' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'kore-07',
    prompt: '¿Qué significa それ?',
    options: [
      { id: 'o1', text: 'esto (cerca de mí)' },
      { id: 'o2', text: 'eso (cerca de vos)' },
      { id: 'o3', text: 'aquello (lejos)' },
      { id: 'o4', text: '¿cuál?' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'kore-08',
    prompt: '¿Qué significa あれ?',
    options: [
      { id: 'o1', text: 'esto (cerca de mí)' },
      { id: 'o2', text: 'eso (cerca de vos)' },
      { id: 'o3', text: 'aquello (lejos)' },
      { id: 'o4', text: '¿cuál?' },
    ],
    correctOptionId: 'o3',
  },
];

// ── この / その / あの / どの ──────────────────────────────────────────────────
const konoQuestions: DemonstrativesQuestion[] = [
  {
    id: 'kono-01',
    prompt: '"Este libro cerca de mí" — ¿cuál adjetivo usás?',
    subtext: '___ 本 (hon = libro)',
    options: [
      { id: 'o1', text: 'この', subtext: 'kono' },
      { id: 'o2', text: 'その', subtext: 'sono' },
      { id: 'o3', text: 'あの', subtext: 'ano' },
      { id: 'o4', text: 'どの', subtext: 'dono' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'kono-02',
    prompt: '"Ese auto cerca de vos" — ¿cuál adjetivo usás?',
    subtext: '___ くるま (kuruma = auto)',
    options: [
      { id: 'o1', text: 'この', subtext: 'kono' },
      { id: 'o2', text: 'その', subtext: 'sono' },
      { id: 'o3', text: 'あの', subtext: 'ano' },
      { id: 'o4', text: 'どの', subtext: 'dono' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'kono-03',
    prompt: '"Aquel árbol lejos de los dos" — ¿cuál adjetivo usás?',
    subtext: '___ き (ki = árbol)',
    options: [
      { id: 'o1', text: 'この', subtext: 'kono' },
      { id: 'o2', text: 'その', subtext: 'sono' },
      { id: 'o3', text: 'あの', subtext: 'ano' },
      { id: 'o4', text: 'どの', subtext: 'dono' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'kono-04',
    prompt: '"¿Qué bolso es tuyo?" — ¿cuál adjetivo interrog. usás?',
    subtext: '___ かばんがあなたのですか',
    options: [
      { id: 'o1', text: 'この', subtext: 'kono' },
      { id: 'o2', text: 'その', subtext: 'sono' },
      { id: 'o3', text: 'あの', subtext: 'ano' },
      { id: 'o4', text: 'どの', subtext: 'dono' },
    ],
    correctOptionId: 'o4',
  },
  {
    id: 'kono-05',
    prompt: '¿Cuál es la diferencia entre これ y この?',
    options: [
      { id: 'o1', text: 'これ va solo; この va con sustantivo' },
      { id: 'o2', text: 'Son equivalentes' },
      { id: 'o3', text: 'この va solo; これ va con sustantivo' },
      { id: 'o4', text: 'これ es formal; この es informal' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'kono-06',
    prompt: '¿Cuál de estas frases es correcta?',
    options: [
      { id: 'o1', text: 'このは本です', subtext: 'Incorrecto: この va solo aquí' },
      { id: 'o2', text: 'この本はおもしろい', subtext: 'Correcto: kono + sustantivo' },
      { id: 'o3', text: 'これ本はおもしろい', subtext: 'Incorrecto' },
      { id: 'o4', text: 'これのです', subtext: 'Incorrecto' },
    ],
    correctOptionId: 'o2',
  },
];

// ── ここ / そこ / あそこ / どこ ───────────────────────────────────────────────
const kokoQuestions: DemonstrativesQuestion[] = [
  {
    id: 'koko-01',
    prompt: '¿Cómo decís "aquí" (cerca de mí)?',
    options: [
      { id: 'o1', text: 'ここ', subtext: 'koko' },
      { id: 'o2', text: 'そこ', subtext: 'soko' },
      { id: 'o3', text: 'あそこ', subtext: 'asoko' },
      { id: 'o4', text: 'どこ', subtext: 'doko' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'koko-02',
    prompt: '¿Cómo decís "ahí" (cerca de vos)?',
    options: [
      { id: 'o1', text: 'ここ', subtext: 'koko' },
      { id: 'o2', text: 'そこ', subtext: 'soko' },
      { id: 'o3', text: 'あそこ', subtext: 'asoko' },
      { id: 'o4', text: 'どこ', subtext: 'doko' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'koko-03',
    prompt: '¿Cómo decís "allá" (lejos de los dos)?',
    options: [
      { id: 'o1', text: 'ここ', subtext: 'koko' },
      { id: 'o2', text: 'そこ', subtext: 'soko' },
      { id: 'o3', text: 'あそこ', subtext: 'asoko' },
      { id: 'o4', text: 'どこ', subtext: 'doko' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'koko-04',
    prompt: '"¿Dónde está el baño?"',
    subtext: 'おてあらいは___ですか',
    options: [
      { id: 'o1', text: 'ここ', subtext: 'koko' },
      { id: 'o2', text: 'そこ', subtext: 'soko' },
      { id: 'o3', text: 'あそこ', subtext: 'asoko' },
      { id: 'o4', text: 'どこ', subtext: 'doko' },
    ],
    correctOptionId: 'o4',
  },
  {
    id: 'koko-05',
    prompt: '¿Qué significa どこ?',
    options: [
      { id: 'o1', text: 'aquí' },
      { id: 'o2', text: 'allá' },
      { id: 'o3', text: '¿dónde?' },
      { id: 'o4', text: 'ahí' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'koko-06',
    prompt: '"La estación está allá" — ¿cuál palabra de lugar usás?',
    subtext: 'Lejos de hablante y oyente',
    options: [
      { id: 'o1', text: 'ここ', subtext: 'koko' },
      { id: 'o2', text: 'そこ', subtext: 'soko' },
      { id: 'o3', text: 'あそこ', subtext: 'asoko' },
      { id: 'o4', text: 'どこ', subtext: 'doko' },
    ],
    correctOptionId: 'o3',
  },
];

// ── Presentaciones ────────────────────────────────────────────────────────────
const presentationQuestions: DemonstrativesQuestion[] = [
  {
    id: 'pres-01',
    prompt: '¿Cómo decís "Encantado de conocerte" (presentación formal)?',
    options: [
      { id: 'o1', text: 'はじめまして', subtext: 'hajimemashite' },
      { id: 'o2', text: 'こんにちは', subtext: 'konnichiwa' },
      { id: 'o3', text: 'ありがとう', subtext: 'arigatou' },
      { id: 'o4', text: 'おやすみ', subtext: 'oyasumi' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'pres-02',
    prompt: '¿Cómo decís "Mucho gusto" al final de una presentación?',
    options: [
      { id: 'o1', text: 'すみません', subtext: 'sumimasen' },
      { id: 'o2', text: 'よろしくおねがいします', subtext: 'yoroshiku onegaishimasu' },
      { id: 'o3', text: 'またね', subtext: 'mata ne' },
      { id: 'o4', text: 'どういたしまして', subtext: 'douitashimashite' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'pres-03',
    prompt: '¿Cómo decís "Yo soy [nombre]" presentándote?',
    options: [
      { id: 'o1', text: 'わたしは〜が好きです', subtext: 'watashi wa ~ ga suki desu' },
      { id: 'o2', text: 'わたしは〜です', subtext: 'watashi wa ~ desu' },
      { id: 'o3', text: 'わたしの〜はです', subtext: 'watashi no ~ wa desu' },
      { id: 'o4', text: 'わたしに〜があります', subtext: 'watashi ni ~ ga arimasu' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'pres-04',
    prompt: '¿Qué significa はじめまして?',
    options: [
      { id: 'o1', text: 'Buenos días' },
      { id: 'o2', text: 'Hasta luego' },
      { id: 'o3', text: 'Encantado de conocerte' },
      { id: 'o4', text: 'Gracias' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'pres-05',
    prompt: '¿Cuál es la palabra para "yo" en japonés (formal)?',
    options: [
      { id: 'o1', text: 'あなた', subtext: 'anata (vos/tú)' },
      { id: 'o2', text: 'かれ', subtext: 'kare (él)' },
      { id: 'o3', text: 'わたし', subtext: 'watashi (yo)' },
      { id: 'o4', text: 'かのじょ', subtext: 'kanojo (ella)' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'pres-06',
    prompt: '¿Cómo preguntás el nombre de alguien?',
    options: [
      { id: 'o1', text: 'おなまえはなんですか', subtext: 'onamae wa nan desu ka' },
      { id: 'o2', text: 'どこからきましたか', subtext: 'doko kara kimashita ka' },
      { id: 'o3', text: 'なんさいですか', subtext: 'nan sai desu ka' },
      { id: 'o4', text: 'なんじですか', subtext: 'nanji desu ka' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'pres-07',
    prompt: '¿Qué significa よろしくおねがいします?',
    options: [
      { id: 'o1', text: '¿Cómo estás?' },
      { id: 'o2', text: 'Mucho gusto / Por favor trátame bien' },
      { id: 'o3', text: 'Hasta pronto' },
      { id: 'o4', text: 'Lo siento' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'pres-08',
    prompt: 'Orden correcto de una presentación formal',
    options: [
      { id: 'o1', text: 'よろしく → はじめまして → わたしは〜です' },
      { id: 'o2', text: 'はじめまして → わたしは〜です → よろしくおねがいします' },
      { id: 'o3', text: 'わたしは〜です → はじめまして → よろしく' },
      { id: 'o4', text: 'こんにちは → よろしく → はじめまして' },
    ],
    correctOptionId: 'o2',
  },
];

// ── Identificación de objetos ──────────────────────────────────────────────────
const objectQuestions: DemonstrativesQuestion[] = [
  {
    id: 'obj-01',
    prompt: '¿Qué es ほん?',
    subtext: '(hon)',
    options: [
      { id: 'o1', text: 'bolígrafo' },
      { id: 'o2', text: 'libro' },
      { id: 'o3', text: 'cuaderno' },
      { id: 'o4', text: 'mesa' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'obj-02',
    prompt: '¿Qué es かばん?',
    subtext: '(kaban)',
    options: [
      { id: 'o1', text: 'zapato' },
      { id: 'o2', text: 'paraguas' },
      { id: 'o3', text: 'bolso / mochila' },
      { id: 'o4', text: 'sombrero' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'obj-03',
    prompt: '¿Qué es かさ?',
    subtext: '(kasa)',
    options: [
      { id: 'o1', text: 'silla' },
      { id: 'o2', text: 'paraguas' },
      { id: 'o3', text: 'ventana' },
      { id: 'o4', text: 'mesa' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'obj-04',
    prompt: '¿Cómo decís "libro" en japonés?',
    options: [
      { id: 'o1', text: 'かばん', subtext: 'kaban' },
      { id: 'o2', text: 'いす', subtext: 'isu' },
      { id: 'o3', text: 'ほん', subtext: 'hon' },
      { id: 'o4', text: 'つくえ', subtext: 'tsukue' },
    ],
    correctOptionId: 'o3',
  },
  {
    id: 'obj-05',
    prompt: '¿Cómo decís "silla" en japonés?',
    options: [
      { id: 'o1', text: 'いす', subtext: 'isu' },
      { id: 'o2', text: 'まど', subtext: 'mado' },
      { id: 'o3', text: 'とけい', subtext: 'tokei' },
      { id: 'o4', text: 'でんki', subtext: 'denki' },
    ],
    correctOptionId: 'o1',
  },
  {
    id: 'obj-06',
    prompt: '¿Qué es とけい?',
    subtext: '(tokei)',
    options: [
      { id: 'o1', text: 'televisión' },
      { id: 'o2', text: 'reloj' },
      { id: 'o3', text: 'teléfono' },
      { id: 'o4', text: 'radio' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'obj-07',
    prompt: '"Ese bolso tuyo" — ¿cómo lo decís completo?',
    subtext: 'Con el adjetivo demostrativo correcto',
    options: [
      { id: 'o1', text: 'このかばん', subtext: 'kono kaban' },
      { id: 'o2', text: 'そのかばん', subtext: 'sono kaban' },
      { id: 'o3', text: 'あのかばん', subtext: 'ano kaban' },
      { id: 'o4', text: 'どのかばん', subtext: 'dono kaban' },
    ],
    correctOptionId: 'o2',
  },
  {
    id: 'obj-08',
    prompt: '"¿Qué es aquello?" (lejos de los dos)',
    options: [
      { id: 'o1', text: 'これはなんですか', subtext: 'kore wa nan desu ka' },
      { id: 'o2', text: 'それはなんですか', subtext: 'sore wa nan desu ka' },
      { id: 'o3', text: 'あれはなんですか', subtext: 'are wa nan desu ka' },
      { id: 'o4', text: 'どれはなんですか', subtext: 'dore wa nan desu ka' },
    ],
    correctOptionId: 'o3',
  },
];

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const allQuestions: DemonstrativesQuestion[] = [
  ...koreQuestions,
  ...konoQuestions,
  ...kokoQuestions,
  ...presentationQuestions,
  ...objectQuestions,
];

export function getDemonstrativesQuestions(): DemonstrativesQuestion[] {
  return shuffle([...allQuestions]);
}
