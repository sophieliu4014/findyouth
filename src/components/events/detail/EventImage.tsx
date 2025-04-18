
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

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
          {/* Main image */}
          <div className="w-full flex justify-center">
            <img 
              src={allImages[0]} 
              alt={title} 
              className="max-w-full rounded-lg max-h-[500px] object-contain"
            />
          </div>

          {/* Additional images grid */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {allImages.slice(1).map((url, index) => (
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
