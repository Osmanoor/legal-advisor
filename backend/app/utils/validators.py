from typing import Optional
import re

def validate_email(email: str) -> bool:
    """Validates an email format."""
    if not email:
        return False
    # A standard, reasonably strict regex for email validation
    pattern = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    return pattern.match(email) is not None

def validate_phone_number(phone_number: str) -> bool:
    """
    Validates a phone number format.
    This example validates a common Saudi Arabian mobile format (10 digits starting with 05).
    """
    # if not phone_number:
    #     return False
    # # Regex for a 10-digit number starting with 05.
    # pattern = re.compile(r'^05\d{8}$')
    # return pattern.match(phone_number) is not None
    return True

def validate_password(password: str) -> bool:
    """
    Validates password strength.
    This example checks for a minimum length of 8 characters.
    """
    if not password or len(password) < 8:
        return False
    # You could add more complex rules here, e.g., requiring numbers, symbols, etc.
    return True

def validate_search_params(query: str, search_type: str) -> Optional[str]:
    """
    Validate search parameters.
    
    Args:
        query (str): Search query text
        search_type (str): Type of search to perform
        
    Returns:
        Optional[str]: Error message if validation fails, None if validation succeeds
    """
    if not query:
        return 'Search query is required'

    valid_types = {'System', 'Regulation', 'Both'}
    if search_type not in valid_types:
        return 'Invalid search type. Must be one of: System, Regulation, Both'

    return None