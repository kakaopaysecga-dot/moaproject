import { create } from 'zustand';
import { RequestItem, BusinessCardRequest, EventsRequest } from '@/types';
import { RequestService } from '@/services/requestService';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

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
  updateCooldowns: () => Promise<void>;
  clearError: () => void;
  
  // Realtime
  initRealtime: () => void;
  cleanup: () => void;
  
  // Computed getters
  getPendingCount: () => number;
}

export const useRequestsStore = create<RequestsState>((set, get) => ({
  requests: [],
  isLoading: false,
  error: null,
  filter: 'all',
  coldCooldown: 0,
  hotCooldown: 0,

  loadRequests: async (filter = 'all') => {
    console.log('🔍 Loading requests with filter:', filter);
    set({ isLoading: true, error: null });
    try {
      const requests = await RequestService.listRequests(filter);
      console.log('📋 Loaded requests:', requests.length, 'items');
      set({ requests, isLoading: false });
    } catch (error) {
      console.error('❌ Error loading requests:', error);
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
      
      // 즉시 쿨다운 설정 (60분 = 3600초)
      if (type === 'cold') {
        set({ coldCooldown: 60 });
      } else {
        set({ hotCooldown: 60 });
      }
      
      set({ 
        requests: [request, ...currentRequests],
        isLoading: false 
      });
      
      // 실제 쿨다운 데이터 업데이트
      setTimeout(() => {
        get().updateCooldowns();
      }, 100);
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

  updateCooldowns: async () => {
    const coldCooldown = await RequestService.getTemperatureCooldownAsync('cold');
    const hotCooldown = await RequestService.getTemperatureCooldownAsync('hot');
    set({ coldCooldown, hotCooldown });
  },

  clearError: () => set({ error: null }),

  initRealtime: () => {
    console.log('🔄 Initializing realtime connection for requests...');
    
    const channel = supabase
      .channel('requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'requests'
        },
        (payload) => {
          console.log('🔥 New request inserted:', payload);
          const newRequest = payload.new as any;
          const currentRequests = get().requests;
          
          // 현재 사용자의 요청인지 확인
          supabase.auth.getUser().then(({ data: { user } }) => {
            console.log('👤 Current user:', user?.id, 'Request user:', newRequest.user_id);
            
            if (newRequest.user_id === user?.id) {
              const mappedRequest: RequestItem = {
                id: newRequest.id,
                title: newRequest.title,
                content: newRequest.description || '',
                status: newRequest.status,
                createdAt: newRequest.created_at,
                type: newRequest.type
              };
              
              console.log('✅ Adding new request to store:', mappedRequest);
              
              // 중복 방지: 이미 존재하는 요청인지 확인
              const exists = currentRequests.some(req => req.id === mappedRequest.id);
              if (!exists) {
                set({ requests: [mappedRequest, ...currentRequests] });
                console.log('🚀 Request added to store successfully');
              } else {
                console.log('⚠️ Request already exists in store');
              }
            } else {
              console.log('❌ Request is not for current user, ignoring');
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requests'
        },
        (payload) => {
          console.log('🔄 Request updated:', payload);
          const updatedRequest = payload.new as any;
          const currentRequests = get().requests;
          
          const updatedRequests = currentRequests.map(req => 
            req.id === updatedRequest.id 
              ? { ...req, status: updatedRequest.status }
              : req
          );
          set({ requests: updatedRequests });
          console.log('✅ Request status updated in store');
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });
      
    // Store channel reference for cleanup
    (get() as any).realtimeChannel = channel;
    console.log('🎯 Realtime channel initialized');
  },

  cleanup: () => {
    console.log('🧹 Cleaning up realtime connection...');
    const channel = (get() as any).realtimeChannel;
    if (channel) {
      supabase.removeChannel(channel);
      console.log('✅ Realtime channel removed');
    }
  },

  getPendingCount: () => {
    return get().requests.filter(req => req.status === 'pending').length;
  }
}));