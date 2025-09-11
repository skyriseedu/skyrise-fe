import apiClient from '../client';
import type {
  ProgramsApiResponse,
  UseProgramsParams,
  ProgramsSearchParams,
  ProgramDetailsApiResponse,
} from '@/types/users/program';
import type { ProgramFiltersResponse } from '@/types/users/explore';

export const programsService = {
  async getPrograms(
    params: UseProgramsParams = { page: 1, limit: 10 }
  ): Promise<ProgramsApiResponse> {
    const { page = 1, limit = 10 } = params;

    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/programs?${searchParams}`);
    return response.data;
  },

  async getProgramFilters(): Promise<ProgramFiltersResponse> {
    const response = await apiClient.get('/programs/filters');
    return response.data;
  },

  async searchPrograms(
    params: ProgramsSearchParams
  ): Promise<ProgramsApiResponse> {
    const {
      page = 1,
      limit = 10,
      q,
      degrees,
      programs,
      fees,
      duration,
    } = params;

    const sp = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (q && q.trim()) sp.append('q', q.trim());

    const toParam = (v?: string | string[]) =>
      Array.isArray(v) ? v.filter(Boolean).join(',') : v;

    const degs = toParam(degrees);
    if (degs) sp.append('degrees', degs);

    const progs = toParam(programs);
    if (progs) sp.append('programs', progs);

    const feeStr = toParam(fees);
    if (feeStr) sp.append('fees', feeStr);

    const durStr = toParam(duration);
    if (durStr) sp.append('duration', durStr);

    const response = await apiClient.get(`/programs/search?${sp}`);
    return response.data;
  },

  async getProgramBySlug(slug: string): Promise<ProgramDetailsApiResponse> {
    const response = await apiClient.get(`/programs/${slug}`);
    return response.data;
  },
};
