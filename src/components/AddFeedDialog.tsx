import React, { useState } from 'react';
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
interface AddFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function AddFeedDialog({ open, onOpenChange }: AddFeedDialogProps) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addSubscription = useFeedStore((state) => state.addSubscription);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isSubmitting) {
      return;
    }
    try {
      new URL(url);
    } catch (_) {
      toast.error('Please enter a valid URL.');
      return;
    }
    setIsSubmitting(true);
    const newSub = await addSubscription(url);
    setIsSubmitting(false);
    if (newSub) {
      setUrl('');
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new feed</DialogTitle>
            <DialogDescription>
              Enter the URL of the RSS feed you want to subscribe to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}