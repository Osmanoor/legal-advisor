// src/pages/admin/SettingsPage.tsx
// Updated for i18n

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminSettings } from '@/hooks/api/useAdminSettings';
import { GlobalSettings } from '@/types/admin';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

import { SettingsCard } from '@/features/admin/components/Settings/SettingsCard';
import { FeatureAccessCard } from '@/features/admin/components/Settings/FeatureAccessCard';
import { UsageLimitsCard } from '@/features/admin/components/Settings/UsageLimitsCard';

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { settingsQuery, updateSettingsMutation } = useAdminSettings();
  const [settings, setSettings] = useState<GlobalSettings | null>(null);

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data.global_settings);
    }
  }, [settingsQuery.data]);

  const handleFeatureToggle = (role: keyof GlobalSettings, permissionName: string, isEnabled: boolean) => {
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [role]: {
          ...prev[role],
          features_enabled: {
            ...prev[role].features_enabled,
            [permissionName]: isEnabled,
          },
        },
      };
    });
  };

  const handleLimitChange = (role: keyof GlobalSettings, limitName: string, value: number) => {
    if (isNaN(value)) return;
    setSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [role]: {
          ...prev[role],
          usage_limits: {
            ...prev[role].usage_limits,
            [limitName]: value,
          },
        },
      };
    });
  };

  const handleSaveChanges = () => {
    if (!settings) return;
    updateSettingsMutation.mutate(settings, {
      onSuccess: () => {
        showToast(t('common.success'), 'success');
      },
      onError: (error) => {
        showToast(`${t('common.error')}: ${error.message}`, 'error');
      },
    });
  };

  if (settingsQuery.isLoading) {
    return <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>;
  }

  if (settingsQuery.isError || !settings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{settingsQuery.error?.message || t('common.error')}</AlertDescription>
      </Alert>
    );
  }

  const allUserPermissions = settingsQuery.data?.all_permissions.user || [];
  const allAdminPermissions = settingsQuery.data?.all_permissions.admin || [];
  const allPermissionsForAdmin = [...allUserPermissions, ...allAdminPermissions];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.settings.title')}</h1>
        <Button onClick={handleSaveChanges} disabled={updateSettingsMutation.isPending}>
          {updateSettingsMutation.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
          {updateSettingsMutation.isPending ? t('admin.settings.saving') : t('admin.settings.save')}
        </Button>
      </div>

      <SettingsCard title={t('admin.settings.guestTitle')} description={t('admin.settings.guestDescription')}>
        <FeatureAccessCard
          title={t('admin.settings.featureAccess')}
          permissions={allUserPermissions}
          enabledFeatures={settings.guest_permissions.features_enabled}
          onToggle={(p, e) => handleFeatureToggle('guest_permissions', p, e)}
        />
        <UsageLimitsCard
          title={t('admin.settings.usageLimits')}
          limits={settings.guest_permissions.usage_limits}
          onLimitChange={(l, v) => handleLimitChange('guest_permissions', l, v)}
        />
      </SettingsCard>

      <SettingsCard title={t('admin.settings.registeredTitle')} description={t('admin.settings.registeredDescription')}>
        <FeatureAccessCard
          title={t('admin.settings.featureAccess')}
          permissions={allUserPermissions}
          enabledFeatures={settings.registered_user_permissions.features_enabled}
          onToggle={(p, e) => handleFeatureToggle('registered_user_permissions', p, e)}
        />
        <UsageLimitsCard
          title={t('admin.settings.usageLimitsUnlimited')}
          limits={settings.registered_user_permissions.usage_limits}
          onLimitChange={(l, v) => handleLimitChange('registered_user_permissions', l, v)}
        />
      </SettingsCard>

      <SettingsCard title={t('admin.settings.adminTitle')} description={t('admin.settings.adminDescription')}>
        <FeatureAccessCard
          title={t('admin.settings.adminPanelAccess')}
          permissions={allPermissionsForAdmin}
          enabledFeatures={settings.admin_permissions.features_enabled}
          onToggle={(p, e) => handleFeatureToggle('admin_permissions', p, e)}
        />
      </SettingsCard>
    </div>
  );
}