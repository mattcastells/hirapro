import {
  HiraganaCharacter,
  HiraganaGroup,
  HiraganaGroupId,
  HiraganaSection,
} from '../types/hiragana';

const createCharacters = (
  groupId: HiraganaGroupId,
  entries: Array<[kana: string, romaji: string]>,
): HiraganaCharacter[] =>
  entries.map(([kana, romaji]) => ({
    id: `${groupId}-${romaji}`,
    kana,
    romaji,
    groupId,
  }));

const createGroup = (
  id: HiraganaGroupId,
  section: HiraganaGroup['section'],
  title: string,
  accentColor: string,
  entries: Array<[kana: string, romaji: string]>,
): HiraganaGroup => ({
  id,
  section,
  title,
  accentColor,
  romajiPreview: entries.map(([, romaji]) => romaji).join(', '),
  kanaPreview: entries.map(([kana]) => kana).join(''),
  characters: createCharacters(id, entries),
});

export const baseKatakanaGroups: HiraganaGroup[] = [
  createGroup('vowels', 'base', 'Vocales', '#66D4FF', [
    ['ア', 'a'],
    ['イ', 'i'],
    ['ウ', 'u'],
    ['エ', 'e'],
    ['オ', 'o'],
  ]),
  createGroup('k', 'base', 'K', '#7CE8FF', [
    ['カ', 'ka'],
    ['キ', 'ki'],
    ['ク', 'ku'],
    ['ケ', 'ke'],
    ['コ', 'ko'],
  ]),
  createGroup('s', 'base', 'S', '#49C0FF', [
    ['サ', 'sa'],
    ['シ', 'shi'],
    ['ス', 'su'],
    ['セ', 'se'],
    ['ソ', 'so'],
  ]),
  createGroup('t', 'base', 'T', '#FFB86B', [
    ['タ', 'ta'],
    ['チ', 'chi'],
    ['ツ', 'tsu'],
    ['テ', 'te'],
    ['ト', 'to'],
  ]),
  createGroup('n', 'base', 'N', '#7CF3BC', [
    ['ナ', 'na'],
    ['ニ', 'ni'],
    ['ヌ', 'nu'],
    ['ネ', 'ne'],
    ['ノ', 'no'],
  ]),
  createGroup('h', 'base', 'H', '#FF78C8', [
    ['ハ', 'ha'],
    ['ヒ', 'hi'],
    ['フ', 'fu'],
    ['ヘ', 'he'],
    ['ホ', 'ho'],
  ]),
  createGroup('m', 'base', 'M', '#73B1FF', [
    ['マ', 'ma'],
    ['ミ', 'mi'],
    ['ム', 'mu'],
    ['メ', 'me'],
    ['モ', 'mo'],
  ]),
  createGroup('y', 'base', 'Y', '#6EE7D5', [
    ['ヤ', 'ya'],
    ['ユ', 'yu'],
    ['ヨ', 'yo'],
  ]),
  createGroup('r', 'base', 'R', '#9B8CFF', [
    ['ラ', 'ra'],
    ['リ', 'ri'],
    ['ル', 'ru'],
    ['レ', 're'],
    ['ロ', 'ro'],
  ]),
  createGroup('w', 'base', 'W', '#FF8E8E', [
    ['ワ', 'wa'],
    ['ヲ', 'wo'],
    ['ン', 'n'],
  ]),
];

