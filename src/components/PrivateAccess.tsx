import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface PrivateAccessProps {
  onAuthenticated: () => void;
}

export function PrivateAccess({ onAuthenticated }: PrivateAccessProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Simple password - change this to whatever you want
  const SITE_PASSWORD = 'NmptGd3qAja?X7gY';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      sessionStorage.setItem('site-authenticated', 'true');
      onAuthenticated();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Private Development Site</CardTitle>
          <CardDescription>
            This site is currently in development and requires authentication to access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Access Site
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Quantivara Healthcare Platform</p>
            <p className="text-xs">Development Environment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}