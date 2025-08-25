import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

export default function BusinessCard() {
  const { user } = useAuthStore();
  const { createBusinessCardRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    design: 'character',
    quantity: '100',
    memo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createBusinessCardRequest({
      name: user.name,
      position: user.name, // Using name as position for now
      dept: user.dept,
      phone: user.phone,
      email: user.email,
      style: formData.design as 'character' | 'normal'
    });

    toast({
      title: "신청 완료",
      description: "명함 신청이 접수되었습니다."
    });

    setFormData({ design: 'character', quantity: '100', memo: '' });
  };

  if (!user) return null;

  return (
    <div className="py-6 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">명함 신청</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">개인 명함을 신청하세요</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 신청 폼 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              명함 신청 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="form-section">
              {/* 개인정보 섹션 */}
              <div className="form-group">
                <h3 className="font-semibold text-foreground mb-4">개인 정보</h3>
                <div className="form-row-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">이름</Label>
                    <Input 
                      id="name" 
                      value={user.name} 
                      disabled 
                      className="bg-muted/50 h-11 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept" className="text-sm font-medium text-foreground">부서</Label>
                    <Input 
                      id="dept" 
                      value={user.dept} 
                      disabled 
                      className="bg-muted/50 h-11 text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">연락처</Label>
                  <Input 
                    id="phone" 
                    value={user.phone} 
                    disabled 
                    className="bg-muted/50 h-11 text-base"
                  />
                </div>
              </div>

              {/* 명함 옵션 섹션 */}
              <div className="form-group">
                <h3 className="font-semibold text-foreground mb-4">명함 옵션</h3>
                <div className="form-row-2">
                  <div className="space-y-2">
                    <Label htmlFor="design" className="text-sm font-medium text-foreground">디자인</Label>
                    <Select value={formData.design} onValueChange={(value) => setFormData(prev => ({ ...prev, design: value }))}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character">캐릭터</SelectItem>
                        <SelectItem value="normal">일반</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm font-medium text-foreground">수량</Label>
                    <Select value={formData.quantity} onValueChange={(value) => setFormData(prev => ({ ...prev, quantity: value }))}>
                      <SelectTrigger className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50매</SelectItem>
                        <SelectItem value="100">100매</SelectItem>
                        <SelectItem value="200">200매</SelectItem>
                        <SelectItem value="500">500매</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo" className="text-sm font-medium text-foreground">메모 (선택사항)</Label>
                  <Textarea 
                    id="memo" 
                    value={formData.memo}
                    onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="추가 요청사항이 있으시면 입력해주세요"
                    className="min-h-[100px] text-base leading-relaxed resize-none"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                신청하기
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 미리보기 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl">명함 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-dashed border-muted aspect-[1.6/1] flex flex-col justify-center space-y-4 shadow-inner">
              <div className="text-center space-y-3">
                <h3 className="font-bold text-xl text-foreground leading-tight">{user.name}</h3>
                <div className="space-y-1">
                  <p className="text-base text-muted-foreground font-medium">{user.dept}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{user.phone}</p>
                  <p className="text-sm text-muted-foreground font-medium">카카오페이증권</p>
                </div>
              </div>
              <div className="text-center pt-3 border-t border-muted/30">
                <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {formData.design === 'character' ? '캐릭터 디자인' : '일반 디자인'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}