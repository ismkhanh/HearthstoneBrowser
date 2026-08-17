import { screen } from '@testing-library/react-native';
import React from 'react';

import { AppError } from '../../../../../core/errors/AppError';
import { toCardDetails } from '../../../data/mappers/cardMapper';
import { buildCardDto } from '../../../../../test/fixtures/cardFixtures';
import { renderWithProviders } from '../../../../../test/renderWithProviders';
import type { CardsUseCases } from '../../../di/cardsContainer';
import { CardDetailsScreen } from '../CardDetailsScreen';

function createUseCases(getCardBySlug: CardsUseCases['getCardBySlug']): CardsUseCases {
  return { getCards: jest.fn(), getCardBySlug };
}

describe('CardDetailsScreen', () => {
  it('renders the full details of a card', async () => {
    const getCardBySlug = jest.fn().mockResolvedValue(toCardDetails(buildCardDto()));

    await renderWithProviders(<CardDetailsScreen slug="a-light-in-the-darkness" />, {
      useCases: createUseCases(getCardBySlug),
    });

    expect(screen.getByTestId('loading-state')).toBeTruthy();
    expect(await screen.findByText('A Light in the Darkness')).toBeTruthy();
    expect(screen.getByText('Discover a Paladin minion. Give it +2/+2.')).toBeTruthy();
    expect(getCardBySlug).toHaveBeenCalledWith('a-light-in-the-darkness', expect.anything());
  });

  it('surfaces a friendly message when the card is missing', async () => {
    const getCardBySlug = jest
      .fn()
      .mockRejectedValue(new AppError('notFound', 'We could not find what you were looking for.'));

    await renderWithProviders(<CardDetailsScreen slug="unknown-card" />, {
      useCases: createUseCases(getCardBySlug),
    });

    expect(await screen.findByText('We could not find what you were looking for.')).toBeTruthy();
  });
});
