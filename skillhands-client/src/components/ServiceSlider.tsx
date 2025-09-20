
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile
      if (window.innerWidth < 1024) return 2; // Tablet
      return 3; // Desktop
    }
    return 1;
  };

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setCurrentIndex(0); // Reset to first slide on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, services.length - cardsPerView);

  const handleServiceClick = (serviceId: number) => {
    if (!isDragging.current) {
      window.location.href = `/services/detail/${serviceId}`;
    }
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX.current) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = startX.current - currentX;
    
    if (Math.abs(diffX) > 10) {
      isDragging.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX.current || !isDragging.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX.current - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentIndex < maxIndex) {
        nextSlide();
      } else if (diffX < 0 && currentIndex > 0) {
        prevSlide();
      }
    }
    
    startX.current = 0;
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  // Calculate the transform percentage
  const getTransformX = () => {
    return -(currentIndex * (100 / cardsPerView));
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${getTransformX()}%)`,
          }}
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`flex-shrink-0 px-2 sm:px-3 ${
                cardsPerView === 1 ? 'w-full' : 
                cardsPerView === 2 ? 'w-1/2' : 'w-1/3'
              }`}
            >
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col"
                onClick={() => handleServiceClick(service.id)}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative flex-shrink-0">
                    <div className="w-full h-48 sm:h-52 md:h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        draggable={false}
                      />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground font-semibold px-3 py-1 text-sm shadow-lg">
                      {service.price}
                    </Badge>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="font-heading font-semibold text-lg sm:text-xl mb-2 line-clamp-2 min-h-[3.5rem]">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-3 flex-grow">
                      {service.description}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{service.rating}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium px-3 py-1 transition-colors duration-200"
                      >
                        Book Now
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-10 h-10 bg-white hover:bg-gray-50 border-2 shadow-lg rounded-full items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-10 h-10 bg-white hover:bg-gray-50 border-2 shadow-lg rounded-full items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-center mt-4">
        <p className="text-sm text-muted-foreground opacity-70">
          ← Swipe to see more services →
        </p>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ServiceSlider;
