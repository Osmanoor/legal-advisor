# app/services/date_service.py

from datetime import datetime
from hijri_converter import Hijri, Gregorian
from dateutil.relativedelta import relativedelta

class DateService:
    @staticmethod
    def convert_date(date_str: str, from_calendar: str) -> dict:
        """Converts a date from one calendar to another."""
        try:
            if from_calendar == 'gregorian':
                dt = datetime.strptime(date_str, '%Y-%m-%d').date()
                gregorian_obj = Gregorian(dt.year, dt.month, dt.day)
                hijri_date = gregorian_obj.to_hijri()
                # --- FIX: Manually format the Hijri date string ---
                formatted_hijri = f"{hijri_date.year}/{hijri_date.month:02d}/{hijri_date.day:02d}"
                return {"hijri": formatted_hijri, "gregorian": date_str}
            elif from_calendar == 'hijri':
                parts = [int(p) for p in date_str.split('/')]
                if len(parts) != 3:
                    raise ValueError("Invalid Hijri date format. Expected YYYY/MM/DD.")
                
                gregorian_date = Hijri(parts[0], parts[1], parts[2]).to_gregorian()
                return {"hijri": date_str, "gregorian": gregorian_date.strftime('%Y-%m-%d')}
            else:
                raise ValueError("Invalid 'from_calendar' value. Must be 'gregorian' or 'hijri'.")
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def calculate_difference(start_date_str: str, end_date_str: str, calendar: str = 'gregorian') -> dict:
        """Calculates the difference between two dates in a given calendar."""
        try:
            start_date = None
            end_date = None

            if calendar == 'gregorian':
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            elif calendar == 'hijri':
                start_parts = [int(p) for p in start_date_str.split('/')]
                end_parts = [int(p) for p in end_date_str.split('/')]
                start_date = Hijri(start_parts[0], start_parts[1], start_parts[2]).to_gregorian()
                end_date = Hijri(end_parts[0], end_parts[1], end_parts[2]).to_gregorian()
            else:
                raise ValueError("Invalid calendar type.")

            if start_date > end_date:
                raise ValueError("Start date cannot be after end date.")

            delta = relativedelta(end_date, start_date)
            return {
                "years": delta.years,
                "months": delta.months,
                "days": delta.days
            }
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def calculate_end_date(start_date_str: str, duration: dict, calendar: str = 'gregorian') -> dict:
        """Calculates an end date by adding a duration to a start date from a given calendar."""
        try:
            start_date = None
            if calendar == 'gregorian':
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            elif calendar == 'hijri':
                start_parts = [int(p) for p in start_date_str.split('/')]
                start_date = Hijri(start_parts[0], start_parts[1], start_parts[2]).to_gregorian()
            else:
                raise ValueError("Invalid calendar type.")

            years = int(duration.get('years', 0))
            months = int(duration.get('months', 0))
            days = int(duration.get('days', 0))

            end_date = start_date + relativedelta(years=years, months=months, days=days)
            
            hijri_end_date_obj = Gregorian(end_date.year, end_date.month, end_date.day).to_hijri()
            # --- FIX: Manually format the Hijri date string ---
            formatted_hijri_end = f"{hijri_end_date_obj.year}/{hijri_end_date_obj.month:02d}/{hijri_end_date_obj.day:02d}"

            return {
                "gregorian_end_date": end_date.strftime('%Y-%m-%d'),
                "hijri_end_date": formatted_hijri_end
            }
        except Exception as e:
            return {"error": str(e)}