export interface UniversityLogoSize {
  width: number | null;
  height: number | null;
}

export interface UniversityLogoMetadata {
  uploadDate: string;
  lastModified: string;
  fileSize: number | null;
}

export interface UniversityLogoUniversityRef {
  _id: string;
  universityName: string;
  status: 'published' | 'draft' | 'archived';
  slug: string;
  id: string;
}

export interface UniversityLogo {
  _id: string;
  id: string;
  universityId: UniversityLogoUniversityRef;
  universityName: string;
  logoUrl: string;
  logoFormat: string;
  logoSize: UniversityLogoSize;
  metadata: UniversityLogoMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface GetUniversityLogosResponse {
  success: boolean;
  count: number;
  data: {
    logos: UniversityLogo[];
  };
}
