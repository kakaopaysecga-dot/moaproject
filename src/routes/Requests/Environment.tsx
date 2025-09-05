import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Thermometer, ChevronLeft, FileImage } from 'lucide-react';

export default function Environment() {
  const { createEnvironmentRequest, createTempRequest, coldCooldown, hotCooldown, updateCooldowns } = useRequestsStore();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const cooldownMinutes = Math.max(coldCooldown, hotCooldown);
  
  React.useEffect(() => {
    updateCooldowns();
  }, [updateCooldowns]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnvironmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "이미지 필요",
        description: "개선이 필요한 부분의 사진을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createEnvironmentRequest({
        image: selectedImage,
        note: note
      });

      toast({
        title: "신청이 완료되었습니다",
        description: "사무환경 개선 요청이 성공적으로 접수되었습니다."
      });

      setSelectedImage(null);
      setImagePreview(null);
      setNote('');
    } catch (error) {
      console.error('Environment request failed:', error);
      toast({
        title: "신청 실패",
        description: error instanceof Error ? error.message : "사무환경 개선 요청 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleTempRequest = async (type: 'cold' | 'hot') => {
    if (cooldownMinutes > 0) {
      toast({
        title: "요청이 제한되었습니다",
        description: `${cooldownMinutes}분 후에 다시 요청하실 수 있습니다.`,
        variant: "destructive"
      });
      return;
    }

    try {
      await createTempRequest(type);
      
      // 요청 후 즉시 쿨다운 상태 업데이트
      await updateCooldowns();
      
      toast({
        title: "요청이 완료되었습니다",
        description: `실내 온도 ${type === 'cold' ? '높이기' : '낮추기'} 요청이 성공적으로 접수되었습니다. 1시간 후에 다시 요청하실 수 있습니다.`
      });
    } catch (error) {
      toast({
        title: "요청 실패",
        description: "온도 조절 요청에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Link to="/">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">사무환경 개선</h1>
          <p className="text-sm text-muted-foreground">환경 개선을 요청하세요</p>
        </div>
      </div>

      {/* 탭 컨테이너 */}
      <div className="p-4">
        <Tabs defaultValue="temperature" className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="temperature" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              온도 조절
            </TabsTrigger>
            <TabsTrigger value="improvement" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              환경 개선
            </TabsTrigger>
          </TabsList>

          {/* 온도 조절 탭 */}
          <TabsContent value="temperature" className="mt-6">
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">실내 온도가 어떤가요?</CardTitle>
                <p className="text-sm text-muted-foreground">
                  온도 조절이 필요하면 요청해주세요
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {cooldownMinutes > 0 && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      ⏱️ {cooldownMinutes}분 후에 다시 요청할 수 있어요
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleTempRequest('cold')}
                    disabled={cooldownMinutes > 0}
                    className="h-20 flex-col gap-2 hover:bg-blue-50 border-blue-200"
                  >
                    <span className="text-2xl">🥶</span>
                    <span className="text-sm font-medium">추워요</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleTempRequest('hot')}
                    disabled={cooldownMinutes > 0}
                    className="h-20 flex-col gap-2 hover:bg-red-50 border-red-200"
                  >
                    <span className="text-2xl">🔥</span>
                    <span className="text-sm font-medium">더워요</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 환경 개선 탭 */}
          <TabsContent value="improvement" className="mt-6">
            <form onSubmit={handleEnvironmentSubmit} className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">문제 상황 사진</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    개선이 필요한 부분을 촬영해주세요
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img 
                          src={imagePreview} 
                          alt="미리보기" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="w-full"
                        >
                          다른 사진 선택
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="image" className="cursor-pointer block">
                        <div className="text-center py-8">
                          <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm font-medium mb-1">사진 업로드</p>
                          <p className="text-xs text-muted-foreground">
                            탭하여 사진을 선택하세요
                          </p>
                        </div>
                        <input 
                          id="image"
                          type="file" 
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">상세 설명</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    어떤 개선이 필요한지 설명해주세요
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="예: 의자가 삐걱거려서 수리가 필요해요"
                    className="min-h-[100px] resize-none"
                    rows={4}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full h-12">
                개선 요청하기
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}