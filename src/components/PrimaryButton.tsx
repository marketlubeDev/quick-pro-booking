
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'accent';
  size?: 'sm' | 'default' | 'lg';
  type?: 'button' | 'submit';
}

const PrimaryButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'accent',
  size = 'default',
  type = 'button'
}: PrimaryButtonProps) => {
  const baseClasses = "ripple-effect font-heading font-semibold transition-all duration-200 hover:scale-105";
  const variantClasses = variant === 'primary' 
    ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
    : "bg-accent hover:bg-accent/90 text-accent-foreground";

  return (
    <Button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      size={size}
      type={type}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
