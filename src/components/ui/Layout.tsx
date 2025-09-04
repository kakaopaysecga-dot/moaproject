import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  padding?: 'none' | 'sm' | 'normal' | 'lg';
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'normal' | 'lg';
}

interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'large' | 'small' | 'caption';
  className?: string;
}

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className, 
  spacing = 'normal',
  padding = 'normal'
}) => {
  const spacingClasses = {
    tight: 'spacing-tight',
    normal: 'spacing-content', 
    relaxed: 'spacing-group',
    loose: 'spacing-section'
  };

  const paddingClasses = {
    none: '',
    sm: 'container-padding-sm',
    normal: 'container-padding',
    lg: 'container-padding-lg'
  };

  return (
    <section className={cn(
      spacingClasses[spacing],
      paddingClasses[padding],
      className
    )}>
      {children}
    </section>
  );
};

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = 'normal'
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: '',
    sm: 'container-padding-sm',
    normal: 'container-padding',
    lg: 'container-padding-lg'
  };

  return (
    <div className={cn(
      'mx-auto',
      sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  className
}) => {
  const variantClasses = {
    body: 'text-base',
    large: 'text-large',
    small: 'text-small',
    caption: 'text-xs text-muted-foreground'
  };

  return (
    <p className={cn(variantClasses[variant], className)}>
      {children}
    </p>
  );
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  level,
  className
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component className={className}>
      {children}
    </Component>
  );
};