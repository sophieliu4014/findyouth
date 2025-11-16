
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EventImageProps {
  imageUrl?: string;
  additionalImageUrls?: string[];
  title: string;
}

const EventImage = ({ imageUrl, additionalImageUrls = [], title }: EventImageProps) => {
  const allImages = imageUrl ? [imageUrl, ...additionalImageUrls] : additionalImageUrls;

  if (allImages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Event Gallery</h2>
        <div className="space-y-4">
          {/* Main carousel for all images */}
          <Carousel 
            className="w-full max-w-3xl mx-auto relative" 
            opts={{ loop: true }}
          >
            <CarouselContent>
              {allImages.map((url, index) => (
                <CarouselItem key={url}>
                  <div className="flex justify-center p-1">
                    <img
                      src={url}
                      alt={`${title} - Image ${index + 1}`}
                      className="max-w-full rounded-lg max-h-[500px] object-contain"
                    />
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

          {/* Thumbnail grid */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {allImages.map((url, index) => (
                <div key={url} className="aspect-video">
                  <img
                    src={url}
                    alt={`${title} - Image ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventImage;
