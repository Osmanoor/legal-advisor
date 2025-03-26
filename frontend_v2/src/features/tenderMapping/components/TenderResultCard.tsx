// src/features/tenderMapping/components/TenderResultCard.tsx
import { useLanguage } from '@/hooks/useLanguage';
import { TenderType, TenderMappingResult } from '@/types/tenderMapping';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface TenderResultCardProps {
  result: TenderMappingResult;
}

export function TenderResultCard({ result }: TenderResultCardProps) {
  const { t } = useLanguage();
  
  // Format confidence level
  const getConfidenceBadge = (score: number) => {
    if (score >= 0.7) {
      return (
        <Badge variant="default" className="bg-green-500">
          {t('tenderMapping.results.confidenceHigh')} ({Math.round(score * 100)}%)
        </Badge>
      );
    } else if (score >= 0.4) {
      return (
        <Badge variant="default" className="bg-yellow-500">
          {t('tenderMapping.results.confidenceMedium')} ({Math.round(score * 100)}%)
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-red-500">
          {t('tenderMapping.results.confidenceLow')} ({Math.round(score * 100)}%)
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('tenderMapping.results.title')}</CardTitle>
          {getConfidenceBadge(result.confidence_score)}
        </div>
        {result.message && (
          <CardDescription>{result.message}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main tender type */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{result.matched_tender_type.name}</h3>
            <div className="border rounded-md divide-y">
              <div className="p-3 bg-gray-50 font-medium">
                {t('tenderMapping.results.attributes')}
              </div>
              {result.matched_tender_type.attributes.map((attr) => (
                <div key={attr.name} className="p-3 flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">{attr.name}:</span> {attr.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative tender types */}
          {result.alternative_types && result.alternative_types.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">
                {t('tenderMapping.results.alternativesTitle')}
              </h3>
              <div className="space-y-4">
                {result.alternative_types.map((type, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{type.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-1 text-sm">
                        {type.attributes.map((attr, i) => (
                          <li key={i} className="flex items-center">
                            <span className="w-1/3 font-medium">{attr.name}:</span>
                            <span>{attr.value}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}