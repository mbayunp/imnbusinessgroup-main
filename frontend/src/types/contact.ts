export interface ContactMessagePayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  phone?: string;
    read?: boolean; 
}

export interface ContactMessageResponse {
  message: string;
  data?: ContactMessage;
}
