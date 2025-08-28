import React from 'react';
import { Link } from 'react-router-dom';
import { Thermometer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TemperatureControl: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold px-1 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-warning to-destructive rounded-full mr-3"></span>
        실내 온도 조절
      </h2>
      <Card className="border-0 bg-white shadow-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-accent to-corporate-blue rounded-2xl shadow-lg">
                <Thermometer className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">실내 온도가 불편하신가요?</h3>
                <p className="text-sm text-muted-foreground">
                  온도 조절을 간편하게 요청하세요
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild className="h-12 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                <Link to="/requests/environment?temp=cold" className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🥶</span>
                  <span className="font-medium">추워요</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-12 border-2 border-red-200 hover:bg-red-50 hover:border-red-300">
                <Link to="/requests/environment?temp=hot" className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🔥</span>
                  <span className="font-medium">더워요</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};