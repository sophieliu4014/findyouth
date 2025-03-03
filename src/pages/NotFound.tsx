
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-youth-softgray py-16">
        <div className="max-w-lg w-full mx-auto px-4 sm:px-6">
          <div className="glass-panel p-8 text-center">
            <div className="text-9xl font-bold text-youth-purple mb-4 opacity-60">404</div>
            <h1 className="text-3xl font-bold text-youth-charcoal mb-4">Page Not Found</h1>
            <p className="text-youth-charcoal/70 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn-primary inline-flex">
              Return to Home
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NotFound;
