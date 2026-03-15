'use client';

/**
 * Client-side JSON-LD injection component.
 * Use this in 'use client' pages to inject structured data.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
