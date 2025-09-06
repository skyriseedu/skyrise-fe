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

export const universityKeys = {
  all: ['universities'] as const,
  lists: () => [...universityKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...universityKeys.lists(), { filters }] as const,
  searches: () => [...universityKeys.all, 'search'] as const,
  search: (filters: Record<string, unknown>) =>
    [...universityKeys.searches(), { filters }] as const,
  details: () => [...universityKeys.all, 'detail'] as const,
  detail: (id: string) => [...universityKeys.details(), id] as const,
  paginated: (page?: number, limit?: number) =>
    [...universityKeys.all, 'paginated', { page, limit }] as const,
} as const;
