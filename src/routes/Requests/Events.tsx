import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Heart, ChevronLeft, Paperclip, Link as LinkIcon, X } from 'lucide-react';

export default function Events() {
  const { createEventsRequest } = useRequestsStore();
  const { toast } = useToast();
  
  const [marriageForm, setMarriageForm] = useState({
    date: '',
    time: '',
    location: '',
    address: '',
    memo: '',
    invitationLink: '',
    attachments: [] as File[]
  });

  const [funeralForm, setFuneralForm] = useState({
    relationship: '',
    deceased: '',
    deathDate: '',
    funeralDate: '',
    location: '',
    address: '',
    contact: '',
    noticeLink: '',
    attachments: [] as File[]
  });

  const handleMarriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEventsRequest({
        type: 'marriage',
        date: marriageForm.date,
        time: marriageForm.time,
        venue: marriageForm.location,
        address: marriageForm.address,
        memo: marriageForm.memo
      });

      toast({
        title: "신청이 완료되었습니다",
        description: "결혼 경조사 지원 신청이 성공적으로 접수되었습니다."
      });

      setMarriageForm({ date: '', time: '', location: '', address: '', memo: '', invitationLink: '', attachments: [] });
    } catch (error) {
      console.error('Marriage events request failed:', error);
      toast({
        title: "신청 실패",
        description: error instanceof Error ? error.message : "결혼 경조사 지원 신청 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleFuneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEventsRequest({
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
        title: "신청이 완료되었습니다",
        description: "장례 경조사 지원 신청이 성공적으로 접수되었습니다."
      });

      setFuneralForm({ relationship: '', deceased: '', deathDate: '', funeralDate: '', location: '', address: '', contact: '', noticeLink: '', attachments: [] });
    } catch (error) {
      console.error('Funeral events request failed:', error);
      toast({
        title: "신청 실패",
        description: error instanceof Error ? error.message : "장례 경조사 지원 신청 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container-padding spacing-content pb-safe-bottom">
      {/* 헤더 */}
      <div className="flex items-center spacing-items">
        <Link to="/">
          <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px] p-0 hover:bg-muted/50">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="spacing-tight">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">경조사 지원 신청</h1>
          <p className="text-base text-muted-foreground">
            결혼, 장례 등 경조사 지원을 신청하세요
          </p>
        </div>
      </div>

      <Card className="shadow-md border-0">
        <CardHeader className="spacing-items">
          <CardTitle className="flex items-center spacing-items text-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            경조사 종류 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="marriage" className="w-full">
            <TabsList className="grid w-full grid-cols-2 min-h-[44px]">
              <TabsTrigger value="marriage" className="text-base font-semibold">결혼식</TabsTrigger>
              <TabsTrigger value="funeral" className="text-base font-semibold">장례식</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marriage" className="spacing-group">
              <form onSubmit={handleMarriageSubmit} className="spacing-group">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="spacing-tight">
                    <Label htmlFor="marriage-date">날짜</Label>
                    <Input 
                      id="marriage-date"
                      type="date"
                      value={marriageForm.date}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, date: e.target.value }))}
                      className="min-h-[44px]"
                      required
                    />
                  </div>
                  <div className="spacing-tight">
                    <Label htmlFor="marriage-time">시간</Label>
                    <Input 
                      id="marriage-time"
                      type="time"
                      value={marriageForm.time}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, time: e.target.value }))}
                      className="min-h-[44px]"
                      required
                    />
                  </div>
                </div>
                <div className="spacing-tight">
                  <Label htmlFor="marriage-location">장소</Label>
                  <Input 
                    id="marriage-location"
                    value={marriageForm.location}
                    onChange={(e) => setMarriageForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="예: 롯데호텔 크리스탈 볼룸"
                    className="min-h-[44px]"
                    required
                  />
                </div>
                <div className="spacing-tight">
                  <Label htmlFor="marriage-address">주소</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="marriage-address"
                      value={marriageForm.address}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="주소를 입력하세요"
                      className="min-h-[44px] flex-1"
                      required
                    />
                    <Button type="button" variant="outline" size="sm" className="min-h-[44px] px-4">
                      주소찾기
                    </Button>
                  </div>
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="marriage-link">청첩장 링크 (선택사항)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="marriage-link"
                      value={marriageForm.invitationLink}
                      onChange={(e) => setMarriageForm(prev => ({ ...prev, invitationLink: e.target.value }))}
                      placeholder="온라인 청첩장 URL을 입력하세요"
                      className="pl-10 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="marriage-files">첨부파일 (선택사항)</Label>
                  <div className="spacing-tight">
                    <div className="w-full">
                      <Input 
                        id="marriage-files"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setMarriageForm(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
                        }}
                        className="w-full min-h-[48px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                      />
                    </div>
                    {marriageForm.attachments.length > 0 && (
                      <div className="spacing-tight">
                        {marriageForm.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                            <div className="flex items-center spacing-items min-w-0 flex-1">
                              <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setMarriageForm(prev => ({ 
                                ...prev, 
                                attachments: prev.attachments.filter((_, i) => i !== index) 
                              }))}
                              className="min-h-[44px] min-w-[44px] p-0 flex-shrink-0 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="marriage-memo">메모 (선택사항)</Label>
                  <Textarea 
                    id="marriage-memo"
                    value={marriageForm.memo}
                    onChange={(e) => setMarriageForm(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="추가 정보가 있으시면 입력해주세요"
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full min-h-[48px] text-base font-semibold">
                  결혼 경조사 신청
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="funeral" className="spacing-group">
              <form onSubmit={handleFuneralSubmit} className="spacing-group">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="spacing-tight">
                    <Label htmlFor="relationship">관계</Label>
                    <Input 
                      id="relationship"
                      value={funeralForm.relationship}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="예: 부친, 모친"
                      className="min-h-[44px]"
                      required
                    />
                  </div>
                  <div className="spacing-tight">
                    <Label htmlFor="deceased">고인명</Label>
                    <Input 
                      id="deceased"
                      value={funeralForm.deceased}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, deceased: e.target.value }))}
                      className="min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="spacing-tight">
                    <Label htmlFor="death-date">망일</Label>
                    <Input 
                      id="death-date"
                      type="date"
                      value={funeralForm.deathDate}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, deathDate: e.target.value }))}
                      className="min-h-[44px]"
                      required
                    />
                  </div>
                  <div className="spacing-tight">
                    <Label htmlFor="funeral-date">발인일</Label>
                    <Input 
                      id="funeral-date"
                      type="date"
                      value={funeralForm.funeralDate}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, funeralDate: e.target.value }))}
                      className="min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="funeral-location">장례식장</Label>
                  <Input 
                    id="funeral-location"
                    value={funeralForm.location}
                    onChange={(e) => setFuneralForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="예: 서울아산병원 장례식장"
                    className="min-h-[44px]"
                    required
                  />
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="funeral-address">주소</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="funeral-address"
                      value={funeralForm.address}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="주소를 입력하세요"
                      className="min-h-[44px] flex-1"
                      required
                    />
                    <Button type="button" variant="outline" size="sm" className="min-h-[44px] px-4">
                      주소찾기
                    </Button>
                  </div>
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="contact">연락처</Label>
                  <Input 
                    id="contact"
                    type="tel"
                    value={funeralForm.contact}
                    onChange={(e) => setFuneralForm(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="010-1234-5678"
                    className="min-h-[44px]"
                    required
                  />
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="funeral-link">부고장 링크 (선택사항)</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="funeral-link"
                      value={funeralForm.noticeLink}
                      onChange={(e) => setFuneralForm(prev => ({ ...prev, noticeLink: e.target.value }))}
                      placeholder="온라인 부고장 URL을 입력하세요"
                      className="pl-10 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="spacing-tight">
                  <Label htmlFor="funeral-files">첨부파일 (선택사항)</Label>
                  <div className="spacing-tight">
                    <div className="w-full">
                      <Input 
                        id="funeral-files"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setFuneralForm(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
                        }}
                        className="w-full min-h-[48px] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                      />
                    </div>
                    {funeralForm.attachments.length > 0 && (
                      <div className="spacing-tight">
                        {funeralForm.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                            <div className="flex items-center spacing-items min-w-0 flex-1">
                              <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm truncate">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFuneralForm(prev => ({ 
                                ...prev, 
                                attachments: prev.attachments.filter((_, i) => i !== index) 
                              }))}
                              className="min-h-[44px] min-w-[44px] p-0 flex-shrink-0 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full min-h-[48px] text-base font-semibold">
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