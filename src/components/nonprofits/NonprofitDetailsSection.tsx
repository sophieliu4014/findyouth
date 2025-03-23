
import React from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NonprofitDetailsSectionProps {
  nonprofit: {
    id: string;
    organization_name: string;
    description: string;
    mission: string;
    location: string;
    profile_image_url: string | null;
    website: string | null;
    social_media: string;
    causes: string[];
    rating: number;
  };
}

const NonprofitDetailsSection = ({ nonprofit }: NonprofitDetailsSectionProps) => {
  // Render stars for rating
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="glass-panel mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image */}
        <div className="md:w-1/4">
          <div className="w-32 h-32 md:w-full md:h-64 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={nonprofit.profile_image_url || "https://via.placeholder.com/300"} 
              alt={nonprofit.organization_name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Nonprofit Details */}
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold text-youth-charcoal mb-2">
            {nonprofit.organization_name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex mr-4">
              {renderStars(nonprofit.rating)}
            </div>
            
            <div className="flex items-center text-youth-charcoal/70">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{nonprofit.location}</span>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-youth-charcoal mb-2">Cause Areas</h3>
            <div className="flex flex-wrap gap-2">
              {nonprofit.causes.map(cause => (
                <Link 
                  key={cause} 
                  to={`/cause/${encodeURIComponent(cause)}`}
                  className="bg-youth-blue/10 text-youth-blue py-1 px-3 rounded-full text-sm hover:bg-youth-blue/20 transition-colors"
                >
                  {cause}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-youth-charcoal mb-2">Description</h3>
            <p className="text-youth-charcoal/80">{nonprofit.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-youth-charcoal mb-2">Mission</h3>
            <p className="text-youth-charcoal/80">{nonprofit.mission}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {nonprofit.website && (
              <a 
                href={nonprofit.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-youth-blue hover:text-youth-purple"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Website
              </a>
            )}
            <a 
              href={nonprofit.social_media} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-youth-blue hover:text-youth-purple"
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              Social Media
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonprofitDetailsSection;
