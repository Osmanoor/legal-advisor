// src/features/journey/components/JourneyMap.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { JourneyLevel } from '@/types/journey';
import { useLanguage } from '@/hooks/useLanguage';
import { Flag, CheckCircle, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

interface JourneyMapProps {
  levels: JourneyLevel[];
  currentLevel?: string;
}

export function JourneyMap({ levels, currentLevel }: JourneyMapProps) {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  
  // Sort levels by order
  const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
  
  // Determine the current step (0-based index)
  const currentStep = currentLevel 
    ? sortedLevels.findIndex(level => level.id === currentLevel)
    : -1;

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="min-w-max">
        <div className="flex items-center justify-start">
          {sortedLevels.map((level, index) => (
            <div key={level.id} className="flex items-center">
              {/* Level node */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex-shrink-0 cursor-pointer transition-all duration-300
                  ${index <= currentStep 
                    ? 'hover:scale-110' 
                    : 'opacity-60 hover:opacity-80'}
                `}
                onClick={() => navigate(`/journey/${level.id}`)}
              >
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  border-4 relative z-10
                  ${index === currentStep 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-600' 
                    : index < currentStep 
                      ? 'bg-green-100 border-green-500 text-green-600'
                      : 'bg-gray-100 border-gray-300 text-gray-500'}
                `}>
                  {index < currentStep ? (
                    <CheckCircle size={24} />
                  ) : index === currentStep ? (
                    <Flag size={24} />
                  ) : (
                    <Lock size={24} />
                  )}
                  
                  <div className="absolute -bottom-8 whitespace-nowrap font-medium text-sm">
                    {t('journey.level')} {level.order}
                  </div>
                </div>
              </motion.div>
              
              {/* Connector line between levels */}
              {index < sortedLevels.length - 1 && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 + 0.05, duration: 0.5 }}
                  className={`
                    h-1 w-20 mx-2
                    ${index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}