// src/hooks/api/useAdmin.ts

import { useState } from 'react';
import { api } from '@/lib/axios';
import { Contact, Credentials, Email } from '@/types/admin';

export function useAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
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
      
      // Also fetch emails when contacts are fetched
      const emailsResponse = await api.get('/admin/emails', {
        headers: getAuthHeader(credentials)
      });
      
      setEmails(emailsResponse.data);
      
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

  const exportToCSV = (data: Contact[] | Email[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item =>
      Object.values(item)
        .map(value => `"${value}"`)
        .join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportContactsToCSV = () => {
    exportToCSV(contacts, `contacts_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportEmailsToCSV = () => {
    exportToCSV(emails, `emails_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setContacts([]);
    setEmails([]);
    setError(null);
  };

  return {
    contacts,
    emails,
    isLoading,
    error,
    isAuthenticated,
    fetchContacts,
    submitContact,
    exportContactsToCSV,
    exportEmailsToCSV,
    logout
  };
}