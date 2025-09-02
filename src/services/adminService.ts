import { supabase } from '@/integrations/supabase/client';
import { RequestItem } from '@/types';

export class AdminService {
  static async isUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    return userRole?.role === 'admin';
  }

  static async getAllRequests(filter?: 'all' | 'pending' | 'processing' | 'completed'): Promise<RequestItem[]> {
    // Check admin permissions first
    const isAdmin = await this.isUserAdmin();
    if (!isAdmin) {
      throw new Error('관리자 권한이 필요합니다.');
    }

    let query = supabase
      .from('requests')
      .select(`
        *,
        profiles!requests_user_id_fkey(name, email, dept)
      `)
      .order('created_at', { ascending: false });

    if (filter && filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data: requestsData, error } = await query;

    if (error) {
      throw new Error('요청 목록을 불러올 수 없습니다.');
    }

    return requestsData?.map(dbRequest => ({
      id: dbRequest.id,
      title: dbRequest.title,
      content: dbRequest.description || '',
      status: dbRequest.status,
      createdAt: dbRequest.created_at,
      type: dbRequest.type,
      metadata: dbRequest.metadata || {},
      image: dbRequest.image_url,
      userInfo: dbRequest.profiles ? {
        name: dbRequest.profiles.name,
        email: dbRequest.profiles.email,
        dept: dbRequest.profiles.dept
      } : undefined
    })) || [];
  }

  static async updateRequestStatus(requestId: string, status: string): Promise<void> {
    // Check admin permissions first
    const isAdmin = await this.isUserAdmin();
    if (!isAdmin) {
      throw new Error('관리자 권한이 필요합니다.');
    }

    const { error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      throw new Error('상태 업데이트에 실패했습니다.');
    }
  }

  static async makeUserAdmin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin'
      });

    if (error) {
      throw new Error('관리자 권한 부여에 실패했습니다.');
    }
  }
}