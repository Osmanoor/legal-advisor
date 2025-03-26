// src/features/journey/components/LevelCard.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { JourneyLevel } from '@/types/journey';
import { useLanguage } from '@/hooks/useLanguage';
import { Book, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LevelCardProps {
  level: JourneyLevel;
  index: number;
  isActive?: boolean;
}

export function LevelCard({ level, index, isActive = false }: LevelCardProps) {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;
  
  // Make sure resources exists, or default to empty array
  const resourceCount = level.resources?.length || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={`
          overflow-hidden transition-all duration-300
          ${isActive 
            ? 'border-indigo-500 shadow-lg' 
            : 'hover:border-indigo-200 hover:shadow-md'}
        `}
      >
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Level number indicator */}
            <div className={`
              flex items-center justify-center w-full md:w-24 p-6
              ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'}
            `}>
              <span className="text-4xl font-bold">{level.order}</span>
            </div>
            
            {/* Level content */}
            <div className="p-6 flex-1">
              <h3 className="text-xl font-semibold mb-2">{level.name}</h3>
              <p className="text-gray-500 line-clamp-2 mb-4">{level.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {resourceCount} {t('journey.resources')}
                </div>
                
                <Button
                  onClick={() => navigate(`/journey/${level.id}`)}
                  size="sm"
                  className={isActive ? 'bg-indigo-600' : ''}
                >
                  {isActive ? t('journey.continue') : t('journey.start')}
                  <ArrowIcon className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}