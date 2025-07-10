// src/components/SwaggerClient.tsx
'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(
  () => import('swagger-ui-react'),
  {
    ssr: false,
    loading: () => <p>Loading docs...</p>,
  }
);

export default function SwaggerClient({ url }: { url: string }) {
  return <SwaggerUI url={url} />;
}
