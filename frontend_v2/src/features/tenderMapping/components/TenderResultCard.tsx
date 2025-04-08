// Updated src/features/tenderMapping/components/TenderResultCard.tsx

import { useLanguage } from '@/hooks/useLanguage';
import { TenderCalculationResult, TenderStage } from '@/types/tenderMapping';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertCircle, FileText, Users, ShieldCheck, BookOpen } from 'lucide-react';

interface TenderResultCardProps {
  result: TenderCalculationResult;
}

export function TenderResultCard({ result }: TenderResultCardProps) {
  const { t } = useLanguage();
  
  // Safely format a value that might be undefined
  const formatValue = (value: string | number | undefined) => {
    if (value === undefined || value === null) return "غير محدد";
    if (value === 0 || value === "0") return "غير مطلوب";
    if (value === "لم يحدد") return "غير محدد";
    return value;
  };

  // Ensure result exists
  if (!result) {
    return null;
  }

  // Check if there are referenced articles
  const hasReferencedArticles = result.referenced_articles && result.referenced_articles.length > 0;
  const hasReferencedArticlesData = result.referenced_articles_data && result.referenced_articles_data.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('tenderMapping.results.title')}</CardTitle>
          <Badge variant="default" className="bg-blue-500">
            {result.procurement_type || "غير محدد"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main procurement details */}
          <div className="border rounded-md divide-y">
            <div className="p-3 bg-gray-50 font-medium">
              المعلومات الأساسية
            </div>
            
            <div className="p-3 flex items-start">
              <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">هيكل الملف:</span> {formatValue(result.file_structure)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <Users className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">المشاركون المطلوبون:</span> {formatValue(result.required_participants)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <ShieldCheck className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">أولوية الشركات الصغيرة والمتوسطة:</span> {formatValue(result.sme_priority)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">الضمان الابتدائي:</span> {formatValue(result.initial_guarantee)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">الضمان النهائي:</span> {formatValue(result.final_guarantee)}
              </div>
            </div>
            
            <div className="p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">إرشادات التنفيذ:</span> {formatValue(result.implementation_guidelines)}
              </div>
            </div>
          </div>

          {/* Referenced Articles */}
          {(hasReferencedArticles || hasReferencedArticlesData) && (
            <div className="border rounded-md divide-y">
              <div className="p-3 bg-gray-50 font-medium">
                المواد المرجعية
              </div>
              
              {hasReferencedArticles && (
                <div className="p-3 flex items-start">
                  <BookOpen className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">أرقام المواد:</span>{' '}
                    {result.referenced_articles.map((article, index) => (
                      <span key={index} className="inline-block bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-xs mr-2 mb-2">
                        المادة {article}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {hasReferencedArticlesData && (
                <div className="space-y-4 p-3">
                  {result.referenced_articles_data.map((article, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="font-medium text-indigo-700 mb-2">
                        {article.type === 'اللائحة' ? 'اللائحة' : 'النظام'}{' '}
                        {article.number && `- المادة ${article.number}`}
                      </div>
                      {article.title && (
                        <div className="text-sm font-medium mb-1">{article.title}</div>
                      )}
                      {article.content && (
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{article.content}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {result.stages && result.stages.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">الجدول الزمني ({result.total_duration || 0} يوم)</h3>
              <div className="space-y-3">
                {result.stages.map((stage, index) => (
                  <TimelineStage key={index} stage={stage} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Timeline stage component
function TimelineStage({ stage, index }: { stage: TenderStage, index: number }) {
  if (!stage) return null;
  
  return (
    <div className="flex">
      <div className="mr-4 flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          stage.notes ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {index + 1}
        </div>
        {index < 5 && <div className="w-px h-full bg-gray-200 my-1"></div>}
      </div>
      <div className="flex-1">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="font-medium">{stage.name || "مرحلة"}</div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>
              {stage.start_date || ""} إلى {stage.end_date || ""} ({stage.duration || 0} {stage.is_working_days ? 'أيام عمل' : 'أيام'})
            </span>
          </div>
          {stage.notes && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              {stage.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}