import {
  buildCardDto,
  buildCardsResponseDto,
} from '../../../../../test/fixtures/cardFixtures';
import type { CardRemoteDataSource } from '../../datasources/CardRemoteDataSource';
import { createHttpCardRepository } from '../HttpCardRepository';

describe('HttpCardRepository', () => {
  const remote: jest.Mocked<CardRemoteDataSource> = {
    fetchCards: jest.fn().mockResolvedValue(buildCardsResponseDto({ page: 2, pageCount: 5 })),
    fetchCardBySlug: jest.fn().mockResolvedValue(buildCardDto()),
  };

  it('returns mapped domain pages', async () => {
    const page = await createHttpCardRepository(remote).getCards({ page: 2, pageSize: 20 });

    expect(remote.fetchCards).toHaveBeenCalledWith({ page: 2, pageSize: 20 }, undefined);
    expect(page.page).toBe(2);
    expect(page.pageCount).toBe(5);
    expect(page.cards[0]?.name).toBe('A Light in the Darkness');
  });

  it('returns mapped card details', async () => {
    const card = await createHttpCardRepository(remote).getCardBySlug('a-light-in-the-darkness');

    expect(card.cardSetName).toBe('Whispers of the Old Gods');
    expect(card.text).toBe('Discover a Paladin minion. Give it +2/+2.');
  });
});
