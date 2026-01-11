import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';

interface Diagnostic {
  id: string;
  orderId: string;
  deviceName: string;
  clientName: string;
  tests: {
    power: boolean;
    display: boolean;
    keyboard: boolean;
    battery: boolean;
    wifi: boolean;
    ports: boolean;
  };
  issues: string[];
  recommendations: string;
  technicianName: string;
  date: string;
}

const initialDiagnostics: Diagnostic[] = [
  {
    id: '1',
    orderId: '#12345',
    deviceName: 'MacBook Pro 2020',
    clientName: 'Иван Петров',
    tests: { power: true, display: false, keyboard: true, battery: false, wifi: true, ports: true },
    issues: ['Не работает дисплей', 'Батарея не держит заряд'],
    recommendations: 'Замена дисплея и батареи',
    technicianName: 'Сергей Технов',
    date: '2024-01-10',
  },
];

export default function Diagnostics() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>(initialDiagnostics);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Diagnostic>>({
    orderId: '',
    deviceName: '',
    clientName: '',
    tests: { power: true, display: true, keyboard: true, battery: true, wifi: true, ports: true },
    recommendations: '',
    technicianName: '',
  });

  const testLabels = {
    power: 'Питание',
    display: 'Дисплей',
    keyboard: 'Клавиатура',
    battery: 'Батарея',
    wifi: 'Wi-Fi',
    ports: 'Порты',
  };

  const handleCreate = () => {
    const failedTests = Object.entries(formData.tests || {})
      .filter(([, passed]) => !passed)
      .map(([test]) => `Проблема с ${testLabels[test as keyof typeof testLabels].toLowerCase()}`);

    const newDiagnostic: Diagnostic = {
      id: String(Date.now()),
      orderId: formData.orderId || '',
      deviceName: formData.deviceName || '',
      clientName: formData.clientName || '',
      tests: formData.tests || { power: true, display: true, keyboard: true, battery: true, wifi: true, ports: true },
      issues: failedTests,
      recommendations: formData.recommendations || '',
      technicianName: formData.technicianName || '',
      date: new Date().toISOString().split('T')[0],
    };
    setDiagnostics([newDiagnostic, ...diagnostics]);
    setFormData({
      orderId: '',
      deviceName: '',
      clientName: '',
      tests: { power: true, display: true, keyboard: true, battery: true, wifi: true, ports: true },
      recommendations: '',
      technicianName: '',
    });
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    setDiagnostics(diagnostics.filter(d => d.id !== id));
  };

  const filteredDiagnostics = diagnostics.filter(d =>
    d.orderId.includes(searchQuery) ||
    d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск по заказу, устройству или клиенту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-white border-none">
              <Icon name="Plus" size={18} />
              Новая диагностика
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Провести диагностику</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Номер заказа</Label>
                  <Input
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="#12345"
                  />
                </div>
                <div>
                  <Label>Клиент</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Имя клиента"
                  />
                </div>
              </div>
              <div>
                <Label>Устройство</Label>
                <Input
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  placeholder="MacBook Pro 2020"
                />
              </div>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <Label className="text-base">Результаты тестов</Label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(testLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData.tests?.[key as keyof typeof formData.tests]}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            tests: { ...formData.tests!, [key]: checked }
                          })
                        }
                      />
                      <label htmlFor={key} className="text-sm cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Рекомендации</Label>
                <Textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Опишите необходимые работы и замены..."
                  rows={4}
                />
              </div>
              <div>
                <Label>Техник</Label>
                <Input
                  value={formData.technicianName}
                  onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                  placeholder="Имя техника"
                />
              </div>
              <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                Сохранить диагностику
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {filteredDiagnostics.map((diagnostic) => (
          <Card key={diagnostic.id} className="border-none shadow-lg glass-effect">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Icon name="Activity" size={24} />
                    {diagnostic.orderId} - {diagnostic.deviceName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Клиент: {diagnostic.clientName} • {diagnostic.date}
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleDelete(diagnostic.id)}>
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(diagnostic.tests).map(([test, passed]) => (
                  <div
                    key={test}
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      passed ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    <Icon
                      name={passed ? 'CheckCircle2' : 'XCircle'}
                      className={passed ? 'text-green-500' : 'text-red-500'}
                      size={20}
                    />
                    <span className="text-sm font-medium">
                      {testLabels[test as keyof typeof testLabels]}
                    </span>
                  </div>
                ))}
              </div>

              {diagnostic.issues.length > 0 && (
                <div className="space-y-2">
                  <Label>Выявленные проблемы:</Label>
                  <div className="flex flex-wrap gap-2">
                    {diagnostic.issues.map((issue, idx) => (
                      <Badge key={idx} variant="destructive">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Рекомендации:</Label>
                <p className="text-sm p-3 bg-muted/50 rounded-lg">{diagnostic.recommendations}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                <Icon name="UserCog" size={16} />
                Техник: {diagnostic.technicianName}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
