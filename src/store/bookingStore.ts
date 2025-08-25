import { create } from 'zustand';
import { Booking, Desk, MeetingRoom, TimeSlot } from '@/types';
import { BookingService } from '@/services/bookingService';

interface BookingState {
  bookings: Booking[];
  desks: Desk[];
  rooms: MeetingRoom[];
  timeSlots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  
  selectedDate: string;
  selectedLocation: 'pangyo' | 'yeouido';
  selectedType: 'smart-office' | 'meeting-room';
  selectedSeat: number | null;
  selectedRoom: string | null;
  selectedTime: string | null;
  
  // Actions
  loadDesks: (date: string, location: 'pangyo' | 'yeouido') => Promise<void>;
  loadRooms: (location: 'pangyo' | 'yeouido') => Promise<void>;
  loadTimeSlots: (date: string, type: 'smart-office' | 'meeting-room') => Promise<void>;
  loadUserBookings: (userEmail: string) => Promise<void>;
  makeReservation: (booking: Omit<Booking, 'id'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  
  // Setters
  setSelectedDate: (date: string) => void;
  setSelectedLocation: (location: 'pangyo' | 'yeouido') => void;
  setSelectedType: (type: 'smart-office' | 'meeting-room') => void;
  setSelectedSeat: (seat: number | null) => void;
  setSelectedRoom: (room: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  clearSelection: () => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  desks: [],
  rooms: [],
  timeSlots: [],
  isLoading: false,
  error: null,
  
  selectedDate: '',
  selectedLocation: 'pangyo',
  selectedType: 'smart-office',
  selectedSeat: null,
  selectedRoom: null,
  selectedTime: null,

  loadDesks: async (date: string, location: 'pangyo' | 'yeouido') => {
    set({ isLoading: true, error: null });
    try {
      const desks = await BookingService.listDesks(date, location);
      set({ desks, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '좌석 정보를 불러올 수 없습니다.',
        isLoading: false 
      });
    }
  },

  loadRooms: async (location: 'pangyo' | 'yeouido') => {
    set({ isLoading: true, error: null });
    try {
      const rooms = await BookingService.listRooms(location);
      set({ rooms, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '회의실 정보를 불러올 수 없습니다.',
        isLoading: false 
      });
    }
  },

  loadTimeSlots: async (date: string, type: 'smart-office' | 'meeting-room') => {
    set({ isLoading: true, error: null });
    try {
      const timeSlots = await BookingService.listTimeSlots(date, type);
      set({ timeSlots, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '시간 정보를 불러올 수 없습니다.',
        isLoading: false 
      });
    }
  },

  loadUserBookings: async (userEmail: string) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await BookingService.getUserBookings(userEmail);
      set({ bookings, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '예약 정보를 불러올 수 없습니다.',
        isLoading: false 
      });
    }
  },

  makeReservation: async (booking: Omit<Booking, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newBooking = await BookingService.reserve(booking);
      const currentBookings = get().bookings;
      set({ 
        bookings: [...currentBookings, newBooking], 
        isLoading: false 
      });
      
      // Refresh data
      if (booking.type === 'smart-office') {
        await get().loadDesks(booking.date, booking.location);
      } else {
        await get().loadRooms(booking.location);
      }
      await get().loadTimeSlots(booking.date, booking.type);
      
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '예약에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  cancelBooking: async (bookingId: string) => {
    set({ isLoading: true, error: null });
    try {
      await BookingService.cancelBooking(bookingId);
      const currentBookings = get().bookings;
      set({ 
        bookings: currentBookings.filter(b => b.id !== bookingId),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '예약 취소에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  setSelectedDate: (date: string) => set({ selectedDate: date }),
  setSelectedLocation: (location: 'pangyo' | 'yeouido') => set({ selectedLocation: location }),
  setSelectedType: (type: 'smart-office' | 'meeting-room') => set({ selectedType: type }),
  setSelectedSeat: (seat: number | null) => set({ selectedSeat: seat }),
  setSelectedRoom: (room: string | null) => set({ selectedRoom: room }),
  setSelectedTime: (time: string | null) => set({ selectedTime: time }),
  
  clearSelection: () => set({
    selectedSeat: null,
    selectedRoom: null,
    selectedTime: null
  }),
  
  clearError: () => set({ error: null })
}));