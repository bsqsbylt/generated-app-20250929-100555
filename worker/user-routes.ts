import { Hono } from "hono";
import { XMLParser } from "fast-xml-parser";
import type { Env } from './core-utils';
import { SubscriptionEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Subscription, FeedData, Article } from "@shared/types";
// A type for the loosely structured items from the parser
type ParsedItem = { [key: string]: any };
// Helper to extract text content, safely handling different object structures from the parser.
const getText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'object' && node !== null) {
    return node['#text'] || node['_cdata'] || '';
  }
  return '';
};
const getSnippet = (content: string, maxLength = 150) => {
    const stripped = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (stripped.length <= maxLength) return stripped;
    return `${stripped.substring(0, maxLength)}...`;
}
const findChannel = (feed: any) => {
  if (feed.rss?.channel) return feed.rss.channel; // RSS 2.0
  if (feed.feed) return feed.feed; // Atom
  if (feed['rdf:RDF']?.channel) return feed['rdf:RDF'].channel; // RSS 1.0 (RDF)
  return null;
};
const findItems = (feed: any, channel: any): ParsedItem[] => {
  let items: ParsedItem[] = [];
  if (channel?.item) items = channel.item; // RSS 2.0
  else if (channel?.entry) items = channel.entry; // Atom
  else if (feed['rdf:RDF']?.item) items = feed['rdf:RDF'].item; // RSS 1.0 (RDF)
  return Array.isArray(items) ? items : [items].filter(Boolean);
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // SUBSCRIPTIONS API
  app.get('/api/subscriptions', async (c) => {
    const subEntity = new SubscriptionEntity(c.env);
    const subscriptions = await subEntity.getAll();
    return ok(c, subscriptions);
  });
  app.post('/api/subscriptions', async (c) => {
    const { url } = await c.req.json<{ url?: string }>();
    if (!isStr(url)) return bad(c, 'URL is required');
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'AuraReader/1.0' } });
      if (!response.ok) throw new Error(`Failed to fetch feed: ${response.statusText}`);
      const xmlText = await response.text();
      const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '_cdata', attributeNamePrefix: '@_' });
      const feed = parser.parse(xmlText);
      const channel = findChannel(feed);
      if (!channel) throw new Error('Invalid RSS/Atom feed structure');
      const title = getText(channel.title);
      if (!title) throw new Error('Feed title not found');
      const newSubscription: Subscription = {
        id: crypto.randomUUID(),
        url,
        title,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
      };
      const subEntity = new SubscriptionEntity(c.env);
      const addedSub = await subEntity.add(newSubscription);
      return ok(c, addedSub);
    } catch (error) {
      console.error('Failed to add subscription:', error);
      return bad(c, error instanceof Error ? error.message : 'Could not validate or add feed.');
    }
  });
  app.put('/api/subscriptions/:id', async (c) => {
    const { id } = c.req.param();
    const { url, title } = await c.req.json<{ url?: string, title?: string }>();
    if (!isStr(id)) return bad(c, 'ID is required');
    if (!isStr(url) || !isStr(title)) return bad(c, 'URL and title are required');
    const subEntity = new SubscriptionEntity(c.env);
    try {
      const allSubs = await subEntity.getAll();
      const existingSub = allSubs.find(s => s.id === id);
      if (!existingSub) return notFound(c, 'Subscription not found');
      const updatedSub: Subscription = {
        ...existingSub,
        url,
        title,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`,
      };
      const result = await subEntity.update(updatedSub);
      return ok(c, result);
    } catch (error) {
      console.error(`Failed to update subscription ${id}:`, error);
      return bad(c, error instanceof Error ? error.message : 'Could not update subscription.');
    }
  });
  app.delete('/api/subscriptions/:id', async (c) => {
    const { id } = c.req.param();
    if (!isStr(id)) return bad(c, 'ID is required');
    const subEntity = new SubscriptionEntity(c.env);
    const deleted = await subEntity.remove(id);
    if (!deleted) return notFound(c, 'Subscription not found');
    return ok(c, { id, deleted });
  });
  // FEED PROXY API
  app.get('/api/proxy-feed', async (c) => {
    const url = c.req.query('url');
    if (!isStr(url)) return bad(c, 'Feed URL is required');
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'AuraReader/1.0' } });
      if (!response.ok) throw new Error(`Failed to fetch feed: ${response.statusText}`);
      const xmlText = await response.text();
      const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '_cdata', attributeNamePrefix: '@_' });
      const feed = parser.parse(xmlText);
      const channel = findChannel(feed);
      if (!channel) throw new Error('Invalid RSS/Atom feed structure');
      const items = findItems(feed, channel);
      const parsedItems: Article[] = items.map((item: ParsedItem) => {
        const title = getText(item.title);
        const link = item.link?.['@_href'] || getText(item.link) || item.id;
        const pubDate = item.pubDate || item.published || item.updated || item['dc:date'];
        const content = getText(item['content:encoded'] || item.content || item.description || '');
        return {
          id: getText(item.guid) || link || title,
          link,
          title,
          pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          author: getText(item['dc:creator'] || item.author?.name),
          content,
          snippet: getSnippet(content),
        };
      }).filter(item => item.id && item.title && item.link);
      const feedData: FeedData = {
        title: getText(channel.title),
        description: getText(channel.description || channel.subtitle),
        link: channel.link?.['@_href'] || getText(channel.link),
        items: parsedItems,
      };
      return ok(c, feedData);
    } catch (error) {
      console.error(`Failed to proxy feed from ${url}:`, error);
      return bad(c, error instanceof Error ? error.message : 'Could not parse feed.');
    }
  });
}