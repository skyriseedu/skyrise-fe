export interface University {
  id: string;
  name: string;
  location: string;
  country: string;
  image: string;
  ranking?: number;
  description: string;
  programs: string[];
  tuitionFee: {
    min: number;
    max: number;
    currency: string;
  };
  acceptanceRate?: number;
  establishedYear: number;
  website?: string;
  tags?: string[];
}

export interface UniversityCardProps {
  university: University;
  onViewDetails?: (university: University) => void;
  onApply?: (university: University) => void;
  className?: string;
}
