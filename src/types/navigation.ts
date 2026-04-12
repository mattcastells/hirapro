import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HiraganaGroupId } from './hiragana';
import { KanaScript, PracticeMode, WordPracticeCategoryId } from './game';
import { KanjiCategoryId, KanjiPracticeMode } from './kanji';

export type RootStackParamList = {
  Home: undefined;
  Options: undefined;
  Kyary: undefined;
  TheoryParticles: undefined;
  TheoryQuestions: undefined;
  TheoryDemonstratives: undefined;
  TheoryPresentations: undefined;
  TheoryNumbers: undefined;
  KanaGroups: {
    script: KanaScript;
  };
  KanaGame: {
    script: KanaScript;
    selectedGroupIds: HiraganaGroupId[];
    selectedWordCategoryIds: WordPracticeCategoryId[];
    mode: PracticeMode;
    inverted: boolean;
  };
  KanjiHub: undefined;
  KanjiLearn: undefined;
  KanjiPractice: undefined;
  KanjiGame: {
    mode: KanjiPracticeMode;
    categoryIds: KanjiCategoryId[];
  };
  NumbersGame: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
