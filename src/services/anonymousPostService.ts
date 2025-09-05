import { supabase } from '@/integrations/supabase/client';

export interface AnonymousPost {
  id: string;
  title: string;
  content: string;
  author_nickname: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface AnonymousComment {
  id: string;
  post_id: string;
  content: string;
  author_nickname: string;
  created_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  author_nickname?: string;
  password: string;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
  author_nickname?: string;
  password: string;
}

class AnonymousPostService {
  async getPosts(sortBy: 'latest' | 'popular' | 'views' = 'latest'): Promise<AnonymousPost[]> {
    let query = supabase
      .from('anonymous_posts')
      .select('id, title, content, author_nickname, view_count, like_count, comment_count, created_at, updated_at, is_deleted')
      .eq('is_deleted', false);

    switch (sortBy) {
      case 'popular':
        query = query.order('like_count', { ascending: false });
        break;
      case 'views':
        query = query.order('view_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`게시글을 불러올 수 없습니다: ${error.message}`);
    }

    return data || [];
  }

  async getPost(id: string): Promise<AnonymousPost | null> {
    const { data, error } = await supabase
      .from('anonymous_posts')
      .select('id, title, content, author_nickname, view_count, like_count, comment_count, created_at, updated_at, is_deleted')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Post not found
      }
      throw new Error(`게시글을 불러올 수 없습니다: ${error.message}`);
    }

    // Increment view count
    await this.incrementViewCount(id);

    return data;
  }

  async createPost(postData: CreatePostData): Promise<string> {
    const { data, error } = await supabase.rpc('create_anonymous_post', {
      post_title: postData.title,
      post_content: postData.content,
      author_nickname: postData.author_nickname || '익명',
      password_plain: postData.password,
    });

    if (error) {
      throw new Error(`게시글 작성에 실패했습니다: ${error.message}`);
    }

    return data;
  }

  async incrementViewCount(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', { post_id: postId });

    if (error) {
      console.error('조회수 증가 실패:', error);
    }
  }

  async incrementLikeCount(postId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_like_count', { post_id: postId });

    if (error) {
      throw new Error(`좋아요 처리에 실패했습니다: ${error.message}`);
    }
  }

  async getComments(postId: string): Promise<AnonymousComment[]> {
    const { data, error } = await supabase
      .from('anonymous_comments')
      .select('id, post_id, content, author_nickname, created_at, is_deleted')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`댓글을 불러올 수 없습니다: ${error.message}`);
    }

    return data || [];
  }

  async createComment(commentData: CreateCommentData): Promise<string> {
    const { data, error } = await supabase.rpc('create_anonymous_comment', {
      post_id_param: commentData.post_id,
      comment_content: commentData.content,
      author_nickname: commentData.author_nickname || '익명',
      password_plain: commentData.password,
    });

    if (error) {
      throw new Error(`댓글 작성에 실패했습니다: ${error.message}`);
    }

    return data;
  }

  async deletePost(postId: string, password: string): Promise<void> {
    const { data, error } = await supabase.rpc('delete_anonymous_post', {
      post_id_param: postId,
      password_plain: password,
    });

    if (error) {
      throw new Error(`게시글 삭제에 실패했습니다: ${error.message}`);
    }

    if (!data) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
  }

  async deleteComment(commentId: string, password: string): Promise<void> {
    const { data, error } = await supabase.rpc('delete_anonymous_comment', {
      comment_id_param: commentId,
      password_plain: password,
    });

    if (error) {
      throw new Error(`댓글 삭제에 실패했습니다: ${error.message}`);
    }

    if (!data) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
  }
}

export const anonymousPostService = new AnonymousPostService();