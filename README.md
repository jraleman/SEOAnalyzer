# SEOAnalyzer

![SEOAnalyzer](./generated-icon.png)

A powerful, interactive web application for analyzing and visualizing SEO meta tags on any website. This tool helps you identify SEO issues, provides recommendations for improvements, and generates comprehensive reports with visual representations of how your page would appear in search engines and social media platforms.

[Click here for a (broken) live demo!](https://jraleman.com/SEOAnalyzer)

> No worries, it works fine locally ;)

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
- **No Database Required**: Pure client-server architecture with no data persistence needs

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:jraleman/SEOAnalyzer.git
   cd SEOAnalyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to [http://localhost:5000](http://localhost:5000) or [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 🚀 Deployment

### GitHub Pages Deployment

This application can be deployed as a static site on GitHub Pages using the pre-built version:

1. Fork this repository to your GitHub account
2. In your forked repository, go to Settings > Pages
3. Set the source to the "gh-pages" branch and save
4. GitHub will provide you with a URL where your application is deployed

Alternatively, you can deploy manually from your local machine:

1. Navigate to the `gh-pages` directory, which contains a standalone version of the application
2. Initialize a new git repository in this directory:
   ```bash
   cd gh-pages
   git init
   git add .
   git commit -m "Initial commit for GitHub Pages"
   ```

3. Add your GitHub repository as remote and push to the gh-pages branch:
   ```bash
   git remote add origin git@github.com:yourusername/reponame.git
   git push -u origin master:gh-pages -f
   ```

You can also use the `gh-pages` npm package:
```bash
npx gh-pages -d gh-pages
```

Your site should be available.

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
│   │   │   ├── pdfExport.ts  # PDF generation utility
│   │   │   ├── clientSeoAnalyzer.ts  # Client-side SEO analyzer
│   │   │   ├── queryClient.ts  # API client configuration
│   │   │   └── utils.ts  # Utility functions
│   │   ├── pages/         # Main application pages
│   │   └── App.tsx        # Main application component
├── server/                # Backend code
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── vite.ts            # Server-side Vite configuration
│   └── seoAnalyzer.ts     # SEO analysis logic
├── shared/                # Shared code between client and server
│   └── schema.ts          # Zod schemas and TypeScript types
├── gh-pages/              # GitHub Pages deployment files
│   ├── index.html         # Standalone HTML file for GitHub Pages
│   └── .nojekyll          # Prevents GitHub Pages from using Jekyll
├── scripts/               # Utility scripts
│   ├── deploy-gh-pages.js # JavaScript script for GitHub Pages deployment
│   └── deploy.sh          # Shell script for GitHub Pages deployment
├── .github/workflows/     # GitHub Actions workflow files
│   └── deploy.yml         # GitHub Pages deployment workflow
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
