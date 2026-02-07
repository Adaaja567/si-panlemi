import './globals.css';
import type { Metadata } from 'next';
import RedirectIfAdmin from '@/components/RedirectIfAdmin';
import LayoutWrapper from '@/components/LayoutWrapper';
import { CartProvider } from '@/contexts/CartContext';

export const metadata: Metadata = {
  title: 'Ngendok_Farm',
  description: 'Ngendok Farm - Fresh & Ready to Cook',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          <RedirectIfAdmin />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}