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
    <section className="relative text-center space-y-6 p-6 rounded-3xl bg-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/10"></div>
      </div>
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="w-16 h-16 bg-accent/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
          <span className="text-white font-bold text-2xl drop-shadow-sm">{userEnglishName?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
        <div className="flex-1 text-left space-y-1">
          <h1 className="text-xl font-bold text-white drop-shadow-sm">
            안녕하세요, {userEnglishName}님
          </h1>
          <div className="space-y-0.5">
            <p className="text-white/90 text-sm font-medium">팀명: {userDept}</p>
            <p className="text-white/90 text-sm font-medium">오피스명: {userBuilding}</p>
            <p className="text-white/90 text-sm font-medium">근무위치: {userWorkArea}</p>
          </div>
        </div>
      </div>
    </section>
  );
};