import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AdminPanel: React.FC = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold px-1 flex items-center">
        <span className="w-1 h-6 bg-gradient-to-b from-destructive to-primary rounded-full mr-3"></span>
        관리자 도구
      </h2>
      <Card className="border-0 bg-gradient-to-br from-destructive/10 to-primary/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-destructive to-primary rounded-2xl shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">관리자 페이지</h3>
                <p className="text-sm text-muted-foreground">
                  요청 관리 및 시스템 설정
                </p>
              </div>
            </div>
            <Button asChild className="h-12 px-6 bg-gradient-to-r from-destructive to-primary hover:from-destructive/90 hover:to-primary/90 text-white font-medium shadow-lg">
              <Link to="/admin">
                관리하기
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};