import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import DataTable, { Column, Filter } from '@/components/universal/DataTable';
import DataForm, { FormField } from '@/components/universal/DataForm';

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
  { id: '12348', clientName: 'Елена Смирнова', device: 'Asus ROG', problem: 'Перегревается', status: 'completed', priority: 'medium', createdAt: '2024-01-08', price: 3500 },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const columns: Column<Order>[] = [
    {
      key: 'id',
      label: 'Номер',
      sortable: true,
      width: '100px',
      render: (value) => <span className="font-mono font-bold">#{value}</span>,
    },
    {
      key: 'clientName',
      label: 'Клиент',
      sortable: true,
    },
    {
      key: 'device',
      label: 'Устройство',
      sortable: true,
    },
    {
      key: 'problem',
      label: 'Проблема',
    },
    {
      key: 'status',
      label: 'Статус',
      sortable: true,
      render: (value: Order['status']) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusConfig[value].color}`} />
          <Badge variant="outline">{statusConfig[value].label}</Badge>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Приоритет',
      sortable: true,
      render: (value: Order['priority']) => (
        <Badge variant={priorityConfig[value].variant}>
          {priorityConfig[value].label}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Дата',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-1 text-sm">
          <Icon name="Calendar" size={14} />
          {value}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Цена',
      sortable: true,
      render: (value) => value ? (
        <span className="font-bold text-primary">₽{value.toLocaleString()}</span>
      ) : '—',
    },
  ];

  const filters: Filter[] = [
    {
      key: 'status',
      label: 'Статус',
      options: [
        { value: 'new', label: 'Новый' },
        { value: 'in-progress', label: 'В работе' },
        { value: 'waiting', label: 'Ожидание' },
        { value: 'completed', label: 'Завершён' },
      ],
    },
    {
      key: 'priority',
      label: 'Приоритет',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
      ],
    },
  ];

  const formFields: FormField[] = [
    {
      key: 'id',
      label: 'Номер заказа',
      type: 'text',
      disabled: true,
      hidden: formMode === 'create',
    },
    {
      key: 'clientName',
      label: 'Клиент',
      type: 'text',
      required: true,
      placeholder: 'Имя клиента',
    },
    {
      key: 'device',
      label: 'Устройство',
      type: 'text',
      required: true,
      placeholder: 'Модель устройства',
    },
    {
      key: 'problem',
      label: 'Проблема',
      type: 'textarea',
      required: true,
      placeholder: 'Описание проблемы',
      rows: 3,
    },
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { value: 'new', label: 'Новый' },
        { value: 'in-progress', label: 'В работе' },
        { value: 'waiting', label: 'Ожидание' },
        { value: 'completed', label: 'Завершён' },
      ],
    },
    {
      key: 'priority',
      label: 'Приоритет',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
      ],
    },
    {
      key: 'price',
      label: 'Цена (₽)',
      type: 'number',
      min: 0,
      placeholder: '0',
    },
    {
      key: 'createdAt',
      label: 'Дата создания',
      type: 'date',
      required: true,
      defaultValue: new Date().toISOString().split('T')[0],
    },
  ];

  const handleCreate = () => {
    setSelectedOrder(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (order: Order) => {
    setOrders(orders.filter(o => o.id !== order.id));
  };

  const handleSubmit = (data: Partial<Order>) => {
    if (formMode === 'create') {
      const newOrder: Order = {
        id: String(Math.floor(Math.random() * 90000) + 10000),
        clientName: data.clientName || '',
        device: data.device || '',
        problem: data.problem || '',
        status: data.status || 'new',
        priority: data.priority || 'medium',
        createdAt: data.createdAt || new Date().toISOString().split('T')[0],
        price: data.price,
      };
      setOrders([newOrder, ...orders]);
    } else if (formMode === 'edit' && selectedOrder) {
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, ...data } : o));
    }
  };

  const handleDeleteInForm = () => {
    if (selectedOrder) {
      handleDelete(selectedOrder);
      setIsFormOpen(false);
    }
  };

  return (
    <>
      <DataTable
        data={orders}
        columns={columns}
        searchKeys={['id', 'clientName', 'device', 'problem']}
        filters={filters}
        onRowClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Новый заказ"
        emptyMessage="Заказы не найдены"
      />

      <DataForm
        title={formMode === 'create' ? 'Создать заказ' : formMode === 'edit' ? 'Редактировать заказ' : 'Просмотр заказа'}
        fields={formFields}
        data={selectedOrder}
        mode={formMode}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        onDelete={formMode === 'edit' ? handleDeleteInForm : undefined}
      />
    </>
  );
}
