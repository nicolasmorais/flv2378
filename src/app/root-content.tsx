
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { useAuthStore } from '@/hooks/use-auth-store';

export default function RootContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoaded } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthLoaded) {
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isAuthLoaded, pathname, router]);

  if (!isAuthLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated || pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="border-b bg-card backdrop-blur-sm sticky top-0 z-10 md:hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
              </div>
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </>
  );
}
