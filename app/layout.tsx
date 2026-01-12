import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Remotion Player Demo',
  description: 'Next.js app showcasing Remotion compositions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
