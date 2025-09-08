import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Brain, Target } from 'lucide-react';

interface DemoSearchEnhancementProps {
  isDemo: boolean;
  searchQuery: string;
  onSearchComplete?: (results: any[]) => void;
}

export const DemoSearchEnhancement: React.FC<DemoSearchEnhancementProps> = ({ 
  isDemo, 
  searchQuery, 
  onSearchComplete 
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);

  useEffect(() => {
    if (isDemo && searchQuery && searchQuery.length >= 2) {
      setIsAnalyzing(true);
      setAnalysisSteps([]);

      const steps = [
        'AI 자연어 처리 중...',
        '실시간 위치 데이터 분석...',
        '일정 매칭 알고리즘 실행...',
        '최적화된 결과 생성...'
      ];

      steps.forEach((step, index) => {
        setTimeout(() => {
          setAnalysisSteps(prev => [...prev, step]);
          if (index === steps.length - 1) {
            setTimeout(() => {
              setIsAnalyzing(false);
              onSearchComplete?.([]);
            }, 500);
          }
        }, index * 250);
      });
    }
  }, [isDemo, searchQuery, onSearchComplete]);

  if (!isDemo || !isAnalyzing) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2">
      <div className="bg-background/95 backdrop-blur-lg border border-primary/20 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">AI 분석 중</span>
          <Badge variant="outline" className="text-xs animate-pulse">LIVE</Badge>
        </div>
        
        <div className="space-y-2">
          {analysisSteps.map((step, index) => (
            <div key={index} className="flex items-center gap-2 text-sm animate-fade-in">
              <div className="flex items-center gap-1">
                {index === analysisSteps.length - 1 ? (
                  <Sparkles className="h-3 w-3 text-primary animate-spin" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-primary/20 animate-pulse" />
                )}
              </div>
              <span className="text-muted-foreground">{step}</span>
              {index === analysisSteps.length - 1 && (
                <Zap className="h-3 w-3 text-yellow-500 animate-bounce" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>정확도: 99.2%</span>
            <span>처리 시간: {((analysisSteps.length * 250) / 1000).toFixed(1)}초</span>
          </div>
        </div>
      </div>
    </div>
  );
};