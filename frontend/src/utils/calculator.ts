import { DateTime, Duration, Info } from 'luxon';
import { tafqit } from './tafqit';
import {toWords   } from 'number-to-words';

// VAT Calculator as a separate class
export class VATCalculator {
  static readonly defaultVAT = 15; // Default VAT rate in Saudi Arabia

  static calculateTotalWithVAT(amount: number, vatRate: number = VATCalculator.defaultVAT): {
    netAmount: number;
    vatAmount: number;
    totalAmount: number;
  } {
    const vatAmount = (amount * vatRate) / 100;
    return {
      netAmount: amount,
      vatAmount,
      totalAmount: amount + vatAmount
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

// Date Converter as a separate class
export class DateConverter {
  // Convert Gregorian to Hijri
  static gregorianToHijri(date: Date): string {
    const luxonDate = DateTime.fromJSDate(date)
      .reconfigure({ outputCalendar: 'islamic' });
    
    // Get the formatted date
    const formatted = luxonDate.toLocaleString({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Convert to YYYY/MM/DD format
    const [month, day, year] = formatted.split('/');
    return `${year}/${month}/${day}`;
  }

  // Convert Hijri to Gregorian
  static hijriToGregorian(hijriDateStr: string): Date {
    // Since Luxon doesn't support direct Islamic calendar calculations,
    // we'll need to use a different approach.
    // This is a simplified conversion that might need adjustment
    const [yearStr, monthStr, dayStr] = hijriDateStr.split('/');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);

    // Approximate conversion formula
    const hijriYear = year;
    const hijriMonth = month;
    const hijriDay = day;

    // Rough approximation: Hijri year × 354.367068 days per Hijri year
    const epochDays = Math.floor(
      (hijriYear - 1) * 354.367068 +
      (hijriMonth - 1) * 29.5 +
      hijriDay
    );

    // Approximate Gregorian date (base date: July 19, 622 CE)
    const gregorianDate = new Date(622, 6, 19);
    gregorianDate.setDate(gregorianDate.getDate() + epochDays);

    return gregorianDate;
  }

  // Calculate difference between dates
  static calculateDateDifference(startDate: Date, endDate: Date): {
    days: number;
    months: number;
    years: number;
  } {
    const start = DateTime.fromJSDate(startDate);
    const end = DateTime.fromJSDate(endDate);
    const diff = end.diff(start, ['years', 'months', 'days']);

    return {
      years: Math.floor(diff.years),
      months: Math.floor(diff.months),
      days: Math.floor(diff.days)
    };
  }

  // Calculate end date by adding duration
  static calculateEndDate(startDate: Date, duration: {
    days?: number;
    months?: number;
    years?: number;
  }): Date {
    // Convert to DateTime for precise calculations
    let result = DateTime.fromJSDate(startDate)
      // Add years first
      .plus({ years: duration.years || 0 })
      // Then months
      .plus({ months: duration.months || 0 })
      // Finally days
      .plus({ days: duration.days || 0 })
      // Ensure we're in local time
      .setZone('local');

    // If the time is midnight (00:00:00), maintain that
    if (startDate.getHours() === 0 && 
        startDate.getMinutes() === 0 && 
        startDate.getSeconds() === 0) {
      result = result.startOf('day');
    }

    return result.toJSDate();
  }

  // Added method for date difference verification
  static verifyDateDifference(startDate: Date, endDate: Date, expectedDuration: {
    years?: number;
    months?: number;
    days?: number;
  }): boolean {
    const start = DateTime.fromJSDate(startDate);
    const end = DateTime.fromJSDate(endDate);
    const diff = end.diff(start, ['years', 'months', 'days']).toObject();

    return (
      Math.floor(diff.years || 0) === (expectedDuration.years || 0) &&
      Math.floor(diff.months || 0) === (expectedDuration.months || 0) &&
      Math.floor(diff.days || 0) === (expectedDuration.days || 0)
    );
  }

  // Helper method to validate Hijri date
  static isValidHijriDate(dateStr: string): boolean {
    try {
      const [year, month, day] = dateStr.split('/').map(Number);
      
      // Basic validation
      if (
        year < 1 || year > 9999 ||
        month < 1 || month > 12 ||
        day < 1 || day > 30  // Hijri months have 29 or 30 days
      ) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Get current Hijri date
  static getCurrentHijriDate(): string {
    return DateTime.now()
      .reconfigure({ outputCalendar: 'islamic' })
      .toLocaleString({
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
  }

  // Get Hijri month name
  static getHijriMonthName(month: number): string {
    const months = [
      "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
      "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
      "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ];
    return months[month - 1] || '';
  }

  // Format Gregorian date to display
  static formatGregorianDate(date: Date): string {
    return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
  }

  // Get a more detailed Hijri date string including month name
  static getDetailedHijriDate(date: Date): string {
    const luxonDate = DateTime.fromJSDate(date)
      .reconfigure({ outputCalendar: 'islamic' });
    
    return luxonDate.toLocaleString({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      calendar: 'islamic'
    });
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
  DateConverter
};