import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('TechRepair');
  const [email, setEmail] = useState('info@techrepair.ru');
  const [phone, setPhone] = useState('+7 999 123-45-67');
  const [address, setAddress] = useState('Москва, ул. Примерная, д. 1');
  
  const [notifications, setNotifications] = useState({
    newOrders: true,
    statusChanges: true,
    lowStock: true,
    dailyReport: false,
  });

  const [workHours, setWorkHours] = useState({
    start: '09:00',
    end: '18:00',
  });

  const handleSaveCompany = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Информация о компании успешно обновлена',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Параметры уведомлений обновлены',
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Building2" size={24} />
                Информация о компании
              </CardTitle>
              <CardDescription>
                Основные данные о вашем сервисном центре
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Название компании</Label>
                  <Input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Адрес</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Начало рабочего дня</Label>
                  <Input
                    type="time"
                    value={workHours.start}
                    onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Конец рабочего дня</Label>
                  <Input
                    type="time"
                    value={workHours.end}
                    onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSaveCompany} className="gradient-purple text-white">
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg gradient-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MapPin" size={24} />
                География работы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Часовой пояс</Label>
                <Select defaultValue="msk">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="msk">GMT+3 Москва</SelectItem>
                    <SelectItem value="spb">GMT+3 Санкт-Петербург</SelectItem>
                    <SelectItem value="ekb">GMT+5 Екатеринбург</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Валюта</Label>
                <Select defaultValue="rub">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rub">₽ Российский рубль</SelectItem>
                    <SelectItem value="usd">$ Доллар США</SelectItem>
                    <SelectItem value="eur">€ Евро</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Bell" size={24} />
                Настройки уведомлений
              </CardTitle>
              <CardDescription>
                Управляйте тем, какие уведомления вы хотите получать
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Новые заказы</Label>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о поступлении новых заказов
                  </p>
                </div>
                <Switch
                  checked={notifications.newOrders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newOrders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Изменения статусов</Label>
                  <p className="text-sm text-muted-foreground">
                    Уведомления при изменении статуса заказа
                  </p>
                </div>
                <Switch
                  checked={notifications.statusChanges}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, statusChanges: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Критический уровень запасов</Label>
                  <p className="text-sm text-muted-foreground">
                    Уведомления о необходимости пополнения склада
                  </p>
                </div>
                <Switch
                  checked={notifications.lowStock}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, lowStock: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Ежедневный отчёт</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать сводку по итогам дня на email
                  </p>
                </div>
                <Switch
                  checked={notifications.dailyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, dailyReport: checked })
                  }
                />
              </div>
              <Button onClick={handleSaveNotifications} className="gradient-purple text-white">
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Settings" size={24} />
                Системные настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Язык интерфейса</Label>
                <Select defaultValue="ru">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Формат даты</Label>
                <Select defaultValue="dd.mm.yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd.mm.yyyy">ДД.ММ.ГГГГ</SelectItem>
                    <SelectItem value="mm/dd/yyyy">ММ/ДД/ГГГГ</SelectItem>
                    <SelectItem value="yyyy-mm-dd">ГГГГ-ММ-ДД</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg gradient-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Database" size={24} />
                Резервное копирование
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Последняя копия: 10.01.2024, 23:45
              </p>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Icon name="Download" size={18} />
                  Скачать копию
                </Button>
                <Button variant="outline">
                  <Icon name="Upload" size={18} />
                  Восстановить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Shield" size={24} />
                Безопасность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Текущий пароль</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label>Новый пароль</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label>Подтвердите пароль</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="gradient-purple text-white">
                Изменить пароль
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Clock" size={24} />
                История активности
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { action: 'Вход в систему', time: '10:23, 11.01.2024', ip: '192.168.1.1' },
                { action: 'Создан заказ #12349', time: '09:45, 11.01.2024', ip: '192.168.1.1' },
                { action: 'Изменены настройки', time: '18:30, 10.01.2024', ip: '192.168.1.1' },
              ].map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.time} • {log.ip}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
