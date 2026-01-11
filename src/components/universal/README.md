# Универсальные компоненты для админ панели

Система универсальных компонентов для работы с данными в админ панели TechRepair.

## DataTable - Универсальная таблица

Компонент для отображения данных в виде таблицы с поиском, фильтрацией, сортировкой и пагинацией.

### Возможности

- ✅ Поиск по нескольким полям
- ✅ Фильтрация по любым полям
- ✅ Сортировка по колонкам
- ✅ Пагинация с выбором количества строк
- ✅ Кастомный рендер ячеек
- ✅ Действия над строками (просмотр, редактирование, удаление)
- ✅ Автоматическое форматирование типов данных

### Пример использования

```tsx
import DataTable, { Column, Filter } from '@/components/universal/DataTable';

interface Order {
  id: string;
  clientName: string;
  status: 'new' | 'completed';
  price: number;
}

const columns: Column<Order>[] = [
  {
    key: 'id',
    label: 'Номер',
    sortable: true,
    width: '100px',
  },
  {
    key: 'clientName',
    label: 'Клиент',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Статус',
    render: (value) => <Badge>{value}</Badge>,
  },
  {
    key: 'price',
    label: 'Цена',
    sortable: true,
    render: (value) => `₽${value.toLocaleString()}`,
  },
];

const filters: Filter[] = [
  {
    key: 'status',
    label: 'Статус',
    options: [
      { value: 'new', label: 'Новый' },
      { value: 'completed', label: 'Завершён' },
    ],
  },
];

<DataTable
  data={orders}
  columns={columns}
  searchKeys={['id', 'clientName']}
  filters={filters}
  onRowClick={(row) => console.log(row)}
  onEdit={(row) => handleEdit(row)}
  onDelete={(row) => handleDelete(row)}
  onCreate={() => handleCreate()}
  createLabel="Новый заказ"
  emptyMessage="Заказы не найдены"
/>
```

### Props

| Prop | Тип | Описание |
|------|-----|----------|
| `data` | `T[]` | Массив данных для отображения |
| `columns` | `Column<T>[]` | Конфигурация колонок |
| `searchKeys` | `string[]` | Поля для поиска |
| `filters` | `Filter[]` | Конфигурация фильтров |
| `onRowClick` | `(row: T) => void` | Обработчик клика по строке |
| `onEdit` | `(row: T) => void` | Обработчик редактирования |
| `onDelete` | `(row: T) => void` | Обработчик удаления |
| `onCreate` | `() => void` | Обработчик создания |
| `createLabel` | `string` | Текст кнопки создания |
| `emptyMessage` | `string` | Сообщение при отсутствии данных |
| `rowsPerPageOptions` | `number[]` | Опции для выбора количества строк |

### Column

```tsx
interface Column<T> {
  key: string;                    // Ключ поля в данных
  label: string;                  // Заголовок колонки
  sortable?: boolean;             // Включить сортировку
  filterable?: boolean;           // Включить фильтрацию
  render?: (value, row) => React.ReactNode;  // Кастомный рендер
  width?: string;                 // Ширина колонки
}
```

### Filter

```tsx
interface Filter {
  key: string;                    // Ключ поля для фильтрации
  label: string;                  // Название фильтра
  options: Array<{                // Опции фильтра
    value: string;
    label: string;
  }>;
}
```

## DataForm - Универсальная форма

Компонент для создания, редактирования и просмотра данных с валидацией.

### Возможности

- ✅ 3 режима: создание, редактирование, просмотр
- ✅ 10+ типов полей (text, email, number, date, select, checkbox, textarea и др.)
- ✅ Встроенная валидация
- ✅ Кастомные поля через render функцию
- ✅ Автоматическая обработка ошибок
- ✅ Поддержка тегов и мультиселектов

### Пример использования

```tsx
import DataForm, { FormField } from '@/components/universal/DataForm';

const formFields: FormField[] = [
  {
    key: 'clientName',
    label: 'Клиент',
    type: 'text',
    required: true,
    placeholder: 'Имя клиента',
  },
  {
    key: 'status',
    label: 'Статус',
    type: 'select',
    required: true,
    defaultValue: 'new',
    options: [
      { value: 'new', label: 'Новый' },
      { value: 'completed', label: 'Завершён' },
    ],
  },
  {
    key: 'price',
    label: 'Цена (₽)',
    type: 'number',
    min: 0,
    validation: (value) => {
      if (value < 100) return 'Минимальная цена 100₽';
      return null;
    },
  },
  {
    key: 'description',
    label: 'Описание',
    type: 'textarea',
    rows: 4,
  },
];

<DataForm
  title="Создать заказ"
  fields={formFields}
  data={selectedOrder}
  mode="create"
  open={isFormOpen}
  onOpenChange={setIsFormOpen}
  onSubmit={(data) => console.log(data)}
  onDelete={() => handleDelete()}
/>
```

### Props

