import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { GameScreen } from '../screens/GameScreen';
import { HiraganaSelectionScreen } from '../screens/HiraganaSelectionScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { KyaryScreen } from '../screens/KyaryScreen';
import { OptionsScreen } from '../screens/OptionsScreen';

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
    </Stack.Navigator>
  );
}
