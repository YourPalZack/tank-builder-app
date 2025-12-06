export interface PurchaseLink {
  vendor: string;            // 'Amazon', 'DansFish', 'AquaHuna', 'FlipAquatics', etc.
  url: string;               // direct URL to product or search results
  price?: number;            // optional, if known
  availability?: 'in-stock' | 'out-of-stock' | 'seasonal' | 'unknown';
  affiliate?: boolean;       // true if this link uses an affiliate program
}

export interface PurchasableItem {
  purchaseLinks?: PurchaseLink[];
}
