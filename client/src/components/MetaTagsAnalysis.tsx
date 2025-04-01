import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MetaTag, SeoAnalysis } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Printer, FileDown, ChevronDown, ChevronUp, Tags, Share, Settings, Check, AlertTriangle, Info, XCircle } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { exportToPdf } from '@/lib/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface MetaTagsAnalysisProps {
  basicMetaTags: MetaTag[];
  socialMetaTags: MetaTag[];
  technicalMetaTags: MetaTag[];
}

const TagIcon = ({ status }: { status?: MetaTag['status'] }) => {
  if (!status) return null;
  
  switch (status) {
    case 'good':
      return <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-1"></span>;
    case 'warning':
      return <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>;
    case 'error':
      return <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-1"></span>;
    case 'info':
      return <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1"></span>;
    default:
      return null;
  }
};

const StatusLabel = ({ status }: { status?: MetaTag['status'] }) => {
  if (!status) return null;
  
  const labels = {
    good: 'Good',
    warning: 'Needs Improvement',
    error: 'Missing',
    info: 'Low Impact'
  };
  
  const colors = {
    good: 'text-green-600',
    warning: 'text-amber-500',
    error: 'text-red-600',
    info: 'text-gray-500'
  };
  
  return (
    <div className="flex items-center">
      <TagIcon status={status} />
      <span className={cn("text-sm", colors[status])}>{labels[status]}</span>
    </div>
  );
};

const MessageIcon = ({ status }: { status?: MetaTag['status'] }) => {
  if (!status) return null;
  
  switch (status) {
    case 'good':
      return <Check className="h-4 w-4 text-green-600 mr-1" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-600 mr-1" />;
    case 'info':
      return <Info className="h-4 w-4 text-gray-400 mr-1" />;
    default:
      return null;
  }
};

const MetaTagItem = ({ tag }: { tag: MetaTag }) => {
  const { name, property, content, rel, href, status, missing, message } = tag;
  
  // Construct tag name
  let tagName = name || property || rel || '';
  
  // Format the tag for display
  let tagFormat = '';
  if (name) {
    tagFormat = `<meta name="${name}" content="${content}">`;
  } else if (property) {
    tagFormat = `<meta property="${property}" content="${content}">`;
  } else if (rel) {
    tagFormat = `<link rel="${rel}" href="${href}">`;
  }
  
  if (missing) {
    tagFormat = `No ${tagName} tag found.`;
  }
  
  return (
    <div className="py-3 border-t border-gray-100 first:border-0">
      <div className="flex justify-between mb-1">
        <div className="font-medium text-gray-700">{tagName}</div>
        <StatusLabel status={status} />
      </div>
      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono overflow-x-auto">
        <div className="whitespace-pre-wrap break-all">
          {tagFormat}
        </div>
      </div>
      {message && (
        <div className="flex mt-2">
          <div className="text-xs text-gray-500 flex items-start">
            <MessageIcon status={status} />
            <span>{message}</span>
          </div>
        </div>
      )}
      {tag.property === 'og:image' && content && (
        <div className="mt-2 bg-gray-100 p-2 rounded">
          <img 
            src={content} 
            className="w-32 h-16 object-cover rounded" 
            alt="OG Image preview" 
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=200&h=100';
              e.currentTarget.alt = 'Fallback image (original could not be loaded)';
            }}
          />
        </div>
      )}
    </div>
  );
};

const MetaTagSection = ({ 
  title, 
  icon, 
  tags, 
  badgeText,
  badgeColor = "bg-blue-100 text-blue-800" 
}: { 
  title: string; 
  icon: React.ReactNode; 
  tags: MetaTag[];
  badgeText: string;
  badgeColor?: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-md mb-4">
      <CollapsibleTrigger className="w-full px-4 py-3 text-left font-medium flex justify-between items-center focus:outline-none">
        <div className="flex flex-wrap items-center gap-2">
          {icon}
          <span className="mr-1">{title}</span>
          <Badge variant="outline" className={cn("px-2 py-0.5 text-xs rounded-full", badgeColor)}>{badgeText}</Badge>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-3">
        {tags.map((tag, index) => (
          <MetaTagItem key={index} tag={tag} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function MetaTagsAnalysis({ basicMetaTags, socialMetaTags, technicalMetaTags }: MetaTagsAnalysisProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  // Get the full analysis data from SeoResults props
  const getFullAnalysisData = (): SeoAnalysis | null => {
    // Get the parent component's props through DOM traversal
    // This is needed because we don't have direct access to the full analysis object
    const seoResultsElement = document.querySelector('[data-seo-analysis]');
    if (!seoResultsElement) return null;
    
    const url = seoResultsElement.getAttribute('data-url') || '';
    const pageTitle = seoResultsElement.getAttribute('data-page-title') || '';
    const seoScore = parseInt(seoResultsElement.getAttribute('data-seo-score') || '0');
    const metaTagsCount = parseInt(seoResultsElement.getAttribute('data-meta-tags-count') || '0');
    const issuesCount = parseInt(seoResultsElement.getAttribute('data-issues-count') || '0');
    
    // Construct the analysis object
    return {
      url,
      pageTitle,
      seoScore,
      metaTagsCount,
      issuesCount,
      basicMetaTags,
      socialMetaTags,
      technicalMetaTags,
      recommendations: [] // We'll get this from another data attribute if needed
    };
  };
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const analysisData = getFullAnalysisData();
      if (!analysisData) {
        toast({
          title: "Export Failed",
          description: "Could not access complete analysis data. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Get recommendations from DOM if available
      const recommendationsElements = document.querySelectorAll('[data-recommendation]');
      const recommendations = Array.from(recommendationsElements).map(el => ({
        title: el.getAttribute('data-title') || '',
        description: el.getAttribute('data-description') || '',
        code: el.getAttribute('data-code') || ''
      }));
      
      // Include recommendations in the analysis data
      const fullAnalysis: SeoAnalysis = {
        ...analysisData,
        recommendations
      };
      
      // Export to PDF
      await exportToPdf(fullAnalysis);
      
      toast({
        title: "Export Complete",
        description: "SEO Analysis exported to PDF successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <h2 className="text-xl font-semibold">Meta Tags Analysis</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4 mr-1" /> Export to PDF
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </div>
        </div>
        
        <MetaTagSection 
          title="Basic SEO Meta Tags" 
          icon={<Tags className="text-blue-600 mr-2 h-4 w-4" />} 
          tags={basicMetaTags} 
          badgeText="Core"
          badgeColor="bg-blue-100 text-blue-800"
        />
        
        <MetaTagSection 
          title="Open Graph (Social Media) Tags" 
          icon={<Share className="text-blue-600 mr-2 h-4 w-4" />} 
          tags={socialMetaTags} 
          badgeText="Social"
          badgeColor="bg-green-100 text-green-800"
        />
        
        <MetaTagSection 
          title="Technical Meta Tags" 
          icon={<Settings className="text-blue-600 mr-2 h-4 w-4" />} 
          tags={technicalMetaTags} 
          badgeText="Technical"
          badgeColor="bg-purple-100 text-purple-800"
        />
      </CardContent>
    </Card>
  );
}
