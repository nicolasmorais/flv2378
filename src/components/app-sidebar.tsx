'use client';

import Link from 'next/link';
import Image from 'next/image';
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
            <div className="flex items-center justify-center p-4">
                <Image 
                    src="https://iv2jb3repd5xzuuy.public.blob.vercel-storage.com/ChatGPT%20Image%2027%20de%20set.%20de%202025%2C%2023_53_23%20%281%29-P2FGpUXiJ03U8Gc6zcn80QicOZqucr.png" 
                    alt="FLV Logo"
                    width={180}
                    height={60}
                />
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
