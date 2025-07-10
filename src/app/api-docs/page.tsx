// app/api-docs/page.tsx
'use client';

import { useEffect } from 'react';

export default function ApiDocsPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference';
    script.onload = () => {
      // Mount Scalar UI pointing at your OpenAPI path
      // @ts-ignore
      Scalar.createApiReference('#scalar-root', {
        url: '/api/openapi',
        // optional: proxyUrl, theme, persistAuth, ...
      });
    };
    document.body.appendChild(script);
  }, []);

  return <div id="scalar-root" style={{ height: '100vh' }} />;
}
