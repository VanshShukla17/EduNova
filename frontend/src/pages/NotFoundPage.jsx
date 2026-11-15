import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { EmptyState, PaperCard, Pin, StickyNote, Button } from '../components/ui';

/**
 * Torn/missing notebook page 404 screen anchored to the green desk.
 */
export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: '620px', margin: 'var(--sp-6) auto' }}>
      <PaperCard flat style={{ padding: 'var(--sp-6)' }}>
        <Pin color="red" position="right" />
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <StickyNote tone="yellow" rotation="-1.5deg">
            Page 404 — seems to have fallen out of the binder!
          </StickyNote>
        </div>

        <EmptyState
          icon={FileQuestion}
          title="Notebook Page Not Found"
          description="The chapter, lab, or link you opened does not exist in this notebook. Let us return to your desk."
          actionLabel="Back to Home"
          to="/"
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--sp-4)' }}>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
            Go Back
          </Button>
        </div>
      </PaperCard>
    </div>
  );
}
