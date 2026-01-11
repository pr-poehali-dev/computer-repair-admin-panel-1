import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DataTable, { Column } from '@/components/universal/DataTable';
import DataForm, { FormField } from '@/components/universal/DataForm';

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
  { id: '4', name: 'Елена Смирнова', phone: '+7 999 456-78-90', email: 'elena@mail.ru', totalOrders: 15, totalSpent: 58000 },
];

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const columns: Column<Client>[] = [
    {
      key: 'name',
      label: 'Клиент',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 gradient-purple">
            <AvatarFallback className="text-white font-bold">
              {getInitials(value)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Телефон',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'totalOrders',
      label: 'Заказов',
      sortable: true,
      render: (value) => <span className="font-bold text-primary">{value}</span>,
    },
    {
      key: 'totalSpent',
      label: 'Потрачено',
      sortable: true,
      render: (value) => <span className="font-bold text-green-600">₽{value.toLocaleString()}</span>,
    },
  ];

  const formFields: FormField[] = [
    {
      key: 'name',
      label: 'ФИО',
      type: 'text',
      required: true,
      placeholder: 'Полное имя клиента',
    },
    {
      key: 'phone',
      label: 'Телефон',
      type: 'text',
      required: true,
      placeholder: '+7 999 123-45-67',
      validation: (value) => {
        if (value && !/^\+7 \d{3} \d{3}-\d{2}-\d{2}$/.test(value)) {
          return 'Формат: +7 999 123-45-67';
        }
        return null;
      },
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'email@example.com',
    },
    {
      key: 'totalOrders',
      label: 'Количество заказов',
      type: 'number',
      disabled: true,
      defaultValue: 0,
    },
    {
      key: 'totalSpent',
      label: 'Общая сумма покупок (₽)',
      type: 'number',
      disabled: true,
      defaultValue: 0,
    },
  ];

  const handleCreate = () => {
    setSelectedClient(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (client: Client) => {
    setClients(clients.filter(c => c.id !== client.id));
  };

  const handleSubmit = (data: Partial<Client>) => {
    if (formMode === 'create') {
      const newClient: Client = {
        id: String(Date.now()),
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        totalOrders: 0,
        totalSpent: 0,
      };
      setClients([newClient, ...clients]);
    } else if (formMode === 'edit' && selectedClient) {
      setClients(clients.map(c => c.id === selectedClient.id ? { ...c, ...data } : c));
    }
  };

  const handleDeleteInForm = () => {
    if (selectedClient) {
      handleDelete(selectedClient);
      setIsFormOpen(false);
    }
  };

  return (
    <>
      <DataTable
        data={clients}
        columns={columns}
        searchKeys={['name', 'phone', 'email']}
        onRowClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Добавить клиента"
        emptyMessage="Клиенты не найдены"
      />

      <DataForm
        title={formMode === 'create' ? 'Добавить клиента' : formMode === 'edit' ? 'Редактировать клиента' : 'Просмотр клиента'}
        fields={formFields}
        data={selectedClient}
        mode={formMode}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        onDelete={formMode === 'edit' ? handleDeleteInForm : undefined}
      />
    </>
  );
}
