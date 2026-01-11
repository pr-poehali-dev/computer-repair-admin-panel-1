import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import DataTable, { Column, Filter } from '@/components/universal/DataTable';
import DataForm, { FormField } from '@/components/universal/DataForm';

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
  { id: '4', model: 'ROG Strix', brand: 'Asus', type: 'desktop', serialNumber: 'ASUS456DEF', condition: 'excellent', clientId: '4', clientName: 'Елена Смирнова' },
];

export default function DevicesTable() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const columns: Column<Device>[] = [
    {
      key: 'type',
      label: 'Тип',
      sortable: true,
      width: '80px',
      render: (value: Device['type']) => (
        <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center">
          <Icon name={typeIcons[value] as any} className="text-white" size={20} />
        </div>
      ),
    },
    {
      key: 'brand',
      label: 'Бренд',
      sortable: true,
    },
    {
      key: 'model',
      label: 'Модель',
      sortable: true,
    },
    {
      key: 'serialNumber',
      label: 'S/N',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'condition',
      label: 'Состояние',
      sortable: true,
      render: (value: Device['condition']) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${conditionConfig[value].color}`} />
          <Badge variant="outline">{conditionConfig[value].label}</Badge>
        </div>
      ),
    },
    {
      key: 'clientName',
      label: 'Клиент',
      sortable: true,
    },
  ];

  const filters: Filter[] = [
    {
      key: 'type',
      label: 'Тип',
      options: [
        { value: 'laptop', label: 'Ноутбук' },
        { value: 'desktop', label: 'ПК' },
        { value: 'other', label: 'Другое' },
      ],
    },
    {
      key: 'condition',
      label: 'Состояние',
      options: [
        { value: 'excellent', label: 'Отличное' },
        { value: 'good', label: 'Хорошее' },
        { value: 'damaged', label: 'Повреждено' },
        { value: 'broken', label: 'Сломано' },
      ],
    },
  ];

  const formFields: FormField[] = [
    {
      key: 'brand',
      label: 'Бренд',
      type: 'text',
      required: true,
      placeholder: 'Apple, HP, Lenovo...',
    },
    {
      key: 'model',
      label: 'Модель',
      type: 'text',
      required: true,
      placeholder: 'MacBook Pro 2020',
    },
    {
      key: 'type',
      label: 'Тип устройства',
      type: 'select',
      required: true,
      defaultValue: 'laptop',
      options: [
        { value: 'laptop', label: 'Ноутбук' },
        { value: 'desktop', label: 'ПК' },
        { value: 'other', label: 'Другое' },
      ],
    },
    {
      key: 'serialNumber',
      label: 'Серийный номер',
      type: 'text',
      required: true,
      placeholder: 'C02X123456',
    },
    {
      key: 'condition',
      label: 'Состояние',
      type: 'select',
      required: true,
      defaultValue: 'good',
      options: [
        { value: 'excellent', label: 'Отличное' },
        { value: 'good', label: 'Хорошее' },
        { value: 'damaged', label: 'Повреждено' },
        { value: 'broken', label: 'Сломано' },
      ],
    },
    {
      key: 'clientName',
      label: 'Клиент',
      type: 'text',
      required: true,
      placeholder: 'Имя клиента',
    },
  ];

  const handleCreate = () => {
    setSelectedDevice(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (device: Device) => {
    setSelectedDevice(device);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (device: Device) => {
    setDevices(devices.filter(d => d.id !== device.id));
  };

  const handleSubmit = (data: Partial<Device>) => {
    if (formMode === 'create') {
      const newDevice: Device = {
        id: String(Date.now()),
        model: data.model || '',
        brand: data.brand || '',
        type: data.type || 'laptop',
        serialNumber: data.serialNumber || '',
        condition: data.condition || 'good',
        clientId: String(Date.now()),
        clientName: data.clientName || '',
      };
      setDevices([newDevice, ...devices]);
    } else if (formMode === 'edit' && selectedDevice) {
      setDevices(devices.map(d => d.id === selectedDevice.id ? { ...d, ...data } : d));
    }
  };

  const handleDeleteInForm = () => {
    if (selectedDevice) {
      handleDelete(selectedDevice);
      setIsFormOpen(false);
    }
  };

  return (
    <>
      <DataTable
        data={devices}
        columns={columns}
        searchKeys={['brand', 'model', 'serialNumber', 'clientName']}
        filters={filters}
        onRowClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Добавить устройство"
        emptyMessage="Устройства не найдены"
      />

      <DataForm
        title={formMode === 'create' ? 'Добавить устройство' : formMode === 'edit' ? 'Редактировать устройство' : 'Просмотр устройства'}
        fields={formFields}
        data={selectedDevice}
        mode={formMode}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        onDelete={formMode === 'edit' ? handleDeleteInForm : undefined}
      />
    </>
  );
}
