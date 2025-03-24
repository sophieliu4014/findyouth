
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Book, Dumbbell, Stethoscope, PaintBucket, 
  Leaf, Home, Dog, Baby, Users, Cross
} from 'lucide-react';

const causeAreas = [
  { name: "Advocacy & Human Rights", icon: Heart },
  { name: "Education", icon: Book },
  { name: "Sports", icon: Dumbbell },
  { name: "Health", icon: Stethoscope },
  { name: "Arts & Culture", icon: PaintBucket },
  { name: "Environment", icon: Leaf },
  { name: "Homeless", icon: Home },
  { name: "Animals", icon: Dog },
  { name: "Youth", icon: Baby },
  { name: "Seniors", icon: Users },
  { name: "Religion", icon: Cross }
];

const CauseAreas = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Add staggered animation on component mount
  useEffect(() => {
    setAnimationComplete(true);
  }, []);

  // Handle click on cause area button
  const handleCauseClick = (causeName: string) => {
    // Navigate to find-activities page with the cause filter
    navigate('/find-activities', { 
      state: { 
        cause: causeName 
      }
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-youth-softgray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-youth-charcoal mb-4">
            Volunteer by Cause Area
          </h2>
          <p className="text-xl text-youth-charcoal/70 max-w-3xl mx-auto">
            Explore volunteer opportunities by the causes you're most passionate about
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8">
          {causeAreas.map((cause, index) => {
            const Icon = cause.icon;
            return (
              <button 
                key={index}
                onClick={() => handleCauseClick(cause.name)}
                className={`glass-panel p-6 text-center transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] 
                  ${activeIndex === index ? 'ring-2 ring-youth-purple shadow-lg' : ''}
                  ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  animationDelay: `${index * 50}ms` 
                }}
              >
                <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 
                  ${activeIndex === index 
                    ? 'bg-youth-purple text-white' 
                    : 'bg-youth-purple/10 text-youth-purple'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-medium text-youth-charcoal">{cause.name}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => navigate('/find-activities')}
            className="inline-flex items-center justify-center bg-youth-blue hover:bg-youth-blue/90 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View All Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default CauseAreas;
