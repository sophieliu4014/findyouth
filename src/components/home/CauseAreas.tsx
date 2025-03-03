
import { useState } from 'react';
import { Link } from 'react-router-dom';

const causeAreas = [
  "Advocacy & Human Rights",
  "Education",
  "Sports",
  "Health",
  "Arts & Culture",
  "Environment",
  "Homeless",
  "Animals",
  "Youth",
  "Seniors",
  "Religion"
];

const CauseAreas = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-youth-softgray py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title text-center">Volunteer by Cause Area</h2>
        <p className="section-subtitle text-center">
          Explore volunteer opportunities by the causes you're most passionate about
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
          {causeAreas.map((cause, index) => (
            <Link 
              to={`/find-activities?cause=${encodeURIComponent(cause)}`}
              key={index}
              className={`glass-card p-4 text-center transition-all duration-300 hover:shadow-lg ${activeIndex === index ? 'ring-2 ring-youth-purple' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="font-medium text-youth-charcoal">{cause}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/find-activities" className="btn-primary inline-flex">
            View All Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CauseAreas;
