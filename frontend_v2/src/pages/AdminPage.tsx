// src/pages/AdminPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useAdmin } from '@/hooks/api/useAdmin';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Credentials } from '@/types/admin';

export default function AdminPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credentials>({ 
    username: '', 
    password: '' 
  });

  const {
    contacts,
    isLoading,
    error,
    isAuthenticated,
    fetchContacts,
    exportToCSV,
    logout
  } = useAdmin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchContacts(credentials);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {!isAuthenticated ? (
        <div className="max-w-md w-full mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {t('admin.login.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  required
                  placeholder={t('admin.login.username')}
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ 
                    ...prev, 
                    username: e.target.value 
                  }))}
                />
                <Input
                  type="password"
                  required
                  placeholder={t('admin.login.password')}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ 
                    ...prev, 
                    password: e.target.value 
                  }))}
                />
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full">
                  {t('admin.login.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('admin.contacts.title')}
            </h1>
            <div className="flex gap-4">
              <Button
                onClick={exportToCSV}
                disabled={contacts.length === 0}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('admin.contacts.export')}
              </Button>
              <Button
                onClick={logout}
                variant="danger"
              >
                {t('admin.logout')}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              {t('common.loading')}
            </div>
          ) : (
            <div className="shadow-lg rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.contacts.date')}</TableHead>
                    <TableHead>{t('admin.contacts.name')}</TableHead>
                    <TableHead>{t('admin.contacts.email')}</TableHead>
                    <TableHead>{t('admin.contacts.message')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell>{contact.Date}</TableCell>
                      <TableCell>{contact.Name}</TableCell>
                      <TableCell>{contact.Email}</TableCell>
                      <TableCell>{contact.Message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}