import type { CardDto, CardsResponseDto } from '../../features/cards/data/dto/CardDto';
import type { CardSummary, CardsPage } from '../../features/cards/domain/entities/Card';

export function buildCardDto(overrides: Partial<CardDto> = {}): CardDto {
  return {
    id: 38913,
    slug: 'a-light-in-the-darkness',
    name: 'A Light in the Darkness',
    manaCost: 2,
    text: '<b>Discover</b> a Paladin minion. Give it +2/+2.',
    flavorText: 'Wait, how can you have a light in the dark?',
    artistName: 'Zoltan Boros',
    image: 'https://images.test/full.png',
    cropImage: 'https://images.test/crop.png',
    rarity: { slug: 'common', name: 'Common' },
    class: { slug: 'paladin', name: 'Paladin' },
    type: { slug: 'spell', name: 'Spell' },
    cardSet: { slug: 'whispers', name: 'Whispers of the Old Man' },
    keywords: [{ slug: 'discover', name: 'Discover', text: 'Choose one of three cards.' }],
    ...overrides,
  };
}

export function buildCardsResponseDto(overrides: Partial<CardsResponseDto> = {}): CardsResponseDto {
  return { cards: [buildCardDto()], pageCount: 1, page: 1, ...overrides };
}

export function buildCardSummary(overrides: Partial<CardSummary> = {}): CardSummary {
  return {
    id: 1,
    slug: 'fireball',
    name: 'Fireball',
    imageUrl: 'https://images.test/fireball.png',
    rarity: 'Free',
    className: 'Mage',
    cardType: 'Spell',
    ...overrides,
  };
}

export function buildCardsPage(overrides: Partial<CardsPage> = {}): CardsPage {
  return { cards: [buildCardSummary()], page: 1, pageCount: 1, ...overrides };
}
