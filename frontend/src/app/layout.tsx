import './globals.css';
import type { Metadata } from 'next';
import RedirectIfAdmin from '@/components/RedirectIfAdmin';


export const metadata: Metadata = {
  title: 'Ngendok_Farm',
  description: 'Ngendok Farm',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <RedirectIfAdmin />
        
      </body>
    </html>
  );
}