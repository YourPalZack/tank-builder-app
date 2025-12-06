import React from 'react';
import type { PurchaseLink } from '@/types/purchasing';
import { useSettingsStore } from '@/store/useSettingsStore';
import { filterAndSortPurchaseLinks } from '@/lib/purchasing';

interface WhereToBuySectionProps {
  purchaseLinks: PurchaseLink[] | undefined;
  title?: string;
}

export const WhereToBuySection: React.FC<WhereToBuySectionProps> = ({
  purchaseLinks,
  title = 'Where to Buy',
}) => {
  const preferredVendors = useSettingsStore((s) => s.preferredVendors);
  const sortedLinks = filterAndSortPurchaseLinks(purchaseLinks ?? [], preferredVendors);

  if (!sortedLinks.length) {
    return null;
  }

  return (
    <section className="mt-6">
      <h3 className="text-base font-semibold text-slate-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {sortedLinks.map((link) => (
          <div
            key={`${link.vendor}-${link.url}`}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">
                {link.vendor}
              </span>
              {link.availability && (
                <span className="text-xs text-slate-500">
                  {link.availability === 'in-stock' ? 'In stock' : link.availability}
                </span>
              )}
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
            >
              Visit
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