| Prop | Тип | Описание |
|------|-----|----------|
| `title` | `string` | Заголовок формы |
| `fields` | `FormField[]` | Конфигурация полей |
| `data` | `T \| null` | Данные для редактирования |
| `mode` | `'create' \| 'edit' \| 'view'` | Режим формы |
| `open` | `boolean` | Открыта ли форма |
| `onOpenChange` | `(open: boolean) => void` | Обработчик закрытия |
| `onSubmit` | `(data: Partial<T>) => void` | Обработчик отправки |
| `onDelete` | `() => void` | Обработчик удаления |
| `submitLabel` | `string` | Текст кнопки отправки |
| `deleteLabel` | `string` | Текст кнопки удаления |

### FormField

```tsx
interface FormField {
  key: string;                    // Ключ поля в данных
  label: string;                  // Название поля
  type: FieldType;                // Тип поля
  placeholder?: string;           // Плейсхолдер
  required?: boolean;             // Обязательное поле
  options?: Array<{value, label}>; // Опции для select
  min?: number;                   // Минимальное значение (number)
  max?: number;                   // Максимальное значение (number)
  rows?: number;                  // Количество строк (textarea)
  disabled?: boolean;             // Заблокировано
  hidden?: boolean;               // Скрыто
  defaultValue?: any;             // Значение по умолчанию
  validation?: (value) => string | null;  // Кастомная валидация
  render?: (value, onChange, formData) => React.ReactNode;  // Кастомный рендер
}
```

### Типы полей (FieldType)

- `text` - Текстовое поле
- `email` - Email
- `number` - Число
- `date` - Дата
- `time` - Время
- `datetime-local` - Дата и время
- `textarea` - Многострочное поле
- `select` - Выпадающий список
- `multiselect` - Множественный выбор
- `checkbox` - Чекбокс
- `switch` - Переключатель
- `tags` - Теги (через Enter или запятую)

## Полный пример интеграции

```tsx
import { useState } from 'react';
import DataTable, { Column, Filter } from '@/components/universal/DataTable';
import DataForm, { FormField } from '@/components/universal/DataForm';

interface Order {
  id: string;
  clientName: string;
  device: string;
  status: 'new' | 'in-progress' | 'completed';
  price: number;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const columns: Column<Order>[] = [
    { key: 'id', label: 'Номер', sortable: true },
    { key: 'clientName', label: 'Клиент', sortable: true },
    { key: 'device', label: 'Устройство' },
    { 
      key: 'status', 
      label: 'Статус',
      render: (value) => <Badge>{value}</Badge>
    },
    { 
      key: 'price', 
      label: 'Цена',
      render: (value) => `₽${value.toLocaleString()}`
    },
  ];

  const filters: Filter[] = [
    {
      key: 'status',
      label: 'Статус',
      options: [
        { value: 'new', label: 'Новый' },
        { value: 'in-progress', label: 'В работе' },
        { value: 'completed', label: 'Завершён' },
      ],
    },
  ];

  const formFields: FormField[] = [
    {
      key: 'clientName',
      label: 'Клиент',
      type: 'text',
      required: true,
    },
    {
      key: 'device',
      label: 'Устройство',
      type: 'text',
      required: true,
    },
    {
      key: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'new',
      options: [
        { value: 'new', label: 'Новый' },
        { value: 'in-progress', label: 'В работе' },
        { value: 'completed', label: 'Завершён' },
      ],
    },
    {
      key: 'price',
      label: 'Цена (₽)',
      type: 'number',
      min: 0,
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
        id: String(Date.now()),
        ...data as Order,
      };
      setOrders([newOrder, ...orders]);
    } else if (formMode === 'edit' && selectedOrder) {
      setOrders(orders.map(o => 
        o.id === selectedOrder.id ? { ...o, ...data } : o
      ));
    }
  };

  return (
    <>
      <DataTable
        data={orders}
        columns={columns}
        searchKeys={['clientName', 'device']}
        filters={filters}
        onRowClick={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        createLabel="Новый заказ"
      />

      <DataForm
        title={
          formMode === 'create' ? 'Создать заказ' :
          formMode === 'edit' ? 'Редактировать заказ' :
          'Просмотр заказа'
        }
        fields={formFields}
        data={selectedOrder}
        mode={formMode}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        onDelete={formMode === 'edit' ? () => {
          handleDelete(selectedOrder!);
          setIsFormOpen(false);
        } : undefined}
      />
    </>
  );
}
```

## Преимущества

1. **DRY принцип** - Один раз написанная логика работает для всех разделов
2. **Типобезопасность** - Полная поддержка TypeScript с generic типами
3. **Консистентность** - Единый UX во всей админ панели
4. **Расширяемость** - Легко добавить новые типы полей или кастомизацию
5. **Производительность** - Оптимизированные рендеры с useMemo
6. **Accessibility** - Правильная семантика и клавиатурная навигация

## Советы

- Всегда указывайте `required` для обязательных полей
- Используйте `validation` для сложных проверок
- Для сложных ячеек используйте `render` функцию в Column
- Для readonly полей используйте `disabled: true`
- В режиме `view` все поля автоматически становятся disabled
