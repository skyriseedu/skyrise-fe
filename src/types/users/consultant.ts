export interface Consultant {
  id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  location: string;
  languages: string[];
  description: string;
  price: {
    amount: number;
    currency: string;
    per: string; // 'hour', 'session', 'month'
  };
  availability: string[];
  tags?: string[];
}

export interface ConsultantCardProps {
  consultant: Consultant;
  onViewProfile?: (consultant: Consultant) => void;
  onBookConsultation?: (consultant: Consultant) => void;
  className?: string;
}
