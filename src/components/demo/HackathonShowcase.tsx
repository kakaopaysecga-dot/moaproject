import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Trophy, 
  Target, 
  Users, 
  Clock, 
  TrendingUp, 
  Zap, 
  Brain,
  Rocket,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { enhancedDemoData, demoScenarios } from './DemoData';

export const HackathonShowcase: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [currentScenario, setCurrentScenario] = useState<keyof typeof demoScenarios>('aiSearch');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  useEffect(() => {
    if (isVisible && !showMetrics) {
      const timer = setTimeout(() => setShowMetrics(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, showMetrics]);

  const playScenario = (scenario: keyof typeof demoScenarios) => {
    setCurrentScenario(scenario);
    setIsPlaying(true);
    
    // 3초 후 자동으로 완료
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            MOA - AI 해커톤 데모
            <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 핵심 가치 제안 */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">AI로 업무 효율성을 극대화하는 스마트 오피스</h3>
            </div>
            <p className="text-muted-foreground text-lg">
              전통적인 오피스 관리의 모든 비효율을 AI 기술로 해결하여 
              <span className="text-primary font-semibold"> 업무 시간 87% 단축</span>과 
              <span className="text-primary font-semibold"> 공간 활용도 94% 달성</span>
            </p>
          </Card>

          {/* 실시간 성과 지표 */}
          {showMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
              {Object.entries(enhancedDemoData.successMetrics).map(([key, value], index) => (
                <Card key={key} className="p-4 text-center border-primary/20">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(value)}%
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-500 mx-auto mt-2" />
                </Card>
              ))}
            </div>
          )}

          {/* 데모 시나리오 선택 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(demoScenarios).map(([key, scenario]) => (
              <Card 
                key={key}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
                  currentScenario === key ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => playScenario(key as keyof typeof demoScenarios)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {key === 'aiSearch' && <Brain className="h-5 w-5 text-primary" />}
                  {key === 'smartBooking' && <Target className="h-5 w-5 text-primary" />}
                  {key === 'automation' && <Rocket className="h-5 w-5 text-primary" />}
                  <h4 className="font-semibold">{scenario.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground">기존 방식</div>
                    <div className="text-sm line-through">{scenario.traditionalTime}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">MOA 방식</div>
                    <div className="text-sm font-bold text-primary">{scenario.expectedTime}</div>
                  </div>
                </div>

                {isPlaying && currentScenario === key && (
                  <div className="mt-3 p-2 bg-primary/10 rounded animate-pulse">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary animate-spin" />
                      <span className="text-sm font-medium">실행 중...</span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* 기술 스택 하이라이트 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              핵심 기술 스택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enhancedDemoData.techHighlights.map((tech, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-medium">{tech.category}</div>
                  <div className="space-y-1">
                    {tech.technologies.map((item, i) => (
                      <Badge key={i} variant="outline" className="mr-1 mb-1">
                        {item}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-primary font-medium">{tech.impact}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* 비즈니스 임팩트 */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              예상 비즈니스 임팩트
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium mb-2">즉시 효과</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 직원 찾기 시간 10분 → 1분</li>
                  <li>• 회의실 예약 5분 → 10초</li>
                  <li>• 업무 요청 처리 1일 → 즉시</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">중장기 효과</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 연간 업무 시간 1,200시간 절약</li>
                  <li>• 공간 운영비 30% 절감</li>
                  <li>• 직원 만족도 96% 달성</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 확장 계획 */}
          <Card className="p-6 border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              확장 로드맵
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Badge>Q1 2025</Badge>
                <span>다국어 지원 및 음성 인식 기능 추가</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">Q2 2025</Badge>
                <span>타 기업 SaaS 서비스로 확장</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline">Q3 2025</Badge>
                <span>IoT 센서 연동 및 실시간 환경 제어</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};