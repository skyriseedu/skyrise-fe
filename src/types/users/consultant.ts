export interface Consultant {
  id?: string;
  _id?: string;
  consultantName: string;
  major: string;
  university: string;
  email: string;
  phoneNumber: string;
  facebookAccount?: string;
  profileImage?: string;
  pinned?: boolean;
  pinnedAt?: string | null;
  status?: 'active' | 'inactive';
  order?: number;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  // Legacy fields for backward compatibility
  name?: string;
  title?: string;
  company?: string;
  image?: string;
  specialization?: string[];
  experience?: number;
  rating?: number;
  reviewCount?: number;
  location?: string;
  languages?: string[];
  description?: string;
  price?: {
    amount: number;
    currency: string;
    per: string;
  };
  availability?: string[];
  tags?: string[];
}

export interface ConsultantCardProps {
  consultant: Consultant;
  onViewProfile?: (consultant: Consultant) => void;
  onBookConsultation?: (consultant: Consultant) => void;
  className?: string;
}

export interface consultantCountResponse {
  success: boolean;
  data: { total: number };
}

export interface ConsultantsQueryParams {
  page?: number;
  limit?: number;
}

export interface ConsultantsResponse {
  success: boolean;
  count: number;
  total?: number;
  data: {
    consultants: Consultant[];
  };
}

export interface CreateConsultantPayload {
  consultantName: string;
  major: string;
  university: string;
  email: string;
  phoneNumber: string;
  facebookAccount?: string;
  profileImage?: string;
  pinned?: boolean;
  status?: 'active' | 'inactive';
  order?: number;
}

export interface UpdateConsultantParams {
  id: string;
  payload: Partial<CreateConsultantPayload>;
}

export interface BulkDeleteConsultantsResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: string[];
  };
}

export interface UploadConsultantImageResponse {
  success: boolean;
  data: {
    image: {
      url: string;
      public_id: string;
    };
  };
}
