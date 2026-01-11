import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
}

const initialTransactions: Transaction[] = [
  { id: '1', type: 'income', category: 'Ремонт', amount: 5000, description: 'Заказ #12345', date: '2024-01-10', paymentMethod: 'Наличные' },
  { id: '2', type: 'expense', category: 'Запчасти', amount: 25000, description: 'Закупка дисплеев', date: '2024-01-09', paymentMethod: 'Безнал' },
  { id: '3', type: 'income', category: 'Диагностика', amount: 1500, description: 'Заказ #12346', date: '2024-01-11', paymentMethod: 'Карта' },
];

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'income', category: '', amount: 0, description: '', paymentMethod: 'Наличные'
  });

  const handleCreate = () => {
    const newTransaction: Transaction = {
      id: String(Date.now()),
      type: formData.type as Transaction['type'] || 'income',
      category: formData.category || '',
      amount: formData.amount || 0,
      description: formData.description || '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod || 'Наличные',
    };
    setTransactions([newTransaction, ...transactions]);
    setFormData({ type: 'income', category: '', amount: 0, description: '', paymentMethod: 'Наличные' });
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg gradient-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon name="TrendingUp" size={20} />
              Доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">₽{totalIncome.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon name="TrendingDown" size={20} />
              Расход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">₽{totalExpense.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg gradient-purple text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Icon name="Wallet" size={20} />
              Баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₽{balance.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="income">Доходы</TabsTrigger>
            <TabsTrigger value="expense">Расходы</TabsTrigger>
          </TabsList>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-purple text-white border-none">
                <Icon name="Plus" size={18} />
                Новая операция
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить операцию</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Тип операции</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as Transaction['type'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Доход</SelectItem>
                      <SelectItem value="expense">Расход</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Категория</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ремонт, Запчасти, Зарплата..."
                  />
                </div>
                <div>
                  <Label>Сумма (₽)</Label>
                  <Input
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Краткое описание"
                  />
                </div>
                <div>
                  <Label>Способ оплаты</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Наличные">Наличные</SelectItem>
                      <SelectItem value="Карта">Карта</SelectItem>
                      <SelectItem value="Безнал">Безнал</SelectItem>
                      <SelectItem value="Перевод">Перевод</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="all" className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="border-none shadow-lg glass-effect">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    } flex items-center justify-center`}>
                      <Icon
                        name={transaction.type === 'income' ? 'ArrowDownToLine' : 'ArrowUpFromLine'}
                        className="text-white"
                        size={24}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <h3 className="font-bold text-lg">{transaction.description}</h3>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {transaction.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="CreditCard" size={14} />
                          {transaction.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-2xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₽{transaction.amount.toLocaleString()}
                    </p>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(transaction.id)}>
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="income" className="space-y-3">
          {transactions.filter(t => t.type === 'income').map((transaction) => (
            <Card key={transaction.id} className="border-none shadow-lg glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{transaction.description}</h3>
                    <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">+₽{transaction.amount.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expense" className="space-y-3">
          {transactions.filter(t => t.type === 'expense').map((transaction) => (
            <Card key={transaction.id} className="border-none shadow-lg glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{transaction.description}</h3>
                    <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">-₽{transaction.amount.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
