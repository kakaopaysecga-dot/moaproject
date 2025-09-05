import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Eye, ThumbsUp, MessageCircle, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author_nickname: string;
  created_at: string;
}

interface PostDetailModalProps {
  post: {
    id: string;
    title: string;
    content: string;
    author_nickname: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    created_at: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated: () => void;
}

export function PostDetailModal({ post, isOpen, onClose, onPostUpdated }: PostDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentNickname, setCommentNickname] = useState('익명');
  const [commentPassword, setCommentPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, post.id]);

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('anonymous_comments')
        .select('*')
        .eq('post_id', post.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (liked) return;
    
    try {
      const { error } = await supabase
        .from('anonymous_posts')
        .update({ like_count: post.like_count + 1 })
        .eq('id', post.id);

      if (error) throw error;
      
      setLiked(true);
      onPostUpdated();
      toast.success('좋아요를 눌렀습니다.');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('좋아요 실패');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !commentPassword.trim()) {
      toast.error('내용과 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    
    try {
      const passwordHash = btoa(commentPassword);
      
      const { error } = await supabase
        .from('anonymous_comments')
        .insert({
          post_id: post.id,
          content: newComment.trim(),
          author_nickname: commentNickname.trim() || '익명',
          password_hash: passwordHash
        });

      if (error) throw error;

      setNewComment('');
      setCommentPassword('');
      setCommentNickname('익명');
      loadComments();
      onPostUpdated();
      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left">{post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Post Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{post.author_nickname}</Badge>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ko
                })}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.view_count}
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {post.like_count}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.comment_count}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-foreground">
              {post.content}
            </div>
          </div>

          {/* Like Button */}
          <div className="flex justify-center">
            <Button
              variant={liked ? "default" : "outline"}
              onClick={handleLike}
              disabled={liked}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              {liked ? '좋아요 완료' : '좋아요'}
            </Button>
          </div>

          <Separator />

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">댓글 {comments.length}개</h3>
            
            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {comment.author_nickname}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ko
                        })}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-3 border-t pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="comment-nickname" className="text-sm">닉네임</Label>
                  <Input
                    id="comment-nickname"
                    value={commentNickname}
                    onChange={(e) => setCommentNickname(e.target.value)}
                    placeholder="익명"
                  />
                </div>
                <div>
                  <Label htmlFor="comment-password" className="text-sm">비밀번호</Label>
                  <Input
                    id="comment-password"
                    type="password"
                    value={commentPassword}
                    onChange={(e) => setCommentPassword(e.target.value)}
                    placeholder="댓글 삭제시 필요"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment-content" className="text-sm">댓글</Label>
                <Textarea
                  id="comment-content"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  rows={3}
                  className="resize-none"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? '작성 중...' : '댓글 작성'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}