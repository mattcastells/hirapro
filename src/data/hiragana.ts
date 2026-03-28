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

export const baseHiraganaGroups: HiraganaGroup[] = [
  createGroup('vowels', 'base', 'Vocales', '#66D4FF', [
    ['あ', 'a'],
    ['い', 'i'],
    ['う', 'u'],
    ['え', 'e'],
    ['お', 'o'],
  ]),
  createGroup('k', 'base', 'K', '#7CE8FF', [
    ['か', 'ka'],
    ['き', 'ki'],
    ['く', 'ku'],
    ['け', 'ke'],
    ['こ', 'ko'],
  ]),
  createGroup('s', 'base', 'S', '#49C0FF', [
    ['さ', 'sa'],
    ['し', 'shi'],
    ['す', 'su'],
    ['せ', 'se'],
    ['そ', 'so'],
  ]),
  createGroup('t', 'base', 'T', '#FFB86B', [
    ['た', 'ta'],
    ['ち', 'chi'],
    ['つ', 'tsu'],
    ['て', 'te'],
    ['と', 'to'],
  ]),
  createGroup('n', 'base', 'N', '#7CF3BC', [
    ['な', 'na'],
    ['に', 'ni'],
    ['ぬ', 'nu'],
    ['ね', 'ne'],
    ['の', 'no'],
  ]),
  createGroup('h', 'base', 'H', '#FF78C8', [
    ['は', 'ha'],
    ['ひ', 'hi'],
    ['ふ', 'fu'],
    ['へ', 'he'],
    ['ほ', 'ho'],
  ]),
  createGroup('m', 'base', 'M', '#73B1FF', [
    ['ま', 'ma'],
    ['み', 'mi'],
    ['む', 'mu'],
    ['め', 'me'],
    ['も', 'mo'],
  ]),
  createGroup('y', 'base', 'Y', '#6EE7D5', [
    ['や', 'ya'],
    ['ゆ', 'yu'],
    ['よ', 'yo'],
  ]),
  createGroup('r', 'base', 'R', '#9B8CFF', [
    ['ら', 'ra'],
    ['り', 'ri'],
    ['る', 'ru'],
    ['れ', 're'],
    ['ろ', 'ro'],
  ]),
  createGroup('w', 'base', 'W', '#FF8E8E', [
    ['わ', 'wa'],
    ['を', 'wo'],
    ['ん', 'n'],
  ]),
];

export const alteredHiraganaGroups: HiraganaGroup[] = [
  createGroup('g', 'alternatives', 'G', '#58CCFF', [
    ['が', 'ga'],
    ['ぎ', 'gi'],
    ['ぐ', 'gu'],
    ['げ', 'ge'],
    ['ご', 'go'],
  ]),
  createGroup('z', 'alternatives', 'Z', '#44C8FF', [
    ['ざ', 'za'],
    ['じ', 'ji'],
    ['ず', 'zu'],
    ['ぜ', 'ze'],
    ['ぞ', 'zo'],
  ]),
  createGroup('d', 'alternatives', 'D', '#36B6FF', [
    ['だ', 'da'],
    ['ぢ', 'ji'],
    ['づ', 'zu'],
    ['で', 'de'],
    ['ど', 'do'],
  ]),
  createGroup('b', 'alternatives', 'B', '#FF87C3', [
    ['ば', 'ba'],
    ['び', 'bi'],
    ['ぶ', 'bu'],
    ['べ', 'be'],
    ['ぼ', 'bo'],
  ]),
  createGroup('p', 'alternatives', 'P', '#FFC36B', [
    ['ぱ', 'pa'],
    ['ぴ', 'pi'],
    ['ぷ', 'pu'],
    ['ぺ', 'pe'],
    ['ぽ', 'po'],
  ]),
];

export const comboHiraganaGroups: HiraganaGroup[] = [
  createGroup('kya', 'combos', 'Kya', '#64D8FF', [
    ['きゃ', 'kya'],
    ['きゅ', 'kyu'],
    ['きょ', 'kyo'],
  ]),
  createGroup('sha', 'combos', 'Sha', '#59C5FF', [
    ['しゃ', 'sha'],
    ['しゅ', 'shu'],
    ['しょ', 'sho'],
  ]),
  createGroup('cha', 'combos', 'Cha', '#FFB57A', [
    ['ちゃ', 'cha'],
    ['ちゅ', 'chu'],
    ['ちょ', 'cho'],
  ]),
  createGroup('nya', 'combos', 'Nya', '#7FEFC6', [
    ['にゃ', 'nya'],
    ['にゅ', 'nyu'],
    ['にょ', 'nyo'],
  ]),
  createGroup('hya', 'combos', 'Hya', '#FF85CF', [
    ['ひゃ', 'hya'],
    ['ひゅ', 'hyu'],
    ['ひょ', 'hyo'],
  ]),
  createGroup('mya', 'combos', 'Mya', '#76B6FF', [
    ['みゃ', 'mya'],
    ['みゅ', 'myu'],
    ['みょ', 'myo'],
  ]),
  createGroup('rya', 'combos', 'Rya', '#A894FF', [
    ['りゃ', 'rya'],
    ['りゅ', 'ryu'],
    ['りょ', 'ryo'],
  ]),
  createGroup('gya', 'combos', 'Gya', '#3FB7FF', [
    ['ぎゃ', 'gya'],
    ['ぎゅ', 'gyu'],
    ['ぎょ', 'gyo'],
  ]),
  createGroup('ja', 'combos', 'Ja', '#35AFFF', [
    ['じゃ', 'ja'],
    ['じゅ', 'ju'],
    ['じょ', 'jo'],
  ]),
  createGroup('bya', 'combos', 'Bya', '#FF96D0', [
    ['びゃ', 'bya'],
    ['びゅ', 'byu'],
    ['びょ', 'byo'],
  ]),
  createGroup('pya', 'combos', 'Pya', '#FFD080', [
    ['ぴゃ', 'pya'],
    ['ぴゅ', 'pyu'],
    ['ぴょ', 'pyo'],
  ]),
];

export const hiraganaGroups: HiraganaGroup[] = [
  ...baseHiraganaGroups,
  ...alteredHiraganaGroups,
  ...comboHiraganaGroups,
];

export const hiraganaSections: HiraganaSection[] = [
  {
    id: 'base',
    title: 'Silabas',
    defaultExpanded: false,
    groups: baseHiraganaGroups,
  },
  {
    id: 'alternatives',
    title: 'Dakuten / Handakuten',
    defaultExpanded: false,
    groups: alteredHiraganaGroups,
  },
  {
    id: 'combos',
    title: 'Combos',
    defaultExpanded: false,
    groups: comboHiraganaGroups,
  },
];

export const hiraganaBaseCharacters = hiraganaGroups.flatMap(
  (group) => group.characters,
);

export function getCharactersForGroupIds(groupIds: HiraganaGroupId[]) {
  return hiraganaGroups
    .filter((group) => groupIds.includes(group.id))
    .flatMap((group) => group.characters);
}
