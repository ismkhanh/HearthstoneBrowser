import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CardsUseCasesProvider } from '../features/cards/providers/CardsUseCasesProvider';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary';
import { RootNavigator } from './navigation/RootNavigator';
import { AppQueryProvider } from './providers/AppQueryProvider';

export function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <ErrorBoundary>
        <AppQueryProvider>
          <CardsUseCasesProvider>
            <RootNavigator />
          </CardsUseCasesProvider>
        </AppQueryProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
