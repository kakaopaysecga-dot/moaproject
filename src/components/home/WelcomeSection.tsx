import React from 'react';
interface WelcomeSectionProps {
  userEnglishName: string;
  userDept: string;
  userBuilding: string;
  userWorkArea: string;
}
export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userEnglishName,
  userDept,
  userBuilding,
  userWorkArea
}) => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? '좋은 아침이에요' : currentHour < 18 ? '오늘도 수고하세요' : '오늘 하루 고생했어요';
  return <section className="relative text-center spacing-items p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary to-accent overflow-hidden">
      {/* Clean minimalist background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/8 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/6 rounded-full translate-y-10 -translate-x-10"></div>
      </div>
      
      <div className="relative z-10">
        {/* Simplified avatar */}
        <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/50 mb-4">
          <span className="text-kakao-dark font-bold text-2xl md:text-3xl">{userEnglishName?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
        
        <div className="spacing-tight">
          <h1 className="md:text-2xl font-bold text-white drop-shadow-lg px-0 text-lg">
            {greeting}, {userEnglishName}님
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90 text-sm md:text-base font-medium">
            <span className="px-3 py-1.5 bg-white/20 rounded-full text-base font-bold">{userDept}</span>
            <span className="px-3 py-1.5 bg-white/20 rounded-full font-bold">{userBuilding}</span>
          </div>
          <p className="text-white/80 text-base md:text-lg">
            {userWorkArea}
          </p>
        </div>
      </div>
    </section>;
};