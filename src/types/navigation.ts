import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { HiraganaGroupId } from './hiragana';
import { PracticeMode } from './game';

export type RootStackParamList = {
  Home: undefined;
  HiraganaGroups: undefined;
  HiraganaGame: {
    selectedGroupIds: HiraganaGroupId[];
    mode: PracticeMode;
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
