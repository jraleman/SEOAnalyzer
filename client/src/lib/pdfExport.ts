import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SeoAnalysis } from '@shared/schema';

/**
 * Formats date for PDF
 */
const formatDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get status text with appropriate styling
 */
const getStatusText = (status: string | undefined): { text: string, color: string } => {
  switch(status) {
    case 'good':
      return { text: 'Good', color: '#10B981' };
    case 'warning':
      return { text: 'Needs Improvement', color: '#F59E0B' };
    case 'error':
      return { text: 'Missing', color: '#EF4444' };
    case 'info':
    default:
      return { text: 'Information', color: '#6B7280' };
  }
};

/**
 * Add section heading to PDF
 */
const addSectionHeading = (doc: jsPDF, text: string, y: number): number => {
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#1E3A8A');
  doc.setFontSize(14);
  doc.text(text, 20, y);
  doc.line(20, y + 2, 190, y + 2);
  return y + 10;
};

/**
 * Safe text rendering function that handles undefined values
 */
const safeText = (doc: jsPDF, text: string | undefined, x: number, y: number, options?: { maxWidth?: number }): void => {
  doc.text(text || '', x, y, options);
};

/**
 * Export analysis to PDF
 */
export const exportToPdf = async (analysis: SeoAnalysis): Promise<void> => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `SEO Analysis for ${analysis.url}`,
      subject: 'SEO Analysis Report',
      author: 'SEOAnalyzer',
      creator: 'SEOAnalyzer'
    });

    // Add header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#1F2937');
    doc.text('SEO Analysis Report', 20, 20);

    // Add date and URL
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor('#4B5563');
    doc.text(`Generated on: ${formatDate()}`, 20, 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor('#2563EB');
    doc.text(`Website: ${analysis.url}`, 20, 35);

    // Overview section
    let yPos = 45;
    yPos = addSectionHeading(doc, 'Overview', yPos);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#000000');
    doc.setFontSize(12);
    
    // Overview content - display in a table-like format
    doc.setFont('helvetica', 'bold');
    doc.text(`Page Title:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    safeText(doc, analysis.pageTitle || 'Untitled Page', 60, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`SEO Score:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    
    const scoreColor = analysis.seoScore >= 80 ? '#10B981' : 
                      analysis.seoScore >= 50 ? '#F59E0B' : '#EF4444';
    doc.setTextColor(scoreColor);
    doc.text(`${analysis.seoScore}/100`, 60, yPos);
    doc.setTextColor('#000000');
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`Meta Tags Found:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${analysis.metaTagsCount}`, 60, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text(`Issues Found:`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    const issuesColor = analysis.issuesCount === 0 ? '#10B981' : 
                       analysis.issuesCount < 3 ? '#F59E0B' : '#EF4444';
    doc.setTextColor(issuesColor);
    doc.text(`${analysis.issuesCount}`, 60, yPos);
    doc.setTextColor('#000000');
    yPos += 15;

    // Meta Tags Section
    if (analysis.basicMetaTags.length > 0) {
      yPos = addSectionHeading(doc, 'Basic SEO Meta Tags', yPos);
      
      for (const tag of analysis.basicMetaTags) {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        const { text: statusText, color: statusColor } = getStatusText(tag.status);
        
        doc.setFont('helvetica', 'bold');
        safeText(doc, tag.name || tag.property || tag.rel || '', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(statusColor);
        doc.text(statusText, 150, yPos);
        doc.setTextColor('#000000');
        
        yPos += 6;
        
        if (tag.message) {
          doc.setFontSize(10);
          safeText(doc, `Note: ${tag.message}`, 25, yPos);
          doc.setFontSize(12);
          yPos += 6;
        }
        
        if (tag.content) {
          doc.setFontSize(9);
          doc.setFont('courier', 'normal');
          safeText(doc, tag.content, 25, yPos, { maxWidth: 165 });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
        }
        
        yPos += 10;
      }
    }

    // Social Meta Tags Section
    if (analysis.socialMetaTags.length > 0) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos = addSectionHeading(doc, 'Social Media Meta Tags', yPos);
      
      for (const tag of analysis.socialMetaTags) {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        const { text: statusText, color: statusColor } = getStatusText(tag.status);
        
        doc.setFont('helvetica', 'bold');
        safeText(doc, tag.property || tag.name || '', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(statusColor);
        doc.text(statusText, 150, yPos);
        doc.setTextColor('#000000');
        
        yPos += 6;
        
        if (tag.message) {
          doc.setFontSize(10);
          safeText(doc, `Note: ${tag.message}`, 25, yPos);
          doc.setFontSize(12);
          yPos += 6;
        }
        
        if (tag.content) {
          doc.setFontSize(9);
          doc.setFont('courier', 'normal');
          safeText(doc, tag.content, 25, yPos, { maxWidth: 165 });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
        }
        
        yPos += 10;
      }
    }

    // Technical Meta Tags Section
    if (analysis.technicalMetaTags.length > 0) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos = addSectionHeading(doc, 'Technical Meta Tags', yPos);
      
      for (const tag of analysis.technicalMetaTags) {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        const { text: statusText, color: statusColor } = getStatusText(tag.status);
        
        doc.setFont('helvetica', 'bold');
        safeText(doc, tag.name || tag.rel || '', 20, yPos);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(statusColor);
        doc.text(statusText, 150, yPos);
        doc.setTextColor('#000000');
        
        yPos += 6;
        
        if (tag.message) {
          doc.setFontSize(10);
          safeText(doc, `Note: ${tag.message}`, 25, yPos);
          doc.setFontSize(12);
          yPos += 6;
        }
        
        if (tag.content || tag.href) {
          doc.setFontSize(9);
          doc.setFont('courier', 'normal');
          safeText(doc, tag.content || tag.href || '', 25, yPos, { maxWidth: 165 });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
        }
        
        yPos += 10;
      }
    }

    // Recommendations Section
    if (analysis.recommendations.length > 0) {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      yPos = addSectionHeading(doc, 'Recommendations', yPos);
      
      for (let i = 0; i < analysis.recommendations.length; i++) {
        const rec = analysis.recommendations[i];
        
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#1E3A8A');
        safeText(doc, `${i + 1}. ${rec.title}`, 20, yPos);
        doc.setTextColor('#000000');
        yPos += 6;
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        safeText(doc, rec.description, 25, yPos, { maxWidth: 165 });
        yPos += 12;
        
        if (rec.code) {
          doc.setFontSize(8);
          doc.setFont('courier', 'normal');
          safeText(doc, rec.code, 25, yPos, { maxWidth: 165 });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(12);
          yPos += 14;
        }
      }
    }

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor('#9CA3AF');
      doc.text(`Page ${i} of ${pageCount} | SEOAnalyzer | ${analysis.url}`, 20, 287);
    }

    // Save the PDF
    const filename = `seo-analysis-${analysis.url.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    doc.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};