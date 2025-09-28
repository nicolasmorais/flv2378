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
            <div className="flex items-center gap-2 p-2">
                 <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 30"
                    className="h-6 w-auto"
                    fill="currentColor"
                  >
                    <text x="0" y="22" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold">FLV</text>
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
