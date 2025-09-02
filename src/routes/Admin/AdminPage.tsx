import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { AdminService } from '@/services/adminService';
import { Settings, Filter, Shield } from 'lucide-react';
import { RequestStatus, RequestItem } from '@/types';

export default function AdminPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (!user) {
      setError('로그인이 필요합니다.');
      setIsLoading(false);
      return;
    }

    if (!user.isAdmin) {
      setError('관리자 권한이 필요합니다.');
      setIsLoading(false);
      return;
    }

    loadAllRequests();
  }, [user]);

  const loadAllRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const requests = await AdminService.getAllRequests(filter);
      setRequests(requests);
    } catch (error) {
      setError(error instanceof Error ? error.message : '요청을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
    try {
      await AdminService.updateRequestStatus(requestId, newStatus);
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      toast({
        title: "상태 변경",
        description: "요청 상태가 변경되었습니다."
      });
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : '상태 변경에 실패했습니다.',
        variant: "destructive"
      });
    }
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

  const handleFilterChange = (newFilter: RequestStatus | 'all') => {
    setFilter(newFilter);
    // Reload requests with new filter
    setTimeout(() => loadAllRequests(), 0);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">로그인 필요</h2>
        <p className="text-muted-foreground">관리자 페이지에 접근하려면 로그인이 필요합니다.</p>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Shield className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">접근 권한 없음</h2>
        <p className="text-muted-foreground">관리자 권한이 필요합니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">요청을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Shield className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold text-destructive">오류 발생</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={loadAllRequests}>다시 시도</Button>
      </div>
    );
  }

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
            <Tabs value={filter} onValueChange={handleFilterChange}>
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