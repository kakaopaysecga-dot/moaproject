import React from 'react';

interface WelcomeSectionProps {
  userEnglishName: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userEnglishName,
}) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? '좋은 아침이에요' : currentHour < 18 ? '오늘도 수고하세요' : '오늘 하루 고생했어요';

  return (
    <section className="relative text-center space-y-4 p-6 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent overflow-hidden">
      {/* Simplified background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
      </div>
      
      <div className="relative z-10">
        {/* Simplified avatar */}
        <div className="mx-auto w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/50 mb-4">
          <span className="text-kakao-dark font-bold text-2xl">{userEnglishName?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white drop-shadow-lg">
            {greeting}, {userEnglishName}님
          </h1>
          <p className="text-white/80 text-sm">
            오늘도 MOA와 함께 효율적인 하루 보내세요
          </p>
        </div>
      </div>
    </section>
  );
};