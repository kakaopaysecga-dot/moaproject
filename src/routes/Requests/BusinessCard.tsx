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
    <div className="py-8 space-y-10">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl font-bold tracking-tight">명함 신청</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
          개인 명함을 신청하세요
        </p>
      </div>

      <div className="grid gap-10 xl:grid-cols-2 max-w-7xl mx-auto">
        {/* 신청 폼 */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              명함 신청 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 개인정보 섹션 */}
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg text-foreground">개인 정보</h3>
                  <p className="text-sm text-muted-foreground mt-1">회사에서 등록된 정보입니다</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground">이름</Label>
                    <Input 
                      id="name" 
                      value={user.name} 
                      disabled 
                      className="bg-muted/50 h-12 text-base font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="dept" className="text-sm font-semibold text-foreground">부서</Label>
                    <Input 
                      id="dept" 
                      value={user.dept} 
                      disabled 
                      className="bg-muted/50 h-12 text-base font-medium"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-foreground">연락처</Label>
                  <Input 
                    id="phone" 
                    value={user.phone} 
                    disabled 
                    className="bg-muted/50 h-12 text-base font-medium"
                  />
                </div>
              </div>

              {/* 명함 옵션 섹션 */}
              <div className="space-y-6">
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-lg text-foreground">명함 옵션</h3>
                  <p className="text-sm text-muted-foreground mt-1">원하는 디자인과 수량을 선택하세요</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="design" className="text-sm font-semibold text-foreground">디자인 타입</Label>
                    <Select value={formData.design} onValueChange={(value) => setFormData(prev => ({ ...prev, design: value }))}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="디자인을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="character">🎨 캐릭터 디자인</SelectItem>
                        <SelectItem value="normal">📄 일반 디자인</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="quantity" className="text-sm font-semibold text-foreground">제작 수량</Label>
                    <Select value={formData.quantity} onValueChange={(value) => setFormData(prev => ({ ...prev, quantity: value }))}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="수량을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50매 (기본)</SelectItem>
                        <SelectItem value="100">100매 (추천)</SelectItem>
                        <SelectItem value="200">200매</SelectItem>
                        <SelectItem value="500">500매 (대량)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 추가 요청사항 섹션 */}
              <div className="space-y-6">
                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-lg text-foreground">추가 요청사항</h3>
                  <p className="text-sm text-muted-foreground mt-1">특별한 요청이 있으시면 자세히 적어주세요</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="memo" className="text-sm font-semibold text-foreground">메모 (선택사항)</Label>
                  <Textarea 
                    id="memo" 
                    value={formData.memo}
                    onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="예: 로고 크기 조정, 특정 색상 요청, 글꼴 변경 등"
                    className="min-h-[120px] text-base leading-relaxed resize-none"
                    rows={5}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg">
                  명함 신청하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 미리보기 */}
        <Card className="shadow-lg border-0 xl:sticky xl:top-8">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl flex items-center gap-3">
              <span>📋</span>
              명함 미리보기
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-10 rounded-3xl border-2 border-dashed border-muted aspect-[1.6/1] flex flex-col justify-center space-y-6 shadow-inner relative overflow-hidden">
                {/* 배경 장식 */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary/5 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-accent/5 rounded-full"></div>
                
                <div className="text-center space-y-4 relative z-10">
                  <h3 className="font-bold text-2xl text-foreground leading-tight">{user.name}</h3>
                  <div className="space-y-2">
                    <p className="text-lg text-muted-foreground font-semibold">{user.dept}</p>
                    <p className="text-base text-muted-foreground leading-relaxed">{user.phone}</p>
                    <p className="text-base text-muted-foreground font-semibold">카카오페이증권</p>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-muted/40">
                  <span className="text-sm text-muted-foreground bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    {formData.design === 'character' ? '🎨 캐릭터 디자인' : '📄 일반 디자인'}
                  </span>
                </div>
              </div>
              
              {/* 제작 정보 */}
              <div className="bg-muted/30 p-6 rounded-2xl space-y-3">
                <h4 className="font-semibold text-foreground">제작 정보</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">수량:</span>
                    <span className="ml-2 font-medium">{formData.quantity}매</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">예상 완료:</span>
                    <span className="ml-2 font-medium">3-5일</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}