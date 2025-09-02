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