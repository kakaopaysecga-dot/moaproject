import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Car } from 'lucide-react';

export default function Parking() {
  const { user } = useAuthStore();
  const { createParkingRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    carNumber: user?.car || '',
    carModel: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.carNumber || !formData.carModel || !formData.location) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    createParkingRequest(formData.carNumber);

    toast({
      title: "신청 완료",
      description: "주차 등록 신청이 접수되었습니다."
    });

    setFormData({ carNumber: '', carModel: '', location: '' });
  };

  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">주차 등록</h1>
        <p className="text-muted-foreground">회사 주차장 이용을 신청하세요</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            주차 등록 신청
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carNumber">차량번호</Label>
              <Input 
                id="carNumber"
                value={formData.carNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, carNumber: e.target.value }))}
                placeholder="예: 12가3456"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carModel">차종</Label>
              <Input 
                id="carModel"
                value={formData.carModel}
                onChange={(e) => setFormData(prev => ({ ...prev, carModel: e.target.value }))}
                placeholder="예: 아반떼"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">희망 주차 위치</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="위치 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">지상 주차장</SelectItem>
                  <SelectItem value="underground">지하 주차장</SelectItem>
                  <SelectItem value="any">상관없음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              등록 신청
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}