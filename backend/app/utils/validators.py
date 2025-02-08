from typing import Optional

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