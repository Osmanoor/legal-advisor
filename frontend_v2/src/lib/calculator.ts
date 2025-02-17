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
  static calculateEndDate(
    startDate: Date, 
    duration: { days?: number; months?: number; years?: number; }
  ): Date {
    const dt = DateTime.fromJSDate(startDate, { zone: 'local' })
      .plus({
        years: duration.years || 0,
        months: duration.months || 0,
        days: duration.days || 0,
      });
    
    // If the original startDate was at midnight, ensure the result is too.
    const finalDateTime = (startDate.getHours() === 0 &&
                           startDate.getMinutes() === 0 &&
                           startDate.getSeconds() === 0)
                           ? dt.startOf('day')
                           : dt;
  
    return finalDateTime.toJSDate();
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

  static HijricalculateDateDifference(startDateStr: string, endDateStr: string): {
    days: number;
    months: number;
    years: number;
  } {
    // Validate input dates
    if (!this.isValidHijriDate(startDateStr) || !this.isValidHijriDate(endDateStr)) {
      throw new Error('Invalid Hijri date format. Use YYYY/MM/DD');
    }

    // Convert Hijri dates to DateTime objects with Islamic calendar
    const [startYear, startMonth, startDay] = startDateStr.split('/').map(Number);
    const [endYear, endMonth, endDay] = endDateStr.split('/').map(Number);

    const start = DateTime.local()
      .reconfigure({ outputCalendar: 'islamic' })
      .set({ year: startYear, month: startMonth, day: startDay });

    const end = DateTime.local()
      .reconfigure({ outputCalendar: 'islamic' })
      .set({ year: endYear, month: endMonth, day: endDay });

    // Calculate difference
    const diff = end.diff(start, ['years', 'months', 'days']);

    return {
      years: Math.floor(diff.years),
      months: Math.floor(diff.months),
      days: Math.floor(diff.days)
    };
  }

  // Calculate end date by adding duration in Hijri calendar
  static HijricalculateEndDate(
    startDateStr: string,
    duration: { days?: number; months?: number; years?: number; }
  ): string {
    // Validate input date
    if (!this.isValidHijriDate(startDateStr)) {
      throw new Error('Invalid Hijri date format. Use YYYY/MM/DD');
    }

    // Parse the start date
    const [year, month, day] = startDateStr.split('/').map(Number);

    // Create DateTime object with Islamic calendar
    let dt = DateTime.local()
      .reconfigure({ outputCalendar: 'islamic' })
      .set({ year, month, day });

    // Add duration
    dt = dt.plus({
      years: duration.years || 0,
      months: duration.months || 0,
      days: duration.days || 0,
    });

    // Format the result back to YYYY/MM/DD
    const result = dt.toLocaleString({
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // Convert from MM/DD/YYYY to YYYY/MM/DD format
    const [resultMonth, resultDay, resultYear] = result.split('/');
    return `${resultYear}/${resultMonth}/${resultDay}`;
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