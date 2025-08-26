import { Booking, Desk, MeetingRoom, TimeSlot } from '@/types';
import { StorageService, STORAGE_KEYS } from './storage';
import { generateTimeSlots, today, isDateInRange, getSmartOfficeMaxDate } from '@/lib/date';

export class BookingService {
  private static bookedTimeSlots = new Set([
    '10:00', '10:30', '14:00', '14:30', '16:00'
  ]);

  private static bookedDesks = new Set([1, 3, 5, 8]);

  private static meetingRooms: MeetingRoom[] = [
    // Pangyo rooms
    { id: 'pg1', name: 'Santorini_산토리니_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg2', name: 'Da Nang_다낭_2인', capacity: 2, location: 'pangyo', available: true },
    { id: 'pg3', name: 'Guam_괌_4인', capacity: 4, location: 'pangyo', available: true },
    { id: 'pg4', name: 'Mauritius_모리셔스_20인', capacity: 20, location: 'pangyo', available: true },
    { id: 'pg5', name: 'Hawaii_하와이_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg6', name: 'Bali_발리_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg7', name: 'Cancun_칸쿤_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg8', name: 'Ibiza_이비자_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg9', name: 'Saipan_사이판_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg10', name: 'Jeju_제주_12인', capacity: 12, location: 'pangyo', available: true },
    { id: 'pg11', name: 'Tahiti_타히티_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg12', name: 'Malta_몰타_6인', capacity: 6, location: 'pangyo', available: true },
    { id: 'pg13', name: 'Maldives_몰디브_8인', capacity: 8, location: 'pangyo', available: true },
    { id: 'pg14', name: 'Majorca_마요르카_4인', capacity: 4, location: 'pangyo', available: true },
    { id: 'pg15', name: 'Palau_팔라우_5인', capacity: 5, location: 'pangyo', available: true },
    { id: 'pg16', name: 'Okinawa_오키나와_12인', capacity: 12, location: 'pangyo', available: true },
    { id: 'pg17', name: 'Nice_니스_20인(최대30인)', capacity: 30, location: 'pangyo', available: true },
    { id: 'pg18', name: 'Bohol_보홀_8인', capacity: 8, location: 'pangyo', available: true },
    
    // Yeouido rooms
    { id: 'yd1', name: 'Phuket_푸켓_6인', capacity: 6, location: 'yeouido', available: true },
    { id: 'yd2', name: 'Capri_카프리_6인', capacity: 6, location: 'yeouido', available: true },
    { id: 'yd3', name: 'Positano_포지타노_6인', capacity: 6, location: 'yeouido', available: true },
    { id: 'yd4', name: 'Sicilia_시칠리아_6인', capacity: 6, location: 'yeouido', available: true },
    { id: 'yd5', name: 'Boracay_보라카이_15인', capacity: 15, location: 'yeouido', available: true },
    { id: 'yd6', name: 'Fiji_피지_4인', capacity: 4, location: 'yeouido', available: true },
    { id: 'yd7', name: 'Cebu_세부_4인', capacity: 4, location: 'yeouido', available: true },
  ];

  static async listDesks(date: string, location: 'pangyo' | 'yeouido'): Promise<Desk[]> {
    const desks: Desk[] = [];
    const totalDesks = 10;
    
    for (let i = 1; i <= totalDesks; i++) {
      desks.push({
        id: i,
        available: !this.bookedDesks.has(i),
        location
      });
    }

    return desks;
  }

  static async listRooms(location: 'pangyo' | 'yeouido'): Promise<MeetingRoom[]> {
    return this.meetingRooms.filter(room => room.location === location);
  }

  static async listTimeSlots(date: string, type: 'smart-office' | 'meeting-room'): Promise<TimeSlot[]> {
    const timeSlots = generateTimeSlots();
    
    return timeSlots.map(time => ({
      time,
      available: !this.bookedTimeSlots.has(time)
    }));
  }

  static async reserve(booking: Omit<Booking, 'id'>): Promise<Booking> {
    // Validate date range for smart office
    if (booking.type === 'smart-office') {
      const maxDate = getSmartOfficeMaxDate();
      if (!isDateInRange(booking.date, today(), maxDate)) {
        throw new Error('스마트오피스는 오늘부터 3일 이내만 예약 가능합니다.');
      }
    }

    // Check if slot is available
    const timeSlots = await this.listTimeSlots(booking.date, booking.type);
    const selectedSlot = timeSlots.find(slot => slot.time === booking.time);
    
    if (!selectedSlot || !selectedSlot.available) {
      throw new Error('선택한 시간대는 이미 예약되었습니다.');
    }

    // Create booking
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString()
    };

    // Save to storage
    const existingBookings = StorageService.get<Booking[]>(STORAGE_KEYS.BOOKINGS) || [];
    existingBookings.push(newBooking);
    StorageService.set(STORAGE_KEYS.BOOKINGS, existingBookings);

    // Mark slot as booked
    this.bookedTimeSlots.add(booking.time);
    if (booking.type === 'smart-office' && booking.seatNumber) {
      this.bookedDesks.add(booking.seatNumber);
    }

    return newBooking;
  }

  static async getUserBookings(userEmail: string): Promise<Booking[]> {
    const allBookings = StorageService.get<Booking[]>(STORAGE_KEYS.BOOKINGS) || [];
    return allBookings.filter(booking => booking.userEmail === userEmail);
  }

  static async getAllBookings(): Promise<Booking[]> {
    return StorageService.get<Booking[]>(STORAGE_KEYS.BOOKINGS) || [];
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    const allBookings = StorageService.get<Booking[]>(STORAGE_KEYS.BOOKINGS) || [];
    const booking = allBookings.find(b => b.id === bookingId);
    
    if (booking) {
      // Remove from booked sets
      this.bookedTimeSlots.delete(booking.time);
      if (booking.type === 'smart-office' && booking.seatNumber) {
        this.bookedDesks.delete(booking.seatNumber);
      }
      
      // Remove from storage
      const updatedBookings = allBookings.filter(b => b.id !== bookingId);
      StorageService.set(STORAGE_KEYS.BOOKINGS, updatedBookings);
    }
  }
}