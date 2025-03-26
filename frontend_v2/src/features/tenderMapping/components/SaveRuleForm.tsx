// src/features/tenderMapping/components/SaveRuleForm.tsx
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TenderMappingResult, MappingRule } from '@/types/tenderMapping';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSaveMappingRule } from '@/hooks/api/useTenderMapping';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SaveRuleFormProps {
  result: TenderMappingResult;
  inputs: Record<string, string>;
}

export function SaveRuleForm({ result, inputs }: SaveRuleFormProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [ruleName, setRuleName] = useState('');
  const saveMutation = useSaveMappingRule();

  const handleSave = async () => {
    if (!ruleName.trim()) return;

    // Create a new rule from the current mapping
    const rule: MappingRule = {
      conditions: inputs,
      matched_tender_type: result.matched_tender_type.name,
      attributes: result.matched_tender_type.attributes.reduce(
        (acc, attr) => ({ ...acc, [attr.name]: attr.value }),
        {}
      )
    };

    try {
      await saveMutation.mutateAsync(rule);
      showToast(t('tenderMapping.saveRule.success'), 'success');
      setRuleName('');
    } catch (error) {
      showToast(t('tenderMapping.saveRule.error'), 'error');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tenderMapping.saveRule.title')}</CardTitle>
        <CardDescription>{t('tenderMapping.saveRule.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder={t('tenderMapping.saveRule.ruleName')}
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={!ruleName.trim() || saveMutation.isPending}
          className="w-full"
        >
          {saveMutation.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {t('common.loading')}
            </>
          ) : (
            t('tenderMapping.saveRule.submit')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}