import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import DataTable, { Column, Filter } from '@/components/universal/DataTable';
import DataForm, { FormField } from '@/components/universal/DataForm';

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
  { id: '4', name: 'SSD 512GB', category: 'storage', brand: 'Samsung', model: '970 EVO', price: 6500, stock: 12, minStock: 5 },
];

export default function PartsTable() {
  const [parts, setParts] = useState<Part[]>(initialParts);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categoryConfig = {
    display: { label: 'Дисплей', icon: 'Monitor' },
    battery: { label: 'Батарея', icon: 'Battery' },
    keyboard: { label: 'Клавиатура', icon: 'Keyboard' },
    motherboard: { label: 'Материнская плата', icon: 'Cpu' },
    memory: { label: 'Память', icon: 'MemoryStick' },
    storage: { label: 'Накопитель', icon: 'HardDrive' },
    other: { label: 'Другое', icon: 'Package' },
  };

  const columns: Column<Part>[] = [
    {
      key: 'category',
      label: 'Категория',
      sortable: true,
      width: '80px',
      render: (value: Part['category'], row) => {
        const isLowStock = row.stock <= row.minStock;
        return (
          <div className={`w-10 h-10 rounded-lg ${isLowStock ? 'bg-red-500' : 'gradient-purple'} flex items-center justify-center`}>
            <Icon name={categoryConfig[value].icon as any} className="text-white" size={20} />
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Название',
      sortable: true,
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
      key: 'price',
      label: 'Цена',
      sortable: true,
      render: (value) => <span className="font-bold text-primary">₽{value.toLocaleString()}</span>,
    },
    {
      key: 'stock',
      label: 'На складе',
      sortable: true,
      render: (value, row) => {
        const isLowStock = row.stock <= row.minStock;
        return (
          <div className="space-y-1">
            <span className={`font-bold ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>
              {value} шт.
            </span>
            {isLowStock && (
              <Badge variant="destructive" className="text-xs">
                <Icon name="AlertTriangle" size={12} />
                Низкий запас
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  const filters: Filter[] = [
    {
      key: 'category',
      label: 'Категория',
      options: Object.entries(categoryConfig).map(([key, { label }]) => ({
        value: key,
        label,
      })),
    },
  ];

  const formFields: FormField[] = [
    {
      key: 'name',
      label: 'Название',
      type: 'text',
      required: true,
      placeholder: 'Дисплей MacBook Pro 13"',
    },
    {
      key: 'category',
      label: 'Категория',
      type: 'select',
      required: true,
      defaultValue: 'other',
      options: Object.entries(categoryConfig).map(([key, { label }]) => ({
        value: key,
        label,
      })),
    },
    {
      key: 'brand',
      label: 'Бренд',
      type: 'text',
      required: true,
      placeholder: 'Apple',
    },
    {
      key: 'model',
      label: 'Модель',
      type: 'text',
      required: true,
      placeholder: 'A2338',
    },
    {
      key: 'price',
      label: 'Цена (₽)',
      type: 'number',
      required: true,
      min: 0,
      placeholder: '0',
    },
    {
      key: 'stock',
      label: 'Количество на складе',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      key: 'minStock',
      label: 'Минимальный запас',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 1,
    },
  ];

  const handleCreate = () => {
    setSelectedPart(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (part: Part) => {
    setSelectedPart(part);
    setFormMode('view');
    setIsFormOpen(true);
  };

  const handleDelete = (part: Part) => {
    setParts(parts.filter(p => p.id !== part.id));
  };

  const handleSubmit = (data: Partial<Part>) => {
    if (formMode === 'create') {
      const newPart: Part = {
        id: String(Date.now()),
        name: data.name || '',
        category: data.category || 'other',
        brand: data.brand || '',
        model: data.model || '',
        price: data.price || 0,
        stock: data.stock || 0,
        minStock: data.minStock || 1,
      };
      setParts([newPart, ...parts]);
    } else if (formMode === 'edit' && selectedPart) {
      setParts(parts.map(p => p.id === selectedPart.id ? { ...p, ...data } : p));
    }
  };

  const handleDeleteInForm = () => {
    if (selectedPart) {
      handleDelete(selectedPart);
      setIsFormOpen(false);
    }
  };

  return (
    <>
      <DataTable
        data={parts}
        columns={columns}
        searchKeys={['name', 'brand', 'model']}
        filters={filters}
        onRowClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Добавить запчасть"
        emptyMessage="Запчасти не найдены"
      />

      <DataForm
        title={formMode === 'create' ? 'Добавить запчасть' : formMode === 'edit' ? 'Редактировать запчасть' : 'Просмотр запчасти'}
        fields={formFields}
        data={selectedPart}
        mode={formMode}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        onDelete={formMode === 'edit' ? handleDeleteInForm : undefined}
      />
    </>
  );
}
