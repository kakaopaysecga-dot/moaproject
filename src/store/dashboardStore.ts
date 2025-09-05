import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DashboardWidget {
  id: string;
  name: string;
  component: string;
  size: 'small' | 'medium' | 'large' | 'full';
  isVisible: boolean;
  order: number;
}

interface DashboardState {
  widgets: DashboardWidget[];
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  reorderWidgets: (newOrder: DashboardWidget[]) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  resetToDefault: () => void;
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'status-summary',
    name: '실시간 상태',
    component: 'StatusSummary',
    size: 'full',
    isVisible: true,
    order: 0
  },
  {
    id: 'quick-stats',
    name: '빠른 통계',
    component: 'QuickStats',
    size: 'full',
    isVisible: true,
    order: 1
  },
  {
    id: 'quick-actions',
    name: '빠른 예약',
    component: 'QuickActions',
    size: 'large',
    isVisible: true,
    order: 2
  },
  {
    id: 'ai-people-finder',
    name: 'AI 사람찾기',
    component: 'AIPeopleFinder',
    size: 'medium',
    isVisible: true,
    order: 3
  },
  {
    id: 'service-cards',
    name: '서비스 메뉴',
    component: 'ServiceCards',
    size: 'full',
    isVisible: true,
    order: 4
  },
  {
    id: 'today-schedule',
    name: '오늘의 일정',
    component: 'TodaySchedule',
    size: 'large',
    isVisible: true,
    order: 5
  }
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: defaultWidgets,
      isEditMode: false,
      setEditMode: (mode) => set({ isEditMode: mode }),
      reorderWidgets: (newOrder) => 
        set({ widgets: newOrder.map((widget, index) => ({ ...widget, order: index })) }),
      toggleWidgetVisibility: (widgetId) =>
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === widgetId
              ? { ...widget, isVisible: !widget.isVisible }
              : widget
          )
        })),
      resetToDefault: () => set({ widgets: defaultWidgets, isEditMode: false })
    }),
    {
      name: 'dashboard-settings',
      version: 1
    }
  )
);