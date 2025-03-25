
import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: 'lift' | 'glow' | 'none';
  animation?: 'fade-in' | 'slide-up' | 'zoom-in' | 'none';
  delay?: number;
}

const AnimatedCard = ({
  children,
  className,
  hoverEffect = 'lift',
  animation = 'fade-in',
  delay = 0,
}: AnimatedCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Set loaded state after component mounts
  setTimeout(() => setIsLoaded(true), 10);

  const getAnimationClass = () => {
    if (!isLoaded) return '';
    
    switch (animation) {
      case 'fade-in':
        return 'animate-fade-in';
      case 'slide-up':
        return 'animate-slide-up';
      case 'zoom-in':
        return 'animate-zoom-in';
      default:
        return '';
    }
  };

  const getHoverClass = () => {
    switch (hoverEffect) {
      case 'lift':
        return 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg';
      case 'glow':
        return 'transition-shadow duration-300 hover:shadow-md hover:shadow-primary/20';
      default:
        return '';
    }
  };
  
  const style = delay ? { animationDelay: `${delay}ms` } : {};

  return (
    <div
      className={cn(
        'rounded-xl bg-card p-6 shadow-sm',
        getHoverClass(),
        getAnimationClass(),
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
