
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NonprofitHeaderProps {
  title: string;
}

const NonprofitHeader = ({ title }: NonprofitHeaderProps) => {
  return (
    <div className="mb-8">
      <Link 
        to="/find-activities" 
        className="inline-flex items-center text-youth-blue hover:text-youth-purple"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Activities
      </Link>
      {title && (
        <h1 className="text-3xl font-bold text-youth-charcoal mt-4">
          {title}
        </h1>
      )}
    </div>
  );
};

export default NonprofitHeader;
