import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

const initialClients: Client[] = [
  { id: '1', name: 'Иван Петров', phone: '+7 999 123-45-67', email: 'ivan@mail.ru', totalOrders: 12, totalSpent: 45000 },
  { id: '2', name: 'Мария Сидорова', phone: '+7 999 234-56-78', email: 'maria@gmail.com', totalOrders: 5, totalSpent: 18000 },
  { id: '3', name: 'Алексей Козлов', phone: '+7 999 345-67-89', email: 'alex@yandex.ru', totalOrders: 8, totalSpent: 32000 },
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({ name: '', phone: '', email: '' });

  const handleCreate = () => {
    const newClient: Client = {
      id: String(Date.now()),
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      totalOrders: 0,
      totalSpent: 0,
    };
    setClients([newClient, ...clients]);
    setFormData({ name: '', phone: '', email: '' });
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editingClient) return;
    setClients(clients.map(c => c.id === editingClient.id ? { ...editingClient, ...formData } : c));
    setEditingClient(null);
    setFormData({ name: '', phone: '', email: '' });
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск по имени, телефону или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-white border-none">
              <Icon name="UserPlus" size={18} />
              Добавить клиента
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового клиента</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Имя</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Полное имя"
                />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 999 123-45-67"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover-scale border-none shadow-lg glass-effect">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="w-16 h-16 gradient-purple">
                  <AvatarFallback className="text-white font-bold text-lg">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingClient(client);
                          setFormData(client);
                        }}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать клиента</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Имя</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Телефон</Label>
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                        <Button onClick={handleUpdate} className="w-full gradient-purple text-white">
                          Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(client.id)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <h3 className="font-bold text-xl mb-1">{client.name}</h3>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  {client.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  {client.email}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Заказов</p>
                  <p className="text-xl font-bold">{client.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Потрачено</p>
                  <p className="text-xl font-bold">₽{client.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
