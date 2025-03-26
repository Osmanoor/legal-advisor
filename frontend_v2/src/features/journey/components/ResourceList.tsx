// src/features/journey/components/ResourceList.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { JourneyResource } from '@/types/journey';
import { ResourceCard } from './ResourceCard';

interface ResourceListProps {
  resources: JourneyResource[];
  levelId: string;
}

export function ResourceList({ resources, levelId }: ResourceListProps) {
  const { t } = useLanguage();
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const toggleResource = (id: string) => {
    setExpandedResource(expandedResource === id ? null : id);
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {t('journey.noResources')}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {resources.map((resource, index) => (
        <motion.div
          key={resource.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ResourceCard 
            resource={resource} 
            levelId={levelId}
            isExpanded={expandedResource === resource.id}
            onToggle={() => toggleResource(resource.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}