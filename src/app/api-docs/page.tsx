// src/app/api-docs/page.tsx
'use client';

import SwaggerClient from '@/components/SwaggerClient'; // or import SwaggerUI directly

export default function ApiDocsPage() {
  return (
    <section>
      <SwaggerClient url="/openapi.json" />
    </section>
  );
}
