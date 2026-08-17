import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';

import { CardDetailsScreen } from '../../features/cards/presentation/screens/CardDetailsScreen';
import { CardListScreen } from '../../features/cards/presentation/screens/CardListScreen';
import { theme } from '../../shared/theme/theme';
import type { RootStackParamList, RootStackScreenProps } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="CardList" component={CardListRoute} options={{ title: 'Cards' }} />
        <Stack.Screen
          name="CardDetails"
          component={CardDetailsRoute}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Route adapters: screens stay navigation-agnostic (plain props), which keeps
 * them straightforward to render in unit tests.
 */
function CardListRoute({ navigation }: RootStackScreenProps<'CardList'>) {
  const handleSelectCard = useCallback(
    (card: { slug: string; name: string }) =>
      navigation.navigate('CardDetails', { slug: card.slug, name: card.name }),
    [navigation],
  );

  return <CardListScreen onSelectCard={handleSelectCard} />;
}

function CardDetailsRoute({ route }: RootStackScreenProps<'CardDetails'>) {
  return <CardDetailsScreen slug={route.params.slug} />;
}

const screenOptions = {
  headerStyle: { backgroundColor: theme.colors.surface },
  headerTintColor: theme.colors.text,
  contentStyle: { backgroundColor: theme.colors.background },
} as const;
