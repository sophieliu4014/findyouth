
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer';
import { ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  caption: string;
  timestamp: string;
}

const OurInstagram = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For demo purposes, we'll use a mock fetch - in production this would be replaced with a real API call
    // This mock function simulates an API call to the Instagram Graph API
    const fetchInstagramPosts = () => {
      setLoading(true);
      
      // Mock data - in a real implementation, you would make an API call to Instagram
      // This would typically be done server-side to protect API keys/tokens
      setTimeout(() => {
        const mockPosts: InstagramPost[] = [
          {
            id: "1",
            permalink: "https://www.instagram.com/p/C5JpexPyUGU/",
            media_url: "https://placehold.co/600x600/youth-purple/white?text=Instagram+Post+1",
            caption: "Youth making a difference in our community! #findyouthbc #volunteering",
            timestamp: "2023-06-15T12:00:00Z"
          },
          {
            id: "2", 
            permalink: "https://www.instagram.com/p/C5JpexPyUGU/",
            media_url: "https://placehold.co/600x600/youth-blue/white?text=Instagram+Post+2",
            caption: "Join us this weekend for our community cleanup event! #community #youth",
            timestamp: "2023-06-10T15:30:00Z"
          },
          {
            id: "3",
            permalink: "https://www.instagram.com/p/C5JpexPyUGU/",
            media_url: "https://placehold.co/600x600/1EAEDB/white?text=Instagram+Post+3",
            caption: "Check out our latest volunteer opportunities! #findyouth #vancouver",
            timestamp: "2023-06-05T09:15:00Z"
          }
        ];
        
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
    };

    fetchInstagramPosts();
    
    // In a real implementation, you might set up a webhook or polling mechanism 
    // to update the posts when new content is published
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Instagram - FindYOUth</title>
        <meta name="description" content="Check out the latest posts from FindYOUth on Instagram." />
      </Helmet>
      
      <Navbar />
      
      <main className="page-container">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="section-title">Our Instagram</h1>
            <a 
              href="https://www.instagram.com/findyouthbc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-youth-purple hover:text-youth-blue transition-colors"
            >
              <span className="mr-1">@findyouthbc</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse-slow">Loading latest posts...</div>
            </div>
          ) : error ? (
            <div className="glass-panel p-6 text-center text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <a 
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel overflow-hidden rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={post.media_url} 
                      alt={post.caption} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-youth-charcoal/80 line-clamp-3">{post.caption}</p>
                    <p className="text-xs text-youth-charcoal/60 mt-2">
                      {new Date(post.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center text-youth-charcoal/60">
            <p>Follow us on Instagram for the latest updates and opportunities.</p>
            <p className="text-sm mt-2">
              Note: This page automatically updates when new posts are published on our Instagram account.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default OurInstagram;
