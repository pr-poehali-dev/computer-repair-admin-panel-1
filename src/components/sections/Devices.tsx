import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Device {
  id: string;
  model: string;
  brand: string;
  type: 'laptop' | 'desktop' | 'other';
  serialNumber: string;
  condition: 'excellent' | 'good' | 'damaged' | 'broken';
  clientId: string;
  clientName: string;
}

const initialDevices: Device[] = [
  { id: '1', model: 'MacBook Pro 2020', brand: 'Apple', type: 'laptop', serialNumber: 'C02X123456', condition: 'good', clientId: '1', clientName: 'Иван Петров' },
  { id: '2', model: 'Pavilion 15', brand: 'HP', type: 'laptop', serialNumber: 'HP123ABC', condition: 'damaged', clientId: '2', clientName: 'Мария Сидорова' },
  { id: '3', model: 'IdeaPad Gaming', brand: 'Lenovo', type: 'laptop', serialNumber: 'LEN789XYZ', condition: 'broken', clientId: '3', clientName: 'Алексей Козлов' },
];

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({
    model: '', brand: '', type: 'laptop', serialNumber: '', condition: 'good', clientName: ''
  });

  const conditionConfig = {
    excellent: { label: 'Отличное', color: 'bg-green-500' },
    good: { label: 'Хорошее', color: 'bg-blue-500' },
    damaged: { label: 'Повреждено', color: 'bg-yellow-500' },
    broken: { label: 'Сломано', color: 'bg-red-500' },
  };

  const typeIcons = {
    laptop: 'Laptop',
    desktop: 'Monitor',
    other: 'Smartphone',
  };

  const handleCreate = () => {
    const newDevice: Device = {
      id: String(Date.now()),
      model: formData.model || '',
      brand: formData.brand || '',
      type: formData.type as Device['type'] || 'laptop',
      serialNumber: formData.serialNumber || '',
      condition: formData.condition as Device['condition'] || 'good',
      clientId: String(Date.now()),
      clientName: formData.clientName || '',
    };
    setDevices([newDevice, ...devices]);
    setFormData({ model: '', brand: '', type: 'laptop', serialNumber: '', condition: 'good', clientName: '' });
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editingDevice) return;
    setDevices(devices.map(d => d.id === editingDevice.id ? { ...editingDevice, ...formData } : d));
    setEditingDevice(null);
    setFormData({ model: '', brand: '', type: 'laptop', serialNumber: '', condition: 'good', clientName: '' });
  };

  const handleDelete = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const filteredDevices = devices.filter(d =>
    d.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск по модели, бренду или серийному номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-white border-none">
              <Icon name="Plus" size={18} />
              Добавить устройство
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить устройство</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Бренд</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple, HP, Lenovo..."
                  />
                </div>
                <div>
                  <Label>Модель</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="MacBook Pro 2020"
                  />
                </div>
              </div>
              <div>
                <Label>Серийный номер</Label>
                <Input
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="C02X123456"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Тип</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Device['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laptop">Ноутбук</SelectItem>
                      <SelectItem value="desktop">ПК</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Состояние</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v as Device['condition'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Отличное</SelectItem>
                      <SelectItem value="good">Хорошее</SelectItem>
                      <SelectItem value="damaged">Повреждено</SelectItem>
                      <SelectItem value="broken">Сломано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Клиент</Label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Имя клиента"
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
        {filteredDevices.map((device) => (
          <Card key={device.id} className="hover-scale border-none shadow-lg glass-effect">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl gradient-purple flex items-center justify-center`}>
                  <Icon name={typeIcons[device.type] as any} className="text-white" size={24} />
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingDevice(device);
                          setFormData(device);
                        }}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать устройство</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Модель</Label>
                          <Input
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Состояние</Label>
                          <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v as Device['condition'] })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Отличное</SelectItem>
                              <SelectItem value="good">Хорошее</SelectItem>
                              <SelectItem value="damaged">Повреждено</SelectItem>
                              <SelectItem value="broken">Сломано</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleUpdate} className="w-full gradient-purple text-white">
                          Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(device.id)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-1">{device.brand} {device.model}</h3>
              <p className="text-sm text-muted-foreground mb-3">S/N: {device.serialNumber}</p>

              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${conditionConfig[device.condition].color}`} />
                <Badge variant="outline">{conditionConfig[device.condition].label}</Badge>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="User" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{device.clientName}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
