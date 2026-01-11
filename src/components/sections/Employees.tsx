import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Employee {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'technician' | 'operator';
  phone: string;
  email: string;
  salary: number;
  activeOrders: number;
  completedOrders: number;
  status: 'active' | 'vacation' | 'sick';
}

const initialEmployees: Employee[] = [
  { id: '1', name: 'Сергей Технов', role: 'technician', phone: '+7 999 111-22-33', email: 'sergey@tech.ru', salary: 80000, activeOrders: 8, completedOrders: 145, status: 'active' },
  { id: '2', name: 'Анна Менеджер', role: 'manager', phone: '+7 999 222-33-44', email: 'anna@tech.ru', salary: 90000, activeOrders: 0, completedOrders: 0, status: 'active' },
  { id: '3', name: 'Максим Оператор', role: 'operator', phone: '+7 999 333-44-55', email: 'maxim@tech.ru', salary: 60000, activeOrders: 0, completedOrders: 0, status: 'vacation' },
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '', role: 'operator', phone: '', email: '', salary: 0, status: 'active'
  });

  const roleConfig = {
    admin: { label: 'Администратор', color: 'bg-purple-500' },
    manager: { label: 'Менеджер', color: 'bg-blue-500' },
    technician: { label: 'Техник', color: 'bg-green-500' },
    operator: { label: 'Оператор', color: 'bg-orange-500' },
  };

  const statusConfig = {
    active: { label: 'Активен', variant: 'default' as const },
    vacation: { label: 'Отпуск', variant: 'secondary' as const },
    sick: { label: 'Больничный', variant: 'destructive' as const },
  };

  const handleCreate = () => {
    const newEmployee: Employee = {
      id: String(Date.now()),
      name: formData.name || '',
      role: formData.role as Employee['role'] || 'operator',
      phone: formData.phone || '',
      email: formData.email || '',
      salary: formData.salary || 0,
      activeOrders: 0,
      completedOrders: 0,
      status: formData.status as Employee['status'] || 'active',
    };
    setEmployees([newEmployee, ...employees]);
    setFormData({ name: '', role: 'operator', phone: '', email: '', salary: 0, status: 'active' });
    setIsCreateOpen(false);
  };

  const handleUpdate = () => {
    if (!editingEmployee) return;
    setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...editingEmployee, ...formData } : e));
    setEditingEmployee(null);
    setFormData({ name: '', role: 'operator', phone: '', email: '', salary: 0, status: 'active' });
  };

  const handleDelete = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.phone.includes(searchQuery) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
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
              Добавить сотрудника
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить сотрудника</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>ФИО</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Полное имя"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Должность</Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as Employee['role'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Администратор</SelectItem>
                      <SelectItem value="manager">Менеджер</SelectItem>
                      <SelectItem value="technician">Техник</SelectItem>
                      <SelectItem value="operator">Оператор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Статус</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Employee['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Активен</SelectItem>
                      <SelectItem value="vacation">Отпуск</SelectItem>
                      <SelectItem value="sick">Больничный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <div>
                <Label>Зарплата (₽)</Label>
                <Input
                  type="number"
                  value={formData.salary || ''}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                Добавить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover-scale border-none shadow-lg glass-effect">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Avatar className={`w-16 h-16 ${roleConfig[employee.role].color}`}>
                    <AvatarFallback className="text-white font-bold text-lg">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{employee.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{roleConfig[employee.role].label}</Badge>
                      <Badge variant={statusConfig[employee.status].variant}>
                        {statusConfig[employee.status].label}
                      </Badge>
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
                          setEditingEmployee(employee);
                          setFormData(employee);
                        }}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать сотрудника</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>ФИО</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Статус</Label>
                          <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Employee['status'] })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Активен</SelectItem>
                              <SelectItem value="vacation">Отпуск</SelectItem>
                              <SelectItem value="sick">Больничный</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Зарплата (₽)</Label>
                          <Input
                            type="number"
                            value={formData.salary || ''}
                            onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                          />
                        </div>
                        <Button onClick={handleUpdate} className="w-full gradient-purple text-white">
                          Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(employee.id)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={14} />
                  {employee.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={14} />
                  {employee.email}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Зарплата</p>
                  <p className="text-lg font-bold">₽{employee.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">В работе</p>
                  <p className="text-lg font-bold text-primary">{employee.activeOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Выполнено</p>
                  <p className="text-lg font-bold text-green-500">{employee.completedOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
