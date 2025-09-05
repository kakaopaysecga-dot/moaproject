import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface FloatingActionButtonProps {
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  className 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const navigate = useNavigate();

  const handleActionClick = (actionType: string) => {
    setIsExpanded(false); // 버튼 클릭 후 메뉴 닫기
    
    switch (actionType) {
      case 'booking':
        // 빠른예약 기능 - QuickActions 섹션으로 스크롤
        if (window.location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            const quickActionsElement = document.getElementById('quick-actions');
            if (quickActionsElement) {
              quickActionsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // 애니메이션 효과 추가
              quickActionsElement.classList.add('animate-pulse');
              setTimeout(() => {
                quickActionsElement.classList.remove('animate-pulse');
                quickActionsElement.classList.add('animate-scale-in');
              }, 500);
            }
          }, 100);
        } else {
          const quickActionsElement = document.getElementById('quick-actions');
          if (quickActionsElement) {
            quickActionsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 애니메이션 효과 추가
            quickActionsElement.classList.add('animate-pulse');
            setTimeout(() => {
              quickActionsElement.classList.remove('animate-pulse');
              quickActionsElement.classList.add('animate-scale-in');
            }, 500);
          }
        }
        break;
      case 'colleagues':
        // AIPeopleFinder 기능 (홈페이지의 해당 섹션으로 스크롤)
        if (window.location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            const peopleFinderElement = document.getElementById('ai-people-finder');
            if (peopleFinderElement) {
              peopleFinderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
               // 애니메이션 효과 및 포커스
               peopleFinderElement.classList.add('animate-pulse');
               setTimeout(() => {
                 peopleFinderElement.classList.remove('animate-pulse');
                 peopleFinderElement.classList.add('animate-scale-in');
                 // 검색창에 포커스
                 if ((window as any).focusPeopleFinderSearch) {
                   (window as any).focusPeopleFinderSearch();
                 }
               }, 500);
            }
          }, 100);
        } else {
          const peopleFinderElement = document.getElementById('ai-people-finder');
          if (peopleFinderElement) {
            peopleFinderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 애니메이션 효과 및 포커스
            peopleFinderElement.classList.add('animate-pulse');
            setTimeout(() => {
              peopleFinderElement.classList.remove('animate-pulse');
              peopleFinderElement.classList.add('animate-scale-in');
              // 검색창에 포커스
              if ((window as any).focusPeopleFinderSearch) {
                (window as any).focusPeopleFinderSearch();
              }
            }, 500);
          }
        }
        break;
      default:
        console.log('Unknown action:', actionType);
    }
  };

  const quickActions = [
    {
      icon: Calendar,
      label: '빠른 예약',
      color: 'bg-primary text-primary-foreground hover:bg-primary/90',
      action: () => handleActionClick('booking')
    },
    {
      icon: Users,
      label: '동료 찾기',
      color: 'bg-accent text-accent-foreground hover:bg-accent/90',
      action: () => handleActionClick('colleagues')
    }
  ];

  return (
    <div className={cn(
      "fixed bottom-24 right-4 z-40 flex flex-col-reverse items-end gap-3",
      className
    )}>
      {/* 확장된 액션 버튼들 */}
      {isExpanded && (
        <div className="flex flex-col gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              className={cn(
                "shadow-lg animate-in slide-in-from-bottom-2 duration-200",
                action.color
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={action.action}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* 메인 FAB */}
      <Button
        size="lg"
        className={cn(
          "w-14 h-14 rounded-full shadow-xl transition-all duration-300",
          "bg-gradient-to-r from-primary to-accent text-white",
          isExpanded && "rotate-45"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};