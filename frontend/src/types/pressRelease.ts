export interface PressRelease {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  postedDate: string;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PressReleasePayload {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface PressReleaseStats {
  totalPressReleases: number;
}