export const alteredKatakanaGroups: HiraganaGroup[] = [
  createGroup('g', 'alternatives', 'G', '#58CCFF', [
    ['ガ', 'ga'],
    ['ギ', 'gi'],
    ['グ', 'gu'],
    ['ゲ', 'ge'],
    ['ゴ', 'go'],
  ]),
  createGroup('z', 'alternatives', 'Z', '#44C8FF', [
    ['ザ', 'za'],
    ['ジ', 'ji'],
    ['ズ', 'zu'],
    ['ゼ', 'ze'],
    ['ゾ', 'zo'],
  ]),
  createGroup('d', 'alternatives', 'D', '#36B6FF', [
    ['ダ', 'da'],
    ['ヂ', 'ji'],
    ['ヅ', 'zu'],
    ['デ', 'de'],
    ['ド', 'do'],
  ]),
  createGroup('b', 'alternatives', 'B', '#FF87C3', [
    ['バ', 'ba'],
    ['ビ', 'bi'],
    ['ブ', 'bu'],
    ['ベ', 'be'],
    ['ボ', 'bo'],
  ]),
  createGroup('p', 'alternatives', 'P', '#FFC36B', [
    ['パ', 'pa'],
    ['ピ', 'pi'],
    ['プ', 'pu'],
    ['ペ', 'pe'],
    ['ポ', 'po'],
  ]),
];

export const comboKatakanaGroups: HiraganaGroup[] = [
  createGroup('kya', 'combos', 'Kya', '#64D8FF', [
    ['キャ', 'kya'],
    ['キュ', 'kyu'],
    ['キョ', 'kyo'],
  ]),
  createGroup('sha', 'combos', 'Sha', '#59C5FF', [
    ['シャ', 'sha'],
    ['シュ', 'shu'],
    ['ショ', 'sho'],
  ]),
  createGroup('cha', 'combos', 'Cha', '#FFB57A', [
    ['チャ', 'cha'],
    ['チュ', 'chu'],
    ['チョ', 'cho'],
  ]),
  createGroup('nya', 'combos', 'Nya', '#7FEFC6', [
    ['ニャ', 'nya'],
    ['ニュ', 'nyu'],
    ['ニョ', 'nyo'],
  ]),
  createGroup('hya', 'combos', 'Hya', '#FF85CF', [
    ['ヒャ', 'hya'],
    ['ヒュ', 'hyu'],
    ['ヒョ', 'hyo'],
  ]),
  createGroup('mya', 'combos', 'Mya', '#76B6FF', [
    ['ミャ', 'mya'],
    ['ミュ', 'myu'],
    ['ミョ', 'myo'],
  ]),
  createGroup('rya', 'combos', 'Rya', '#A894FF', [
    ['リャ', 'rya'],
    ['リュ', 'ryu'],
    ['リョ', 'ryo'],
  ]),
  createGroup('gya', 'combos', 'Gya', '#3FB7FF', [
    ['ギャ', 'gya'],
    ['ギュ', 'gyu'],
    ['ギョ', 'gyo'],
  ]),
  createGroup('ja', 'combos', 'Ja', '#35AFFF', [
    ['ジャ', 'ja'],
    ['ジュ', 'ju'],
    ['ジョ', 'jo'],
  ]),
  createGroup('bya', 'combos', 'Bya', '#FF96D0', [
    ['ビャ', 'bya'],
    ['ビュ', 'byu'],
    ['ビョ', 'byo'],
  ]),
  createGroup('pya', 'combos', 'Pya', '#FFD080', [
    ['ピャ', 'pya'],
    ['ピュ', 'pyu'],
    ['ピョ', 'pyo'],
  ]),
];

export const katakanaGroups: HiraganaGroup[] = [
  ...baseKatakanaGroups,
  ...alteredKatakanaGroups,
  ...comboKatakanaGroups,
];

export const katakanaSections: HiraganaSection[] = [
  {
    id: 'base',
    title: 'Silabas',
    defaultExpanded: false,
    groups: baseKatakanaGroups,
  },
  {
    id: 'alternatives',
    title: 'Dakuten / Handakuten',
    defaultExpanded: false,
    groups: alteredKatakanaGroups,
  },
  {
    id: 'combos',
    title: 'Combos',
    defaultExpanded: false,
    groups: comboKatakanaGroups,
  },
];

export function getKatakanaCharactersForGroupIds(groupIds: HiraganaGroupId[]) {
  return katakanaGroups
    .filter((group) => groupIds.includes(group.id))
    .flatMap((group) => group.characters);
}
