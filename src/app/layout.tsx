import { VCFContextProvider } from '@/components/VCFContextProvider';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VCF Viewer',
  description: 'Viewer for VCF files',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <VCFContextProvider>
        <body className={inter.className}>{children}</body>
      </VCFContextProvider>
    </html>
  );
}
