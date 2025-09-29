import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFeedStore } from '@/store/feedStore';
import { toast } from 'sonner';
import type { Subscription } from '@shared/types';
interface EditFeedDialogProps {
  subscription: Subscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function EditFeedDialog({ subscription, open, onOpenChange }: EditFeedDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateSubscription = useFeedStore((state) => state.updateSubscription);
  useEffect(() => {
    if (subscription) {
      setTitle(subscription.title);
      setUrl(subscription.url);
    }
  }, [subscription]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription || !url.trim() || !title.trim() || isSubmitting) {
      return;
    }
    try {
      new URL(url);
    } catch (_) {
      toast.error('Please enter a valid URL.');
      return;
    }
    setIsSubmitting(true);
    const updatedSub = await updateSubscription({
      ...subscription,
      title,
      url,
    });
    setIsSubmitting(false);
    if (updatedSub) {
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Feed</DialogTitle>
            <DialogDescription>
              Modify the title or URL for this subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="Feed Title"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/rss.xml"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}