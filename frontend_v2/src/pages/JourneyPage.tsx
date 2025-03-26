// src/pages/JourneyPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Compass } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useJourneyLevels, useJourneyLevelResources } from '@/hooks/api/useJourney';
import { LevelCard } from '@/features/journey/components/LevelCard';
import { ResourceList } from '@/features/journey/components/ResourceList';
import { JourneyMap } from '@/features/journey/components/JourneyMap';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function JourneyPage() {
  const { levelId } = useParams<{ levelId?: string }>();
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(levelId);

  // Update selected level when URL parameter changes
  useEffect(() => {
    setSelectedLevel(levelId);
  }, [levelId]);

  const { 
    data: levels, 
    isLoading: isLoadingLevels,
    error: levelsError
  } = useJourneyLevels();

  const {
    data: levelDetails,
    isLoading: isLoadingLevel,
    error: levelError
  } = useJourneyLevelResources(levelId || '');
  
  // Used to find adjacent levels for navigation
  const getAdjacentLevels = () => {
    if (!levels || !levelId) return { prev: null, next: null };
    
    const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
    const currentIndex = sortedLevels.findIndex(level => level.id === levelId);
    
    return {
      prev: currentIndex > 0 ? sortedLevels[currentIndex - 1] : null,
      next: currentIndex < sortedLevels.length - 1 ? sortedLevels[currentIndex + 1] : null
    };
  };
  
  const { prev, next } = getAdjacentLevels();

  // If we have loading states
  if (isLoadingLevels || (levelId && isLoadingLevel)) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-500">{t('journey.loading')}</p>
        </div>
      </div>
    );
  }

  // If we have errors
  if (levelsError || (levelId && levelError)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12 text-red-500">
          <p className="text-xl font-semibold">{t('journey.error')}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/journey')}
            className="mt-4"
          >
            {t('journey.backToJourney')}
          </Button>
        </div>
      </div>
    );
  }

  // If we're viewing a specific level
  if (levelId && levelDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/journey')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('journey.back')}
        </Button>

        {/* Journey Map */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">{t('journey.yourProgress')}</h2>
          <JourneyMap levels={levels || []} currentLevel={levelId} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Level header */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <span className="text-sm font-medium">
                {t('journey.level')} {levelDetails.order}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{levelDetails.name}</h1>
            <p className="text-gray-600 max-w-3xl">{levelDetails.description}</p>
          </div>

          {/* Resources section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">{t('journey.resources')}</h2>
            <ResourceList resources={levelDetails.resources} levelId={levelId} />
          </div>

          {/* Level navigation */}
          <div className="flex justify-between pt-6 border-t">
            {prev ? (
              <Button
                variant="outline"
                onClick={() => navigate(`/journey/${prev.id}`)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('journey.previousLevel')}
              </Button>
            ) : (
              <div></div> // Empty div to maintain flex layout
            )}
            
            {next && (
              <Button
                onClick={() => navigate(`/journey/${next.id}`)}
              >
                {t('journey.nextLevel')}
                {direction === 'rtl' ? (
                  <ChevronLeft className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronLeft className="ml-2 h-4 w-4" transform="rotate(180)" />
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Otherwise, show the list of all levels
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center mb-2">
          <Compass className="w-6 h-6 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold">{t('journey.title')}</h1>
        </div>
        <p className="text-gray-600 max-w-3xl">{t('journey.description')}</p>
      </motion.div>

      {/* Journey roadmap visualization */}
      {levels && levels.length > 0 && (
        <div className="mb-12">
          <JourneyMap levels={levels} />
        </div>
      )}

      {levels && levels.length > 0 ? (
        <div className="space-y-6">
          {[...levels]
            .sort((a, b) => a.order - b.order)
            .map((level, index) => (
              <LevelCard 
                key={level.id} 
                level={level}
                index={index}
                isActive={level.id === selectedLevel}
              />
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {t('journey.noLevels')}
        </div>
      )}
    </div>
  );
}