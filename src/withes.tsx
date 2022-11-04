import React from 'react';
import { withImport, withMiddleware } from '@codixjs/codix';
import { Layout } from './layout';
type Importor = Parameters<typeof React.lazy>[0];
export function withLayout(options: {
  fallback?: React.ReactNode,
  title?: string,
  sidebar?: boolean,
}, callback: Importor) {
  return [
    withMiddleware(Layout, { 
      title: options.title,
      sidebar: options.sidebar,
    }),
    ...withImport(callback, {
      fallback: options.fallback,
    })
  ] as const;
}