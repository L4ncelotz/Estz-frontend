// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Import global CSS (which should now include your animation)

// Initialize the Inter font with optimization from next/font
const inter = Inter({ subsets: ['latin'] });

// Centralized metadata object, including the favicon
export const metadata: Metadata = {
  title: 'Discord Memo Archiver',
  description: 'Your Discord highlights, archived and browsable.',
  icons: {
    icon: '/favicon.ico', // The modern way to add a favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply the font class to the body for optimal performance.
        This avoids using a <head> tag directly in this file.
      */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}