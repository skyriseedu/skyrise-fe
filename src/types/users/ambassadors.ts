export interface AmbassadorApiItem {
  _id: string;
  ambassadorName: string;
  major: string;
  university: string;
  profileImage: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  slug: string;
  id: string;
}

export interface AmbassadorResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: {
    ambassadors: AmbassadorApiItem[];
  };
}

export interface AmbassadorQueryParams {
  page?: number;
  limit?: number;
}
