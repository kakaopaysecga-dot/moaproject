import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

export default function Events() {
  const { createEventsRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [marriageForm, setMarriageForm] = useState({
    date: '',
    time: '',
    location: '',
    address: '',
    memo: ''
  });

  const [funeralForm, setFuneralForm] = useState({
    relationship: '',
    deceased: '',
    deathDate: '',
    funeralDate: '',
    location: '',
    address: '',
    contact: ''
  });

  const handleMarriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createEventsRequest({
      type: 'marriage',
      date: marriageForm.date,
      time: marriageForm.time,
      venue: marriageForm.location,
      address: marriageForm.address,
      memo: marriageForm.memo
    });

    toast({
      title: "신청 완료",
      description: "결혼 경조사 지원이 신청되었습니다."
    });

    setMarriageForm({ date: '', time: '', location: '', address: '', memo: '' });
  };

  const handleFuneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createEventsRequest({
      type: 'funeral',
      relationship: funeralForm.relationship,
      deceasedName: funeralForm.deceased,
      deathDate: funeralForm.deathDate,
      funeralDate: funeralForm.funeralDate,
      funeralHall: funeralForm.location,
      funeralAddress: funeralForm.address,
      contact: funeralForm.contact
    });

    toast({
      title: "신청 완료",
      description: "장례 경조사 지원이 신청되었습니다."
    });

    setFuneralForm({ relationship: '', deceased: '', deathDate: '', funeralDate: '', location: '', address: '', contact: '' });
  };

  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">경조사 지원</h1>
        <p className="text-muted-foreground">결혼, 장례 등 경조사 지원을 신청하세요</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            경조사 지원 신청
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="marriage" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="marriage">결혼</TabsTrigger>
              <TabsTrigger value="funeral">장례</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marriage" className="space-y-4">
              <form onSubmit={handleMarriageSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="marriage-date">날짜</Label>
                    <Input 
                      id="marriage-date"
                      type="date"
                      value={marriageForm.date}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marriage-time">시간</Label>
                    <Input 
                      id="marriage-time"
                      type="time"
                      value={marriageForm.time}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marriage-location">장소</Label>
                  <Input 
                    id="marriage-location"
                    value={marriageForm.location}
                    onChange={(e) => setMarriageForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="예: 롯데호텔 크리스탈 볼룸"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marriage-address">주소</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="marriage-address"
                      value={marriageForm.address}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="주소를 입력하세요"
                      required
                    />
                    <Button type="button" variant="outline" size="sm">
                      주소찾기
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marriage-memo">메모 (선택사항)</Label>
                  <Textarea 
                    id="marriage-memo"
                    value={marriageForm.memo}
                    onChange={(e) => setMarriageForm(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="추가 정보가 있으시면 입력해주세요"
                  />
                </div>

                <Button type="submit" className="w-full">
                  결혼 경조사 신청
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="funeral" className="space-y-4">
              <form onSubmit={handleFuneralSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="relationship">관계</Label>
                    <Input 
                      id="relationship"
                      value={funeralForm.relationship}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="예: 부친, 모친"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deceased">고인명</Label>
                    <Input 
                      id="deceased"
                      value={funeralForm.deceased}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, deceased: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="death-date">망일</Label>
                    <Input 
                      id="death-date"
                      type="date"
                      value={funeralForm.deathDate}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, deathDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="funeral-date">발인일</Label>
                    <Input 
                      id="funeral-date"
                      type="date"
                      value={funeralForm.funeralDate}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, funeralDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funeral-location">장례식장</Label>
                  <Input 
                    id="funeral-location"
                    value={funeralForm.location}
                    onChange={(e) => setFuneralForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="예: 서울아산병원 장례식장"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funeral-address">주소</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="funeral-address"
                      value={funeralForm.address}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="주소를 입력하세요"
                      required
                    />
                    <Button type="button" variant="outline" size="sm">
                      주소찾기
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">연락처</Label>
                  <Input 
                    id="contact"
                    type="tel"
                    value={funeralForm.contact}
                    onChange={(e) => setFuneralForm(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  장례 경조사 신청
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}