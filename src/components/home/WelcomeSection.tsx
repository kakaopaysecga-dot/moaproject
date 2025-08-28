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
  userWorkArea,
}) => {
  return (
    <section className="relative text-center space-y-6 p-6 rounded-3xl bg-gradient-to-br from-primary via-primary to-accent overflow-hidden animate-fade-in">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      <div className="relative z-10 animate-scale-in">
        {/* Enhanced avatar with Kakao branding */}
        <div className="mx-auto w-20 h-20 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/50 animate-bounce-subtle">
          <span className="text-kakao-dark font-bold text-3xl">{userEnglishName?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
        
        <div className="space-y-3 animate-slide-up">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            안녕하세요, {userEnglishName}님
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/90 font-medium">
            <span className="px-2 py-1 bg-white/20 rounded-full text-sm">팀: {userDept}</span>
            <span className="px-2 py-1 bg-white/20 rounded-full text-sm">오피스: {userBuilding}</span>
          </div>
          <p className="text-white/80 text-sm">
            근무지: {userWorkArea}
          </p>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer -translate-x-full"></div>
    </section>
  );
};