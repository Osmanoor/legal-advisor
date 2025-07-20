// src/types/calculator.ts
export interface PercentageResult {
  percentage: string;
  error?: string; // Added
}

export interface VATResult {
  netAmount?: number;
  vatAmount?: number;
  totalAmount?: number;
  originalAmount?: number; // This was missing from the original VATResult but used in logic
  error?: string; // Added
}

export interface AmountWithPercentageResult {
  originalAmount?: number;
  adjustmentAmount?: number;
  finalAmount?: number;
  error?: string; // Added
}

export interface DateDifference {
  days?: number;
  months?: number;
  years?: number;
  error?: string; // Added for consistency
}
export interface Competitor {
  id: number; // Unique ID for React keys and state updates
  name: string;
  technicalScore: string; // Stored as string from input
  financialOffer: string; // Stored as string from input
}

// --- NEW TYPES FOR WEIGHTED PERCENTAGE CALCULATOR ---

export interface CalculationResult {
  id: number;
  name: string;
  weightedScore: number;
  rank: number;
}