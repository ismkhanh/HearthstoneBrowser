import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { AppError } from '../../../../../core/errors/AppError';
import { buildCardSummary, buildCardsPage } from '../../../../../test/fixtures/cardFixtures';
import { renderWithProviders } from '../../../../../test/renderWithProviders';
import type { CardsUseCases } from '../../../di/cardsContainer';
import { CardListScreen } from '../CardListScreen';

function createUseCases(overrides: Partial<CardsUseCases> = {}): CardsUseCases {
  return {
    getCards: jest.fn().mockResolvedValue(buildCardsPage()),
    getCardBySlug: jest.fn(),
    ...overrides,
  };
}

describe('CardListScreen', () => {
  it('shows a loader and then the first page of cards', async () => {
    await renderWithProviders(<CardListScreen onSelectCard={jest.fn()} />, {
      useCases: createUseCases(),
    });

    expect(screen.getByTestId('loading-state')).toBeTruthy();
    expect(await screen.findByText('Fireball')).toBeTruthy();
  });

  it('renders an empty state when the search returns nothing', async () => {
    const getCards = jest.fn().mockResolvedValue(buildCardsPage({ cards: [] }));

    await renderWithProviders(<CardListScreen onSelectCard={jest.fn()} />, {
      useCases: createUseCases({ getCards }),
    });

    expect(await screen.findByTestId('empty-state')).toBeTruthy();
  });

  it('renders an error state and retries on demand', async () => {
    const getCards = jest
      .fn()
      .mockRejectedValueOnce(new AppError('notFound', 'We could not find what you were looking for.'))
      .mockResolvedValue(buildCardsPage());

    await renderWithProviders(<CardListScreen onSelectCard={jest.fn()} />, {
      useCases: createUseCases({ getCards }),
    });

    await fireEvent.press(await screen.findByText('Try again'));

    expect(await screen.findByText('Fireball')).toBeTruthy();
  });

  it('loads the next page when the list reaches its end', async () => {
    const getCards = jest
      .fn()
      .mockResolvedValueOnce(buildCardsPage({ page: 1, pageCount: 2 }))
      .mockResolvedValueOnce(
        buildCardsPage({
          page: 2,
          pageCount: 2,
          cards: [buildCardSummary({ id: 2, slug: 'polymorph', name: 'Polymorph' })],
        }),
      );

    await renderWithProviders(<CardListScreen onSelectCard={jest.fn()} />, {
      useCases: createUseCases({ getCards }),
    });

    await screen.findByText('Fireball');
    await fireEvent(screen.getByTestId('card-list'), 'onEndReached');

    expect(await screen.findByText('Polymorph')).toBeTruthy();
    await waitFor(() =>
      expect(getCards).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
        expect.anything(),
      ),
    );
  });

  it('runs a debounced server-side search', async () => {
    const getCards = jest.fn().mockResolvedValue(buildCardsPage());

    await renderWithProviders(<CardListScreen onSelectCard={jest.fn()} />, {
      useCases: createUseCases({ getCards }),
    });

    await screen.findByText('Fireball');

    await fireEvent.changeText(screen.getByTestId('card-search-input'), 'fir');
    await fireEvent.changeText(screen.getByTestId('card-search-input'), 'fire');

    await waitFor(() =>
      expect(getCards).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: 'fire' }),
        expect.anything(),
      ),
    );
    expect(getCards).not.toHaveBeenCalledWith(
      expect.objectContaining({ search: 'fir' }),
      expect.anything(),
    );
  });

  it('notifies the caller when a card is tapped', async () => {
    const onSelectCard = jest.fn();

    await renderWithProviders(<CardListScreen onSelectCard={onSelectCard} />, {
      useCases: createUseCases(),
    });

    await fireEvent.press(await screen.findByTestId('card-item-fireball'));

    expect(onSelectCard).toHaveBeenCalledWith(expect.objectContaining({ slug: 'fireball' }));
  });
});
