import axios from 'axios';
import { SeoAnalysis, MetaTag as BaseMetaTag, Recommendation } from '@shared/schema';
import { load } from 'cheerio';

// Define a custom meta tag type that makes missing optional
type MetaTag = Omit<BaseMetaTag, 'missing'> & { missing?: boolean };

// Helper function to create a meta tag with the correct missing property
function createMetaTag(tag: {
  name?: string;
  property?: string;
  content?: string;
  rel?: string;
  href?: string;
  status?: 'good' | 'warning' | 'error' | 'info';
  message: string;
}): MetaTag {
  // Determine if the tag is missing based on content or href
  const valueExists = tag.content !== undefined || tag.href !== undefined;
  const isEmpty = valueExists && (tag.content === '' || tag.href === '');
  const isMissing = !valueExists || isEmpty;
  
  return {
    ...tag,
    missing: isMissing
  };
}

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
// 'https://corsproxy.io/?';

/**
 * Fetch content from a URL using CORS proxy
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    // Use CORS proxy to fetch external website content
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; SeoMetaTagAnalyzer/1.0)'
      }
    });
    
    if (response.status !== 200) {
      throw new Error(`Failed to fetch URL: HTTP ${response.status}`);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Failed to fetch URL: HTTP ${error.response.status}`);
    }
    throw new Error('Failed to fetch URL: Network error');
  }
}

/**
 * Validate title tag
 */
function validateTitleTag(title: string | undefined): { status: MetaTag['status']; message: string } {
  if (!title) {
    return { status: 'error', message: 'Title tag is missing.' };
  }
  
  if (title.length < 30) {
    return { 
      status: 'warning', 
      message: 'Title is too short. Recommended length is 50-60 characters.' 
    };
  }
  
  if (title.length > 60) {
    return { 
      status: 'warning', 
      message: 'Title is too long. Recommended length is 50-60 characters.' 
    };
  }
  
  return { status: 'good', message: 'Title length is optimal.' };
}

/**
 * Validate meta description
 */
function validateMetaDescription(description: string | undefined): { status: MetaTag['status']; message: string } {
  if (!description) {
    return { status: 'error', message: 'Meta description is missing.' };
  }
  
  if (description.length < 120) {
    return { 
      status: 'warning', 
      message: 'Description is too short. Recommended length is 120-160 characters.' 
    };
  }
  
  if (description.length > 160) {
    return { 
      status: 'warning', 
      message: 'Description is too long. Recommended length is 120-160 characters.' 
    };
  }
  
  return { status: 'good', message: 'Description length is optimal.' };
}

/**
 * Analyze SEO meta tags from HTML
 */
