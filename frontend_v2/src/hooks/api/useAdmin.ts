// src/hooks/api/useAdmin.ts
import { useState } from 'react';
import { api } from '@/lib/axios';
import { Contact, Credentials } from '@/types/admin';

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set up auth header for the request
  const getAuthHeader = (credentials: Credentials) => ({
    'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`
  });

  const fetchContacts = async (credentials: Credentials) => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/contacts', {
        headers: getAuthHeader(credentials)
      });

      if (response.status === 401) {
        throw new Error('Unauthorized access');
      }

      setContacts(response.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsAuthenticated(false);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Submit contact form (no auth required)
  const submitContact = async (contactData: Omit<Contact, 'Date'>) => {
    try {
      const response = await api.post('/admin/contact', contactData);
      return response.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to submit contact form');
    }
  };

  const exportToCSV = () => {
    if (contacts.length === 0) return;

    const headers = Object.keys(contacts[0]).join(',');
    const rows = contacts.map(contact =>
      Object.values(contact)
        .map(value => `"${value}"`)
        .join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setContacts([]);
    setError(null);
  };

  return {
    contacts,
    isLoading,
    error,
    isAuthenticated,
    fetchContacts,
    submitContact,
    exportToCSV,
    logout
  };
}