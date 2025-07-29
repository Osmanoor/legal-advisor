// src/features/calculator/components/ResultsTable.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/types/calculator';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface ResultsTableProps {
  results: CalculationResult[];
  onBack: () => void;
  onReset: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onBack, onReset }) => {
  const { t, direction } = useLanguage();
  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl">
      <div className="flex justify-end mb-4">
        <Button variant="ghost" onClick={onBack} className="text-gray-500">
          <ArrowRight size={16} className="ml-2" />
          {t('common.back')}
        </Button>
      </div>

      <div className="bg-[#ECFFEA] rounded-lg p-6 ">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir={direction}>
            <thead>
              <tr className="border-b border-black/20">
                <th className="p-4 font-normal text-gray-600">{t('calculator.weighted.results.rank')}</th>
                <th className="p-4 font-normal text-gray-600">{t('calculator.weighted.results.competitorName')}</th>
                <th className="p-4 font-normal text-gray-600">{t('calculator.weighted.results.weightedScore')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-b border-black/10 last:border-b-0">
                  <td className="p-4 font-medium">{result.rank}</td>
                  <td className="p-4">{result.name}</td>
                  <td className="p-4 font-bold text-lg text-cta">
                    {result.weightedScore.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Button onClick={onReset} className="w-full h-12 bg-cta hover:bg-cta-hover text-base">
          {t('calculator.weighted.results.anotherCompetition')}
        </Button>
      </div>
    </div>
  );
};