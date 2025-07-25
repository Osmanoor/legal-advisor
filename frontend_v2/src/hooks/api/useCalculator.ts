// src/hooks/api/useCalculator.ts

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { trackEvent } from '@/lib/analytics';
import { DateDifference } from '@/types/calculator';

// --- Type Definitions for API Payloads and Responses ---

export type CalendarType = 'gregorian' | 'hijri';

export interface DateConversionPayload {
  date: string;
  from_calendar: CalendarType;
}
export interface DateConversionResponse {
  gregorian: string;
  hijri: string;
}

export interface DateDifferencePayload {
  start_date: string;
  end_date: string;
  calendar: CalendarType;
}
export type DateDifferenceResponse = DateDifference; // Uses existing type

export interface EndDatePayload {
  start_date: string;
  duration: { years?: number; months?: number; days?: number };
  calendar: CalendarType;
}
export interface EndDateResponse {
  gregorian_end_date: string;
  hijri_end_date: string;
}

// --- The Hook ---

export function useCalculatorAPI() {
  const convertDateMutation = useMutation<DateConversionResponse, Error, DateConversionPayload>({
    mutationFn: (payload) => api.post('/calculator/convert-date', payload).then(res => res.data),
    onSuccess: () => {
      trackEvent({ event: 'feature_used', feature_name: 'date_calculator', sub_feature: 'conversion' });
    }
  });

  const dateDifferenceMutation = useMutation<DateDifferenceResponse, Error, DateDifferencePayload>({
    mutationFn: (payload) => api.post('/calculator/date-difference', payload).then(res => res.data),
     onSuccess: () => {
      trackEvent({ event: 'feature_used', feature_name: 'date_calculator', sub_feature: 'difference' });
    }
  });

  const endDateMutation = useMutation<EndDateResponse, Error, EndDatePayload>({
    mutationFn: (payload) => api.post('/calculator/end-date', payload).then(res => res.data),
     onSuccess: () => {
      trackEvent({ event: 'feature_used', feature_name: 'date_calculator', sub_feature: 'duration' });
    }
  });

  return {
    convertDateMutation,
    dateDifferenceMutation,
    endDateMutation
  };
}