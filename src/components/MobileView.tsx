import React from 'react';
import { useFeedStore } from '@/store/feedStore';
import { SubscriptionPanel } from '@/components/SubscriptionPanel';
import { ArticleListPanel } from '@/components/ArticleListPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Subscription } from '@shared/types';
interface MobileViewProps {
  onAddFeed: () => void;
  onEditFeed: (subscription: Subscription) => void;
}
export function MobileView({ onAddFeed, onEditFeed }: MobileViewProps) {
  const selectedSubscriptionId = useFeedStore((state) => state.selectedSubscriptionId);
  const selectSubscription = useFeedStore((state) => state.selectSubscription);
  const handleBackToFeeds = () => {
    selectSubscription(null);
  };
  if (selectedSubscriptionId) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-2 border-b">
          <Button variant="ghost" size="sm" onClick={handleBackToFeeds}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Feeds
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ArticleListPanel />
        </div>
      </div>
    );
  }
  return (
    <div className="h-full">
      <SubscriptionPanel onAddFeed={onAddFeed} onEditFeed={onEditFeed} />
    </div>
  );
}