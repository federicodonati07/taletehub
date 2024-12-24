"use client"
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/system';
import { Roboto, Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="en">
        <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
          {/* Render empty until mounted */}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
