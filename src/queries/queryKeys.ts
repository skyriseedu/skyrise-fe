// Query key factory for blogs
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...blogKeys.lists(), { filters }] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  latest: (limit?: number) => [...blogKeys.all, 'latest', { limit }] as const,
  category: (category: string) =>
    [...blogKeys.all, 'category', category] as const,
  paginated: (category?: string, page?: number, limit?: number) =>
    [...blogKeys.all, 'paginated', { category, page, limit }] as const,
} as const;
