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

// Query key factory for programs
export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...programKeys.lists(), { filters }] as const,
  paginated: (page?: number, limit?: number) =>
    [...programKeys.all, 'paginated', { page, limit }] as const,
  filters: () => [...programKeys.all, 'filters'] as const,
  search: (filters: Record<string, unknown>) =>
    [...programKeys.all, 'search', { filters }] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (slug: string) => [...programKeys.details(), slug] as const,
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

export const faqKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  paginated: (page?: number, limit?: number) =>
    [...faqKeys.lists(), { page, limit }] as const,
} as const;

export const teamMemberKeys = {
  all: ['team-members'] as const,
  lists: () => [...teamMemberKeys.all, 'list'] as const,
  paginated: (page?: number, limit?: number) =>
    [...teamMemberKeys.lists(), { page, limit }] as const,
} as const;

export const ambassadorKeys = {
  all: ['ambassadors'] as const,
  lists: () => [...ambassadorKeys.all, 'list'] as const,
  paginated: (page?: number, limit?: number) =>
    [...ambassadorKeys.lists(), { page, limit }] as const,
} as const;

export const bookingKeys = {
  all: ['bookings'] as const,
  consultations: () => [...bookingKeys.all, 'consultations'] as const,
  consultationsList: (filters: Record<string, unknown>) =>
    [...bookingKeys.consultations(), 'list', { filters }] as const,
} as const;
