import React, { createContext, useContext, useMemo, type PropsWithChildren } from 'react';

import { createCardsUseCases, type CardsUseCases } from '../di/cardsContainer';

const CardsUseCasesContext = createContext<CardsUseCases | null>(null);

interface CardsUseCasesProviderProps extends PropsWithChildren {
  /** Tests (and future feature flags) inject their own implementation here. */
  useCases?: CardsUseCases;
}

export function CardsUseCasesProvider({ useCases, children }: CardsUseCasesProviderProps) {
  const value = useMemo(() => useCases ?? createCardsUseCases(), [useCases]);

  return <CardsUseCasesContext.Provider value={value}>{children}</CardsUseCasesContext.Provider>;
}

export function useCardsUseCases(): CardsUseCases {
  const value = useContext(CardsUseCasesContext);

  if (!value) {
    throw new Error('useCardsUseCases must be used inside a <CardsUseCasesProvider />');
  }

  return value;
}
