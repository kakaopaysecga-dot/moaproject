import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Thermometer } from 'lucide-react';

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
      title: "신청 완료",
      description: "사무환경 개선 요청이 접수되었습니다."
    });

    setSelectedImage(null);
    setImagePreview(null);
    setNote('');
  };

  const handleTempRequest = (type: 'cold' | 'hot') => {
    if (cooldownMinutes > 0) {
      toast({
        title: "요청 제한",
        description: `${cooldownMinutes}분 후에 다시 요청하실 수 있습니다.`,
        variant: "destructive"
      });
      return;
    }

    createTempRequest(type);
    
    toast({
      title: "요청 완료",
      description: `실내 온도 ${type === 'cold' ? '높이기' : '낮추기'} 요청이 접수되었습니다.`
    });
  };

  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">사무환경 개선</h1>
        <p className="text-muted-foreground">사무실 환경 개선을 요청하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 온도 조절 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              실내 온도 조절
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              실내 온도가 불편하시면 조절을 요청하실 수 있습니다.
            </p>
            
            {cooldownMinutes > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {cooldownMinutes}분 후에 다시 요청하실 수 있습니다.
                </p>
              </div>
            )}


            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleTempRequest('cold')}
                disabled={cooldownMinutes > 0}
                className="flex-1"
              >
                추워요 (온도 올려주세요)
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleTempRequest('hot')}
                disabled={cooldownMinutes > 0}
                className="flex-1"
              >
                더워요 (온도 낮춰주세요)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 환경 개선 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              사무환경 개선 요청
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnvironmentSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">사진 업로드</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-4">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        다시 선택
                      </Button>
                    </div>
                  ) : (
                    <label htmlFor="image" className="cursor-pointer flex flex-col items-center py-4">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        개선이 필요한 부분의 사진을 업로드하세요
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

              <div className="space-y-2">
                <Label htmlFor="note">상세 내용</Label>
                <Textarea 
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="개선이 필요한 내용을 자세히 설명해주세요"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                요청 보내기
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}