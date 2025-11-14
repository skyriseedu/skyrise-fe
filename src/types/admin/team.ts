export interface AdminTeamMemberRow {
  id: string;
  consultantName: string;
  addedDate: string;
  rolePosition: string;
  major: string;
  university: string;
  socialLink: string;
  pinned?: boolean;
}

export type ConsultantAvailability = 'Weekdays' | 'Weekends' | 'Flexible';
export type ConsultantStatus = 'Active' | 'Onboarding' | 'Inactive';

export interface AdminConsultantRow {
  id: string;
  consultantName: string;
  university: string;
  expertise: string;
  languages: string;
  availability: ConsultantAvailability;
  status: ConsultantStatus;
  lastActive: string;
}
