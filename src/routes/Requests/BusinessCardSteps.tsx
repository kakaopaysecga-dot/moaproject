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
import { CreditCard, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function BusinessCardSteps() {
  const { user } = useAuthStore();
  const { createBusinessCardRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleSubmit = () => {
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
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.englishName || !formData.koreanName)) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "영어이름과 한글이름은 필수 입력 사항입니다.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
            개인 명함을 신청하세요 ({currentStep}/2 단계)
          </p>
        </div>
      </div>

      {/* 스텝 인디케이터 */}
      <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
          {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
        </div>
        <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
          2
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {currentStep === 1 && (
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
              <div className="space-y-8">
                {/* 개인정보 섹션 */}
                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold text-lg text-foreground">개인 정보</h3>
                    <p className="text-sm text-muted-foreground mt-1">회사에서 등록된 정보입니다</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="englishName" className="text-sm font-semibold text-foreground">영어이름(확장자제외)</Label>
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
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={nextStep} className="px-8">
                    다음 단계
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl flex items-center gap-3">
                <span>📋</span>
                명함 미리보기 및 최종 확인
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 미리보기 */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">명함 미리보기</h3>
                  <div className="bg-white p-6 rounded-lg border border-gray-300 aspect-[0.6/1] max-w-xs mx-auto shadow-md">
                    {formData.design === 'normal' ? (
                      <div className="h-full flex flex-col justify-between text-left p-2">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-black leading-tight">
                              {formData.koreanName || user.name} {formData.englishName && `${formData.englishName}`}
                            </h3>
                          </div>
                          
                          <div className="text-sm text-black space-y-1">
                            <div>
                              {formData.position && `${formData.position} `}
                              {user.dept}
                            </div>
                            {formData.certification && (
                              <div>{formData.certification}</div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="text-sm text-black">{user.phone}</div>
                            <div className="text-sm text-black">{user.email}</div>
                          </div>
                          
                          <div className="w-full h-0.5 bg-yellow-400 my-2"></div>
                          
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-black">
                              {formData.building === '여의도오피스' ? '07325' : '13529'}
                            </div>
                            
                            <div className="text-xs text-black leading-relaxed">
                              {formData.building === '여의도오피스' 
                                ? '서울특별시 영등포구 국제금융로2길 32\n여의도파이낸스타워 5층'
                                : '경기도 성남시 분당구 판교역로 166\n카카오판교아지트 B동 8F'
                              }
                            </div>
                            
                            <div className="text-xs text-black leading-relaxed">
                              {formData.building === '여의도오피스' 
                                ? '5F, 32, Gukjegeumyung-ro 2-gil,\nYeongdeungpo-gu, Seoul, Republic of Korea'
                                : '8F B, 166, Pangyoyeok-ro, Bundang-gu,\nSeongnam-si, Gyeonggi-do, Korea'
                              }
                            </div>
                            
                            <div className="text-xs text-black font-bold leading-tight pt-2">
                              www.kakaopaysec.com<br />
                              (주) 카카오페이증권
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 캐릭터 명함 디자인 (업로드된 이미지와 동일)
                      <div className="h-full flex flex-col justify-between text-left p-4 bg-gray-100">
                        {/* 상단 - 이름 */}
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-black leading-tight">
                            <span className="relative inline-block">
                              <span className="absolute bottom-0 left-0 w-full h-1/3 bg-yellow-200 -z-10"></span>
                              {formData.koreanName || user.name}
                            </span> <span className="text-lg">{formData.englishName}</span>
                          </h3>
                          <div className="text-sm text-black">
                            {user.dept} {formData.position && `/ ${formData.position}`}
                          </div>
                        </div>

                        {/* 중앙 - 구분선 */}
                        <div className="w-full h-0.5 bg-black my-2"></div>

                        {/* 중앙 - 연락처 정보 (선에 바로 붙여서) */}
                        <div className="space-y-1 -mt-4">
                          <div className="text-lg font-bold text-black">
                            <span className="relative inline-block">
                              <span className="absolute bottom-0 left-0 w-full h-1/3 bg-yellow-200 -z-10"></span>
                              {user.phone}
                            </span>
                          </div>
                          <div className="text-lg text-black leading-tight">
                            <span className="relative inline-block">
                              <span className="absolute bottom-0 left-0 w-full h-1/3 bg-yellow-200 -z-10"></span>
                              {user.email.split('@')[0]}@
                            </span><br/>{user.email.split('@')[1]}
                          </div>
                        </div>

                        {/* 하단 - 회사 정보 */}
                        <div className="space-y-1 mt-4">
                          <div className="text-sm font-bold text-black">카카오페이증권</div>
                          <div className="text-[10px] text-black leading-tight">
                            {formData.building === '여의도오피스' 
                              ? '07325 서울시 영등포구 국제금융로2길 32\n여의도파이낸스타워 5F'
                              : '13529 경기도 성남시 분당구 판교역로 166\n카카오판교아지트 B동 8F'
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 옵션 및 메모 */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">명함 옵션</h3>
                    
                    <div className="grid gap-4">
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

                  <div className="space-y-3">
                    <Label htmlFor="memo" className="text-sm font-semibold text-foreground">추가 요청사항</Label>
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
              </div>

              <div className="pt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep} className="px-8">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  이전 단계
                </Button>
                <Button onClick={handleSubmit} className="px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  명함 신청 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}