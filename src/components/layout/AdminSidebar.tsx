import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Upload, 
  Globe, 
  Settings,
  Workflow,
  Shield
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Orders', url: '/orders', icon: FileText },
  { title: 'Create Order', url: '/orders/create', icon: Plus },
  { title: 'Documents', url: '/documents', icon: Upload },
  { title: 'Countries & Visas', url: '/countries', icon: Globe },
  { title: 'Wizard Flow', url: '/wizard', icon: Workflow },
];

export const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-sidebar-foreground">EZVisaPro</h2>
                <p className="text-xs text-sidebar-foreground/70">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s',
                        textDecoration: 'none',
                        color: isActive ? 'hsl(0 0% 100%)' : 'hsl(240 5.9% 10%)',
                        backgroundColor: isActive ? 'hsl(142 76% 36%)' : 'transparent',
                        fontWeight: isActive ? '500' : '400'
                      })}
                      className="hover:!bg-slate-50 hover:!text-slate-900"
                    >
                      <item.icon className="h-4 w-4" style={{ color: 'inherit' }} />
                      {!isCollapsed && <span style={{ color: 'inherit' }}>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/settings" 
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      color: isActive ? 'hsl(0 0% 100%)' : 'hsl(240 5.9% 10%)',
                      backgroundColor: isActive ? 'hsl(142 76% 36%)' : 'transparent',
                      fontWeight: isActive ? '500' : '400'
                    })}
                    className="hover:!bg-slate-50 hover:!text-slate-900"
                  >
                    <Settings className="h-4 w-4" style={{ color: 'inherit' }} />
                    {!isCollapsed && <span style={{ color: 'inherit' }}>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};