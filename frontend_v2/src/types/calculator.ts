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