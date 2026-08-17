import { buildCardDto, buildCardsResponseDto } from '../../../../../test/fixtures/cardFixtures';
import { toCardDetails, toCardSummary, toCardsPage } from '../cardMapper';

describe('cardMapper', () => {
  it('maps a summary and prefers the cropped image for the list', () => {
    const summary = toCardSummary(buildCardDto());

    expect(summary).toEqual({
      id: 38913,
      slug: 'a-light-in-the-darkness',
      name: 'A Light in the Darkness',
      manaCost: 2,
      imageUrl: 'https://images.test/crop.png',
      rarity: 'Common',
      className: 'Paladin',
      cardType: 'Spell',
    });
  });

  it('falls back to safe defaults when optional fields are missing', () => {
    const summary = toCardSummary(
      buildCardDto({
        manaCost: null,
        cropImage: '',
        image: '',
        rarity: null,
        class: null,
        type: null,
      }),
    );

    expect(summary.manaCost).toBe(0);
    expect(summary.imageUrl).toBeNull();
    expect(summary.rarity).toBeNull();
  });

  it('strips inline markup from card texts and keywords', () => {
    const details = toCardDetails(buildCardDto());

    expect(details.text).toBe('Discover a Paladin minion. Give it +2/+2.');
    expect(details.imageUrl).toBe('https://images.test/full.png');
    expect(details.keywords).toEqual([
      { name: 'Discover', description: 'Choose one of three cards.' },
    ]);
  });

  it('treats an empty text as absent', () => {
    expect(toCardDetails(buildCardDto({ text: '<b></b>' })).text).toBeNull();
  });

  it('maps a page and falls back to the requested page number', () => {
    const page = toCardsPage(buildCardsResponseDto({ page: null, cards: null }), 3);

    expect(page.page).toBe(3);
    expect(page.cards).toEqual([]);
  });
});
