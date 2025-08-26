import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, Input, Select } from '@/components/ui/FormField';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';

interface WorkArea {
  id: string;
  name: string;
  building: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading, signOut, user } = useAuthStore();
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    building: '',
    work_area: '',
    phone: '',
    car_number: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        dept: profile.dept || '',
        building: profile.building || '',
        work_area: profile.work_area || '',
        phone: profile.phone || '',
        car_number: profile.car_number || ''
      });
    }
  }, [profile]);

  // Fetch work areas when building changes
  useEffect(() => {
    const fetchWorkAreas = async () => {
      if (!formData.building) return;
      
      try {
        const { data } = await supabase
          .from('work_areas')
          .select('*')
          .eq('building', formData.building)
          .order('name');
        
        if (data) {
          setWorkAreas(data);
        }
      } catch (error) {
        console.error('Failed to fetch work areas:', error);
      }
    };

    fetchWorkAreas();
  }, [formData.building]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset work_area when building changes
    if (name === 'building') {
      setFormData(prev => ({ ...prev, work_area: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로</span>
            </button>
            <h1 className="text-lg font-semibold">프로필 관리</h1>
            <div className="w-12" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Icon */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile?.name}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>개인 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="이름" required>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름"
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

              <FormField label="근무구역">
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
                {isLoading ? '업데이트 중...' : '프로필 업데이트'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
            >
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}