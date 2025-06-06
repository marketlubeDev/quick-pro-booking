
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface Service {
  id: number;
  title: string;
  image: string;
  description: string;
  price: string;
  rating: number;
}

interface ServiceSliderProps {
  services: Service[];
}

const ServiceSlider = ({ services }: ServiceSliderProps) => {
  const handleServiceClick = (serviceId: number) => {
    window.location.href = `/services/detail/${serviceId}`;
  };

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {services.map((service) => (
          <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
            <Card 
              className="cursor-pointer hover-lift hover:shadow-lg transition-all duration-200"
              onClick={() => handleServiceClick(service.id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                    {service.price}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{service.rating}</span>
                    </div>
                    <Badge variant="secondary">Book Now</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ServiceSlider;
