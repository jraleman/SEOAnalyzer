import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreOverviewProps {
  url: string;
  seoScore: number;
  metaTagsCount: number;
  issuesCount: number;
}

export default function ScoreOverview({ url, seoScore, metaTagsCount, issuesCount }: ScoreOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-600';
  };

  const getIssuesColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count < 3) return 'text-amber-500';
    return 'text-red-600';
  };

  const getScoreStrokeColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green-600
    if (score >= 50) return '#F59E0B'; // amber-500
    return '#EF4444'; // red-600
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold mb-2">SEO Score Overview</h2>
          <p className="text-gray-600 mb-4 max-w-3xl overflow-hidden text-ellipsis">
            Based on the analysis of meta tags from <span className="font-medium text-blue-600 break-all">{url}</span>
          </p>
          
          {/* Score Circle - Centered at the top */}
          <div className="w-36 h-36 mb-6 relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={getScoreStrokeColor(seoScore)}
                strokeWidth="3"
                strokeDasharray={`${seoScore}, 100`}
              />
              <text x="18" y="19" className="text-3xl font-bold" textAnchor="middle" fill={getScoreStrokeColor(seoScore)}>
                {seoScore}
              </text>
              <text x="18" y="24" className="text-xs" textAnchor="middle" fill="currentColor">
                /100
              </text>
            </svg>
          </div>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Overall Score</p>
              <div className="flex items-center justify-center">
                <span className={cn("text-2xl font-bold mr-2", getScoreColor(seoScore))}>{seoScore}</span>
                <span className="text-gray-500">/100</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Meta Tags Found</p>
              <p className="text-2xl font-bold">{metaTagsCount}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Issues Found</p>
              <p className={cn("text-2xl font-bold", getIssuesColor(issuesCount))}>
                {issuesCount}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
