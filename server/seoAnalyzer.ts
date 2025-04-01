import { SeoAnalysis, MetaTag, Recommendation } from '@shared/schema';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'SEO Meta Tag Analyzer Bot',
      },
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`Failed to fetch URL (${error.response.status}): ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Failed to receive response from the server. Please check the URL and try again.');
      } else {
        throw new Error(`Error in request setup: ${error.message}`);
      }
    }
    throw new Error('Failed to fetch URL content');
  }
}

function validateTitleTag(title: string | undefined): { status: MetaTag['status']; message: string } {
  if (!title) {
    return { status: 'error', message: 'Missing title tag' };
  }
  
  if (title.length < 30) {
    return { status: 'warning', message: 'Title is too short (less than 30 characters)' };
  }
  
  if (title.length > 60) {
    return { status: 'warning', message: 'Title is too long (more than 60 characters)' };
  }
  
  return { status: 'good', message: `Optimal length (30-60 characters). Currently ${title.length} characters.` };
}

function validateMetaDescription(description: string | undefined): { status: MetaTag['status']; message: string } {
  if (!description) {
    return { status: 'error', message: 'Missing meta description' };
  }
  
  if (description.length < 50) {
    return { status: 'warning', message: 'Description is too short (less than 50 characters)' };
  }
  
  if (description.length > 160) {
    return { status: 'warning', message: 'Description is too long (more than 160 characters)' };
  }
  
  // Check if description seems generic
  const genericPhrases = ['description of your page', 'description goes here', 'your description'];
  if (genericPhrases.some(phrase => description.toLowerCase().includes(phrase))) {
    return { status: 'warning', message: 'Description appears to be generic. Add more specific information about your page content.' };
  }
  
  return { status: 'good', message: `Good length (50-160 characters). Currently ${description.length} characters.` };
}

export function analyzeSeoTags(html: string, url: string): SeoAnalysis {
  const $ = cheerio.load(html);
  
  // Extract basic meta tags
  const pageTitle = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content');
  const metaKeywords = $('meta[name="keywords"]').attr('content');
  
  // Extract Open Graph meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  
  // Extract Twitter card meta tags
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  const twitterDescription = $('meta[name="twitter:description"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  
  // Extract technical meta tags
  const viewport = $('meta[name="viewport"]').attr('content');
  const robots = $('meta[name="robots"]').attr('content');
  const canonical = $('link[rel="canonical"]').attr('href');
  
  // Validate title and generate status
  const titleValidation = validateTitleTag(pageTitle);
  const descriptionValidation = validateMetaDescription(metaDescription);
  
  // Basic meta tags
  const basicMetaTags: MetaTag[] = [
    {
      name: 'title',
      content: pageTitle,
      status: titleValidation.status,
      message: titleValidation.message,
      missing: false,
    },
    {
      name: 'description',
      content: metaDescription,
      status: descriptionValidation.status,
      message: descriptionValidation.message,
      missing: false,
    }
  ];
  
  if (metaKeywords) {
    basicMetaTags.push({
      name: 'keywords',
      content: metaKeywords,
      status: 'info',
      message: 'Keywords meta tag has limited SEO value in modern search algorithms.',
      missing: false,
    });
  }
  
  // Social media meta tags
  const socialMetaTags: MetaTag[] = [];
  
  if (ogTitle) {
    socialMetaTags.push({
      property: 'og:title',
      content: ogTitle,
      status: 'good',
      missing: false,
    });
  } else {
    socialMetaTags.push({
      property: 'og:title',
      missing: true,
      status: 'warning',
      message: 'Missing og:title tag. Social media shares will use the page title instead.'
    });
  }
  
  if (ogDescription) {
    socialMetaTags.push({
      property: 'og:description',
      content: ogDescription,
      status: ogDescription === metaDescription ? 'info' : 'good',
      message: ogDescription === metaDescription ? 'Using the same content as meta description' : undefined,
      missing: false,
    });
  } else {
    socialMetaTags.push({
      property: 'og:description',
      missing: true,
      status: 'warning',
      message: 'Missing og:description tag. Social media shares will use the meta description instead or may use text from your page.'
    });
  }
  
  if (ogImage) {
    socialMetaTags.push({
      property: 'og:image',
      content: ogImage,
      status: 'good',
      missing: false,
    });
  } else {
    socialMetaTags.push({
      property: 'og:image',
      missing: true,
      status: 'warning',
      message: 'Missing og:image tag. Social media shares will not include an image preview.'
    });
  }
  
  if (twitterCard) {
    socialMetaTags.push({
      name: 'twitter:card',
      content: twitterCard,
      status: 'good',
      missing: false,
    });
  } else {
    socialMetaTags.push({
      name: 'twitter:card',
      missing: true,
      status: 'warning',
      message: 'Missing twitter:card tag. Twitter shares will not display properly.'
    });
  }
  
  // Add Twitter-specific tags if present
  if (twitterTitle) {
    socialMetaTags.push({
      name: 'twitter:title',
      content: twitterTitle,
      status: 'good',
      missing: false,
    });
  }
  
  if (twitterDescription) {
    socialMetaTags.push({
      name: 'twitter:description',
      content: twitterDescription,
      status: 'good',
      missing: false,
    });
  }
  
  if (twitterImage) {
    socialMetaTags.push({
      name: 'twitter:image',
      content: twitterImage,
      status: 'good',
      missing: false,
    });
  }
  
  // Technical meta tags
  const technicalMetaTags: MetaTag[] = [];
  
  if (viewport) {
    technicalMetaTags.push({
      name: 'viewport',
      content: viewport,
      status: 'good',
      missing: false,
    });
  } else {
    technicalMetaTags.push({
      name: 'viewport',
      missing: true,
      status: 'error',
      message: 'Missing viewport meta tag. Your site may not be mobile-friendly.'
    });
  }
  
  if (robots) {
    technicalMetaTags.push({
      name: 'robots',
      content: robots,
      status: robots.includes('noindex') ? 'warning' : 'good',
      message: robots.includes('noindex') ? 'Your page is set to not be indexed by search engines.' : undefined,
      missing: false,
    });
  } else {
    technicalMetaTags.push({
      name: 'robots',
      content: 'index, follow', // Default behavior
      status: 'info',
      message: 'No robots meta tag specified. Defaults to "index, follow".',
      missing: false,
    });
  }
  
  if (canonical) {
    technicalMetaTags.push({
      rel: 'canonical',
      href: canonical,
      status: 'good',
      missing: false,
    });
  } else {
    technicalMetaTags.push({
      rel: 'canonical',
      missing: true,
      status: 'error',
      message: 'Missing canonical tag. Recommend adding a canonical URL to prevent duplicate content issues.'
    });
  }
  
  // Generate recommendations
  const recommendations: Recommendation[] = [];
  
  // Check for canonical tag
  if (!canonical) {
    recommendations.push({
      title: 'Add a canonical URL',
      description: 'Add a canonical link tag to prevent duplicate content issues and consolidate link signals for similar or identical content.',
      code: `<link rel="canonical" href="${url}">`
    });
  }
  
  // Check meta description
  if (!metaDescription || descriptionValidation.status !== 'good') {
    recommendations.push({
      title: 'Improve meta description',
      description: 'Create a more specific and compelling meta description that accurately summarizes your page content and includes relevant keywords.',
      code: '<meta name="description" content="A specific, informative description with relevant keywords that compels users to click.">'
    });
  }
  
  // Check for Twitter-specific tags
  if (!twitterCard || !twitterTitle || !twitterDescription || !twitterImage) {
    recommendations.push({
      title: 'Add Twitter-specific meta tags',
      description: 'While you may have Open Graph tags, adding Twitter-specific tags can improve how your content appears when shared on Twitter.',
      code: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${ogTitle || pageTitle || 'Your Title Here'}">
<meta name="twitter:description" content="${ogDescription || metaDescription || 'Your description here'}">
<meta name="twitter:image" content="https://example.com/image.jpg">`
    });
  }
  
  // Check for OG tags
  if (!ogTitle || !ogDescription || !ogImage) {
    recommendations.push({
      title: 'Complete Open Graph meta tags',
      description: 'Add all essential Open Graph meta tags to improve how your content appears when shared on social media platforms.',
      code: `<meta property="og:title" content="${pageTitle || 'Your Title Here'}">
<meta property="og:description" content="${metaDescription || 'Your description here'}">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="${url}">`
    });
  }
  
  // Calculate SEO score
  let score = 100;
  
  // Deduct points for missing critical tags
  if (!pageTitle || titleValidation.status === 'error') score -= 25;
  if (!metaDescription || descriptionValidation.status === 'error') score -= 15;
  if (!canonical) score -= 10;
  if (!viewport) score -= 15;
  
  // Deduct points for warnings
  if (titleValidation.status === 'warning') score -= 5;
  if (descriptionValidation.status === 'warning') score -= 5;
  if (!ogTitle || !ogDescription || !ogImage) score -= 5;
  if (!twitterCard) score -= 5;
  
  // Count issues
  const issuesCount = [
    ...basicMetaTags,
    ...socialMetaTags,
    ...technicalMetaTags
  ].filter(tag => tag.status === 'error' || tag.status === 'warning').length;
  
  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));
  
  return {
    url,
    pageTitle,
    seoScore: score,
    metaTagsCount: basicMetaTags.length + socialMetaTags.length + technicalMetaTags.length,
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
