import { create } from 'zustand';
import { RequestItem, BusinessCardRequest, EventsRequest } from '@/types';
import { RequestService } from '@/services/requestService';

interface RequestsState {
  requests: RequestItem[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'processing' | 'completed';
  
  // Temperature request cooldowns
  coldCooldown: number;
  hotCooldown: number;
  
  // Actions
  loadRequests: (filter?: 'all' | 'pending' | 'processing' | 'completed') => Promise<void>;
  createEnvironmentRequest: (data: { image: File | null; note: string }) => Promise<void>;
  createTempRequest: (type: 'cold' | 'hot') => Promise<void>;
  createBusinessCardRequest: (data: BusinessCardRequest) => Promise<void>;
  createParkingRequest: (carNumber: string) => Promise<void>;
  createEventsRequest: (data: EventsRequest) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestItem['status']) => Promise<void>;
  
  setFilter: (filter: 'all' | 'pending' | 'processing' | 'completed') => void;
  updateCooldowns: () => void;
  clearError: () => void;
}

export const useRequestsStore = create<RequestsState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,
  filter: 'all',
  coldCooldown: 0,
  hotCooldown: 0,

  loadRequests: async (filter = 'all') => {
    set({ isLoading: true, error: null });
    try {
      const requests = await RequestService.listRequests(filter);
      set({ requests, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '요청 목록을 불러올 수 없습니다.',
        isLoading: false 
      });
    }
  },

  createEnvironmentRequest: async (data: { image: File | null; note: string }) => {
    set({ isLoading: true, error: null });
    try {
      const request = await RequestService.createEnvironmentRequest(data);
      const currentRequests = get().requests;
      set({ 
        requests: [request, ...currentRequests],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '요청 생성에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createTempRequest: async (type: 'cold' | 'hot') => {
    set({ isLoading: true, error: null });
    try {
      const request = await RequestService.createTempRequest(type);
      const currentRequests = get().requests;
      set({ 
        requests: [request, ...currentRequests],
        isLoading: false 
      });
      get().updateCooldowns();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '온도 조절 요청에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createBusinessCardRequest: async (data: BusinessCardRequest) => {
    set({ isLoading: true, error: null });
    try {
      const request = await RequestService.createBusinessCardRequest(data);
      const currentRequests = get().requests;
      set({ 
        requests: [request, ...currentRequests],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '명함 신청에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createParkingRequest: async (carNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      const request = await RequestService.createParkingRequest(carNumber);
      const currentRequests = get().requests;
      set({ 
        requests: [request, ...currentRequests],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '주차 등록 신청에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  createEventsRequest: async (data: EventsRequest) => {
    set({ isLoading: true, error: null });
    try {
      const request = await RequestService.createEventsRequest(data);
      const currentRequests = get().requests;
      set({ 
        requests: [request, ...currentRequests],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '경조사 지원 신청에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  updateRequestStatus: async (id: string, status: RequestItem['status']) => {
    set({ isLoading: true, error: null });
    try {
      await RequestService.updateRequestStatus(id, status);
      const currentRequests = get().requests;
      const updatedRequests = currentRequests.map(req => 
        req.id === id ? { ...req, status } : req
      );
      set({ 
        requests: updatedRequests,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '상태 업데이트에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  setFilter: (filter: 'all' | 'pending' | 'processing' | 'completed') => {
    set({ filter });
    get().loadRequests(filter);
  },

  updateCooldowns: () => {
    const coldCooldown = RequestService.getTemperatureCooldown('cold');
    const hotCooldown = RequestService.getTemperatureCooldown('hot');
    set({ coldCooldown, hotCooldown });
  },

  clearError: () => set({ error: null })
}));