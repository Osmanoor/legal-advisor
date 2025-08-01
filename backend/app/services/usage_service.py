# app/services/usage_service.py

from datetime import date
from sqlalchemy import and_
from app.extensions import db
from app.models import UserUsageLog, User
from app.services.settings_service import SettingsService

class UsageService:

    def _get_limit_for_feature(self, user: User | None, guest_identifier: str | None, feature: str) -> int:
        """Determines the usage limit for a given user/guest and feature."""
        # --- MODIFICATION: Get the latest settings on every check ---
        settings = SettingsService.get_settings()
        
        if user:
            role_name = user.roles[0].name if user.roles else 'Registered User'
            if role_name == 'Admin':
                return settings.get("admin_permissions", {}).get("usage_limits", {}).get(feature, 0)
            else: # Registered User
                return settings.get("registered_user_permissions", {}).get("usage_limits", {}).get(feature, 0)
        elif guest_identifier: # Guest user
            return settings.get("guest_permissions", {}).get("usage_limits", {}).get(feature, 0)
        return 0

    def check_usage(self, user: User | None, guest_identifier: str | None, feature: str) -> bool:
        """Checks if a user or guest is within their usage limit for a feature."""
        limit = self._get_limit_for_feature(user, guest_identifier, feature)
        
        if limit == -1: return True
        if limit == 0: return False

        today = date.today()
        
        query_filter = [
            UserUsageLog.feature == feature,
            UserUsageLog.usage_date == today
        ]

        if user:
            query_filter.append(UserUsageLog.user_id == user.id)
        elif guest_identifier:
            query_filter.append(UserUsageLog.guest_identifier == guest_identifier)
        else:
            return False

        usage_log = UserUsageLog.query.filter(and_(*query_filter)).first()
        current_usage = usage_log.count if usage_log else 0
        
        return current_usage < limit

    def log_usage(self, user_id: str | None, guest_identifier: str | None, feature: str):
        """Logs one usage instance for a user or guest for a specific feature."""
        if not user_id and not guest_identifier:
            return

        today = date.today()
        
        query_filter = [
            UserUsageLog.feature == feature,
            UserUsageLog.usage_date == today
        ]
        if user_id:
            query_filter.append(UserUsageLog.user_id == user_id)
        else:
            query_filter.append(UserUsageLog.guest_identifier == guest_identifier)

        usage_log = UserUsageLog.query.filter(and_(*query_filter)).first()

        if usage_log:
            usage_log.count += 1
        else:
            new_log = UserUsageLog(
                user_id=user_id,
                guest_identifier=guest_identifier,
                feature=feature,
                usage_date=today,
                count=1
            )
            db.session.add(new_log)
        
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error logging usage: {e}")