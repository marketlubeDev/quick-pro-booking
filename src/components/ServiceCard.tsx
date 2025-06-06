
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

const ServiceCard = ({ icon: Icon, title, description, onClick, className = '' }: ServiceCardProps) => {
  return (
    <Card 
      className={`cursor-pointer hover-lift hover:shadow-lg transition-all duration-200 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-heading font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
