import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Sparkles } from 'lucide-react';

interface DemoModeToggleProps {
  onDemoModeChange: (isDemo: boolean) => void;
}

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ onDemoModeChange }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const toggleDemoMode = () => {
    const newDemoMode = !isDemoMode;
    setIsDemoMode(newDemoMode);
    onDemoModeChange(newDemoMode);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={toggleDemoMode}
        variant={isDemoMode ? "default" : "outline"}
        size="sm"
        className={`shadow-lg ${isDemoMode ? 'animate-pulse' : ''}`}
      >
        {isDemoMode ? <Sparkles className="h-4 w-4 mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
        {isDemoMode ? 'DEMO 모드 ON' : 'DEMO 모드'}
      </Button>
      {isDemoMode && (
        <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs animate-bounce">
          LIVE
        </Badge>
      )}
    </div>
  );
};