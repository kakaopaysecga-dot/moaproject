import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRequestsStore } from '@/store/requestsStore';
import { useToast } from '@/hooks/use-toast';
import { Settings, Filter } from 'lucide-react';
import { RequestStatus } from '@/types';

export default function AdminPage() {
  const { requests, updateRequestStatus } = useRequestsStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">대기중</Badge>;
      case 'processing':
        return <Badge variant="default">진행중</Badge>;
      case 'completed':
        return <Badge variant="outline">완료</Badge>;
    }
  };

  const handleStatusUpdate = (requestId: string, newStatus: RequestStatus) => {
    updateRequestStatus(requestId, newStatus);
    toast({
      title: "상태 변경",
      description: "요청 상태가 변경되었습니다."
    });
  };

  const getStatusCounts = () => {
    const counts = {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      processing: requests.filter(r => r.status === 'processing').length,
      completed: requests.filter(r => r.status === 'completed').length
    };
    return counts;
  };

  const counts = getStatusCounts();

  return (
    <div className="py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">관리자 페이지</h1>
        <p className="text-muted-foreground">요청 관리 및 시스템 설정</p>
      </div>

      <div className="space-y-6">
        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{counts.all}</div>
              <div className="text-sm text-muted-foreground">전체</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{counts.pending}</div>
              <div className="text-sm text-muted-foreground">대기중</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{counts.processing}</div>
              <div className="text-sm text-muted-foreground">진행중</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{counts.completed}</div>
              <div className="text-sm text-muted-foreground">완료</div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 요청 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              요청 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(value) => setFilter(value as RequestStatus | 'all')}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">전체 ({counts.all})</TabsTrigger>
                <TabsTrigger value="pending">대기중 ({counts.pending})</TabsTrigger>
                <TabsTrigger value="processing">진행중 ({counts.processing})</TabsTrigger>
                <TabsTrigger value="completed">완료 ({counts.completed})</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {filter === 'all' ? '등록된 요청이 없습니다.' : `${filter} 상태의 요청이 없습니다.`}
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <Card key={request.id} variant="bordered">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{request.title}</h3>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{request.content}</p>
                            <p className="text-xs text-muted-foreground">
                              신청일: {new Date(request.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {request.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(request.id, 'processing')}
                              >
                                진행중으로 변경
                              </Button>
                            )}
                            {request.status === 'processing' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusUpdate(request.id, 'completed')}
                              >
                                완료로 변경
                              </Button>
                            )}
                            {request.status === 'completed' && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleStatusUpdate(request.id, 'processing')}
                              >
                                진행중으로 되돌리기
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}