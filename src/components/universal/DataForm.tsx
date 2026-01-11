import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

export type FieldType = 'text' | 'email' | 'number' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'switch' | 'tags';

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  rows?: number;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: any;
  validation?: (value: any) => string | null;
  render?: (value: any, onChange: (value: any) => void, formData: any) => React.ReactNode;
}

interface DataFormProps<T> {
  title: string;
  fields: FormField[];
  data?: T | null;
  mode: 'create' | 'edit' | 'view';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<T>) => void;
  onDelete?: () => void;
  submitLabel?: string;
  deleteLabel?: string;
}

export default function DataForm<T extends Record<string, any>>({
  title,
  fields,
  data,
  mode,
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  submitLabel = mode === 'create' ? 'Создать' : mode === 'edit' ? 'Сохранить' : 'Закрыть',
  deleteLabel = 'Удалить',
}: DataFormProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      const initialData: Partial<T> = {};
      fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.key as keyof T] = field.defaultValue;
        } else if (field.type === 'checkbox' || field.type === 'switch') {
          initialData[field.key as keyof T] = false as any;
        } else if (field.type === 'multiselect' || field.type === 'tags') {
          initialData[field.key as keyof T] = [] as any;
        } else {
          initialData[field.key as keyof T] = '' as any;
        }
      });
      setFormData(initialData);
    }
    setErrors({});
  }, [data, fields, open]);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.hidden) return;

      const value = formData[field.key as keyof T];

      if (field.required && (value === undefined || value === '' || value === null)) {
        newErrors[field.key] = `${field.label} обязательно для заполнения`;
      }

      if (field.validation) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.key] = error;
        }
      }

      if (field.type === 'number') {
        if (field.min !== undefined && Number(value) < field.min) {
          newErrors[field.key] = `Минимальное значение: ${field.min}`;
        }
        if (field.max !== undefined && Number(value) > field.max) {
          newErrors[field.key] = `Максимальное значение: ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view') {
      onOpenChange(false);
      return;
    }

    if (!validate()) {
      return;
    }

    onSubmit(formData);
    onOpenChange(false);
  };

  const renderField = (field: FormField) => {
    if (field.hidden) return null;

    const value = formData[field.key as keyof T];
    const isDisabled = field.disabled || mode === 'view';
    const error = errors[field.key];

    if (field.render) {
      return (
        <div key={field.key}>
          <Label>{field.label}{field.required && <span className="text-destructive"> *</span>}</Label>
          {field.render(value, (newValue) => handleChange(field.key, newValue), formData)}
          {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
      );
    }

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key}>
            <Label htmlFor={field.key}>
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Textarea
              id={field.key}
              value={String(value || '')}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              disabled={isDisabled}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.key}>
            <Label htmlFor={field.key}>
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Select
              value={String(value || '')}
              onValueChange={(newValue) => handleChange(field.key, newValue)}
              disabled={isDisabled}
            >
              <SelectTrigger className={error ? 'border-destructive' : ''}>
                <SelectValue placeholder={field.placeholder || `Выберите ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.key}>
            <Label>
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
            <div className="space-y-2 p-3 border rounded-lg">
              {field.options?.map((option) => {
                const values = Array.isArray(value) ? value : [];
                const isChecked = values.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.key}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const newValues = checked
                          ? [...values, option.value]
                          : values.filter((v: any) => v !== option.value);
                        handleChange(field.key, newValues);
                      }}
                      disabled={isDisabled}
                    />
                    <label htmlFor={`${field.key}-${option.value}`} className="text-sm cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.key} className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleChange(field.key, checked)}
              disabled={isDisabled}
            />
            <Label htmlFor={field.key} className="cursor-pointer">
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
          </div>
        );

      case 'switch':
        return (
          <div key={field.key} className="flex items-center justify-between">
            <Label htmlFor={field.key}>
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Switch
              id={field.key}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleChange(field.key, checked)}
              disabled={isDisabled}
            />
          </div>
        );

      case 'tags':
        const tags = Array.isArray(value) ? value : [];
        return (
          <div key={field.key}>
            <Label htmlFor={field.key}>
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.key}
              value=""
              onChange={(e) => {
                if (e.target.value.endsWith(',') || e.target.value.endsWith(' ')) {
                  const tag = e.target.value.slice(0, -1).trim();
                  if (tag && !tags.includes(tag)) {
                    handleChange(field.key, [...tags, tag]);
                  }
                  e.target.value = '';
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const tag = e.currentTarget.value.trim();
                  if (tag && !tags.includes(tag)) {
                    handleChange(field.key, [...tags, tag]);
                  }
                  e.currentTarget.value = '';
                }
              }}
              placeholder={field.placeholder || 'Введите тег и нажмите Enter'}
              disabled={isDisabled}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                    {tag}
                    {!isDisabled && (
                      <button
                        onClick={() => handleChange(field.key, tags.filter((_: any, i: number) => i !== idx))}
                        className="hover:text-destructive"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.key}>
            <Label htmlFor={field.key}>
              {field.label}{field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              value={field.type === 'number' ? (value || '') : String(value || '')}
              onChange={(e) => {
                const newValue = field.type === 'number' ? Number(e.target.value) : e.target.value;
                handleChange(field.key, newValue);
              }}
              placeholder={field.placeholder}
              disabled={isDisabled}
              min={field.min}
              max={field.max}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'view' && <Icon name="Eye" size={24} />}
            {mode === 'edit' && <Icon name="Pencil" size={24} />}
            {mode === 'create' && <Icon name="Plus" size={24} />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((field) => renderField(field))}
          
          <div className="flex gap-3 pt-4">
            {mode !== 'view' && (
              <Button onClick={handleSubmit} className="flex-1 gradient-purple text-white">
                {submitLabel}
              </Button>
            )}
            {mode === 'view' && (
              <Button onClick={() => onOpenChange(false)} className="flex-1" variant="outline">
                {submitLabel}
              </Button>
            )}
            {mode === 'edit' && onDelete && (
              <Button onClick={onDelete} variant="destructive">
                <Icon name="Trash2" size={18} />
                {deleteLabel}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
