import { Card, CardContent } from '@/components/ui/card';
import { Recommendation } from '@shared/schema';
import { Lightbulb } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <div className="flex p-4 bg-green-50 border-l-4 border-green-600 rounded">
            <div className="flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Great job!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your website is well optimized for search engines and social media platforms. We don't have any specific recommendations at this time.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row p-4 bg-blue-50 border-l-4 border-blue-600 rounded"
              data-recommendation="true"
              data-title={rec.title}
              data-description={rec.description}
              data-code={rec.code || ''}
            >
              <div className="flex-shrink-0 mb-2 sm:mb-0">
                <Lightbulb className="h-5 w-5 text-blue-600" />
              </div>
              <div className="sm:ml-3">
                <h3 className="text-sm font-medium text-blue-800">{rec.title}</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>{rec.description}</p>
                  {rec.code && (
                    <div className="mt-2 p-2 bg-white rounded text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                      {rec.code}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
