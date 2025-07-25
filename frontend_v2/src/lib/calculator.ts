import { DateTime, Duration, Info } from 'luxon';
import { tafqit } from './tafqit';
import {toWords   } from 'number-to-words';

// VAT Calculator as a separate class
export class VATCalculator {
  static readonly defaultVAT = 15; // Default VAT rate in Saudi Arabia

  static calculateTotalWithVAT(totalAmount: number, vatRate: number = VATCalculator.defaultVAT): {
    netAmount: number;
    vatAmount: number;
    totalAmount: number;
  } {
    const netAmount = totalAmount / (1 + (vatRate / 100));
    const vatAmount = totalAmount - netAmount;
    return {
      netAmount: netAmount,
      vatAmount: vatAmount,
      totalAmount: totalAmount
    };
  }

  static extractAmountFromVAT(vatAmount: number, vatRate: number = VATCalculator.defaultVAT): {
    originalAmount: number;
    totalAmount: number;
  } {
    const originalAmount = (vatAmount * 100) / vatRate;
    return {
      originalAmount,
      totalAmount: originalAmount
    };
  }

  static calculateVATAmount(totalAmount: number, vatRate: number = VATCalculator.defaultVAT): {
    vatAmount: number;
    netAmount: number;
  } {
    const vatAmount = (totalAmount * vatRate) / (100 + vatRate);
    return {
      vatAmount,
      netAmount: totalAmount - vatAmount
    };
  }
}

// Main Calculator class
export class ProcurementCalculator {
  static calculatePercentageChange(baseAmount: number, newAmount: number): number {
    return ((newAmount - baseAmount) / baseAmount) * 100;
  }

  static calculateAmountWithPercentage(amount: number, percentage: number): {
    originalAmount: number;
    adjustmentAmount: number;
    finalAmount: number;
  } {
    const adjustmentAmount = (amount * percentage) / 100;
    return {
      originalAmount: amount,
      adjustmentAmount,
      finalAmount: amount + adjustmentAmount
    };
  }

  /**
   * Convert number to Arabic words with optional configuration
   * @param amount The number to convert
   * @param options Configuration options for the conversion
   * @returns The number in Arabic words
   */
  static numberToWords(amount: number, options: {
    language?: 'ar' | 'en';
    feminine?: 'on';
    comma?: 'on';
    miah?: 'on';
    legal?: 'on';
  } = {}): string {
    if (options.language === 'en') {
      // Simple English implementation remains for backward compatibility
      const englishNumbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
      return toWords(amount);
    }

    // Use the tafqit function for Arabic
    return tafqit(amount, {
      Feminine: options.feminine,
      Comma: options.comma,
      Miah: options.miah,
      Legal: options.legal
    });
  }
}

// Re-export all calculators
export default {
  ProcurementCalculator,
  VATCalculator,
};