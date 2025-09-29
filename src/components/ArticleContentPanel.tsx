import { useFeedStore } from '@/store/feedStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';
export function ArticleContentPanel() {
  const articles = useFeedStore((state) => state.articles);
  const selectedArticleId = useFeedStore((state) => state.selectedArticleId);
  const article = articles.find((a) => a.id === selectedArticleId);
  if (!article) {
    return (
      <div className="flex h-full items-center justify-center text-center p-8">
        <p className="text-muted-foreground">Select an article to read.</p>
      </div>
    );
  }
  // Sanitize HTML content to prevent XSS attacks.
  const sanitizedContent = DOMPurify.sanitize(article.content);
  return (
    <ScrollArea className="h-full">
      <article className="prose dark:prose-invert max-w-none p-6 md:p-10">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-3xl md:text-4xl font-bold !mb-2 text-foreground">
            {article.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {article.author && `By ${article.author} • `}
              {format(new Date(article.pubDate), 'MMMM d, yyyy')}
            </span>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              View Original <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div
          className="prose-p:text-lg prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </article>
    </ScrollArea>
  );
}