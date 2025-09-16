'use client'

import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModalProvider } from '@/context/ModalContext';
const queryClient = new QueryClient()

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
          <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
        </ModalProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
