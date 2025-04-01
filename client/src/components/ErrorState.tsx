import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onTryAgain: () => void;
}

export default function ErrorState({ errorMessage, onTryAgain }: ErrorStateProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to analyze URL</h2>
          <p className="text-gray-600 mb-6">
            We couldn't fetch the meta tags from the provided URL. Please check the URL and try again.
          </p>
          <div className="bg-red-50 border-l-4 border-red-600 p-4 text-left">
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
          <Button 
            onClick={onTryAgain} 
            className="mt-6"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
