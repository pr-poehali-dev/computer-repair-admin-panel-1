import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DataTable, { Column, Filter } from '@/components/universal/DataTable';
import DataForm, { FormField } from '@/components/universal/DataForm';

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
  { id: '4', name: 'Дмитрий Ремонтов', role: 'technician', phone: '+7 999 444-55-66', email: 'dmitry@tech.ru', salary: 75000, activeOrders: 5, completedOrders: 98, status: 'active' },
];

export default function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const columns: Column<Employee>[] = [
    {
      key: 'name',
      label: 'Сотрудник',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className={`w-10 h-10 ${roleConfig[row.role].color}`}>
            <AvatarFallback className="text-white font-bold">
              {getInitials(value)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Должность',
      sortable: true,
      render: (value: Employee['role']) => (
        <Badge variant="outline">{roleConfig[value].label}</Badge>
      ),
    },
    {
      key: 'phone',
      label: 'Телефон',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (value: Employee['status']) => (
        <Badge variant={statusConfig[value].variant}>{statusConfig[value].label}</Badge>
      ),
    },
    {
      key: 'salary',
      label: 'Зарплата',
      sortable: true,
      render: (value) => <span className="font-bold text-primary">₽{value.toLocaleString()}</span>,
    },
    {
      key: 'activeOrders',
      label: 'В работе',
      sortable: true,
      render: (value) => <span className="font-bold text-yellow-600">{value}</span>,
    },
    {
      key: 'completedOrders',
      label: 'Выполнено',
      sortable: true,
      render: (value) => <span className="font-bold text-green-600">{value}</span>,
    },
  ];

  const filters: Filter[] = [
    {
      key: 'role',
      label: 'Должность',
      options: Object.entries(roleConfig).map(([key, { label }]) => ({
        value: key,
        label,
      })),
    },
    {
      key: 'status',
      label: 'Статус',
      options: Object.entries(statusConfig).map(([key, { label }]) => ({
        value: key,
        label,
      })),
    },
  ];

  const formFields: FormField[] = [
    {
      key: 'name',
      label: 'ФИО',
      type: 'text',
      required: true,
      placeholder: 'Полное имя сотрудника',
    },
    {
      key: 'role',
      label: 'Должность',
      type: 'select',
      required: true,
      defaultValue: 'operator',
      options: Object.entries(roleConfig).map(([key, { label }]) => ({
        value: key,
        label,
      })),
    },
    {
      key: 'phone',
      label: 'Телефон',
      type: 'text',
      required: true,
      placeholder: '+7 999 123-45-67',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'email@example.com',
    },
    {
      key: 'salary',
      label: 'Зарплата (₽)',
      type: 'number',
      required: true,
      min: 0,
      placeholder: '50000',
    },
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: Object.entries(statusConfig).map(([key, { label }]) => ({
        value: key,
        label,
      })),
    },
    {
      key: 'activeOrders',
      label: 'Активных заказов',
      type: 'number',
      disabled: true,
      defaultValue: 0,
    },
    {
      key: 'completedOrders',
      label: 'Выполнено заказов',
      type: 'number',
      disabled: true,
      defaultValue: 0,
    },
  ];

  const handleCreate = () => {
    setSelectedEmployee(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setEmployees(employees.filter(e => e.id !== employee.id));
  };

  const handleSubmit = (data: Partial<Employee>) => {
    if (formMode === 'create') {
      const newEmployee: Employee = {
        id: String(Date.now()),
        name: data.name || '',
        role: data.role || 'operator',
        phone: data.phone || '',
        email: data.email || '',
        salary: data.salary || 0,
        status: data.status || 'active',
        activeOrders: 0,
        completedOrders: 0,
      };
      setEmployees([newEmployee, ...employees]);
    } else if (formMode === 'edit' && selectedEmployee) {
      setEmployees(employees.map(e => e.id === selectedEmployee.id ? { ...e, ...data } : e));
    }
  };

  const handleDeleteInForm = () => {
    if (selectedEmployee) {
      handleDelete(selectedEmployee);
      setIsFormOpen(false);
    }
  };

  return (
    <>
      <DataTable
        data={employees}
        columns={columns}
        searchKeys={['name', 'phone', 'email']}
        filters={filters}
        onRowClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Добавить сотрудника"
        emptyMessage="Сотрудники не найдены"
      />

      <DataForm
        title={formMode === 'create' ? 'Добавить сотрудника' : formMode === 'edit' ? 'Редактировать сотрудника' : 'Просмотр сотрудника'}
        fields={formFields}
        data={selectedEmployee}
        mode={formMode}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        onDelete={formMode === 'edit' ? handleDeleteInForm : undefined}
      />
    </>
  );
}
