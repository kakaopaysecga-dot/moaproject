import { RequestItem, TemperatureRequest, BusinessCardRequest, EventsRequest } from '@/types';
import { StorageService, STORAGE_KEYS } from './storage';
import { isWithinCooldown, getCooldownRemaining } from '@/lib/date';

export class RequestService {
  static async createEnvironmentRequest(data: { image: File | null; note: string }): Promise<RequestItem> {
    const request: RequestItem = {
      id: Date.now().toString(),
      title: '사무환경 개선 요청',
      content: data.note,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'environment',
      image: data.image ? URL.createObjectURL(data.image) : undefined,
      metadata: { 
        note: data.note,
        hasImage: !!data.image
      }
    };

    const existingRequests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    existingRequests.push(request);
    StorageService.set(STORAGE_KEYS.REQUESTS, existingRequests);

    return request;
  }

  static async createTempRequest(type: 'cold' | 'hot'): Promise<RequestItem> {
    // Check cooldown
    const tempRequests = StorageService.get<TemperatureRequest[]>(STORAGE_KEYS.TEMPERATURE_REQUESTS) || [];
    const lastRequest = tempRequests
      .filter(req => req.type === type)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];

    if (lastRequest && isWithinCooldown(lastRequest.requestedAt)) {
      const remainingMinutes = getCooldownRemaining(lastRequest.requestedAt);
      throw new Error(`${remainingMinutes}분 후에 다시 요청할 수 있습니다.`);
    }

    const now = new Date().toISOString();
    const tempRequest: TemperatureRequest = {
      type,
      requestedAt: now,
      cooldownUntil: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour cooldown
    };

    tempRequests.push(tempRequest);
    StorageService.set(STORAGE_KEYS.TEMPERATURE_REQUESTS, tempRequests);

    const request: RequestItem = {
      id: Date.now().toString(),
      title: `실내 온도 조절 요청 (${type === 'cold' ? '추위' : '더위'})`,
      content: type === 'cold' ? '너무 추워요, 온도를 높여주세요.' : '너무 더워요, 온도를 낮춰주세요.',
      status: 'pending',
      createdAt: now,
      type: 'temperature',
      metadata: { temperatureType: type }
    };

    const existingRequests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    existingRequests.push(request);
    StorageService.set(STORAGE_KEYS.REQUESTS, existingRequests);

    return request;
  }

  static async createBusinessCardRequest(data: BusinessCardRequest): Promise<RequestItem> {
    const request: RequestItem = {
      id: Date.now().toString(),
      title: '명함 신청',
      content: `${data.name} (${data.position}) 명함 신청`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'business-card',
      metadata: data
    };

    const existingRequests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    existingRequests.push(request);
    StorageService.set(STORAGE_KEYS.REQUESTS, existingRequests);

    return request;
  }

  static async createParkingRequest(carNumber: string): Promise<RequestItem> {
    const request: RequestItem = {
      id: Date.now().toString(),
      title: '주차 등록 신청',
      content: `차량번호: ${carNumber}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'parking',
      metadata: { carNumber }
    };

    const existingRequests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    existingRequests.push(request);
    StorageService.set(STORAGE_KEYS.REQUESTS, existingRequests);

    return request;
  }

  static async createEventsRequest(data: EventsRequest): Promise<RequestItem> {
    const title = data.type === 'marriage' ? '결혼 축하 지원' : '장례 조의 지원';
    const content = data.type === 'marriage' 
      ? `${data.date} ${data.time} ${data.venue}`
      : `고인: ${data.deceasedName}, 관계: ${data.relationship}`;

    const request: RequestItem = {
      id: Date.now().toString(),
      title,
      content,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'events',
      metadata: data
    };

    const existingRequests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    existingRequests.push(request);
    StorageService.set(STORAGE_KEYS.REQUESTS, existingRequests);

    return request;
  }

  static async listRequests(filter?: 'all' | 'pending' | 'processing' | 'completed'): Promise<RequestItem[]> {
    const requests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    
    if (!filter || filter === 'all') {
      return requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return requests
      .filter(request => request.status === filter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async updateRequestStatus(id: string, status: RequestItem['status']): Promise<void> {
    const requests = StorageService.get<RequestItem[]>(STORAGE_KEYS.REQUESTS) || [];
    const requestIndex = requests.findIndex(req => req.id === id);
    
    if (requestIndex !== -1) {
      requests[requestIndex].status = status;
      StorageService.set(STORAGE_KEYS.REQUESTS, requests);
    }
  }

  static getTemperatureCooldown(type: 'cold' | 'hot'): number {
    const tempRequests = StorageService.get<TemperatureRequest[]>(STORAGE_KEYS.TEMPERATURE_REQUESTS) || [];
    const lastRequest = tempRequests
      .filter(req => req.type === type)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0];

    if (!lastRequest || !isWithinCooldown(lastRequest.requestedAt)) {
      return 0;
    }

    return getCooldownRemaining(lastRequest.requestedAt);
  }
}