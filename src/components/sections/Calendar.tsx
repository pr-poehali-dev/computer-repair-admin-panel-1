import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Event {
  id: string;
  title: string;
  type: 'order' | 'meeting' | 'delivery' | 'other';
  date: string;
  time: string;
  description: string;
  assignedTo: string;
}

const initialEvents: Event[] = [
  { id: '1', title: 'Встреча с клиентом Петров', type: 'meeting', date: '2024-01-15', time: '10:00', description: 'Обсуждение заказа #12345', assignedTo: 'Анна Менеджер' },
  { id: '2', title: 'Поставка запчастей', type: 'delivery', date: '2024-01-15', time: '14:00', description: 'Дисплеи для MacBook', assignedTo: 'Иван Петров' },
  { id: '3', title: 'Готов заказ #12348', type: 'order', date: '2024-01-16', time: '12:00', description: 'Клиент Елена Смирнова', assignedTo: 'Сергей Технов' },
];

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '', type: 'other', date: selectedDate, time: '', description: '', assignedTo: ''
  });

  const typeConfig = {
    order: { label: 'Заказ', color: 'bg-blue-500', icon: 'ClipboardList' },
    meeting: { label: 'Встреча', color: 'bg-purple-500', icon: 'Users' },
    delivery: { label: 'Поставка', color: 'bg-green-500', icon: 'Truck' },
    other: { label: 'Другое', color: 'bg-gray-500', icon: 'Calendar' },
  };

  const handleCreate = () => {
    const newEvent: Event = {
      id: String(Date.now()),
      title: formData.title || '',
      type: formData.type as Event['type'] || 'other',
      date: formData.date || selectedDate,
      time: formData.time || '',
      description: formData.description || '',
      assignedTo: formData.assignedTo || '',
    };
    setEvents([...events, newEvent]);
    setFormData({ title: '', type: 'other', date: selectedDate, time: '', description: '', assignedTo: '' });
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const date = `2024-01-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === date);
      days.push({ date, events: dayEvents });
    }
    return days;
  };

  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-lg glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calendar" size={24} />
                Январь 2024
              </CardTitle>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-purple text-white border-none">
                    <Icon name="Plus" size={18} />
                    Добавить событие
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новое событие</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Название</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Название события"
                      />
                    </div>
                    <div>
                      <Label>Тип</Label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Event['type'] })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Заказ</SelectItem>
                          <SelectItem value="meeting">Встреча</SelectItem>
                          <SelectItem value="delivery">Поставка</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Дата</Label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Время</Label>
                        <Input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Описание</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Детали события"
                      />
                    </div>
                    <div>
                      <Label>Ответственный</Label>
                      <Input
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        placeholder="Имя сотрудника"
                      />
                    </div>
                    <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                      Создать
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              {getDaysInMonth().map(({ date, events: dayEvents }) => {
                const day = parseInt(date.split('-')[2]);
                const isSelected = date === selectedDate;
                const hasEvents = dayEvents.length > 0;
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                      isSelected
                        ? 'gradient-purple text-white'
                        : hasEvents
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div>{day}</div>
                    {hasEvents && (
                      <div className="flex gap-0.5 justify-center mt-1">
                        {dayEvents.slice(0, 3).map((_, idx) => (
                          <div key={idx} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-none shadow-lg gradient-soft">
          <CardHeader>
            <CardTitle className="text-lg">
              События на {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{selectedDateEvents.length}</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {selectedDateEvents.length === 0 ? (
            <Card className="border-none shadow-lg glass-effect">
              <CardContent className="p-6 text-center">
                <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Нет событий на эту дату</p>
              </CardContent>
            </Card>
          ) : (
            selectedDateEvents.map((event) => (
              <Card key={event.id} className="border-none shadow-lg glass-effect">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg ${typeConfig[event.type].color} flex items-center justify-center`}>
                        <Icon name={typeConfig[event.type].icon as any} className="text-white" size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{event.title}</h4>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {typeConfig[event.type].label}
                        </Badge>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" size={12} />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="User" size={12} />
                            {event.assignedTo}
                          </div>
                        </div>
                        <p className="text-xs mt-2">{event.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
