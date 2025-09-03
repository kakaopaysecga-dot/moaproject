export type AdminLevel = 'supreme' | 'part' | null;

export interface User {
  email: string;
  password?: string;
  name: string;         // Korean name e.g., "홍길동"
  englishName?: string; // English name e.g., "Hong Gildong"
  dept: string;
  building: '판교오피스' | '여의도오피스';
  workArea?: string;    // Work area within the building
  phone: string;        // "010-1234-5678"
  car: string;          // "11가1111"
  isAdmin: boolean;
  adminLevel: AdminLevel;
}

export type RequestStatus = 'pending' | 'processing' | 'completed';

export interface RequestItem {
  id: string;
  title: string;
  content: string;
  status: RequestStatus;
  createdAt: string;
  type: 'environment' | 'temperature' | 'business-card' | 'parking' | 'events';
  image?: string;
  metadata?: Record<string, any>;
  userInfo?: {
    name: string;
    email: string;
    dept: string;
  };
}

export interface Booking {
  id: string;
  type: 'smart-office' | 'meeting-room';
  location: 'pangyo' | 'yeouido';
  seatNumber?: number;
  roomName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  userEmail: string;
  userName: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Desk {
  id: number;
  available: boolean;
  location: 'pangyo' | 'yeouido';
}

export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  location: 'pangyo' | 'yeouido';
  available: boolean;
}

export interface BusinessCardRequest {
  englishName: string;
  koreanName: string;
  dept: string;
  position?: string;
  certification?: string;
  phone: string;
  email: string;
  building: '판교오피스' | '여의도오피스';
  style: 'character' | 'normal';
}

export interface EventsRequest {
  type: 'marriage' | 'funeral';
  // Marriage fields
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  memo?: string;
  // Funeral fields
  relationship?: string;
  deceasedName?: string;
  deathDate?: string;
  funeralDate?: string;
  funeralHall?: string;
  funeralAddress?: string;
  contact?: string;
}

export interface TemperatureRequest {
  type: 'cold' | 'hot';
  requestedAt: string;
  cooldownUntil: string;
}