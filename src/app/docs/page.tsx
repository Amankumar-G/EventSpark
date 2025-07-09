'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function DocsPage() {
  return (
    <div className="p-4 min-h-screen bg-white">
      <SwaggerUI url="/api/docs/json" />
    </div>
  );
}
