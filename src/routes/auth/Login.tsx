import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dept, setDept] = useState('');
  const [building, setBuilding] = useState<'판교오피스' | '여의도오피스'>('판교오피스');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // 이미 로그인된 경우 홈으로 리다이렉트
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: '로그인 실패',
          description: error.message === 'Invalid login credentials' 
            ? '이메일 또는 비밀번호가 올바르지 않습니다.' 
            : error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: '로그인 실패',
        description: '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            dept,
            building,
            phone,
          }
        }
      });

      if (error) {
        toast({
          title: '회원가입 실패',
          description: error.message === 'User already registered' 
            ? '이미 등록된 이메일입니다.' 
            : error.message,
          variant: 'destructive',
        });
      } else {
        // 프로필 정보 저장
        if (data.user) {
          await supabase.from('profiles').insert({
            user_id: data.user.id,
            email,
            name,
            dept,
            building,
            phone,
          });
        }

        toast({
          title: '회원가입 완료',
          description: '이메일 확인 후 로그인해주세요.',
        });
      }
    } catch (error) {
      toast({
        title: '회원가입 실패',
        description: '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">스마트 오피스</h1>
          <p className="text-muted-foreground">직장생활을 더 편리하게</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-center">로그인 / 회원가입</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="signup">회원가입</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '로그인 중...' : '로그인'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">이메일</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">비밀번호</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dept">부서</Label>
                    <Input
                      id="dept"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      placeholder="부서를 입력하세요"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="building">건물</Label>
                    <select
                      id="building"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value as '판교오피스' | '여의도오피스')}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="판교오피스">판교오피스</option>
                      <option value="여의도오피스">여의도오피스</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-1234-5678"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? '가입 중...' : '회원가입'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}