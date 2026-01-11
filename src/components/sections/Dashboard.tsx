import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const stats = [
  { label: 'Активных заказов', value: '47', change: '+12%', icon: 'ClipboardList', color: 'text-primary' },
  { label: 'Выполнено сегодня', value: '23', change: '+8%', icon: 'CheckCircle2', color: 'text-secondary' },
  { label: 'Новых клиентов', value: '15', change: '+25%', icon: 'UserPlus', color: 'text-accent' },
  { label: 'Выручка за день', value: '₽84,500', change: '+18%', icon: 'TrendingUp', color: 'text-green-500' },
];

const recentOrders = [
  { id: '#12345', client: 'Иван Петров', device: 'MacBook Pro 2020', status: 'В работе', priority: 'high' },
  { id: '#12346', client: 'Мария Сидорова', device: 'HP Pavilion', status: 'Диагностика', priority: 'medium' },
  { id: '#12347', client: 'Алексей Козлов', device: 'Lenovo IdeaPad', status: 'Ожидание запчастей', priority: 'low' },
  { id: '#12348', client: 'Елена Смирнова', device: 'Asus ROG', status: 'Готов', priority: 'medium' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="hover-scale border-none shadow-lg glass-effect">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg gradient-purple flex items-center justify-center`}>
                <Icon name={stat.icon as any} className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {stat.change} от вчера
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Activity" size={24} />
              Загрузка мастерских
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Мастерская №1', value: 85, color: 'bg-primary' },
              { name: 'Мастерская №2', value: 65, color: 'bg-secondary' },
              { name: 'Мастерская №3', value: 92, color: 'bg-accent' },
            ].map((workshop, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{workshop.name}</span>
                  <span className="text-muted-foreground">{workshop.value}%</span>
                </div>
                <Progress value={workshop.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg gradient-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Target" size={24} />
              План месяца
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-5xl font-bold">68%</div>
              <p className="text-sm text-muted-foreground mt-2">Выполнено</p>
            </div>
            <Progress value={68} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Цель</p>
                <p className="font-bold">₽1,500,000</p>
              </div>
              <div>
                <p className="text-muted-foreground">Осталось</p>
                <p className="font-bold">₽480,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="ClipboardList" size={24} />
            Последние заказы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    order.priority === 'high' ? 'bg-red-500' :
                    order.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.device}</p>
                    <p className="text-xs text-muted-foreground">{order.status}</p>
                  </div>
                  <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
