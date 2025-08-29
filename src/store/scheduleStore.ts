import { create } from 'zustand';

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'reminder' | 'personal';
  location?: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface ScheduleState {
  todaySchedule: ScheduleItem[];
  setTodaySchedule: (schedule: ScheduleItem[]) => void;
  addScheduleItem: (item: ScheduleItem) => void;
  toggleScheduleItem: (id: string) => void;
  removeScheduleItem: (id: string) => void;
}

// 샘플 데이터
const sampleSchedule: ScheduleItem[] = [
  {
    id: '1',
    title: '팀 회의',
    time: '09:00',
    type: 'meeting',
    location: '회의실 A',
    priority: 'high'
  },
  {
    id: '2', 
    title: '프로젝트 검토',
    time: '11:00',
    type: 'task',
    priority: 'medium'
  },
  {
    id: '3',
    title: '점심 약속',
    time: '12:30',
    type: 'personal',
    location: '강남역',
    priority: 'low'
  },
  {
    id: '4',
    title: '보고서 제출',
    time: '16:00',
    type: 'task',
    priority: 'high'
  },
  {
    id: '5',
    title: '운동',
    time: '19:00',
    type: 'personal',
    priority: 'low'
  }
];

export const useScheduleStore = create<ScheduleState>((set) => ({
  todaySchedule: sampleSchedule,
  setTodaySchedule: (schedule) => set({ todaySchedule: schedule }),
  addScheduleItem: (item) => set((state) => ({ 
    todaySchedule: [...state.todaySchedule, item] 
  })),
  toggleScheduleItem: (id) => set((state) => ({
    todaySchedule: state.todaySchedule.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    )
  })),
  removeScheduleItem: (id) => set((state) => ({
    todaySchedule: state.todaySchedule.filter(item => item.id !== id)
  }))
}));