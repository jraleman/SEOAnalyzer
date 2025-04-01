import { useState } from 'react';
import UrlForm from '@/components/UrlForm';
import SeoResults from '@/components/SeoResults';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import LoadingState from '@/components/LoadingState';
import { SeoAnalysis } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Home() {
  const [url, setUrl] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysis | null>(null);

  const analyzeUrlMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/analyze', { url });
      return response.json() as Promise<SeoAnalysis>;
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setHasError(false);
    },
    onError: (error: Error) => {
      setHasError(true);
      setErrorMessage(error.message || 'Failed to analyze the URL. Please check the URL and try again.');
      toast({
        title: 'Error',
        description: error.message || 'Failed to analyze the URL',
        variant: 'destructive',
      });
    },
  });

  const handleAnalyzeUrl = (url: string) => {
    setUrl(url);
    analyzeUrlMutation.mutate(url);
  };

  const handleTryAgain = () => {
    setHasError(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">SEO Meta Tag Analyzer</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-2">
          Check and analyze SEO meta tags from any website to ensure optimal search engine and social media presence.
        </p>
      </header>

      <UrlForm onSubmit={handleAnalyzeUrl} isLoading={analyzeUrlMutation.isPending} />

      {analyzeUrlMutation.isPending && <LoadingState />}
      
      {hasError && (
        <ErrorState 
          errorMessage={errorMessage} 
          onTryAgain={handleTryAgain} 
        />
      )}
      
      {!analyzeUrlMutation.isPending && !hasError && analysisResult && (
        <SeoResults 
          analysis={analysisResult}
        />
      )}
      
      {!analyzeUrlMutation.isPending && !hasError && !analysisResult && !url && (
        <EmptyState />
      )}

      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>SEO Meta Tag Analyzer &copy; {new Date().getFullYear()} | Check meta tags for better search engine optimization</p>
      </footer>
    </div>
  );
}
