import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { supabase } from '@/integrations/supabase/client';

interface WorkArea {
  id: string;
  name: string;
  building: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    dept: '개발팀',
    building: '판교오피스' as '판교오피스' | '여의도오피스',
    work_area: '',
    phone: '',
    car_number: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch work areas when building changes
  useEffect(() => {
    const fetchWorkAreas = async () => {
      try {
        const { data } = await supabase
          .from('work_areas')
          .select('*')
          .eq('building', formData.building)
          .order('name');
        
        if (data) {
          setWorkAreas(data);
          // Reset work_area when building changes
          setFormData(prev => ({ ...prev, work_area: '' }));
        }
      } catch (error) {
        console.error('Failed to fetch work areas:', error);
      }
    };

    fetchWorkAreas();
  }, [formData.building]);

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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(formData);
      navigate('/');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">회원가입</CardTitle>
          <CardDescription>
            카카오페이증권 계정으로 가입하세요
          </CardDescription>
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

            <FormField label="이름" error={validationErrors.name} required>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
                error={!!validationErrors.name}
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

            <FormField label="근무지" required>
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

            <FormField label="전화번호">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="근무구역" required>
              <Select
                name="work_area"
                value={formData.work_area}
                onChange={handleChange}
                disabled={isLoading || workAreas.length === 0}
              >
                <option value="">근무구역을 선택하세요</option>
                {workAreas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </Select>
            </FormField>


            <FormField label="차량번호">
              <Input
                type="text"
                name="car_number"
                value={formData.car_number}
                onChange={handleChange}
                placeholder="11가1111"
                disabled={isLoading}
              />
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
  );
}