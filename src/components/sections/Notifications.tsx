import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Notification {
  id: string;
  type: 'order' | 'system' | 'alert' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'order', title: 'Новый заказ #12349', message: 'Клиент: Сергей Иванов. Устройство: MacBook Air', time: '5 мин назад', isRead: false },
  { id: '2', type: 'alert', title: 'Критический уровень запасов', message: 'Клавиатура Lenovo KB-001 требует пополнения', time: '1 час назад', isRead: false },
  { id: '3', type: 'system', title: 'Обновление системы', message: 'Доступна новая версия админ панели v2.3.1', time: '2 часа назад', isRead: true },
  { id: '4', type: 'info', title: 'Завершён заказ #12345', message: 'Клиент уведомлён о готовности', time: '3 часа назад', isRead: true },
  { id: '5', type: 'order', title: 'Новый заказ #12348', message: 'Клиент: Елена Смирнова. Устройство: Asus ROG', time: '5 часов назад', isRead: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const typeConfig = {
    order: { label: 'Заказ', color: 'bg-blue-500', icon: 'ClipboardList' },
    system: { label: 'Система', color: 'bg-purple-500', icon: 'Settings' },
    alert: { label: 'Важно', color: 'bg-red-500', icon: 'AlertTriangle' },
    info: { label: 'Инфо', color: 'bg-green-500', icon: 'Info' },
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={`border-none shadow-lg transition-all ${notification.isRead ? 'glass-effect' : 'bg-primary/5'}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${typeConfig[notification.type].color} flex items-center justify-center flex-shrink-0`}>
            <Icon name={typeConfig[notification.type].icon as any} className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold">{notification.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {typeConfig[notification.type].label}
                </Badge>
                {!notification.isRead && (
                  <Badge className="gradient-purple text-white text-xs">Новое</Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Icon name="Clock" size={12} />
                {notification.time}
              </p>
              <div className="flex gap-2">
                {!notification.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Icon name="Check" size={14} />
                    Прочитано
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Уведомления</h2>
          {unreadCount > 0 && (
            <Badge className="gradient-purple text-white">
              {unreadCount} новых
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Icon name="CheckCheck" size={18} />
            Прочитать всё
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Все ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Непрочитанные ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="order">
            Заказы ({notifications.filter(n => n.type === 'order').length})
          </TabsTrigger>
          <TabsTrigger value="alert">
            Важные ({notifications.filter(n => n.type === 'alert').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {notifications.filter(n => !n.isRead).length === 0 ? (
            <Card className="border-none shadow-lg glass-effect">
              <CardContent className="p-12 text-center">
                <Icon name="CheckCircle2" size={64} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Нет новых уведомлений</h3>
                <p className="text-muted-foreground">Все уведомления прочитаны</p>
              </CardContent>
            </Card>
          ) : (
            notifications.filter(n => !n.isRead).map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="order" className="space-y-4">
          {notifications.filter(n => n.type === 'order').map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        <TabsContent value="alert" className="space-y-4">
          {notifications.filter(n => n.type === 'alert').map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
