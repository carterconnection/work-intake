import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Implementation Build Request – Carter Connection',
  description: 'Client intake and admin dashboard for implementation build requests.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
