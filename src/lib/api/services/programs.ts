import apiClient from '../client';
import type {
  ProgramsApiResponse,
  UseProgramsParams,
  ProgramsSearchParams,
  ProgramDetailsApiResponse,
  CreateProgramPayload,
  BulkDeleteProgramsPayload,
  UpdateProgramParams,
} from '@/types/users/program';
import type { ProgramFiltersResponse } from '@/types/users/explore';

export const programsService = {
  async getPrograms(params: UseProgramsParams): Promise<ProgramsApiResponse> {
    const { page, limit } = params;

    const searchParams = new URLSearchParams();
    if (page) searchParams.append('page', page.toString());
    if (limit) searchParams.append('limit', limit.toString());

    const response = await apiClient.get(`/programs?${searchParams}`);
    return response.data;
  },

  async getProgramsAdmin(): Promise<ProgramsApiResponse> {
    const response = await apiClient.get(`/programs/admin/all`);
    return response.data;
  },

  async getProgramFilters(): Promise<ProgramFiltersResponse> {
    const response = await apiClient.get('/programs/filters');
    return response.data;
  },

  async searchPrograms(
    params: ProgramsSearchParams
  ): Promise<ProgramsApiResponse> {
    const { page, limit, q, degrees, programs, fees, duration } = params;

    const sp = new URLSearchParams();

    if (page) sp.append('page', String(page));
    if (limit) sp.append('limit', String(limit));

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

  async createProgram(payload: CreateProgramPayload) {
    const response = await apiClient.post('/programs', payload);
    return response.data;
  },

  async updateProgram({ id, payload }: UpdateProgramParams) {
    const response = await apiClient.put(`/programs/${id}`, payload);
    return response.data;
  },

  async deleteProgram(id: string) {
    const response = await apiClient.delete(`/programs/${id}`);
    return response.data;
  },

  async bulkDeletePrograms(payload: BulkDeleteProgramsPayload) {
    const response = await apiClient.delete('/programs/bulk-delete', {
      data: payload,
    });
    return response.data;
  },
};
