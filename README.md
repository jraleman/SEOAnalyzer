# SEOAnalyzer

![SEO Meta Tag Analyzer](./generated-icon.png)

A powerful, interactive web application for analyzing and visualizing SEO meta tags on any website. This tool helps you identify SEO issues, provides recommendations for improvements, and generates comprehensive reports with visual representations of how your page would appear in search engines and social media platforms.

## 🌟 Features

- **Comprehensive SEO Analysis**: Evaluates meta tags, Open Graph properties, Twitter cards, and other technical SEO elements
- **Visual Previews**: Shows how your page would appear in Google search results, Facebook, and Twitter 
- **Detailed Recommendations**: Provides actionable suggestions to improve your SEO implementation
- **PDF Export**: Generate and download professional PDF reports for documentation and sharing
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 📋 Core Technologies

- **Frontend**: React with TypeScript, Vite, Tailwind CSS, and Shadcn UI components
- **Backend**: Express.js with TypeScript
- **Data Validation**: Zod for type-safe schema validation
- **HTTP Client**: Axios for API requests
- **PDF Generation**: jsPDF and html2canvas for report generation
- **Web Scraping**: Cheerio for HTML parsing and analysis

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seo-meta-tag-analyzer.git
   cd seo-meta-tag-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## 🔍 How to Use

1. Enter a URL (including the "https://" prefix) in the input field
2. Click the "Analyze" button to start the SEO analysis
3. View the results including:
   - SEO score with a visual representation
   - Meta tag analysis with statuses and recommendations
   - Preview tabs showing how your page appears on different platforms
   - Detailed recommendations for improvement
4. Export the analysis to PDF for documentation or sharing

## 📊 SEO Analysis Components

The application analyzes several critical SEO elements:

### Basic SEO Meta Tags
- Title tag
- Meta description
- Meta keywords
- Canonical URL
- Robots directives

### Social Media Meta Tags
- Open Graph (og:) properties for Facebook and other platforms
- Twitter card tags
- Social media images and descriptions

### Technical Meta Tags
- Viewport settings
- Character encoding
- Language specification
- Favicon
- Mobile compatibility

## 📑 PDF Export Feature

The PDF export functionality generates a professionally formatted report with:

- Cover page with analysis overview
- Color-coded statuses for quick issue identification
- Complete meta tag listings with their values and statuses
- Comprehensive recommendations section
- Proper pagination and document structure
- Header/footer with page numbers and website information

## 🔧 Project Structure

```
/
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/    # React components 
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and services
│   │   ├── pages/         # Main application pages
│   │   └── App.tsx        # Main application component
├── server/                # Backend code
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── seoAnalyzer.ts     # SEO analysis logic
│   └── storage.ts         # Data storage interface
├── shared/                # Shared code between client and server
│   └── schema.ts          # Zod schemas and TypeScript types
└── README.md              # This file
```

## 📦 Dependencies Explained

### Frontend Dependencies

- **@tanstack/react-query**: Data fetching, caching, and state management
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation for form inputs and API responses
- **tailwindcss**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality UI components built on Radix UI
- **lucide-react**: SVG icon library
- **recharts**: Composable charting library for data visualization
- **jspdf & html2canvas**: PDF generation for exporting analysis reports
- **wouter**: Lightweight routing solution

### Backend Dependencies

- **express**: Web server framework
- **cors**: Cross-Origin Resource Sharing middleware
- **cheerio**: Server-side HTML parsing for SEO analysis
- **axios**: HTTP client for fetching web pages
- **zod**: Schema validation for API requests and responses

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful, accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the frontend library
- [Express](https://expressjs.com/) for the backend framework
- [Cheerio](https://cheerio.js.org/) for the HTML parsing library
- [jsPDF](https://github.com/parallax/jsPDF) for the PDF generation