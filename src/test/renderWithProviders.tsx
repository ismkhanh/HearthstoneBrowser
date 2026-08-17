import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react-native';
import React, { type ReactElement, type PropsWithChildren } from 'react';

import type { CardsUseCases } from '../features/cards/di/cardsContainer';
import { CardsUseCasesProvider } from '../features/cards/providers/CardsUseCasesProvider';

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { useCases, ...options }: RenderOptions & { useCases: CardsUseCases },
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <CardsUseCasesProvider useCases={useCases}>{children}</CardsUseCasesProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
