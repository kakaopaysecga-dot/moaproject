import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

export default function BookingSelect() {
  return (
    <div className="py-8 space-y-10">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-3xl font-bold tracking-tight">예약 서비스</h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
          좌석 및 회의실을 예약하세요
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl mx-auto">
        {/* 스마트오피스 예약 카드 */}
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto p-4 bg-primary/10 rounded-2xl w-fit mb-4 shadow-sm">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">스마트오피스 좌석</CardTitle>
            <p className="text-muted-foreground text-base leading-relaxed mt-2">
              개인 업무용 좌석을 예약하세요
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="bg-muted/30 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-lg text-foreground mb-4">이용 안내</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">예약 가능 기간</span>
                  <span className="font-semibold bg-primary/10 px-3 py-1 rounded-full">오늘부터 3일</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">이용 시간</span>
                  <span className="font-semibold bg-accent/10 px-3 py-1 rounded-full">09:00 - 18:30</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">좌석 수</span>
                  <span className="font-semibold bg-success/10 px-3 py-1 rounded-full">10석 운영</span>
                </div>
              </div>
            </div>
            <Button asChild className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg">
              <Link to="/booking/reserve">
                스마트오피스 예약하기
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* 회의실 예약 카드 */}
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto p-4 bg-accent/10 rounded-2xl w-fit mb-4 shadow-sm">
              <Users className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold">회의실 예약</CardTitle>
            <p className="text-muted-foreground text-base leading-relaxed mt-2">
              팀 회의 및 미팅을 위한 회의실을 예약하세요
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <div className="bg-muted/30 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-lg text-foreground mb-4">이용 안내</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">예약 가능 기간</span>
                  <span className="font-semibold bg-primary/10 px-3 py-1 rounded-full">제한 없음</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">이용 시간</span>
                  <span className="font-semibold bg-accent/10 px-3 py-1 rounded-full">09:00 - 18:30</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">회의실 수</span>
                  <span className="font-semibold bg-success/10 px-3 py-1 rounded-full">판교 19개, 여의도 7개</span>
                </div>
              </div>
            </div>
            <Button asChild className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-accent to-corporate-blue hover:from-accent/90 hover:to-corporate-blue/90 shadow-lg">
              <Link to="/booking/reserve">
                회의실 예약하기
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 하단 여백 */}
      <div className="h-6" />
    </div>
  );
}