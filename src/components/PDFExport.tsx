'use client';

import React, { Suspense, useState, useEffect } from 'react';

// Lazy-load entire PDF export to avoid SSR issues with @react-pdf/renderer
// This is the correct pattern: dynamic import with ssr:false
export default function PDFExport({ report }: { report: any }) {
  const [isClient, setIsClient] = useState(false);
  const [PDFButton, setPDFButton] = useState<React.ReactNode>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import client-side only to avoid Next.js SSR problems
    import('./PDFExportClient').then((mod) => {
      setPDFButton(mod.default(report));
    }).catch((err: Error) => {
      console.error('[PDFExport] failed to load:', err);
    });
  }, [report]);

  if (!isClient) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 py-2 px-4 bg-gray-300 text-white font-medium rounded-lg cursor-not-allowed"
      >
        📄 載入中...
      </button>
    );
  }

  if (!PDFButton) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 py-2 px-4 bg-gray-300 text-white font-medium rounded-lg cursor-not-allowed"
      >
        📄 準備中...
      </button>
    );
  }

  return PDFButton;
}
