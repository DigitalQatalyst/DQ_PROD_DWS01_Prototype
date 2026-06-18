import { useState } from 'react';
import { ArrowRight, Bookmark, ExternalLink, MoreHorizontal } from 'lucide-react';

interface MarketplaceDetailHeaderActionsProps {
  primaryLabel: string;
  primaryIcon?: 'arrow' | 'external';
  onPrimaryClick: () => void;
  saveLabel?: string;
  onSave?: (saved: boolean) => void;
  onMore?: () => void;
}

export function MarketplaceDetailHeaderActions({
  primaryLabel,
  primaryIcon = 'arrow',
  onPrimaryClick,
  saveLabel = 'Save',
  onSave,
  onMore,
}: MarketplaceDetailHeaderActionsProps) {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    onSave?.(next);
    showToast(next ? `Saved to your ${saveLabel.toLowerCase()} list.` : `Removed from saved ${saveLabel.toLowerCase()}s.`);
  };

  const handleMore = () => {
    onMore?.();
    showToast('More actions coming soon.');
  };

  const PrimaryIcon = primaryIcon === 'external' ? ExternalLink : ArrowRight;

  return (
    <>
      <div className="flex w-full shrink-0 items-center gap-2 lg:w-auto">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-dq-orange px-5 text-sm font-medium text-white shadow-[0_1px_3px_rgba(3,15,53,0.20)] transition hover:bg-[#F24C2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2 lg:flex-initial"
        >
          {primaryLabel}
          <PrimaryIcon size={16} strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? 'Saved' : 'Save'}
          className={[
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2',
            saved
              ? 'border-dq-orange bg-orange-50 text-dq-orange'
              : 'border-gray-200 bg-white text-dq-navy hover:bg-gray-50',
          ].join(' ')}
        >
          <Bookmark size={18} strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
        </button>

        <button
          type="button"
          onClick={handleMore}
          aria-label="More actions"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-dq-navy transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dq-orange focus-visible:ring-offset-2"
        >
          <MoreHorizontal size={18} strokeWidth={2} />
        </button>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[500] max-w-sm rounded-lg border border-gray-200 bg-white p-3 text-xs font-medium text-dq-navy shadow-dq-hover">
          {toast}
        </div>
      )}
    </>
  );
}
