'use client';

import { ReactNode } from 'react';

// Language is handled client-side in Navbar component
// next-intl removed to fix routing conflicts
export function IntlProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
