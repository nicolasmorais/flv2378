
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
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
                {children}
            </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
