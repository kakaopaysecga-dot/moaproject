import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Thermometer, ChevronLeft } from 'lucide-react';

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

  const handleEnvironmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "이미지 필요",
        description: "개선이 필요한 부분의 사진을 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    createEnvironmentRequest({
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
  };

  const handleTempRequest = (type: 'cold' | 'hot') => {
    if (cooldownMinutes > 0) {
      toast({
        title: "요청이 제한되었습니다",
        description: `${cooldownMinutes}분 후에 다시 요청하실 수 있습니다.`,
        variant: "destructive"
      });
      return;
    }

    createTempRequest(type);
    
    toast({
      title: "요청이 완료되었습니다",
      description: `실내 온도 ${type === 'cold' ? '높이기' : '낮추기'} 요청이 성공적으로 접수되었습니다.`
    });
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
          <h1 className="text-2xl font-bold tracking-tight">사무환경 개선 요청</h1>
          <p className="text-muted-foreground text-sm mt-1">
            사무실 환경 개선을 요청하세요
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
        {/* 온도 조절 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Thermometer className="h-5 w-5 text-accent" />
              </div>
              실내 온도 조절 요청
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base text-muted-foreground leading-relaxed">
              실내 온도가 불편하시면 조절을 요청하실 수 있습니다.
            </p>
            
            {cooldownMinutes > 0 && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
                <p className="text-sm text-warning-foreground font-medium">
                  ⏱️ {cooldownMinutes}분 후에 다시 요청하실 수 있습니다.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleTempRequest('cold')}
                disabled={cooldownMinutes > 0}
                className="h-16 flex-col gap-2 border-2 border-blue-200 hover:bg-blue-50"
              >
                <span className="text-2xl">🥶</span>
                <span className="font-semibold">추워요</span>
                <span className="text-xs text-muted-foreground">온도를 높여주세요</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleTempRequest('hot')}
                disabled={cooldownMinutes > 0}
                className="h-16 flex-col gap-2 border-2 border-red-200 hover:bg-red-50"
              >
                <span className="text-2xl">🔥</span>
                <span className="font-semibold">더워요</span>
                <span className="text-xs text-muted-foreground">온도를 낮춰주세요</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 환경 개선 */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              사무환경 개선 요청
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnvironmentSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="image" className="text-base font-semibold">문제가 되는 부분 사진</Label>
                <div className="border-2 border-dashed border-muted rounded-xl p-6">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="미리보기" 
                        className="w-full h-40 object-cover rounded-lg"
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
                        다른 사진 선택하기
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image" className="cursor-pointer flex flex-col items-center py-6">
                      <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                      <span className="text-base font-medium text-foreground mb-1">
                        사진을 업로드하세요
                      </span>
                      <span className="text-sm text-muted-foreground text-center">
                        개선이 필요한 부분의 사진을 찍어 업로드해주세요
                      </span>
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
              </div>

              <div className="space-y-3">
                <Label htmlFor="note" className="text-base font-semibold">상세 설명</Label>
                <Textarea 
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="어떤 부분을 어떻게 개선했으면 좋을지 자세히 설명해주세요"
                  className="min-h-[120px] text-base leading-relaxed resize-none"
                  rows={5}
                />
              </div>

              <Button type="submit" className="w-full h-14 text-lg font-semibold">
                환경 개선 요청하기
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}