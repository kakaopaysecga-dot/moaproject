import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, Input } from '@/components/ui/FormField';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/fc34501e-c18a-46ea-821e-e0801af7e936.png" 
                alt="카카오페이증권" 
                className="h-12 w-auto"
              />
              <div className="h-8 w-px bg-border"></div>
              <span className="font-bold text-3xl text-primary tracking-tight">MOA</span>
            </div>
            <CardDescription className="text-muted-foreground">
              카카오페이증권 업무 관리 시스템
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="이메일" error={error} required>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="아이디 또는 이메일"
                error={!!error}
                disabled={isLoading}
                autoComplete="email"
              />
            </FormField>

            <FormField label="비밀번호" required>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </FormField>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                회원가입
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <strong>테스트 계정:</strong> 아이디 "1", 비밀번호 "1"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}