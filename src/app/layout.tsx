
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { useAuthStore } from '@/hooks/use-auth-store';
import { setupDatabase } from '@/lib/db';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, isAuthLoaded } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSetupDone, setIsSetupDone] = useState(false);

  useEffect(() => {
    setupDatabase().then(() => setIsSetupDone(true));
  }, []);

  useEffect(() => {
    if (isAuthLoaded && isSetupDone) {
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isAuthLoaded, isSetupDone, pathname, router]);

  if (!isAuthLoaded || !isSetupDone) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>FLV 2378</title>
            </head>
            <body>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-2xl font-semibold">Carregando...</div>
                </div>
            </body>
        </html>
    );
  }

  if (!isAuthenticated || pathname === '/login') {
      return (
          <html lang="en" suppressHydrationWarning>
              <head>
                <title>FLV 2378</title>
              </head>
              <body>
                  {children}
                  <Toaster />
              </body>
          </html>
      );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>FLV 2378</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
            <Sidebar>
                <AppSidebar />
            </Sidebar>
            <SidebarInset>
                <header className="border-b bg-sidebar backdrop-blur-sm sticky top-0 z-10 md:hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger />
                            </div>
                            <div className="flex-1 flex justify-center">
                                 <Image 
                                    src="https://iv2jb3repd5xzuuy.public.blob.vercel-storage.com/ChatGPT%20Image%2027%20de%20set.%20de%202025%2C%2023_53_23%20%281%29-P2FGpUXiJ03U8Gc6zcn80QicOZqucr.png" 
                                    alt="FLV Logo"
                                    width={120}
                                    height={40}
                                />
                            </div>
                             <div className="w-10"></div> {/* Spacer to balance the trigger button */}
                        </div>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
