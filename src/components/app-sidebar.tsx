'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Leaf, Apple, Carrot, CalendarDays, LogOut } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';

const menuItems = [
    { href: '/', label: 'Todos os Plus', icon: Home },
    { href: '/folhagem', label: 'Plus Folhagem', icon: Leaf },
    { href: '/frutas', label: 'Plus Frutas', icon: Apple },
    { href: '/verduras-legumes', label: 'Plus Verduras e Legumes', icon: Carrot },
    { href: '/preco-livre-diario', label: 'Preço Livre Diário', icon: CalendarDays },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
        <SidebarHeader>
            <div className="flex items-center justify-center gap-2 p-4">
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 208 64"
                    className="h-8 w-auto"
                    fill="currentColor"
                  >
                    <path d="M23.8,5.4H1.5v53.2h22.3V5.4z M52.2,5.4L41,32l-11.2-26.6H5.3l29.4,41.9h0.1l29.4-41.9H52.2z M107.8,24.1c0-10.3-8.4-18.7-18.7-18.7c-10.3,0-18.7,8.4-18.7,18.7c0,10.3,8.4,18.7,18.7,18.7C99.4,42.8,107.8,34.4,107.8,24.1z M86.8,24.1c0-1.6,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9s-1.3,2.9-2.9,2.9S86.8,25.7,86.8,24.1z"></path>
                    <image href="https://storage.googleapis.com/stc-llm-testing/flv_logo.png" x="110" y="0" height="60" width="98" />
                  </svg>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>PRINCIPAL</SidebarGroupLabel>
                <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} passHref legacyBehavior>
                            <SidebarMenuButton isActive={pathname === item.href}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <LogOut className="h-4 w-4" />
                        <span>Sair</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </>
  );
}
