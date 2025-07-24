import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Competitor, CalculationResult } from '@/types/calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CompetitorInput } from './CompetitorInput';
import { ResultsTable } from './ResultsTable';
import { useToast } from '@/hooks/useToast';
import { Separator } from '@/components/ui/separator';

const FormSeparatorWithLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 my-6">
        <Separator className="flex-1" />
        <span className="text-sm text-gray-500">{label}</span>
        <Separator className="flex-1" />
    </div>
);

export const WeightedPercentageCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [view, setView] = useState<'form' | 'results'>('form');
  const [weights, setWeights] = useState({ technical: '60', financial: '40' });
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { id: Date.now(), name: '', technicalScore: '', financialOffer: '' }
  ]);
  const [results, setResults] = useState<CalculationResult[]>([]);

  const handleWeightChange = (field: 'technical' | 'financial', value: string) => {
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) numValue = 0; // Treat empty input as 0

    if (numValue < 0) numValue = 0;
    if (numValue > 100) numValue = 100;

    if (field === 'technical') {
      setWeights({ technical: numValue.toString(), financial: (100 - numValue).toString() });
    } else {
      setWeights({ technical: (100 - numValue).toString(), financial: numValue.toString() });
    }
  };

  const handleCompetitorUpdate = (id: number, field: keyof Omit<Competitor, 'id'>, value: string) => {
    setCompetitors(prev => 
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAddCompetitor = () => {
    setCompetitors(prev => [
      ...prev,
      { id: Date.now(), name: '', technicalScore: '', financialOffer: '' }
    ]);
  };

  const handleRemoveCompetitor = (id: number) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
  };

  const handleResetForm = () => {
      setWeights({ technical: '60', financial: '40' });
      setCompetitors([{ id: Date.now(), name: '', technicalScore: '', financialOffer: '' }]);
      setResults([]);
      setView('form');
  };
  
  const handleCalculate = () => {
    // --- VALIDATION ---
    const technicalWeight = parseFloat(weights.technical) / 100;
    const financialWeight = parseFloat(weights.financial) / 100;

    for (const c of competitors) {
        if (!c.name.trim() || !c.technicalScore || !c.financialOffer) {
            showToast('Please fill in all fields for every competitor.', 'error');
            return;
        }
        const technicalScoreNum = parseFloat(c.technicalScore);
        if (isNaN(technicalScoreNum) || technicalScoreNum < 0 || technicalScoreNum > 100) {
            showToast(`Technical score for '${c.name || 'competitor'}' must be between 0 and 100.`, 'error');
            return;
        }
        const financialOfferNum = parseFloat(c.financialOffer);
        if (isNaN(financialOfferNum) || financialOfferNum <= 0) {
            showToast(`Financial offer for '${c.name || 'competitor'}' must be a positive number.`, 'error');
            return;
        }
    }

    // --- CALCULATION LOGIC ---
    const offers = competitors.map(c => parseFloat(c.financialOffer));
    const lowestFinancialOffer = Math.min(...offers);

    const calculatedResults = competitors.map(c => {
        const technicalScore = parseFloat(c.technicalScore);
        const financialOffer = parseFloat(c.financialOffer);

        const financialScore = (lowestFinancialOffer / financialOffer) * 100;
        
        const weightedScore = (technicalScore * technicalWeight) + (financialScore * financialWeight);

        return { id: c.id, name: c.name, weightedScore };
    });

    // Sort by score and add rank
    const sortedResults = calculatedResults
        .sort((a, b) => b.weightedScore - a.weightedScore)
        .map((res, index) => ({ ...res, rank: index + 1 }));

    setResults(sortedResults);
    setView('results');
  };

  if (view === 'results') {
    return <ResultsTable results={results} onBack={() => setView('form')} onReset={handleResetForm} />;
  }

  return (
    <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl">
      <div className="space-y-6">
        {/* Main Weights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-right">
            <Label htmlFor="technical-weight">نسبة التقييم الفني</Label>
            <Input 
              id="technical-weight" 
              type="number" 
              value={weights.technical}
              onChange={(e) => handleWeightChange('technical', e.target.value)}
              placeholder="e.g., 60"
              max="100"
              min="0"
            />
          </div>
          <div className="space-y-2 text-right">
            <Label htmlFor="financial-weight">نسبة العرض المالي</Label>
            <Input 
              id="financial-weight" 
              type="number" 
              value={weights.financial}
              onChange={(e) => handleWeightChange('financial', e.target.value)}
              placeholder="e.g., 40"
              max="100"
              min="0"
            />
          </div>
        </div>

        <FormSeparatorWithLabel label="عروض المتنافسين" />

        {/* Competitors List */}
        <div className="space-y-6">
          {competitors.map((c, index) => (
            <CompetitorInput 
              key={c.id}
              competitor={c}
              index={index}
              onUpdate={handleCompetitorUpdate}
              onRemove={handleRemoveCompetitor}
              isFirst={index === 0}
              separatorLabel={`المنافس ${index + 1}`} // Correctly label subsequent competitors
            />
          ))}
        </div>

        {/* Add Competitor Button */}
        <div className="flex justify-center">
            <Button variant="outline" onClick={handleAddCompetitor} className="border-dashed hover:bg-gray-50 text-gray-600">
                <Plus size={16} className="mr-2"/>
                اضافة منافس
            </Button>
        </div>

        {/* Calculate Button */}
        <div className="pt-4">
            <Button onClick={handleCalculate} className="w-full h-12 bg-cta hover:bg-cta-hover text-base">
                أحسب
            </Button>
        </div>
      </div>
    </div>
  );
};