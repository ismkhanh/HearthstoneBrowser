import { z } from 'zod';

/**
 * Wire format returned by RapidAPI, validated at runtime with zod.
 * Only the fields the app consumes are declared; everything else in
 * the (very large) payload is ignored.
 */
const NamedRefDtoSchema = z.object({
  slug: z.string().optional(),
  name: z.string().optional(),
});

const KeywordDtoSchema = NamedRefDtoSchema.extend({
  text: z.string().optional(),
});

export const CardDtoSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  manaCost: z.number().nullable().optional(),
  attack: z.number().nullable().optional(),
  health: z.number().nullable().optional(),
  text: z.string().nullable().optional(),
  flavorText: z.string().nullable().optional(),
  artistName: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  cropImage: z.string().nullable().optional(),
  rarity: NamedRefDtoSchema.nullable().optional(),
  class: NamedRefDtoSchema.nullable().optional(),
  type: NamedRefDtoSchema.nullable().optional(),
  cardSet: NamedRefDtoSchema.nullable().optional(),
  keywords: z.array(KeywordDtoSchema).nullable().optional(),
});

export const CardsResponseDtoSchema = z.object({
  cards: z.array(CardDtoSchema).nullable().optional(),
  pageCount: z.number().nullable().optional(),
  page: z.number().nullable().optional(),
});

export type NamedRefDto = z.infer<typeof NamedRefDtoSchema>;
export type KeywordDto = z.infer<typeof KeywordDtoSchema>;
export type CardDto = z.infer<typeof CardDtoSchema>;
export type CardsResponseDto = z.infer<typeof CardsResponseDtoSchema>;
