'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Leaf, Apple, Carrot, CalendarDays } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold">Menu</h1>
                <div className="flex-1" />
                <SidebarTrigger />
            </div>
        </SidebarHeader>
        <SidebarContent>
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
        </SidebarContent>
    </>
  );
}
