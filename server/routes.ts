import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchUrlContent, analyzeSeoTags } from "./seoAnalyzer";
import { SeoAnalysis, seoAnalysisSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Debug route
  app.get('/api/debug', (req, res) => {
    console.log('Debug route accessed');
    return res.status(200).json({
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    });
  });
  
  // Analyze URL route
  app.post('/api/analyze', async (req, res) => {
    try {
      // Validate the request
      const urlSchema = z.object({
        url: z.string().url('Please enter a valid URL')
      });

      const validatedData = urlSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({
          message: 'Invalid URL',
          errors: validatedData.error.errors
        });
      }

      const { url } = validatedData.data;
      
      try {
        // Fetch the URL content
        const html = await fetchUrlContent(url);
        
        // Analyze the SEO tags
        const analysis = analyzeSeoTags(html, url);
        
        return res.status(200).json(analysis);
      } catch (error) {
        // Handle specific errors from the analyzer
        if (error instanceof Error) {
          return res.status(400).json({
            message: error.message
          });
        }
        
        return res.status(500).json({
          message: 'Failed to analyze URL'
        });
      }
    } catch (error) {
      console.error('Error in /api/analyze route:', error);
      
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
