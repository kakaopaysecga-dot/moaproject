import React from 'react';

interface WelcomeSectionProps {
  userEnglishName: string;
  userDept: string;
  userBuilding: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userEnglishName,
  userDept,
  userBuilding,
}) => {
  return (
    <section className="relative text-center space-y-6 p-6 rounded-3xl bg-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/10"></div>
      </div>
      
      <div className="relative z-10">
        <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
          <span className="text-white font-bold text-3xl drop-shadow-sm">M</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">
            안녕하세요, {userEnglishName}님
          </h1>
          <p className="text-white/80 font-medium">
            {userDept} · {userBuilding}
          </p>
        </div>
      </div>
    </section>
  );
};