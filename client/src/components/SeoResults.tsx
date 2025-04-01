import { SeoAnalysis } from '@shared/schema';
import ScoreOverview from './ScoreOverview';
import PreviewTabs from './PreviewTabs';
import MetaTagsAnalysis from './MetaTagsAnalysis';
import Recommendations from './Recommendations';

interface SeoResultsProps {
  analysis: SeoAnalysis;
}

export default function SeoResults({ analysis }: SeoResultsProps) {
  const {
    url,
    seoScore,
    metaTagsCount,
    issuesCount,
    pageTitle,
    metaDescription,
    metaKeywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    basicMetaTags,
    socialMetaTags,
    technicalMetaTags,
    recommendations,
  } = analysis;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      data-seo-analysis="true"
      data-url={url}
      data-page-title={pageTitle || ''}
      data-seo-score={seoScore}
      data-meta-tags-count={metaTagsCount}
      data-issues-count={issuesCount}
    >
      <ScoreOverview 
        url={url}
        seoScore={seoScore}
        metaTagsCount={metaTagsCount}
        issuesCount={issuesCount}
      />
      
      <PreviewTabs 
        url={url}
        pageTitle={pageTitle || ''}
        metaDescription={metaDescription || ''}
        metaKeywords={metaKeywords || ''}
        ogTitle={ogTitle}
        ogDescription={ogDescription}
        ogImage={ogImage}
        twitterTitle={twitterTitle}
        twitterDescription={twitterDescription}
        twitterImage={twitterImage}
        searchDate={formattedDate}
      />
      
      <MetaTagsAnalysis 
        basicMetaTags={basicMetaTags}
        socialMetaTags={socialMetaTags}
        technicalMetaTags={technicalMetaTags}
      />
      
      <Recommendations recommendations={recommendations} />
    </div>
  );
}
