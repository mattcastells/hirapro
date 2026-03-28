import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HiraganaGroupId } from './hiragana';
import { KanaScript, PracticeMode, WordPracticeCategoryId } from './game';

export type RootStackParamList = {
  Home: undefined;
  Options: undefined;
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
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
