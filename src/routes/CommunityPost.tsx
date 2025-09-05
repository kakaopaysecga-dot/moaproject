import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Eye, Send, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { anonymousPostService, type AnonymousPost, type AnonymousComment } from '@/services/anonymousPostService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CommunityPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<AnonymousPost | null>(null);
  const [comments, setComments] = useState<AnonymousComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    content: '',
    author_nickname: '',
    password: '',
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      loadPostAndComments();
    }
  }, [id]);

  const loadPostAndComments = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [postData, commentsData] = await Promise.all([
        anonymousPostService.getPost(id),
        anonymousPostService.getComments(id)
      ]);
      
      if (!postData) {
        toast.error('게시글을 찾을 수 없습니다.');
        navigate('/community');
        return;
      }
      
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
      toast.error('게시글을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post || liked) return;

    try {
      await anonymousPostService.incrementLikeCount(post.id);
      setPost(prev => prev ? { ...prev, like_count: prev.like_count + 1 } : null);
      setLiked(true);
      toast.success('좋아요를 눌렀습니다!');
    } catch (error) {
      console.error('좋아요 실패:', error);
      toast.error('좋아요 처리에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.content.trim() || !commentForm.password || !post) {
      toast.error('내용과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingComment(true);
      
      await anonymousPostService.createComment({
        post_id: post.id,
        content: commentForm.content.trim(),
        author_nickname: commentForm.author_nickname.trim() || '익명',
        password: commentForm.password,
      });

      setCommentForm({ content: '', author_nickname: '', password: '' });
      await loadPostAndComments();
      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      toast.error(error instanceof Error ? error.message : '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !deletePassword) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }

    try {
      await anonymousPostService.deletePost(post.id, deletePassword);
      toast.success('게시글이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      toast.error(error instanceof Error ? error.message : '게시글 삭제에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: string, password: string) => {
    try {
      await anonymousPostService.deleteComment(commentId, password);
      await loadPostAndComments();
      toast.success('댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      toast.error(error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">게시글을 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/community')}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/community')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                  <div className="space-y-2">
                    <Label htmlFor="deletePassword">작성 시 설정한 비밀번호</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePost} className="bg-destructive hover:bg-destructive/90">
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Post Content */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="font-medium">{post.author_nickname}</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true,
                      locale: ko 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.view_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {post.like_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {post.comment_count}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.content}
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={handleLike}
                variant={liked ? "default" : "outline"}
                className="gap-2"
                disabled={liked}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? '좋아요 완료' : '좋아요'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              댓글 {comments.length}개
            </h3>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commentNickname">닉네임 (선택)</Label>
                  <Input
                    id="commentNickname"
                    type="text"
                    placeholder="닉네임 (비워두면 '익명')"
                    value={commentForm.author_nickname}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, author_nickname: e.target.value }))}
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commentPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    비밀번호
                  </Label>
                  <Input
                    id="commentPassword"
                    type="password"
                    placeholder="댓글 관리용 비밀번호"
                    value={commentForm.password}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Textarea
                  placeholder="댓글을 입력하세요..."
                  value={commentForm.content}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  maxLength={500}
                  required
                />
                <div className="text-xs text-muted-foreground text-right">
                  {commentForm.content.length} / 500
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmittingComment}
                className="w-full sm:w-auto"
              >
                {isSubmittingComment ? (
                  <>로딩...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    댓글 작성
                  </>
                )}
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>첫 번째 댓글을 작성해보세요!</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div key={comment.id}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-foreground">{comment.author_nickname}</span>
                          <span className="text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { 
                              addSuffix: true,
                              locale: ko 
                            })}
                          </span>
                        </div>
                        
                        <CommentDeleteButton 
                          commentId={comment.id}
                          onDelete={handleDeleteComment}
                        />
                      </div>
                      
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                    
                    {index < comments.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Comment Delete Component
const CommentDeleteButton: React.FC<{
  commentId: string;
  onDelete: (commentId: string, password: string) => Promise<void>;
}> = ({ commentId, onDelete }) => {
  const [password, setPassword] = useState('');

  const handleDelete = async () => {
    if (!password) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }
    await onDelete(commentId, password);
    setPassword('');
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:text-destructive">
          <Trash2 className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>댓글 삭제</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>댓글을 삭제하시겠습니까?</p>
            <div className="space-y-2">
              <Label htmlFor="commentDeletePassword">댓글 작성 시 설정한 비밀번호</Label>
              <Input
                id="commentDeletePassword"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};