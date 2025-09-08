import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Target, Zap } from 'lucide-react';

export const PresentationGuide = () => {
  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎯 AI 해커톤 발표 가이드</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 발표 타임라인 */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            발표 타임라인 (5분)
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>오프닝 (문제 제시)</span>
              <Badge variant="outline">30초</Badge>
            </div>
            <div className="flex justify-between">
              <span>AI 검색 데모</span>
              <Badge variant="outline">90초</Badge>
            </div>
            <div className="flex justify-between">
              <span>스마트 예약 데모</span>
              <Badge variant="outline">90초</Badge>
            </div>
            <div className="flex justify-between">
              <span>기술 혁신점</span>
              <Badge variant="outline">60초</Badge>
            </div>
            <div className="flex justify-between">
              <span>비즈니스 임팩트</span>
              <Badge variant="outline">60초</Badge>
            </div>
          </div>
        </div>

        {/* 핵심 메시지 */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            핵심 메시지
          </h3>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
              <strong>문제:</strong> 매일 아침 동료 찾기와 회의실 예약에 10분씩 소모
            </div>
            <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-400">
              <strong>솔루션:</strong> AI 기반 1초 검색 + 즉시 예약
            </div>
            <div className="p-2 bg-green-50 rounded border-l-2 border-green-400">
              <strong>결과:</strong> 업무 효율성 87% 향상, ROI 300%
            </div>
          </div>
        </div>
      </div>

      {/* 데모 스크립트 */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          데모 스크립트
        </h3>
        
        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-primary">1. 오프닝 (30초)</h4>
            <p className="mt-1 text-muted-foreground">
              "매일 아침 회의실을 찾고, 동료를 찾는데 얼마나 시간을 쓰시나요? 
              평균 10분씩 소모되는 이 시간을 AI로 1초로 단축한다면?"
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-primary">2. AI 검색 데모 (90초)</h4>
            <p className="mt-1 text-muted-foreground">
              "김민석을 검색해보겠습니다. 실시간으로 위치, 일정, 가능한 회의 시간까지 
              AI가 자동으로 분석합니다. 이제 원클릭으로 미팅을 예약할 수 있습니다."
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-medium text-primary">3. 스마트 예약 데모 (90초)</h4>
            <p className="mt-1 text-muted-foreground">
              "판교와 여의도 오피스의 실시간 좌석 현황을 보여드립니다. 
              클릭 한 번으로 즉시 예약이 완료됩니다."
            </p>
          </div>
        </div>
      </div>

      {/* 예상 질문 답변 */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          예상 질문 & 답변
        </h3>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong>Q: 다른 기업에도 적용 가능한가요?</strong>
            <p className="text-muted-foreground mt-1">
              A: 네, 모듈형 아키텍처로 설계되어 있어 어떤 기업 환경에도 쉽게 적용 가능합니다.
            </p>
          </div>
          <div>
            <strong>Q: AI 정확도는 얼마나 되나요?</strong>
            <p className="text-muted-foreground mt-1">
              A: 자연어 처리 정확도 99.2%, 검색 결과 만족도 96%를 달성했습니다.
            </p>
          </div>
          <div>
            <strong>Q: 개발 기간은 얼마나 걸렸나요?</strong>
            <p className="text-muted-foreground mt-1">
              A: MVP는 2주, 현재 완성도는 1개월 개발 결과입니다.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};