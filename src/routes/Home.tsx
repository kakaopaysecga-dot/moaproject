import React, { Suspense, memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { WelcomeSection } from '@/components/home/WelcomeSection';
import { ServiceCards } from '@/components/home/ServiceCards';
import { QuickActions } from '@/components/home/QuickActions';
import { AIPeopleFinder } from '@/components/home/AIPeopleFinder';
import { TodaySchedule } from '@/components/home/TodaySchedule';
import { StatusSummary } from '@/components/home/StatusSummary';
import { QuickStats } from '@/components/home/QuickStats';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { DashboardCustomizer } from '@/components/home/DashboardCustomizer';
import { DraggableWidget } from '@/components/home/DraggableWidget';
import { useDashboardStore } from '@/store/dashboardStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Edit3, Check } from 'lucide-react';

// Lazy load admin components for better performance
const AdminPanel = React.lazy(() => import('@/components/home/AdminPanel').then(module => ({ default: module.AdminPanel })));
const RecentActivity = React.lazy(() => import('@/components/home/RecentActivity').then(module => ({ default: module.RecentActivity })));

// Enhanced loading component for better UX
const LoadingCard = memo(() => (
  <SkeletonCard className="h-32" showAvatar={true} lines={2} />
));

export default function Home() {
  const { user } = useAuthStore();
  const { widgets, isEditMode, setEditMode, reorderWidgets } = useDashboardStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRefresh = async () => {
    // 실제 데이터 새로고침 로직
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
      const newIndex = widgets.findIndex((widget) => widget.id === over.id);
      
      reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  const visibleWidgets = widgets
    .filter(widget => widget.isVisible || isEditMode)
    .sort((a, b) => a.order - b.order);

  const renderWidget = (widget: any) => {
    switch (widget.component) {
      case 'StatusSummary':
        return <StatusSummary />;
      case 'QuickStats':
        return <QuickStats />;
      case 'QuickActions':
        return <QuickActions />;
      case 'AIPeopleFinder':
        return <AIPeopleFinder />;
      case 'ServiceCards':
        return <ServiceCards />;
      case 'TodaySchedule':
        return <TodaySchedule />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center container-padding">
        <div className="text-center spacing-group">
          <h1 className="text-2xl md:text-3xl font-bold">MOA에 오신 것을 환영합니다</h1>
          <p className="text-lg text-muted-foreground">로그인이 필요합니다.</p>
          <Button asChild size="lg">
            <Link to="/login">로그인</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container-padding spacing-content pb-safe-bottom">
        <div className="flex items-center justify-between mb-6">
          <WelcomeSection 
            userEnglishName={user.englishName}
            userDept={user.dept}
            userBuilding={user.building}
            userWorkArea={user.workArea}
          />
          
          <div className="flex items-center gap-2">
            <DashboardCustomizer />
            <Button
              variant={isEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEditMode(!isEditMode)}
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <Check className="h-4 w-4" />
                  완료
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  편집
                </>
              )}
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={visibleWidgets.map(w => w.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {visibleWidgets.map((widget) => (
                <DraggableWidget key={widget.id} widget={widget}>
                  {renderWidget(widget)}
                </DraggableWidget>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {/* 관리자 전용 */}
        {user.isAdmin && (
          <section className="spacing-group mt-8">
            <h2 className="text-lg font-semibold text-foreground">관리자 도구</h2>
            <div className="spacing-items">
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard />}>
                  <RecentActivity />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard />}>
                  <AdminPanel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </section>
        )}
        
        {/* Footer Space for Mobile Navigation */}
        <div className="h-safe-bottom" />
      </div>
    </PullToRefresh>
  );
}