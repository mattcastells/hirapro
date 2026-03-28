import {
  hiraganaGroups,
  hiraganaSections,
  getCharactersForGroupIds as getHiraganaCharactersForGroupIds,
} from './hiragana';
import { katakanaGroups, katakanaSections, getKatakanaCharactersForGroupIds } from './katakana';
import {
  getWordPracticeCategorySummaries,
  getWordPracticeEntries,
} from './wordVocabulary';
import { KanaScript, WordPracticeCategoryId } from '../types/game';
import { HiraganaGroupId } from '../types/hiragana';

export function getKanaScriptLabel(script: KanaScript) {
  return script === 'katakana' ? 'Katakana' : 'Hiragana';
}

export function getKanaGroups(script: KanaScript) {
  return script === 'katakana' ? katakanaGroups : hiraganaGroups;
}

export function getKanaSections(script: KanaScript) {
  return script === 'katakana' ? katakanaSections : hiraganaSections;
}

export function getKanaCharactersForGroupIds(
  script: KanaScript,
  groupIds: HiraganaGroupId[],
) {
  return script === 'katakana'
    ? getKatakanaCharactersForGroupIds(groupIds)
    : getHiraganaCharactersForGroupIds(groupIds);
}

export function getKanaWordEntries(
  script: KanaScript,
  categoryIds?: WordPracticeCategoryId[],
) {
  return getWordPracticeEntries(script, categoryIds);
}

export function getKanaWordCategorySummaries(script: KanaScript) {
  return getWordPracticeCategorySummaries(script);
}
