import { RequestItem, TemperatureRequest, BusinessCardRequest, EventsRequest } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { isWithinCooldown, getCooldownRemaining } from '@/lib/date';

export class RequestService {
  static async createEnvironmentRequest(data: { image: File | null; note: string }): Promise<RequestItem> {
    console.log('Creating environment request:', data);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    if (!user) throw new Error('로그인이 필요합니다.');

    let imageUrl = null;
    if (data.image) {
      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll store a placeholder
      imageUrl = URL.createObjectURL(data.image);
    }

    const requestData = {
      user_id: user.id,
      type: 'environment',
      title: '사무환경 개선 요청',
      description: data.note,
      status: 'pending',
      metadata: { 
        note: data.note,
        hasImage: !!data.image
      },
      image_url: imageUrl
    };
    
    console.log('Request data to insert:', requestData);

    const { data: request, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    console.log('Insert result:', { request, error });

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`요청 생성에 실패했습니다: ${error.message}`);
    }

    const mappedRequest = this.mapRequestFromDB(request);
    console.log('Mapped request:', mappedRequest);
    return mappedRequest;
  }

  static async createTempRequest(type: 'cold' | 'hot'): Promise<RequestItem> {
    console.log('Creating temperature request:', type);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    if (!user) throw new Error('로그인이 필요합니다.');

    // Check for recent temperature requests to enforce 60-minute cooldown
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentRequests } = await supabase
      .from('requests')
      .select('created_at, metadata')
      .eq('user_id', user.id)
      .eq('type', 'temperature')
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: false });

    if (recentRequests && recentRequests.length > 0) {
      const lastRequest = recentRequests.find(req => 
        req.metadata && (req.metadata as any).temperatureType === type
      );
      
      if (lastRequest && isWithinCooldown(lastRequest.created_at)) {
        const remainingMinutes = getCooldownRemaining(lastRequest.created_at);
        throw new Error(`${remainingMinutes}분 후에 다시 요청할 수 있습니다.`);
      }
    }

    const requestData = {
      user_id: user.id,
      type: 'temperature',
      title: `실내 온도 조절 요청 (${type === 'cold' ? '추위' : '더위'})`,
      description: type === 'cold' ? '너무 추워요, 온도를 높여주세요.' : '너무 더워요, 온도를 낮춰주세요.',
      status: 'pending',
      metadata: { temperatureType: type }
    };
    
    console.log('Temperature request data to insert:', requestData);

    const { data: request, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    console.log('Temperature insert result:', { request, error });

    if (error) {
      console.error('Temperature database insert error:', error);
      throw new Error(`온도 조절 요청에 실패했습니다: ${error.message}`);
    }

    const mappedRequest = this.mapRequestFromDB(request);
    console.log('Mapped temperature request:', mappedRequest);
    return mappedRequest;
  }

  static async createBusinessCardRequest(data: BusinessCardRequest): Promise<RequestItem> {
    console.log('Creating business card request:', data);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    if (!user) throw new Error('로그인이 필요합니다.');

    const requestData = {
      user_id: user.id,
      type: 'business-card',
      title: '명함 신청',
      description: `${data.koreanName} (${data.englishName}) ${data.position ? `· ${data.position}` : ''} 명함 신청`,
      status: 'pending',
      metadata: data
    };
    
    console.log('Business card request data to insert:', requestData);

    const { data: request, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    console.log('Business card insert result:', { request, error });

    if (error) {
      console.error('Business card database insert error:', error);
      throw new Error(`명함 신청에 실패했습니다: ${error.message}`);
    }

    const mappedRequest = this.mapRequestFromDB(request);
    console.log('Mapped business card request:', mappedRequest);
    return mappedRequest;
  }

  static async createParkingRequest(carNumber: string, location?: string): Promise<RequestItem> {
    console.log('Creating parking request:', carNumber);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    if (!user) throw new Error('로그인이 필요합니다.');

    const requestData = {
      user_id: user.id,
      type: 'parking',
      title: '주차 등록 신청',
      description: `차량번호: ${carNumber}${location ? `, 희망위치: ${location}` : ''}`,
      status: 'pending',
      metadata: { 
        carNumber,
        location: location || '',
        requestType: 'daily'
      }
    };
    
    console.log('Parking request data to insert:', requestData);

    const { data: request, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    console.log('Parking insert result:', { request, error });

    if (error) {
      console.error('Parking database insert error:', error);
      throw new Error(`주차 등록 신청에 실패했습니다: ${error.message}`);
    }

    const mappedRequest = this.mapRequestFromDB(request);
    console.log('Mapped parking request:', mappedRequest);
    return mappedRequest;
  }

  static async createEventsRequest(data: EventsRequest): Promise<RequestItem> {
    console.log('Creating events request:', data);
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    if (!user) throw new Error('로그인이 필요합니다.');

    const title = data.type === 'marriage' ? '결혼 축하 지원' : '장례 조의 지원';
    const description = data.type === 'marriage' 
      ? `${data.date} ${data.time} ${data.venue}`
      : `고인: ${data.deceasedName}, 관계: ${data.relationship}`;

    const requestData = {
      user_id: user.id,
      type: 'events',
      title,
      description,
      status: 'pending',
      metadata: data
    };
    
    console.log('Events request data to insert:', requestData);

    const { data: request, error } = await supabase
      .from('requests')
      .insert(requestData)
      .select()
      .single();

    console.log('Events insert result:', { request, error });

    if (error) {
      console.error('Events database insert error:', error);
      throw new Error(`경조사 지원 신청에 실패했습니다: ${error.message}`);
    }

    const mappedRequest = this.mapRequestFromDB(request);
    console.log('Mapped events request:', mappedRequest);
    return mappedRequest;
  }

  static async listRequests(filter?: 'all' | 'pending' | 'processing' | 'completed'): Promise<RequestItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('로그인이 필요합니다.');

    let query = supabase
      .from('requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filter && filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data: requests, error } = await query;

    if (error) throw new Error('요청 목록을 불러올 수 없습니다.');

    return requests?.map(this.mapRequestFromDB) || [];
  }

  static async updateRequestStatus(id: string, status: RequestItem['status']): Promise<void> {
    const { error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error('상태 업데이트에 실패했습니다.');
  }

  static getTemperatureCooldown(type: 'cold' | 'hot'): number {
    // For backward compatibility, return 0
    // The async version will be called directly when needed
    return 0;
  }

  static async getTemperatureCooldownAsync(type: 'cold' | 'hot'): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentRequests } = await supabase
      .from('requests')
      .select('created_at, metadata')
      .eq('user_id', user.id)
      .eq('type', 'temperature')
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: false });

    if (!recentRequests || recentRequests.length === 0) return 0;

    const lastRequest = recentRequests.find(req => 
      req.metadata && (req.metadata as any).temperatureType === type
    );

    if (!lastRequest || !isWithinCooldown(lastRequest.created_at)) {
      return 0;
    }

    return getCooldownRemaining(lastRequest.created_at);
  }

  private static mapRequestFromDB(dbRequest: any): RequestItem {
    return {
      id: dbRequest.id,
      title: dbRequest.title,
      content: dbRequest.description || '',
      status: dbRequest.status,
      createdAt: dbRequest.created_at,
      type: dbRequest.type,
      metadata: dbRequest.metadata || {},
      image: dbRequest.image_url
    };
  }
}