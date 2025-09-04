import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Car, ChevronLeft } from 'lucide-react';

export default function Parking() {
  const { user } = useAuthStore();
  const { createParkingRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    carNumber: user?.car || '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.carNumber || !formData.location) {
      toast({
        title: "입력 정보가 부족합니다",
        description: "차량번호와 주차위치를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    createParkingRequest(formData.carNumber);

    toast({
      title: "신청이 완료되었습니다",
      description: "주차 등록 신청이 성공적으로 접수되었습니다."
    });

    setFormData({ carNumber: '', location: '' });
  };

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
          <h1 className="text-2xl font-bold tracking-tight">주차 등록 신청 (1일권)</h1>
          <p className="text-muted-foreground text-sm mt-1">
            하루 단위 주차권을 신청하세요
          </p>
        </div>
      </div>

      {/* 신청 폼 */}
      <Card className="shadow-md border-0 max-w-lg mx-auto">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            차량 정보 입력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="carNumber" className="text-base font-semibold">차량 번호</Label>
              <Input 
                id="carNumber"
                value={formData.carNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, carNumber: e.target.value }))}
                placeholder="예: 12가3456"
                className="h-12 text-base"
                required
              />
            </div>


            <div className="space-y-3">
              <Label htmlFor="location" className="text-base font-semibold">희망 주차 위치</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="주차 위치를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">지상 주차장</SelectItem>
                  <SelectItem value="underground">지하 주차장</SelectItem>
                  <SelectItem value="any">어디든 상관없음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1일권 안내</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1일권은 당일 오후 6시까지 유효합니다</li>
                <li>• 차량 번호는 정확히 입력해주세요</li>
                <li>• 승인까지 30분-1시간 소요됩니다</li>
                <li>• 연장이 필요한 경우 재신청 해주세요</li>
              </ul>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-semibold">
              1일권 신청하기
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}