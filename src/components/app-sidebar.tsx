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
                    viewBox="0 0 130 30"
                    className="h-6 w-auto"
                  >
                    <path
                      d="M26.4,26.2h-6.4V3.8h6.4V26.2z M23.2,0.2c-1.6,0-3,0.5-4,1.4s-1.4,2.3-1.4,4v17.2c0,1.7,0.5,3,1.4,4s2.3,1.4,4,1.4
c1.6,0,3-0.5,4-1.4s1.4-2.3,1.4-4V5.6c0-1.7-0.5-3-1.4-4S24.8,0.2,23.2,0.2z"
                    ></path>
                    <path
                      d="M0,26.2V3.8h6.4v22.5H0z"
                    ></path>
                    <path
                      d="M42.2,26.2h-6.4V3.8h6.4v1.8c0.9-1.3,2.3-2,4-2c1.8,0,3.2,0.6,4.2,1.8s1.5,2.8,1.5,4.8v16h-6.4V10
c0-1.2-0.3-2.1-0.9-2.7s-1.4-0.9-2.4-0.9c-1.3,0-2.3,0.4-3,1.3V26.2z"
                    ></path>
                    <path d="M72.9,26.2h-6.4V3.8h6.4V26.2z M69.7,0.2c-1.6,0-3,0.5-4,1.4s-1.4,2.3-1.4,4v17.2c0,1.7,0.5,3,1.4,4s2.3,1.4,4,1.4
s3-0.5,4-1.4s1.4-2.3,1.4-4V5.6c0-1.7-0.5-3-1.4-4S71.3,0.2,69.7,0.2z"></path><path d="M85.9,26.2V3.8h6.4v1.8c0.9-1.3,2.3-2,4-2c1.8,0,3.2,0.6,4.2,1.8s1.5,2.8,1.5,4.8v16h-6.4V10c0-1.2-0.3-2.1-0.9-2.7
s-1.4-0.9-2.4-0.9c-1.3,0-2.3,0.4-3,1.3V26.2z"></path><path d="M129.5,14.2c0,1.7-0.5,3.1-1.4,4.2s-2.2,1.7-3.8,1.7c-1.2,0-2.3-0.3-3.2-0.8V26h-6.4V3.8h6.2v8.8c1-0.8,2.2-1.2,3.5-1.2
c1.7,0,3.1,0.5,4.1,1.5S129.5,12.5,129.5,14.2z M123,14.4c0-0.9-0.2-1.6-0.6-2.1s-1-0.8-1.7-0.8c-0.8,0-1.5,0.3-2,0.8v4.6
c0.5,0.4,1.1,0.6,1.8,0.6c0.7,0,1.3-0.3,1.7-0.8S123,15.3,123,14.4z"></path>
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
