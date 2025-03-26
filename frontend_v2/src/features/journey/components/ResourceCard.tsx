// src/features/journey/components/ResourceCard.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Eye, Download, ChevronDown, ChevronUp, Calendar, HardDrive } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { JourneyResource } from '@/types/journey';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  useResourceView, 
  useResourceDownload,
  downloadResource,
  openResourceInNewTab
} from '@/hooks/api/useJourney';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ResourceCardProps {
  resource: JourneyResource;
  levelId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ResourceCard({ resource, levelId, isExpanded, onToggle }: ResourceCardProps) {
  const { t, direction } = useLanguage();
  const [isViewing, setIsViewing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const viewMutation = useResourceView();
  const downloadMutation = useResourceDownload();

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(direction === 'rtl' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleView = async () => {
    try {
      setIsViewing(true);
      const result = await viewMutation.mutateAsync({ levelId, resourceId: resource.id });
      
      // If the response contains base64 content and mimetype, display it
      if (result.content && result.mimeType) {
        const blob = new Blob(
          [Uint8Array.from(atob(result.content), c => c.charCodeAt(0))], 
          { type: result.mimeType }
        );
        openResourceInNewTab(blob, result.mimeType);
      }
    } catch (error) {
      console.error('Error viewing resource:', error);
    } finally {
      setIsViewing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const result = await downloadMutation.mutateAsync({ levelId, resourceId: resource.id });
      downloadResource(result.blob, result.filename);
    } catch (error) {
      console.error('Error downloading resource:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="text-orange-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="text-green-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-0">
        {/* Resource header */}
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getFileIcon()}
            </div>
            <div>
              <h3 className="font-medium">{resource.name}</h3>
              <p className="text-sm text-gray-500">
                {formatFileSize(resource.size)} • {resource.type.toUpperCase()}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        </div>
        
        {/* Expandable details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                {/* Resource metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>{t('journey.created')}: {formatDate(resource.created_time)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <HardDrive size={16} className="mr-2" />
                    <span>{t('journey.type')}: {resource.mime_type}</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex space-x-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleView}
                    disabled={isViewing}
                  >
                    {isViewing ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {t('journey.viewResource')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {t('journey.downloadResource')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}