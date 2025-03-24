
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <Link to="/" className="flex items-center">
      <div className={`${sizes[size]} rounded-md flex items-center justify-center`}>
        <img 
          src="/lovable-uploads/f86f3e29-c77f-4048-8b94-919af964812c.png" 
          alt="FindYOUth Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="ml-2 text-xl font-semibold text-white">
        Find<span className="text-yellow-400">YOUth</span>
      </span>
    </Link>
  );
};

export default Logo;
