import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, Input } from '@/components/ui/FormField';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isLoading, error, clearError } = useAuthStore();
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
      await signIn(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            카카오페이증권 계정으로 로그인하세요
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="이메일" error={error && error.includes('이메일') ? error : ''} required>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="firstname.lastname@kakaopaysec.com"
                error={!!error}
                disabled={isLoading}
                autoComplete="email"
              />
            </FormField>

            <FormField label="비밀번호" error={error && error.includes('비밀번호') ? error : ''} required>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                error={!!error}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </FormField>

            {error && !error.includes('이메일') && !error.includes('비밀번호') && (
              <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
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
        </CardContent>
      </Card>
    </div>
  );
}