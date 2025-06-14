import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Karachi Bus Tracker',
  description: 'Real-time bus tracking and route planning for Karachi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-b from-[#4A102A] to-[#85193C] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}