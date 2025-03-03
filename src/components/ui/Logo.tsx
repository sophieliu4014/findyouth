
import { Link } from 'react-router-dom';

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <Link to="/" className="flex items-center">
      <div className={`${sizes[size]} bg-gradient-to-br from-youth-purple to-youth-blue rounded-md flex items-center justify-center text-white font-bold`}>
        <span className="text-2xl font-bold">Y</span>
      </div>
      <span className="ml-2 text-xl font-semibold text-youth-charcoal">
        Find<span className="text-youth-purple">YOUth</span>
      </span>
    </Link>
  );
};

export default Logo;
