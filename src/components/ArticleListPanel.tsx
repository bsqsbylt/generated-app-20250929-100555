import { useState, useEffect, useRef } from 'react';
import { useFeedStore } from '@/store/feedStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, Trash2, RefreshCw } from 'lucide-react';
export function ArticleListPanel() {
  const articles = useFeedStore((state) => state.articles);
  const selectedSubscriptionId = useFeedStore((state) => state.selectedSubscriptionId);
  const subscriptions = useFeedStore((state) => state.subscriptions);
  const selectedArticleId = useFeedStore((state) => state.selectedArticleId);
  const selectArticle = useFeedStore((state) => state.selectArticle);
  const isLoading = useFeedStore((state) => state.isLoadingArticles);
  const isRefreshing = useFeedStore((state) => state.isRefreshingFeed);
  const readArticleIds = useFeedStore((state) => state.readArticleIds);
  const markFeedAsRead = useFeedStore((state) => state.markFeedAsRead);
  const clearReadArticlesInFeed = useFeedStore((state) => state.clearReadArticlesInFeed);
  const refreshCurrentFeed = useFeedStore((state) => state.refreshCurrentFeed);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const articleRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    setFocusedIndex(null);
    articleRefs.current = [];
  }, [selectedSubscriptionId]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (articles.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = focusedIndex === null ? 0 : Math.min(focusedIndex + 1, articles.length - 1);
        setFocusedIndex(nextIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIndex = focusedIndex === null ? 0 : Math.max(focusedIndex - 1, 0);
        setFocusedIndex(nextIndex);
      } else if (e.key === 'Enter' && focusedIndex !== null) {
        e.preventDefault();
        const article = articles[focusedIndex];
        if (article) {
          selectArticle(article.id);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, articles, selectArticle]);
  useEffect(() => {
    if (focusedIndex !== null && articleRefs.current[focusedIndex]) {
      articleRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex]);
  const selectedSubscription = subscriptions.find(s => s.id === selectedSubscriptionId);
  const unreadCount = articles.filter(a => !readArticleIds.has(a.id)).length;
  const readCount = articles.length - unreadCount;
  const allArticlesRead = unreadCount === 0;
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-8 w-32" />
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="space-y-2 border-b pb-3 pt-2">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/4 mt-1" />
          </div>
        ))}
      </div>
    );
  }
  if (!selectedSubscriptionId || !selectedSubscription) {
    return (
      <div className="flex h-full items-center justify-center text-center p-8">
        <p className="text-muted-foreground">Select a feed to see articles.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b shrink-0 gap-2">
        <h2 className="text-lg font-bold tracking-tight truncate" title={selectedSubscription.title}>
          {selectedSubscription.title}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshCurrentFeed}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="sr-only">Refresh Feed</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markFeedAsRead}
            disabled={articles.length === 0 || allArticlesRead || isRefreshing}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearReadArticlesInFeed}
            disabled={readCount === 0 || isRefreshing}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/50 hover:border-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear read
          </Button>
        </div>
      </header>
      {articles.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <p className="text-muted-foreground">No articles found for this feed.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {articles.map((article, index) => {
              const isRead = readArticleIds.has(article.id);
              const isFocused = focusedIndex === index;
              return (
                <button
                  key={article.id}
                  ref={el => articleRefs.current[index] = el}
                  onClick={() => selectArticle(article.id)}
                  className={cn(
                    'w-full text-left p-4 border-b transition-colors duration-200 focus:outline-none',
                    selectedArticleId === article.id
                      ? 'bg-accent'
                      : 'hover:bg-accent/50',
                    isFocused && selectedArticleId !== article.id ? 'bg-accent/70' : '',
                    isRead && selectedArticleId !== article.id ? 'opacity-60' : ''
                  )}
                >
                  <h3 className={cn(
                    "font-semibold text-base leading-tight truncate",
                    isRead ? "text-muted-foreground" : "text-primary"
                  )}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {article.snippet}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}
                  </p>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}