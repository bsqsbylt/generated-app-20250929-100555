import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFeedStore } from '@/store/feedStore';
import { ArticleContentPanel } from './ArticleContentPanel';
import { cn } from '@/lib/utils';
export function ArticleContentModal() {
  const selectedArticleId = useFeedStore((state) => state.selectedArticleId);
  const selectArticle = useFeedStore((state) => state.selectArticle);
  const articles = useFeedStore((state) => state.articles);
  const article = articles.find(a => a.id === selectedArticleId);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow 'Enter' within the article content itself (e.g., on a button)
      if (e.key === 'Enter' && (e.target as HTMLElement).closest('.prose')) {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        selectArticle(null);
      }
    };
    if (selectedArticleId) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArticleId, selectArticle]);
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      selectArticle(null);
    }
  };
  return (
    <Dialog open={!!selectedArticleId} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-4xl w-[95vw] h-[90vh] p-0 flex flex-col bg-background/95 backdrop-blur-sm",
        "dark:bg-muted"
      )}>
        {/* Visually hidden title and description for accessibility, fixes console error. */}
        <DialogTitle className="sr-only">{article?.title || 'Article'}</DialogTitle>
        <DialogDescription className="sr-only">
          Showing content for the selected article. Press Escape or Enter to close.
        </DialogDescription>
        <ArticleContentPanel />
      </DialogContent>
    </Dialog>
  );
}