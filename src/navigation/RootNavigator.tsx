import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { GameScreen } from '../screens/GameScreen';
import { HiraganaSelectionScreen } from '../screens/HiraganaSelectionScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { KanjiGameScreen } from '../screens/KanjiGameScreen';
import { KanjiHubScreen } from '../screens/KanjiHubScreen';
import { KanjiLearnScreen } from '../screens/KanjiLearnScreen';
import { KanjiPracticeScreen } from '../screens/KanjiPracticeScreen';
import { NumbersGameScreen } from '../screens/NumbersGameScreen';
import { KyaryScreen } from '../screens/KyaryScreen';
import { OptionsScreen } from '../screens/OptionsScreen';
import { TheoryParticlesScreen } from '../screens/TheoryParticlesScreen';
import { TheoryQuestionsScreen } from '../screens/TheoryQuestionsScreen';
import { TheoryDemonstrativesScreen } from '../screens/TheoryDemonstrativesScreen';
import { TheoryPresentationsScreen } from '../screens/TheoryPresentationsScreen';
import { TheoryNumbersScreen } from '../screens/TheoryNumbersScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Options" component={OptionsScreen} />
      <Stack.Screen name="Kyary" component={KyaryScreen} />
      <Stack.Screen name="KanaGroups" component={HiraganaSelectionScreen} />
      <Stack.Screen name="KanaGame" component={GameScreen} />
      <Stack.Screen name="KanjiHub" component={KanjiHubScreen} />
      <Stack.Screen name="KanjiLearn" component={KanjiLearnScreen} />
      <Stack.Screen name="KanjiPractice" component={KanjiPracticeScreen} />
      <Stack.Screen name="KanjiGame" component={KanjiGameScreen} />
      <Stack.Screen name="TheoryParticles" component={TheoryParticlesScreen} />
      <Stack.Screen name="TheoryQuestions" component={TheoryQuestionsScreen} />
      <Stack.Screen name="TheoryDemonstratives" component={TheoryDemonstrativesScreen} />
      <Stack.Screen name="TheoryPresentations" component={TheoryPresentationsScreen} />
      <Stack.Screen name="TheoryNumbers" component={TheoryNumbersScreen} />
      <Stack.Screen name="NumbersGame" component={NumbersGameScreen} />
    </Stack.Navigator>
  );
}
