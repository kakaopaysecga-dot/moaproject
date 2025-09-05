import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { anonymousPostService } from '@/services/anonymousPostService';

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export function PostCreateModal({ isOpen, onClose, onPostCreated }: PostCreateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('익명');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !password.trim()) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    if (password.length < 4) {
      toast.error('비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    
    try {
      // Use secure database function for post creation
      await anonymousPostService.createPost({
        title: title.trim(),
        content: content.trim(),
        author_nickname: nickname.trim() || '익명',
        password: password
      });

      toast.success('글이 성공적으로 작성되었습니다.');
      setTitle('');
      setContent('');
      setNickname('익명');
      setPassword('');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 글 작성</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="익명"
                maxLength={20}
              />
            </div>
            <div>
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="글 수정/삭제시 필요"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
              maxLength={100}
            />
          </div>
          
          <div>
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
              rows={10}
              className="resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '작성 중...' : '작성완료'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}