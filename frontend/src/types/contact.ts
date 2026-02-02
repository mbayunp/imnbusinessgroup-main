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
  name: string;      // Backend mengirim 'name', bukan firstName/lastName
  email: string;
  subject: string;
  message: string;
  status: string;    // 'read' atau 'unread'
  createdAt: string;
  phone?: string;    // Opsional
  
  // Property tambahan untuk UI (opsional)
  read?: boolean; 
}

export interface ContactMessageResponse {
  message: string;
  data?: ContactMessage;
}
