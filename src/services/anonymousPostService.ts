import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

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
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getPosts(sortBy: 'latest' | 'popular' | 'views' = 'latest'): Promise<AnonymousPost[]> {
    let query = supabase
      .from('anonymous_posts')
      .select('*')
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
      .select('*')
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
    const passwordHash = await this.hashPassword(postData.password);

    const { data, error } = await supabase
      .from('anonymous_posts')
      .insert({
        title: postData.title,
        content: postData.content,
        author_nickname: postData.author_nickname || '익명',
        password_hash: passwordHash,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`게시글 작성에 실패했습니다: ${error.message}`);
    }

    return data.id;
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
      .select('*')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`댓글을 불러올 수 없습니다: ${error.message}`);
    }

    return data || [];
  }

  async createComment(commentData: CreateCommentData): Promise<string> {
    const passwordHash = await this.hashPassword(commentData.password);

    const { data, error } = await supabase
      .from('anonymous_comments')
      .insert({
        post_id: commentData.post_id,
        content: commentData.content,
        author_nickname: commentData.author_nickname || '익명',
        password_hash: passwordHash,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`댓글 작성에 실패했습니다: ${error.message}`);
    }

    return data.id;
  }

  async deletePost(postId: string, password: string): Promise<void> {
    // First get the post to verify password
    const { data: post, error: fetchError } = await supabase
      .from('anonymous_posts')
      .select('password_hash')
      .eq('id', postId)
      .single();

    if (fetchError) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    const isValidPassword = await this.verifyPassword(password, post.password_hash);
    if (!isValidPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const { error } = await supabase
      .from('anonymous_posts')
      .update({ is_deleted: true })
      .eq('id', postId);

    if (error) {
      throw new Error(`게시글 삭제에 실패했습니다: ${error.message}`);
    }
  }

  async deleteComment(commentId: string, password: string): Promise<void> {
    // First get the comment to verify password
    const { data: comment, error: fetchError } = await supabase
      .from('anonymous_comments')
      .select('password_hash')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    const isValidPassword = await this.verifyPassword(password, comment.password_hash);
    if (!isValidPassword) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }

    const { error } = await supabase
      .from('anonymous_comments')
      .update({ is_deleted: true })
      .eq('id', commentId);

    if (error) {
      throw new Error(`댓글 삭제에 실패했습니다: ${error.message}`);
    }
  }
}

export const anonymousPostService = new AnonymousPostService();