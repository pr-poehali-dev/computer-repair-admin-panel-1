import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface LoginProps {
  onLogin: (role: 'admin' | 'manager' | 'technician' | 'operator') => void;
}

const users = [
  { username: 'admin', password: 'admin', role: 'admin' as const },
  { username: 'manager', password: 'manager', role: 'manager' as const },
  { username: 'tech', password: 'tech', role: 'technician' as const },
  { username: 'operator', password: 'operator', role: 'operator' as const },
];

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user.role);
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl glass-effect">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-2xl gradient-purple flex items-center justify-center">
              <Icon name="Wrench" className="text-white" size={40} />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            TechRepair Admin
          </CardTitle>
          <CardDescription>Система управления сервисным центром</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Логин</Label>
            <Input
              id="username"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button onClick={handleLogin} className="w-full gradient-purple text-white border-none">
            <Icon name="LogIn" size={18} />
            Войти
          </Button>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-xs space-y-2">
            <p className="font-medium">Тестовые учётные записи:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-bold">Админ:</p>
                <p>admin / admin</p>
              </div>
              <div>
                <p className="font-bold">Менеджер:</p>
                <p>manager / manager</p>
              </div>
              <div>
                <p className="font-bold">Техник:</p>
                <p>tech / tech</p>
              </div>
              <div>
                <p className="font-bold">Оператор:</p>
                <p>operator / operator</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
