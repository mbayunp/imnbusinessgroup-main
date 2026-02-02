export interface Career {
  id: number;
  title: string;
  description: string;
  gFormLink: string;
  imageUrl?: string;
  postedDate: string;
  createdBy?: number;
}

export interface CareerPayload {
  title: string;
  description: string;
  gFormLink: string;
  imageUrl?: string; 
}
