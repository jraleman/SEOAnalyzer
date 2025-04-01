import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye, Wrench } from 'lucide-react';

export default function EmptyState() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
          <Search className="w-full h-full" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Enter a URL to analyze SEO meta tags</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Discover how well your website's meta tags are optimized for search engines and social media platforms.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">SEO Analysis</h3>
            <p className="text-sm text-gray-600">Check if your meta tags follow SEO best practices.</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Preview Results</h3>
            <p className="text-sm text-gray-600">See how your site appears in Google and social media.</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Get Recommendations</h3>
            <p className="text-sm text-gray-600">Receive actionable tips to improve your meta tags.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
