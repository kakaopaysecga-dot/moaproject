import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

export default function BookingSelect() {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">예약 서비스</h1>
        <p className="text-muted-foreground">스마트오피스 좌석 또는 회의실을 예약하세요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">스마트오피스</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              개인 업무용 좌석을 예약하세요
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>예약 가능 기간:</span>
                <span className="font-medium">오늘부터 3일</span>
              </div>
              <div className="flex justify-between">
                <span>이용 시간:</span>
                <span className="font-medium">09:00 - 18:30</span>
              </div>
              <div className="flex justify-between">
                <span>좌석 수:</span>
                <span className="font-medium">10석</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link to="/booking/smart-office">
                스마트오피스 예약
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-accent/10 rounded-lg w-fit">
              <Users className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-xl">회의실</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              회의실을 예약하세요
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>예약 가능 기간:</span>
                <span className="font-medium">제한 없음</span>
              </div>
              <div className="flex justify-between">
                <span>이용 시간:</span>
                <span className="font-medium">09:00 - 18:30</span>
              </div>
              <div className="flex justify-between">
                <span>회의실 수:</span>
                <span className="font-medium">판교 19개, 여의도 7개</span>
              </div>
            </div>
            <Button asChild variant="secondary" className="w-full" disabled>
              <span>
                회의실 예약 (준비중)
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}