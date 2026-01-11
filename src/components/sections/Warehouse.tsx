import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Movement {
  id: string;
  partName: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  date: string;
  responsiblePerson: string;
}

interface StockAlert {
  id: string;
  partName: string;
  currentStock: number;
  minStock: number;
  category: string;
}

const initialMovements: Movement[] = [
  { id: '1', partName: 'Дисплей MacBook Pro 13"', type: 'in', quantity: 5, reason: 'Поступление от поставщика', date: '2024-01-10', responsiblePerson: 'Иван Петров' },
  { id: '2', partName: 'Батарея HP', type: 'out', quantity: 2, reason: 'Использовано в заказах #12345, #12346', date: '2024-01-11', responsiblePerson: 'Сергей Технов' },
];

const stockAlerts: StockAlert[] = [
  { id: '1', partName: 'Клавиатура Lenovo', currentStock: 1, minStock: 3, category: 'Клавиатура' },
  { id: '2', partName: 'Дисплей MacBook Pro 13"', currentStock: 3, minStock: 2, category: 'Дисплей' },
];

export default function Warehouse() {
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Movement>>({
    partName: '', type: 'in', quantity: 0, reason: '', responsiblePerson: ''
  });

  const handleCreate = () => {
    const newMovement: Movement = {
      id: String(Date.now()),
      partName: formData.partName || '',
      type: formData.type as Movement['type'] || 'in',
      quantity: formData.quantity || 0,
      reason: formData.reason || '',
      date: new Date().toISOString().split('T')[0],
      responsiblePerson: formData.responsiblePerson || '',
    };
    setMovements([newMovement, ...movements]);
    setFormData({ partName: '', type: 'in', quantity: 0, reason: '', responsiblePerson: '' });
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    setMovements(movements.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="movements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="movements">Движение товара</TabsTrigger>
          <TabsTrigger value="alerts">Оповещения</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-purple text-white border-none">
                  <Icon name="Plus" size={18} />
                  Новое движение
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить движение товара</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Запчасть</Label>
                    <Input
                      value={formData.partName}
                      onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                      placeholder="Название запчасти"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Тип операции</Label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Movement['type'] })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">Приход</SelectItem>
                          <SelectItem value="out">Расход</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Количество</Label>
                      <Input
                        type="number"
                        value={formData.quantity || ''}
                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Причина</Label>
                    <Input
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Поступление от поставщика"
                    />
                  </div>
                  <div>
                    <Label>Ответственный</Label>
                    <Input
                      value={formData.responsiblePerson}
                      onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                      placeholder="Имя сотрудника"
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                    Добавить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {movements.map((movement) => (
              <Card key={movement.id} className="border-none shadow-lg glass-effect">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl ${
                        movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                      } flex items-center justify-center`}>
                        <Icon
                          name={movement.type === 'in' ? 'ArrowDownToLine' : 'ArrowUpFromLine'}
                          className="text-white"
                          size={24}
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-lg">{movement.partName}</h3>
                          <Badge variant={movement.type === 'in' ? 'default' : 'secondary'}>
                            {movement.type === 'in' ? 'Приход' : 'Расход'}: {movement.quantity} шт.
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{movement.reason}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {movement.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            {movement.responsiblePerson}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(movement.id)}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="border-none shadow-lg gradient-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={24} />
                Критический уровень запасов
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg"
                >
                  <div>
                    <h3 className="font-bold">{alert.partName}</h3>
                    <p className="text-sm text-muted-foreground">{alert.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">{alert.currentStock} шт.</p>
                    <p className="text-xs text-muted-foreground">Мин: {alert.minStock} шт.</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Всего позиций</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">124</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Общая стоимость</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-primary">₽485K</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Требуют заказа</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-500">{stockAlerts.length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
