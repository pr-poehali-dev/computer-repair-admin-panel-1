import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

export default function Statistics() {
  const monthlyData = [
    { month: 'Янв', orders: 145, revenue: 580000 },
    { month: 'Фев', orders: 167, revenue: 650000 },
    { month: 'Мар', orders: 189, revenue: 720000 },
    { month: 'Апр', orders: 156, revenue: 590000 },
    { month: 'Май', orders: 198, revenue: 780000 },
    { month: 'Июн', orders: 210, revenue: 850000 },
  ];

  const topTechnicians = [
    { name: 'Сергей Технов', orders: 145, rating: 4.9 },
    { name: 'Алексей Мастеров', orders: 132, rating: 4.8 },
    { name: 'Дмитрий Ремонтов', orders: 118, rating: 4.7 },
  ];

  const deviceCategories = [
    { name: 'Ноутбуки', count: 145, percentage: 58 },
    { name: 'ПК', count: 62, percentage: 25 },
    { name: 'Другое', count: 43, percentage: 17 },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Выручка за месяц', value: '₽850,000', icon: 'TrendingUp', color: 'text-green-500' },
          { label: 'Всего заказов', value: '1,247', icon: 'ClipboardList', color: 'text-blue-500' },
          { label: 'Средний чек', value: '₽4,050', icon: 'DollarSign', color: 'text-purple-500' },
          { label: 'Клиентов', value: '789', icon: 'Users', color: 'text-orange-500' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-none shadow-lg glass-effect">
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-lg gradient-purple flex items-center justify-center mb-2`}>
                <Icon name={stat.icon as any} className="text-white" size={20} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Выручка</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="devices">Устройства</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={24} />
                График выручки за полгода
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-muted-foreground">₽{data.revenue.toLocaleString()}</span>
                    </div>
                    <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                      <div
                        className="h-full gradient-purple transition-all duration-500"
                        style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Award" size={24} />
                  Топ техников
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topTechnicians.map((tech, idx) => (
                  <div key={tech.name} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{tech.name}</p>
                      <p className="text-sm text-muted-foreground">{tech.orders} заказов</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Star" size={16} className="text-yellow-500" />
                      <span className="font-bold">{tech.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg gradient-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" size={24} />
                  Динамика заказов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyData.slice(-3).map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{data.month}</span>
                      <span className="text-muted-foreground">{data.orders} заказов</span>
                    </div>
                    <Progress value={(data.orders / 210) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card className="border-none shadow-lg glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="PieChart" size={24} />
                Категории устройств
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {deviceCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.count} устройств</p>
                    </div>
                    <p className="text-2xl font-bold text-primary">{category.percentage}%</p>
                  </div>
                  <Progress value={category.percentage} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Apple</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">42%</p>
                <p className="text-sm text-muted-foreground">105 устройств</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">HP / Lenovo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">35%</p>
                <p className="text-sm text-muted-foreground">87 устройств</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">Другие</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">23%</p>
                <p className="text-sm text-muted-foreground">58 устройств</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
