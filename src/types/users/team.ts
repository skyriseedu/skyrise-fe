export interface TeamMemberSocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

export interface TeamMemberApiItem {
  _id: string;
  memberName: string;
  role: string;
  major: string;
  university: string;
  profilePicture: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  socialMediaLinks: TeamMemberSocialLinks;
  socialMediaCount: number;
  id: string;
}

export interface BulkDeleteTeamMembersResponse {
  success: boolean;
  message: string;
  deletedCount?: number;
}

export interface TeamMembersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: {
    teamMembers: TeamMemberApiItem[];
  };
}

export interface TeamMembersQueryParams {
  page?: number;
  limit?: number;
}
