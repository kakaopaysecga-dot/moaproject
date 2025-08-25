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
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">명함 신청</h1>
        <p className="text-muted-foreground">개인 명함을 신청하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 신청 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              명함 신청 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" value={user.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept">부서</Label>
                  <Input id="dept" value={user.dept} disabled />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input id="phone" value={user.phone} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="design">디자인</Label>
                <Select value={formData.design} onValueChange={(value) => setFormData(prev => ({ ...prev, design: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="character">캐릭터</SelectItem>
                    <SelectItem value="normal">일반</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">수량</Label>
                <Select value={formData.quantity} onValueChange={(value) => setFormData(prev => ({ ...prev, quantity: value }))}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="memo">메모 (선택사항)</Label>
                <Textarea 
                  id="memo" 
                  value={formData.memo}
                  onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                  placeholder="추가 요청사항이 있으시면 입력해주세요"
                />
              </div>

              <Button type="submit" className="w-full">
                신청하기
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle>명함 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-card-background p-6 rounded-lg border-2 border-dashed border-muted aspect-[1.6/1] flex flex-col justify-center space-y-2">
              <div className="text-center space-y-1">
                <h3 className="font-bold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.dept}</p>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
                <p className="text-xs text-muted-foreground">카카오페이증권</p>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-4">
                {formData.design === 'character' ? '캐릭터 디자인' : '일반 디자인'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}