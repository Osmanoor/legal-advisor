// src/components/ui/counter.tsx
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
}

export function CountUp({ 
  end, 
  start = 0, 
  duration = 2000,
  suffix = '' 
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const steps = 60;
    const increment = (end - start) / steps;
    const timePerStep = duration / steps;

    const updateCount = () => {
      if (countRef.current < end) {
        const newCount = Math.min(countRef.current + increment, end);
        countRef.current = newCount;
        setCount(Math.floor(newCount));
        timeoutRef.current = setTimeout(updateCount, timePerStep);
      }
    };

    updateCount();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [end, start, duration]);

  return <>{count}{suffix}</>;
}