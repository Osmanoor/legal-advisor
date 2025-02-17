// src/types/calculator.ts
export interface PercentageResult {
    percentage: string;
  }
  
  export interface VATResult {
    netAmount?: number;
    vatAmount?: number;
    totalAmount?: number;
  }
  
  export interface AmountWithPercentageResult {
    originalAmount?: number;
    adjustmentAmount?: number;
    finalAmount?: number;
  }
  
  export interface DateDifference {
    days?: number;
    months?: number;
    years?: number;
  }