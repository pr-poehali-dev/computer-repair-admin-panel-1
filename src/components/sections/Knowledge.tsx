import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  views: number;
}

const initialArticles: Article[] = [
  {
    id: '1',
    title: 'Как заменить дисплей на MacBook Pro 2020',
    category: 'Ремонт',
    content: '1. Выключите устройство и отключите от питания\n2. Открутите нижнюю крышку\n3. Отсоедините аккумулятор\n4. Снимите старый дисплей\n5. Установите новый дисплей\n6. Соберите в обратном порядке',
    tags: ['MacBook', 'Дисплей', 'Apple'],
    views: 245
  },
  {
    id: '2',
    title: 'Диагностика проблем с батареей ноутбука',
    category: 'Диагностика',
    content: '1. Проверьте состояние батареи в системе\n2. Запустите тест батареи\n3. Проверьте циклы зарядки\n4. Оцените ёмкость батареи\n5. Проверьте порт зарядки',
    tags: ['Батарея', 'Диагностика', 'Ноутбук'],
    views: 189
  },
  {
    id: '3',
    title: 'Чистка системы охлаждения',
    category: 'Обслуживание',
    content: '1. Откройте корпус\n2. Снимите вентилятор\n3. Очистите радиатор\n4. Замените термопасту\n5. Соберите обратно',
    tags: ['Охлаждение', 'Чистка', 'ПК'],
    views: 156
  },
];

export default function Knowledge() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '', category: '', content: '', tags: []
  });

  const handleCreate = () => {
    const newArticle: Article = {
      id: String(Date.now()),
      title: formData.title || '',
      category: formData.category || 'Общее',
      content: formData.content || '',
      tags: formData.tags || [],
      views: 0,
    };
    setArticles([newArticle, ...articles]);
    setFormData({ title: '', category: '', content: '', tags: [] });
    setIsCreateOpen(false);
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = Array.from(new Set(articles.map(a => a.category)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск по статьям, категориям и тегам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-purple text-white border-none">
              <Icon name="Plus" size={18} />
              Добавить статью
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Новая статья</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Название статьи"
                />
              </div>
              <div>
                <Label>Категория</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ремонт, Диагностика, Обслуживание..."
                />
              </div>
              <div>
                <Label>Содержание</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Пошаговая инструкция..."
                  rows={10}
                />
              </div>
              <div>
                <Label>Теги (через запятую)</Label>
                <Input
                  value={formData.tags?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                  placeholder="MacBook, Дисплей, Apple"
                />
              </div>
              <Button onClick={handleCreate} className="w-full gradient-purple text-white">
                Создать статью
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Всего статей', value: articles.length, icon: 'BookOpen' },
          { label: 'Категорий', value: categories.length, icon: 'FolderOpen' },
          { label: 'Просмотров', value: articles.reduce((sum, a) => sum + a.views, 0), icon: 'Eye' },
          { label: 'Тегов', value: new Set(articles.flatMap(a => a.tags)).size, icon: 'Tag' },
        ].map((stat, idx) => (
          <Card key={idx} className="border-none shadow-lg glass-effect">
            <CardHeader className="pb-2">
              <div className={`w-10 h-10 rounded-lg gradient-purple flex items-center justify-center mb-2`}>
                <Icon name={stat.icon as any} className="text-white" size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg gradient-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="FolderOpen" size={20} />
              Категории
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center justify-between p-3 bg-background rounded-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <span className="font-medium">{category}</span>
                <Badge variant="outline">
                  {articles.filter(a => a.category === category).length}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <Card className="border-none shadow-lg glass-effect">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredArticles.map((article) => (
                  <AccordionItem key={article.id} value={article.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-4 text-left flex-1">
                        <div className="w-10 h-10 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0">
                          <Icon name="BookOpen" className="text-white" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Icon name="Eye" size={12} />
                              {article.views} просмотров
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-14 space-y-4">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-lg">
                            {article.content}
                          </pre>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          <Icon name="Trash2" size={14} />
                          Удалить статью
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
