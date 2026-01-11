import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Order {
  id: string;
  clientName: string;
  device: string;
  problem: string;
  status: 'new' | 'in-progress' | 'waiting' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  price?: number;
}

const initialOrders: Order[] = [
  { id: '12345', clientName: 'Иван Петров', device: 'MacBook Pro 2020', problem: 'Не включается', status: 'in-progress', priority: 'high', createdAt: '2024-01-10', price: 5000 },
  { id: '12346', clientName: 'Мария Сидорова', device: 'HP Pavilion', problem: 'Медленно работает', status: 'new', priority: 'medium', createdAt: '2024-01-11', price: 2000 },
  { id: '12347', clientName: 'Алексей Козлов', device: 'Lenovo IdeaPad', problem: 'Разбит экран', status: 'waiting', priority: 'low', createdAt: '2024-01-09', price: 8000 },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState<Partial<Order>>({
    clientName: '',
    device: '',
    problem: '',
    status: 'new',
    priority: 'medium',
  });

  const statusConfig = {
    new: { label: 'Новый', color: 'bg-blue-500' },
    'in-progress': { label: 'В работе', color: 'bg-yellow-500' },
    waiting: { label: 'Ожидание', color: 'bg-orange-500' },
    completed: { label: 'Завершён', color: 'bg-green-500' },
  };

  const priorityConfig = {
    low: { label: 'Низкий', variant: 'outline' as const },
    medium: { label: 'Средний', variant: 'secondary' as const },
    high: { label: 'Высокий', variant: 'destructive' as const },
  };

  const handleCreate = () => {
    const newOrder: Order = {
      id: String(Math.floor(Math.random() * 90000) + 10000),
      clientName: formData.clientName || '',
      device: formData.device || '',
      problem: formData.problem || '',
      status: formData.status as Order['status'] || 'new',
      priority: formData.priority as Order['priority'] || 'medium',
      createdAt: new Date().toISOString().split('T')[0],
      price: formData.price,
    };
    setOrders([newOrder, ...orders]);
    setFormData({ clientName: '', device: '', problem: '', status: 'new', priority: 'medium' });
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editingOrder) return;
    setOrders(orders.map(o => o.id === editingOrder.id ? { ...editingOrder, ...formData } : o));
    setEditingOrder(null);
    setFormData({ clientName: '', device: '', problem: '', status: 'new', priority: 'medium' });
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const filteredOrders = orders.filter(o =>
    o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск по клиенту, устройству или номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-white border-none">
              <Icon name="Plus" size={18} />
              Новый заказ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новый заказ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Клиент</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Имя клиента"
                />
              </div>
              <div>
                <Label>Устройство</Label>
                <Input
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  placeholder="Модель устройства"
                />
              </div>
              <div>
                <Label>Проблема</Label>
                <Textarea
                  value={formData.problem}
                  onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                  placeholder="Описание проблемы"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Приоритет</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as Order['priority'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                Создать заказ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover-scale border-none shadow-lg glass-effect">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-3 h-3 rounded-full ${statusConfig[order.status].color} mt-1.5`} />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg">#{order.id}</h3>
                      <Badge variant={priorityConfig[order.priority].variant}>
                        {priorityConfig[order.priority].label}
                      </Badge>
                      <Badge variant="outline">{statusConfig[order.status].label}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{order.clientName} • {order.device}</p>
                    <p className="text-sm">{order.problem}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {order.createdAt}
                      </span>
                      {order.price && (
                        <span className="flex items-center gap-1 font-medium text-primary">
                          <Icon name="DollarSign" size={14} />
                          {order.price}₽
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingOrder(order);
                          setFormData(order);
                        }}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать заказ #{order.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Статус</Label>
                          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Order['status'] })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">Новый</SelectItem>
                              <SelectItem value="in-progress">В работе</SelectItem>
                              <SelectItem value="waiting">Ожидание</SelectItem>
                              <SelectItem value="completed">Завершён</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Проблема</Label>
                          <Textarea
                            value={formData.problem}
                            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Цена (₽)</Label>
                          <Input
                            type="number"
                            value={formData.price || ''}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                        </div>
                        <Button onClick={handleUpdate} className="w-full gradient-purple text-white">
                          Сохранить изменения
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(order.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
