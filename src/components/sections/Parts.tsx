import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Part {
  id: string;
  name: string;
  category: 'display' | 'battery' | 'keyboard' | 'motherboard' | 'memory' | 'storage' | 'other';
  brand: string;
  model: string;
  price: number;
  stock: number;
  minStock: number;
}

const initialParts: Part[] = [
  { id: '1', name: 'Дисплей MacBook Pro 13"', category: 'display', brand: 'Apple', model: 'A2338', price: 25000, stock: 3, minStock: 2 },
  { id: '2', name: 'Батарея HP', category: 'battery', brand: 'HP', model: 'HS04', price: 3500, stock: 8, minStock: 5 },
  { id: '3', name: 'Клавиатура Lenovo', category: 'keyboard', brand: 'Lenovo', model: 'KB-001', price: 2800, stock: 1, minStock: 3 },
];

export default function Parts() {
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '', category: 'other', brand: '', model: '', price: 0, stock: 0, minStock: 0
  });

  const categoryConfig = {
    display: { label: 'Дисплей', icon: 'Monitor' },
    battery: { label: 'Батарея', icon: 'Battery' },
    keyboard: { label: 'Клавиатура', icon: 'Keyboard' },
    motherboard: { label: 'Материнская плата', icon: 'Cpu' },
    memory: { label: 'Память', icon: 'MemoryStick' },
    storage: { label: 'Накопитель', icon: 'HardDrive' },
    other: { label: 'Другое', icon: 'Package' },
  };

  const handleCreate = () => {
    const newPart: Part = {
      id: String(Date.now()),
      name: formData.name || '',
      category: formData.category as Part['category'] || 'other',
      brand: formData.brand || '',
      model: formData.model || '',
      price: formData.price || 0,
      stock: formData.stock || 0,
      minStock: formData.minStock || 0,
    };
    setParts([newPart, ...parts]);
    setFormData({ name: '', category: 'other', brand: '', model: '', price: 0, stock: 0, minStock: 0 });
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editingPart) return;
    setParts(parts.map(p => p.id === editingPart.id ? { ...editingPart, ...formData } : p));
    setEditingPart(null);
    setFormData({ name: '', category: 'other', brand: '', model: '', price: 0, stock: 0, minStock: 0 });
  };

  const handleDelete = (id: string) => {
    setParts(parts.filter(p => p.id !== id));
  };

  const filteredParts = parts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск по названию, бренду или модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-white border-none">
              <Icon name="Plus" size={18} />
              Добавить запчасть
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить запчасть</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Дисплей MacBook Pro 13"
                />
              </div>
              <div>
                <Label>Категория</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as Part['category'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Бренд</Label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Apple"
                  />
                </div>
                <div>
                  <Label>Модель</Label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="A2338"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Цена (₽)</Label>
                  <Input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>На складе</Label>
                  <Input
                    type="number"
                    value={formData.stock || ''}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Мин. запас</Label>
                  <Input
                    type="number"
                    value={formData.minStock || ''}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => {
          const isLowStock = part.stock <= part.minStock;
          return (
            <Card key={part.id} className="hover-scale border-none shadow-lg glass-effect">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${isLowStock ? 'bg-red-500' : 'gradient-purple'} flex items-center justify-center`}>
                    <Icon name={categoryConfig[part.category].icon as any} className="text-white" size={24} />
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setEditingPart(part);
                            setFormData(part);
                          }}
                        >
                          <Icon name="Pencil" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактировать запчасть</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Название</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Цена (₽)</Label>
                              <Input
                                type="number"
                                value={formData.price || ''}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>На складе</Label>
                              <Input
                                type="number"
                                value={formData.stock || ''}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Мин. запас</Label>
                              <Input
                                type="number"
                                value={formData.minStock || ''}
                                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                              />
                            </div>
                          </div>
                          <Button onClick={handleUpdate} className="w-full gradient-purple text-white">
                            Сохранить
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(part.id)}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <Badge variant="outline" className="mb-2">
                  {categoryConfig[part.category].label}
                </Badge>
                <h3 className="font-bold text-lg mb-1">{part.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {part.brand} • {part.model}
                </p>

                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₽{part.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">На складе:</span>
                    <span className={`font-bold ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>
                      {part.stock} шт.
                    </span>
                  </div>
                  {isLowStock && (
                    <Badge variant="destructive" className="w-full justify-center">
                      <Icon name="AlertTriangle" size={14} />
                      Требуется пополнение
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
