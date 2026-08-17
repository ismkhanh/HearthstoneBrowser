import { stripHtml } from '../../../../shared/utils/stripHtml';
import type { CardDetails, CardSummary, CardsPage } from '../../domain/entities/Card';
import { CardDtoSchema, type CardDto, type CardsResponseDto } from '../dto/CardDto';

export function toCardSummary(dto: CardDto): CardSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    imageUrl: nonEmpty(dto.cropImage) ?? nonEmpty(dto.image),
    rarity: dto.rarity?.name ?? null,
    className: dto.class?.name ?? null,
    cardType: dto.type?.name ?? null,
  };
}

export function toCardDetails(dto: CardDto): CardDetails {
  return {
    ...toCardSummary(dto),
    manaCost: dto.manaCost ?? null,
    imageUrl: nonEmpty(dto.image) ?? nonEmpty(dto.cropImage),
    text: toPlainText(dto.text),
    flavorText: toPlainText(dto.flavorText),
    artistName: nonEmpty(dto.artistName),
    cardSetName: dto.cardSet?.name ?? null,
    attack: dto.attack ?? null,
    health: dto.health ?? null,
    keywords: (dto.keywords ?? []).map(keyword => ({
      name: keyword.name ?? '',
      description: toPlainText(keyword.text) ?? '',
    })),
  };
}

export function toCardsPage(dto: CardsResponseDto, requestedPage: number): CardsPage {
  const validCards = (dto.cards ?? []).reduce<CardSummary[]>((acc, raw) => {
    const result = CardDtoSchema.safeParse(raw);
    if (result.success) {
      acc.push(toCardSummary(result.data));
    }
    return acc;
  }, []);

  return {
    cards: validCards,
    page: dto.page ?? requestedPage,
    pageCount: dto.pageCount ?? 0,
  };
}

function toPlainText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  return nonEmpty(stripHtml(value));
}

function nonEmpty(value: string | null | undefined): string | null {
  return value ? value : null;
}
