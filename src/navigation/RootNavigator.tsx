import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';
import { GameScreen } from '../screens/GameScreen';
import { HiraganaSelectionScreen } from '../screens/HiraganaSelectionScreen';
import { HomeScreen } from '../screens/HomeScreen';

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
      <Stack.Screen name="HiraganaGroups" component={HiraganaSelectionScreen} />
      <Stack.Screen name="HiraganaGame" component={GameScreen} />
    </Stack.Navigator>
  );
}
