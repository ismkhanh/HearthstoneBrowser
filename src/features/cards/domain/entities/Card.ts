/**
 * Domain entities
 */
export interface CardSummary {
  readonly id: number;
  readonly slug: string;
  readonly name: string;
  readonly imageUrl: string | null;
  readonly rarity: string | null;
  readonly className: string | null;
  readonly cardType: string | null;
}

export interface CardKeyword {
  readonly name: string;
  readonly description: string;
}

export interface CardDetails extends CardSummary {
  readonly manaCost: number | null;
  readonly text: string | null;
  readonly flavorText: string | null;
  readonly artistName: string | null;
  readonly cardSetName: string | null;
  readonly attack: number | null;
  readonly health: number | null;
  readonly keywords: readonly CardKeyword[];
}

export interface CardsPage {
  readonly cards: readonly CardSummary[];
  readonly page: number;
  readonly pageCount: number;
}
