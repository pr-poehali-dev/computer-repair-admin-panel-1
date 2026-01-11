import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  onSectionChange: (section: string) => void;
  userRole: 'admin' | 'manager' | 'technician' | 'operator';
}

const menuItems = [
  { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard', roles: ['admin', 'manager', 'technician', 'operator'] },
  { id: 'orders', label: 'Заказы', icon: 'ClipboardList', roles: ['admin', 'manager', 'technician', 'operator'] },
  { id: 'clients', label: 'Клиенты', icon: 'Users', roles: ['admin', 'manager', 'operator'] },
  { id: 'devices', label: 'Устройства', icon: 'Monitor', roles: ['admin', 'manager', 'technician'] },
  { id: 'diagnostics', label: 'Диагностика', icon: 'Activity', roles: ['admin', 'technician'] },
  { id: 'parts', label: 'Запчасти', icon: 'Cpu', roles: ['admin', 'manager', 'technician'] },
  { id: 'warehouse', label: 'Склад', icon: 'Package', roles: ['admin', 'manager'] },
  { id: 'finance', label: 'Финансы', icon: 'DollarSign', roles: ['admin', 'manager'] },
  { id: 'employees', label: 'Сотрудники', icon: 'UserCog', roles: ['admin', 'manager'] },
  { id: 'calendar', label: 'Календарь', icon: 'Calendar', roles: ['admin', 'manager', 'technician', 'operator'] },
  { id: 'statistics', label: 'Статистика', icon: 'BarChart3', roles: ['admin', 'manager'] },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell', roles: ['admin', 'manager', 'technician', 'operator'] },
  { id: 'knowledge', label: 'База знаний', icon: 'BookOpen', roles: ['admin', 'manager', 'technician', 'operator'] },
  { id: 'settings', label: 'Настройки', icon: 'Settings', roles: ['admin', 'manager'] },
];

export default function AdminLayout({ children, currentSection, onSectionChange, userRole }: AdminLayoutProps) {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  const SidebarMenuContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
            <Icon name="Wrench" className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-lg">TechRepair</h2>
            <p className="text-xs text-muted-foreground">Админ панель</p>
          </div>
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenu.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => {
                      onSectionChange(item.id);
                      setMobileOpen(false);
                    }}
                    isActive={currentSection === item.id}
                    className="transition-all duration-200 hover:scale-[1.02]"
                  >
                    <Icon name={item.icon as any} size={18} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={toggleTheme}
        >
          <Icon name={isDark ? 'Sun' : 'Moon'} size={18} />
          {isDark ? 'Светлая тема' : 'Тёмная тема'}
        </Button>
      </div>
    </>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5">
        <div className="hidden lg:block">
          <Sidebar className="border-r border-sidebar-border">
            <SidebarMenuContent />
          </Sidebar>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <SidebarMenuContent />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Icon name="Menu" size={24} />
              </Button>

              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {filteredMenu.find(item => item.id === currentSection)?.label || 'Дашборд'}
              </h1>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Icon name="Bell" size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
                </Button>
                <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-white font-bold text-sm">
                  {userRole === 'admin' ? 'A' : userRole === 'manager' ? 'M' : userRole === 'technician' ? 'T' : 'O'}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
