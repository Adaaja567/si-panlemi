import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ngendok_Farm – SI PANLEMI',
  description: 'Bahan masakan rumahan – fresh, halal, siap goreng.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-orange-50">
        {children}
      </body>
    </html>
  );
}