// src/features/calculator/components/ResultsTable.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { CalculationResult } from '@/types/calculator';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface ResultsTableProps {
  results: CalculationResult[];
  onBack: () => void;
  onReset: () => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, onBack, onReset }) => {
  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl">
      {/* Header with Back button */}
      <div className="flex justify-end mb-4">
        <Button variant="ghost" onClick={onBack} className="text-gray-500">
          <ArrowRight size={16} className="ml-2" />
          العودة
        </Button>
      </div>

      {/* Results Card */}
      <div className="bg-[#ECFFEA] rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-black/20">
                <th className="p-4 font-normal text-gray-600">الترتيب</th>
                <th className="p-4 font-normal text-gray-600">أسم المنافس</th>
                <th className="p-4 font-normal text-gray-600">النسبة الموزونة</th>
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

      {/* Footer Button */}
      <div className="mt-6">
        <Button onClick={onReset} className="w-full h-12 bg-cta hover:bg-cta-hover text-base">
          منافسة أخرى
        </Button>
      </div>
    </div>
  );
};