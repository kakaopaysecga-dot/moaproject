import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';

export const formatDate = (date: Date | string, pattern = 'yyyy-MM-dd'): string => {
  return format(new Date(date), pattern);
};

export const today = (): string => {
  return formatDate(new Date());
};

export const addDaysToDate = (date: Date | string, days: number): string => {
  return formatDate(addDays(new Date(date), days));
};

export const isDateInRange = (date: string, minDate: string, maxDate: string): boolean => {
  const checkDate = new Date(date);
  const min = new Date(minDate);
  const max = new Date(maxDate);
  
  return !isBefore(checkDate, startOfDay(min)) && !isAfter(checkDate, startOfDay(max));
};

export const getSmartOfficeMaxDate = (): string => {
  return addDaysToDate(new Date(), 3);
};

export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  const startHour = 9;
  const endHour = 18;
  const endMinute = 30;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === endHour && minute > endMinute) break;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  
  return slots;
};

export const formatDateTime = (date: string, time: string): string => {
  return `${date} ${time}`;
};

export const isWithinCooldown = (requestedAt: string, cooldownHours = 1): boolean => {
  const now = new Date();
  const requestTime = new Date(requestedAt);
  const cooldownTime = new Date(requestTime.getTime() + cooldownHours * 60 * 60 * 1000);
  
  return now < cooldownTime;
};

export const getCooldownRemaining = (requestedAt: string, cooldownHours = 1): number => {
  const now = new Date();
  const requestTime = new Date(requestedAt);
  const cooldownTime = new Date(requestTime.getTime() + cooldownHours * 60 * 60 * 1000);
  
  if (now >= cooldownTime) return 0;
  
  return Math.ceil((cooldownTime.getTime() - now.getTime()) / (1000 * 60));
};

export const getCooldownRemainingHours = (requestedAt: string, cooldownHours = 1): number => {
  const now = new Date();
  const requestTime = new Date(requestedAt);
  const cooldownTime = new Date(requestTime.getTime() + cooldownHours * 60 * 60 * 1000);
  
  if (now >= cooldownTime) return 0;
  
  return Math.ceil((cooldownTime.getTime() - now.getTime()) / (1000 * 60 * 60));
};