import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { SuccessAnimation } from '@/components/ui/SuccessAnimation';
import { useToast } from '@/hooks/use-toast';

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    englishName: '',
    dept: '개발팀',
    building: '판교오피스' as '판교오피스' | '여의도오피스',
    workArea: '',
    phone: '',
    hasCar: false,
    car: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email.endsWith('@kakaopaysec.com')) {
      errors.email = '카카오페이증권 이메일(@kakaopaysec.com)만 사용 가능합니다.';
    }

    const emailPrefix = formData.email.split('@')[0];
    if (formData.email.endsWith('@kakaopaysec.com') && !emailPrefix.includes('.')) {
      errors.email = '이메일 형식이 올바르지 않습니다. (firstname.lastname 형식)';
    }

    if (formData.password.length < 4) {
      errors.password = '비밀번호는 최소 4자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요.';
    }

    if (!formData.englishName.trim()) {
      errors.englishName = '영어이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      errors.phone = '전화번호를 입력해주세요.';
    }

    if (formData.hasCar && !formData.car.trim()) {
      errors.car = '차량번호를 입력해주세요.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    // 11자리 제한
    const limited = numbersOnly.slice(0, 11);
    
    // 자동 하이픈 추가
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    let newValue = value;
    
    // 전화번호 포맷팅
    if (name === 'phone') {
      newValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : newValue,
      // Reset work area when building changes
      ...(name === 'building' ? { workArea: '' } : {}),
      // Reset car number when hasCar is unchecked
      ...(name === 'hasCar' && !checked ? { car: '' } : {})
    }));
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const getWorkAreaOptions = () => {
    if (formData.building === '판교오피스') {
      return ['실리콘밸리', '팔로알토', '월스트리트'];
    } else if (formData.building === '여의도오피스') {
      return ['퀸즈', '브루클린'];
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signup(formData);
      toast({
        title: "회원가입 성공!",
        description: "환영합니다! 로그인 페이지로 이동합니다.",
      });
      setShowSuccess(true);
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // 회원가입한 이메일과 패스워드를 로그인 페이지로 전달
    navigate('/login', { 
      state: { 
        email: formData.email, 
        password: formData.password,
        autoLogin: true
      } 
    });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/fc34501e-c18a-46ea-821e-e0801af7e936.png" 
                alt="카카오페이증권" 
                className="h-8 w-auto"
              />
              <div className="h-8 w-px bg-border"></div>
              <span className="font-bold text-2xl text-primary tracking-tight">MOA</span>
            </div>
            <CardDescription className="text-muted-foreground">
              카카오페이증권 계정으로 가입하세요
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField 
              label="이메일" 
              error={validationErrors.email || (error && error.includes('이메일') ? error : '')} 
              required
            >
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="firstname.lastname@kakaopaysec.com"
                error={!!(validationErrors.email || error)}
                disabled={isLoading}
                autoComplete="email"
              />
            </FormField>

            <FormField label="비밀번호" error={validationErrors.password} required>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                error={!!validationErrors.password}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </FormField>

            <FormField label="비밀번호 확인" error={validationErrors.confirmPassword} required>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 확인"
                error={!!validationErrors.confirmPassword}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </FormField>

            <FormField label="이름 (한글)" error={validationErrors.name} required>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                error={!!validationErrors.name}
                disabled={isLoading}
              />
            </FormField>

            <FormField label="영어이름" error={validationErrors.englishName} required>
              <Input
                type="text"
                name="englishName"
                value={formData.englishName}
                onChange={handleChange}
                placeholder="Hong Gildong"
                error={!!validationErrors.englishName}
                disabled={isLoading}
              />
            </FormField>

            <FormField label="부서" required>
              <Select
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="개발팀">개발팀</option>
                <option value="기획팀">기획팀</option>
                <option value="디자인팀">디자인팀</option>
                <option value="마케팅팀">마케팅팀</option>
                <option value="영업팀">영업팀</option>
                <option value="총무팀">총무팀</option>
                <option value="인사팀">인사팀</option>
                <option value="경영팀">경영팀</option>
              </Select>
            </FormField>

            <FormField label="오피스" required>
              <Select
                name="building"
                value={formData.building}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="판교오피스">판교오피스</option>
                <option value="여의도오피스">여의도오피스</option>
              </Select>
            </FormField>

            <FormField label="근무구역" required>
              <Select
                name="workArea"
                value={formData.workArea}
                onChange={handleChange}
                disabled={isLoading || !formData.building}
              >
                <option value="">근무구역을 선택하세요</option>
                {getWorkAreaOptions().map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="전화번호" error={validationErrors.phone} required>
              <Input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                error={!!validationErrors.phone}
                disabled={isLoading}
                maxLength={13}
              />
            </FormField>

            <FormField label="차량정보" error={validationErrors.car} required>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasCar"
                    name="hasCar"
                    checked={formData.hasCar}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="rounded border-input"
                  />
                  <label htmlFor="hasCar" className="text-sm font-medium">
                    차량 있음
                  </label>
                </div>
                
                {formData.hasCar && (
                  <Input
                    type="text"
                    name="car"
                    value={formData.car}
                    onChange={handleChange}
                    placeholder="11가1111"
                    error={!!validationErrors.car}
                    disabled={isLoading}
                  />
                )}
              </div>
            </FormField>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <SuccessAnimation
      title="회원가입이 완료되었습니다!"
      message="로그인 페이지로 이동합니다."
      isVisible={showSuccess}
      onComplete={handleSuccessComplete}
    />
    </>
  );
}