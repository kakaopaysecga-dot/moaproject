import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, ChevronLeft } from 'lucide-react';

export default function BusinessCard() {
  const { user } = useAuthStore();
  const { createBusinessCardRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<{
    englishName: string;
    koreanName: string;
    position: string;
    certification: string;
    building: '판교오피스' | '여의도오피스';
    design: string;
    quantity: string;
    memo: string;
  }>({
    englishName: '',
    koreanName: user?.name || '',
    position: '',
    certification: '',
    building: (user?.building as '판교오피스' | '여의도오피스') || '여의도오피스',
    design: 'character',
    quantity: '100',
    memo: ''
  });

  const capitalizeEnglishName = (name: string) => {
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.englishName || !formData.koreanName) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "영어이름과 한글이름은 필수 입력 사항입니다.",
        variant: "destructive"
      });
      return;
    }

    createBusinessCardRequest({
      englishName: formData.englishName,
      koreanName: formData.koreanName,
      dept: user.dept,
      position: formData.position,
      certification: formData.certification,
      phone: user.phone,
      email: user.email,
      building: formData.building as '판교오피스' | '여의도오피스',
      style: formData.design as 'character' | 'normal'
    });

    toast({
      title: "신청이 완료되었습니다",
      description: "명함 제작 신청이 성공적으로 접수되었습니다."
    });

    setFormData({ 
      englishName: '',
      koreanName: user?.name || '',
      position: '',
      certification: '',
      building: (user?.building as '판교오피스' | '여의도오피스') || '여의도오피스',
      design: 'character', 
      quantity: '100', 
      memo: '' 
    });
  };

  if (!user) return null;

  return (
    <div className="py-6 space-y-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4 px-2">
        <Link to="/">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">명함 제작 신청</h1>
          <p className="text-muted-foreground text-sm mt-1">
            개인 명함을 신청하세요
          </p>
        </div>
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
                    <Label htmlFor="englishName" className="text-sm font-semibold text-foreground">영어이름 *</Label>
                    <Input 
                      id="englishName" 
                      value={formData.englishName}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        englishName: capitalizeEnglishName(e.target.value)
                      }))}
                      placeholder="John Smith"
                      className="h-12 text-base font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="koreanName" className="text-sm font-semibold text-foreground">한글이름 *</Label>
                    <Input 
                      id="koreanName" 
                      value={formData.koreanName}
                      onChange={(e) => setFormData(prev => ({ ...prev, koreanName: e.target.value }))}
                      placeholder="홍길동"
                      className="h-12 text-base font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="dept" className="text-sm font-semibold text-foreground">부서</Label>
                    <Input 
                      id="dept" 
                      value={user.dept} 
                      disabled 
                      className="bg-muted/50 h-12 text-base font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="position" className="text-sm font-semibold text-foreground">직급 (필요시)</Label>
                    <Input 
                      id="position" 
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="대리, 과장, 부장 등"
                      className="h-12 text-base font-medium"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="certification" className="text-sm font-semibold text-foreground">자격증 (필요시)</Label>
                    <Input 
                      id="certification" 
                      value={formData.certification}
                      onChange={(e) => setFormData(prev => ({ ...prev, certification: e.target.value }))}
                      placeholder="변호사, 회계사, CPA 등"
                      className="h-12 text-base font-medium"
                    />
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

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">주소 선택</Label>
                  <Select value={formData.building} onValueChange={(value: '판교오피스' | '여의도오피스') => setFormData(prev => ({ ...prev, building: value }))}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="근무지를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="여의도오피스">🏢 여의도오피스</SelectItem>
                      <SelectItem value="판교아지트">🏢 판교아지트</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      {formData.building === '여의도오피스' 
                        ? '07325 서울특별시 영등포구 국제금융로 2길 32 여의도파이낸스타워 5층\n5F, 32, Gukjegeumyung-ro 2-gil, Yeongdeungpo-gu, Seoul, Korea, 07325'
                        : '13529 경기도 성남시 분당구 판교역로 166 카카오판교아지트 B동 8F\n8F B, 166, Pangyoyeok-ro, Bundang-gu, Seongnam-si, Gyeonggi-do, Korea, 13528'
                      }
                    </div>
                  </div>
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
              <div className="bg-white p-6 rounded-lg border border-gray-300 aspect-[0.6/1] max-w-xs mx-auto shadow-md">
                {formData.design === 'normal' ? (
                  // 일반 명함 디자인 (참고 이미지 기반)
                  <div className="h-full flex flex-col justify-between text-left">
                    {/* 상단 - 이름 */}
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-bold text-black">
                          {formData.koreanName || user.name}
                        </h3>
                        <span className="text-base font-normal text-black">
                          {formData.englishName || 'English Name'}
                        </span>
                      </div>
                      
                      {/* 부서/직급 */}
                      <div className="text-sm text-black">
                        {formData.position && `${formData.position} / `}
                        {user.dept}
                        {formData.certification && ` ${formData.certification}`}
                      </div>
                    </div>

                    {/* 중간 공백 */}
                    <div className="flex-1"></div>

                    {/* 하단 - 연락처, 구분선, 주소 */}
                    <div className="space-y-3">
                      {/* 연락처 */}
                      <div className="space-y-1">
                        <div className="text-sm text-black font-medium">{user.phone}</div>
                        <div className="text-sm text-black">{user.email}</div>
                      </div>
                      
                      {/* 노란색 구분선 */}
                      <div className="w-full h-1 bg-yellow-400"></div>
                      
                      {/* 주소 */}
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-black">
                          {formData.building === '여의도오피스' ? '07325' : '13529'}
                        </div>
                        <div className="text-sm text-black leading-tight">
                          {formData.building === '여의도오피스' 
                            ? '서울특별시 영등포구 국제금융로2길 32\n여의도파이낸스타워 5층'
                            : '경기도 성남시 분당구 판교역로 166\n카카오판교아지트 B동 8F'
                          }
                        </div>
                        <div className="text-sm text-black leading-tight">
                          {formData.building === '여의도오피스' 
                            ? '5F, 32, Gukjegeumyung-ro 2-gil,\nYeongdeungpo-gu, Seoul, Republic of Korea'
                            : '8F B, 166, Pangyoyeok-ro, Bundang-gu,\nSeongnam-si, Gyeonggi-do, Korea'
                          }
                        </div>
                      </div>
                      
                      {/* 회사 정보 */}
                      <div className="text-sm text-black font-bold">
                        www.kakaopaysec.com (주) 카카오페이증권
                      </div>
                    </div>
                  </div>
                ) : (
                  // 캐릭터 명함 디자인 (기존)
                  <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 rounded-3xl border-2 border-dashed border-muted h-full flex flex-col justify-between space-y-4 shadow-inner relative overflow-hidden">
                    {/* 배경 장식 */}
                    <div className="absolute top-3 right-3 w-12 h-12 bg-primary/5 rounded-full"></div>
                    <div className="absolute bottom-3 left-3 w-10 h-10 bg-accent/5 rounded-full"></div>
                    
                    {/* 상단 - 회사 로고 영역 */}
                    <div className="text-center relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">K</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-bold tracking-wide">카카오페이증권</p>
                    </div>
                    
                    {/* 중앙 - 개인 정보 */}
                    <div className="text-center space-y-2 relative z-10 flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-lg text-foreground leading-tight">
                        {formData.englishName || 'English Name'}
                      </h3>
                      <h4 className="font-bold text-base text-foreground leading-tight">
                        {formData.koreanName || user.name}
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {user.dept} {formData.position && `· ${formData.position}`}
                      </p>
                      {formData.certification && (
                        <p className="text-xs text-muted-foreground leading-relaxed">{formData.certification}</p>
                      )}
                      <div className="pt-2 space-y-1">
                        <p className="text-xs text-muted-foreground leading-relaxed">{user.phone}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* 하단 - 디자인 타입 */}
                    <div className="text-center pt-2 border-t border-muted/40">
                      <span className="text-xs text-muted-foreground bg-white/80 px-3 py-1 rounded-full shadow-sm">
                        🎨 캐릭터
                      </span>
                    </div>
                  </div>
                )}
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