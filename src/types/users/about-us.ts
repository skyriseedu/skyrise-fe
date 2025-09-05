export interface TeamMember {
  id: number;
  image: string;
  name: string;
  position: string;
  department: string;
  university: string;
  profileLink?: string;
}

export interface TeamGalleryProps {
  members: TeamMember[];
  title?: string;
}

export interface TeamCardProps {
  image: string;
  name: string;
  position: string;
  department: string;
  university: string;
  profileLink?: string;
}

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
