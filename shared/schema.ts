import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define SEO meta tag types
export const metaTagSchema = z.object({
  name: z.string().optional(),
  property: z.string().optional(),
  content: z.string().optional(),
  rel: z.string().optional(),
  href: z.string().optional(),
  status: z.enum(['good', 'warning', 'error', 'info']).optional(),
  missing: z.boolean().optional().default(false),
  message: z.string().optional(),
});

export type MetaTag = z.infer<typeof metaTagSchema>;

// Define recommendation type
export const recommendationSchema = z.object({
  title: z.string(),
  description: z.string(),
  code: z.string().optional(),
});

export type Recommendation = z.infer<typeof recommendationSchema>;

// Define the SEO analysis result schema
export const seoAnalysisSchema = z.object({
  url: z.string().url(),
  pageTitle: z.string().optional(),
  seoScore: z.number().min(0).max(100),
  metaTagsCount: z.number().min(0),
  issuesCount: z.number().min(0),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  basicMetaTags: z.array(metaTagSchema),
  socialMetaTags: z.array(metaTagSchema),
  technicalMetaTags: z.array(metaTagSchema),
  recommendations: z.array(recommendationSchema),
  errorMessage: z.string().optional(),
});

export type SeoAnalysis = z.infer<typeof seoAnalysisSchema>;

// For database storage (optional)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
