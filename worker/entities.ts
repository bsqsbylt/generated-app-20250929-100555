import { Entity } from "./core-utils";
import type { Subscription } from "@shared/types";
import type { Env } from "./core-utils";
export type SubscriptionState = {
  subscriptions: Subscription[];
};
export class SubscriptionEntity extends Entity<SubscriptionState> {
  static readonly entityName = "subscriptions";
  static readonly initialState: SubscriptionState = { subscriptions: [] };
  constructor(env: Env) {
    // Use a single global entity for all subscriptions in this single-user app
    super(env, "global");
  }
  async getAll(): Promise<Subscription[]> {
    const state = await this.getState();
    return state.subscriptions;
  }
  async add(subscription: Subscription): Promise<Subscription> {
    await this.mutate((state) => {
      // Prevent adding duplicate URLs
      if (state.subscriptions.some((s) => s.url === subscription.url)) {
        throw new Error("Subscription with this URL already exists.");
      }
      return {
        ...state,
        subscriptions: [...state.subscriptions, subscription]
      };
    });
    return subscription;
  }
  async update(subscription: Subscription): Promise<Subscription> {
    await this.mutate((state) => {
      const index = state.subscriptions.findIndex((s) => s.id === subscription.id);
      if (index === -1) {
        throw new Error("Subscription not found.");
      }
      const newSubscriptions = [...state.subscriptions];
      newSubscriptions[index] = subscription;
      return {
        ...state,
        subscriptions: newSubscriptions,
      };
    });
    return subscription;
  }
  async remove(id: string): Promise<boolean> {
    let removed = false;
    await this.mutate((state) => {
      const initialLength = state.subscriptions.length;
      const newSubscriptions = state.subscriptions.filter((s) => s.id !== id);
      removed = newSubscriptions.length < initialLength;
      return { ...state, subscriptions: newSubscriptions };
    });
    return removed;
  }
}