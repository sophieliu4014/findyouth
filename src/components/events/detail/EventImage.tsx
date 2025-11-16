import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from '@/components/ui/skeleton';

interface EventImageProps {
  imageUrl?: string;
  additionalImageUrls?: string[];
  title: string;
}

const EventImage = ({ imageUrl, additionalImageUrls = [], title }: EventImageProps) => {
  const allImages = imageUrl ? [imageUrl, ...additionalImageUrls] : additionalImageUrls;
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  if (allImages.length === 0) {
    return null;
  }

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleImageError = (index: number) => {
    setErrorImages(prev => new Set([...prev, index]));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Event Gallery</h2>
        <Carousel 
          className="w-full max-w-3xl mx-auto relative" 
          opts={{ loop: false }}
        >
          <CarouselContent>
            {allImages.map((url, index) => (
              <CarouselItem key={url}>
                <div className="flex justify-center p-1 relative">
                  {!loadedImages.has(index) && !errorImages.has(index) && (
                    <Skeleton className="absolute inset-1 rounded-lg h-[500px]" />
                  )}
                  {!errorImages.has(index) ? (
                    <img
                      src={url}
                      alt={`${title} - Image ${index + 1}`}
                      className="max-w-full rounded-lg max-h-[500px] object-contain"
                      loading={index === 0 ? "eager" : "lazy"}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[500px] w-full bg-muted rounded-lg">
                      <p className="text-muted-foreground">Failed to load image</p>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="left-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background" />
              <CarouselNext className="right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default EventImage;
