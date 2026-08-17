export const cardQueryKeys = {
  all: ['cards'] as const,
  list: (search: string) => [...cardQueryKeys.all, 'list', search] as const,
  detail: (slug: string) => [...cardQueryKeys.all, 'detail', slug] as const,
};
