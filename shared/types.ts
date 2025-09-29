// This file defines the shared data structures used by both the frontend and the backend.
/**
 * Represents a user's RSS feed subscription.
 */
export interface Subscription {
  id: string;
  url: string;
  title: string;
  favicon: string | null;
}
/**
 * Represents a single article from an RSS feed.
 */
export interface Article {
  id: string;
  link: string;
  title: string;
  pubDate: string;
  author?: string;
  content: string;
  snippet: string;
}
/**
 * Represents the parsed data from an RSS feed.
 */
export interface FeedData {
  title: string;
  description: string;
  link: string;
  items: Article[];
}
/**
 * A generic wrapper for API responses to ensure a consistent structure.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}