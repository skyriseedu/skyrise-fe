export interface TeamMember {
  _id?: string;
  consultantName?: string;
  major?: string;
  university?: string;
  email?: string;
  phoneNumber?: string;
  facebookAccount?: string;
  profileImage?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

export interface ConsultantsApiResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: {
    consultants: TeamMember[];
  };
}
export interface TeamGalleryProps {
  members: TeamMember[];
  title?: string;
}

export type TeamCardProps = TeamMember;

// Ambassador types
export interface Ambassador {
  id: number;
  image: string;
  name: string;
  department: string;
  university: string;
}

export interface AmbassadorCardProps {
  image: string;
  name: string;
  department: string;
  university: string;
  className?: string;
}

export interface AmbassadorSectionProps {
  title?: string;
  className?: string;
}