export function analyzeSeoTags(html: string, url: string): SeoAnalysis {
  const $ = load(html);
  
  // Initialize arrays for meta tags
  const basicMetaTags: MetaTag[] = [];
  const socialMetaTags: MetaTag[] = [];
  const technicalMetaTags: MetaTag[] = [];
  const recommendations: Recommendation[] = [];
  
  // Get page title
  const pageTitle = $('title').text().trim();
  let titleStatus = validateTitleTag(pageTitle);
  
  basicMetaTags.push({
    name: 'title',
    content: pageTitle,
    status: titleStatus.status,
    message: titleStatus.message,
    missing: !pageTitle
  });
  
  if (titleStatus.status === 'error') {
    recommendations.push({
      title: 'Add a title tag',
      description: 'Title tags are essential for SEO and user experience. Add a descriptive title between 50-60 characters.',
      code: '<title>Your descriptive page title here</title>'
    });
  } else if (titleStatus.status === 'warning') {
    recommendations.push({
      title: 'Optimize your title tag',
      description: titleStatus.message,
      code: '<title>Your optimized title (50-60 characters)</title>'
    });
  }
  
  // Get meta description
  const metaDescription = $('meta[name="description"]').attr('content');
  let descriptionStatus = validateMetaDescription(metaDescription);
  
  basicMetaTags.push({
    name: 'description',
    content: metaDescription,
    status: descriptionStatus.status,
    message: descriptionStatus.message,
    missing: !metaDescription
  });
  
  if (descriptionStatus.status === 'error') {
    recommendations.push({
      title: 'Add a meta description',
      description: 'Meta descriptions help improve click-through rates from search results. Add a description between 120-160 characters.',
      code: '<meta name="description" content="Your compelling description here (120-160 characters)">'
    });
  } else if (descriptionStatus.status === 'warning') {
    recommendations.push({
      title: 'Optimize your meta description',
      description: descriptionStatus.message,
      code: '<meta name="description" content="Your optimized description (120-160 characters)">'
    });
  }
  
  // Get meta keywords
  const metaKeywords = $('meta[name="keywords"]').attr('content');
  
  basicMetaTags.push({
    name: 'keywords',
    content: metaKeywords,
    status: metaKeywords ? 'info' : 'info',
    message: metaKeywords ? 'Keywords are present but have limited impact on modern SEO.' : 'Keywords meta tag is missing, but has limited impact on modern SEO.',
    missing: !metaKeywords
  });
  
  // Check canonical URL
  const canonicalUrl = $('link[rel="canonical"]').attr('href');
  
  basicMetaTags.push({
    rel: 'canonical',
    href: canonicalUrl,
    status: canonicalUrl ? 'good' : 'warning',
    message: canonicalUrl ? 'Canonical URL is properly set.' : 'Canonical URL is missing. It helps prevent duplicate content issues.',
    missing: !canonicalUrl
  });
  
  if (!canonicalUrl) {
    recommendations.push({
      title: 'Add a canonical URL',
      description: 'Canonical URLs help prevent duplicate content issues by specifying the preferred version of a page.',
      code: `<link rel="canonical" href="${url}">`
    });
  }
  
  // Check robots meta tag
  const robotsContent = $('meta[name="robots"]').attr('content');
  
  basicMetaTags.push({
    name: 'robots',
    content: robotsContent,
    status: robotsContent ? 'info' : 'info',
    message: robotsContent ? `Robots directive: ${robotsContent}` : 'No robots directive specified. Default is to allow indexing and following links.',
    missing: !robotsContent
  });
  
  // Check Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');
  const ogType = $('meta[property="og:type"]').attr('content');
  
  socialMetaTags.push({
    property: 'og:title',
    content: ogTitle,
    status: ogTitle ? 'good' : 'warning',
    message: ogTitle ? 'Open Graph title is present.' : 'Open Graph title is missing. Important for social media sharing.',
    missing: !ogTitle
  });
  
  socialMetaTags.push({
    property: 'og:description',
    content: ogDescription,
    status: ogDescription ? 'good' : 'warning',
    message: ogDescription ? 'Open Graph description is present.' : 'Open Graph description is missing. Important for social media sharing.',
    missing: !ogDescription
  });
  
  socialMetaTags.push({
    property: 'og:image',
    content: ogImage,
    status: ogImage ? 'good' : 'warning',
    message: ogImage ? 'Open Graph image is present.' : 'Open Graph image is missing. Images improve engagement on social media.',
    missing: !ogImage
  });
  
  socialMetaTags.push(createMetaTag({
    property: 'og:url',
    content: ogUrl,
    status: ogUrl ? 'good' : 'warning',
    message: ogUrl ? 'Open Graph URL is present.' : 'Open Graph URL is missing.'
  }));
  
  socialMetaTags.push(createMetaTag({
    property: 'og:type',
    content: ogType,
    status: ogType ? 'good' : 'info',
    message: ogType ? `Content type: ${ogType}` : 'Open Graph type is missing. Helps social platforms understand your content type.'
  }));
  
  if (!ogTitle || !ogDescription || !ogImage) {
    recommendations.push({
      title: 'Add Open Graph meta tags',
      description: 'Open Graph meta tags improve how your content appears when shared on social media platforms.',
      code: `<meta property="og:title" content="Your title here">
<meta property="og:description" content="Your description here">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">`
    });
  }
  
  // Check Twitter Card tags
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  const twitterDescription = $('meta[name="twitter:description"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  
  socialMetaTags.push(createMetaTag({
    name: 'twitter:card',
    content: twitterCard,
    status: twitterCard ? 'good' : 'warning',
    message: twitterCard ? `Twitter card type: ${twitterCard}` : 'Twitter card type is missing. Specifies how your content appears on Twitter.'
  }));
  
  socialMetaTags.push(createMetaTag({
    name: 'twitter:title',
    content: twitterTitle,
    status: twitterTitle ? 'good' : 'info',
    message: twitterTitle ? 'Twitter title is present.' : 'Twitter title is missing (may fall back to Open Graph).'
  }));
  
  socialMetaTags.push(createMetaTag({
    name: 'twitter:description',
    content: twitterDescription,
    status: twitterDescription ? 'good' : 'info',
    message: twitterDescription ? 'Twitter description is present.' : 'Twitter description is missing (may fall back to Open Graph).'
  }));
  
  socialMetaTags.push(createMetaTag({
    name: 'twitter:image',
    content: twitterImage,
    status: twitterImage ? 'good' : 'info',
    message: twitterImage ? 'Twitter image is present.' : 'Twitter image is missing (may fall back to Open Graph).'
  }));
  
  if (!twitterCard) {
    recommendations.push({
      title: 'Add Twitter Card meta tags',
      description: 'Twitter Card meta tags control how your content appears when shared on Twitter.',
      code: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your title here">
<meta name="twitter:description" content="Your description here">
<meta name="twitter:image" content="https://example.com/image.jpg">`
    });
  }
  
  // Check viewport
  const viewport = $('meta[name="viewport"]').attr('content');
  
  technicalMetaTags.push({
    name: 'viewport',
    content: viewport,
    status: viewport ? 'good' : 'warning',
    message: viewport ? 'Viewport is properly set.' : 'Viewport meta tag is missing. Important for mobile responsiveness.',
    missing: !viewport
  });
  
  if (!viewport) {
    recommendations.push({
      title: 'Add a viewport meta tag',
      description: 'The viewport meta tag ensures your page is mobile-friendly, which is essential for SEO.',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1">'
    });
  }
  
  // Check character encoding
  const charset = $('meta[charset]').attr('charset');
  
  technicalMetaTags.push(createMetaTag({
    name: 'charset',
    content: charset,
    status: charset ? 'good' : 'warning',
    message: charset ? `Character encoding: ${charset}` : 'Character encoding is not explicitly set.'
  }));
  
  if (!charset) {
    recommendations.push({
      title: 'Add character encoding',
      description: 'Explicitly declaring character encoding ensures text is displayed correctly.',
      code: '<meta charset="UTF-8">'
    });
  }
  
  // Check language
  const language = $('html').attr('lang');
  
  technicalMetaTags.push(createMetaTag({
    name: 'language',
    content: language,
    status: language ? 'good' : 'warning',
    message: language ? `Language: ${language}` : 'Language attribute is missing. Important for accessibility and SEO.'
  }));
  
  if (!language) {
    recommendations.push({
      title: 'Add language attribute',
      description: 'Declaring the language helps search engines and screen readers.',
      code: '<html lang="en">'
    });
  }
  
  // Check favicon
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
  
  technicalMetaTags.push(createMetaTag({
    rel: 'icon',
    href: favicon,
    status: favicon ? 'info' : 'info',
    message: favicon ? 'Favicon is present.' : 'Favicon not found. Helps with brand recognition.'
  }));
  
  // Calculate scores and counts
  const metaTagsCount = basicMetaTags.length + socialMetaTags.length + technicalMetaTags.length;
  
  // Count issues (error and warning status)
  const allTags = [...basicMetaTags, ...socialMetaTags, ...technicalMetaTags];
  const issuesCount = allTags.filter(tag => tag.status === 'error' || tag.status === 'warning').length;
  
  // Calculate SEO score (higher weight for basic tags, lower for social and technical)
  const basicScore = basicMetaTags.reduce((score, tag) => {
    if (tag.status === 'good') return score + 15;
    if (tag.status === 'info') return score + 10;
    if (tag.status === 'warning') return score + 5;
    return score;
  }, 0);
  
  const socialScore = socialMetaTags.reduce((score, tag) => {
    if (tag.status === 'good') return score + 8;
    if (tag.status === 'info') return score + 5;
    if (tag.status === 'warning') return score + 3;
    return score;
  }, 0);
  
  const technicalScore = technicalMetaTags.reduce((score, tag) => {
    if (tag.status === 'good') return score + 10;
    if (tag.status === 'info') return score + 7;
    if (tag.status === 'warning') return score + 4;
    return score;
  }, 0);
  
  // Maximum possible scores
  const maxBasicScore = basicMetaTags.length * 15;
  const maxSocialScore = socialMetaTags.length * 8;
  const maxTechnicalScore = technicalMetaTags.length * 10;
  const maxTotalScore = maxBasicScore + maxSocialScore + maxTechnicalScore;
  
  // Calculate final score as percentage
  const totalScore = basicScore + socialScore + technicalScore;
  const seoScore = Math.round((totalScore / maxTotalScore) * 100);
  
  // Return the complete analysis
  return {
    url,
    pageTitle,
    seoScore,
    metaTagsCount,
    issuesCount,
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
    recommendations
  };
}

/**
 * Perform client-side SEO analysis
 */
export async function analyzeUrl(url: string): Promise<SeoAnalysis> {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Fetch the URL content
    const html = await fetchUrlContent(url);
    
    // Analyze the SEO tags
    return analyzeSeoTags(html, url);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to analyze URL: ${error.message}`);
    }
    throw new Error('Failed to analyze URL: Unknown error');
  }
}