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
    { id: 'p1', name: '회의실 A', capacity: 6, location: 'pangyo', available: true },
    { id: 'p2', name: '회의실 B', capacity: 8, location: 'pangyo', available: true },
    { id: 'p3', name: '회의실 C', capacity: 4, location: 'pangyo', available: true },
    { id: 'p4', name: '대회의실', capacity: 20, location: 'pangyo', available: true },
    { id: 'p5', name: '화상회의실 1', capacity: 6, location: 'pangyo', available: true },
    { id: 'p6', name: '화상회의실 2', capacity: 8, location: 'pangyo', available: true },
    { id: 'p7', name: '집중근무실 1', capacity: 2, location: 'pangyo', available: true },
    { id: 'p8', name: '집중근무실 2', capacity: 2, location: 'pangyo', available: true },
    { id: 'p9', name: '팀회의실 1', capacity: 4, location: 'pangyo', available: true },
    { id: 'p10', name: '팀회의실 2', capacity: 4, location: 'pangyo', available: true },
    { id: 'p11', name: '팀회의실 3', capacity: 6, location: 'pangyo', available: true },
    { id: 'p12', name: '프로젝트룸 1', capacity: 8, location: 'pangyo', available: true },
    { id: 'p13', name: '프로젝트룸 2', capacity: 8, location: 'pangyo', available: true },
    { id: 'p14', name: '브레인스토밍실', capacity: 10, location: 'pangyo', available: true },
    { id: 'p15', name: '휴게실', capacity: 12, location: 'pangyo', available: true },
    { id: 'p16', name: '면접실 1', capacity: 4, location: 'pangyo', available: true },
    { id: 'p17', name: '면접실 2', capacity: 4, location: 'pangyo', available: true },
    { id: 'p18', name: '교육실', capacity: 16, location: 'pangyo', available: true },
    { id: 'p19', name: '세미나실', capacity: 30, location: 'pangyo', available: true },
    
    // Yeouido rooms
    { id: 'y1', name: '중회의실 A', capacity: 10, location: 'yeouido', available: true },
    { id: 'y2', name: '중회의실 B', capacity: 10, location: 'yeouido', available: true },
    { id: 'y3', name: '소회의실 1', capacity: 4, location: 'yeouido', available: true },
    { id: 'y4', name: '소회의실 2', capacity: 4, location: 'yeouido', available: true },
    { id: 'y5', name: '임원회의실', capacity: 12, location: 'yeouido', available: true },
    { id: 'y6', name: '화상회의실', capacity: 8, location: 'yeouido', available: true },
    { id: 'y7', name: '휴게실', capacity: 8, location: 'yeouido', available: true },
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