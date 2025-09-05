import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { anonymousPostService } from '@/services/anonymousPostService';
import { toast } from 'sonner';

export default function CommunityWrite() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_nickname: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.password) {
      toast.error('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      toast.error('비밀번호는 4자리 이상 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const postId = await anonymousPostService.createPost({
        title: formData.title.trim(),
        content: formData.content.trim(),
        author_nickname: formData.author_nickname.trim() || '익명',
        password: formData.password,
      });

      toast.success('게시글이 작성되었습니다.');
      navigate(`/community/post/${postId}`);
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      toast.error(error instanceof Error ? error.message : '게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/community')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
          <h1 className="text-xl font-semibold text-foreground">새 글 작성</h1>
        </div>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">익명 게시글 작성</CardTitle>
            <p className="text-sm text-muted-foreground">
              익명으로 자유롭게 글을 작성해보세요. 작성한 글은 비밀번호로 관리됩니다.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author Nickname */}
              <div className="space-y-2">
                <Label htmlFor="nickname" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  닉네임 (선택사항)
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="닉네임을 입력하세요 (비워두면 '익명'으로 표시)"
                  value={formData.author_nickname}
                  onChange={handleInputChange('author_nickname')}
                  maxLength={20}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  제목 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="제목을 입력하세요"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  maxLength={100}
                  required
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  내용 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="내용을 입력하세요"
                  value={formData.content}
                  onChange={handleInputChange('content')}
                  rows={10}
                  maxLength={2000}
                  required
                  className="resize-none"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.content.length} / 2000
                </div>
              </div>

              {/* Password */}
              <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>게시글 관리를 위한 비밀번호를 설정해주세요</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      비밀번호 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="4자리 이상"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      minLength={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      비밀번호 확인 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호 재입력"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      minLength={4}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/community')}
                  className="order-2 sm:order-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="order-1 sm:order-2 flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>로딩...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      게시글 작성
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}