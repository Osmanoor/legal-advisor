import json
import os

class SearchEngine:
    def __init__(self):
        self.data_dir = os.path.dirname(os.path.abspath(__file__))
        self.json_files = {
            'en': os.path.join(self.data_dir, 'final_en.json'),
            'ar': os.path.join(self.data_dir, 'final_ar.json')
        }
        self.data = {}
        self._load_json_files()
        
        # Define type mappings between Arabic and English
        self.type_mappings = {
            'اللائحة': 'Regulation',
            'النظام': 'System'
        }
    
    def _load_json_files(self):
        """Load JSON files into memory"""
        for lang, filepath in self.json_files.items():
            try:
                with open(filepath, 'r', encoding='utf-8') as file:
                    self.data[lang] = json.load(file)
            except Exception as e:
                print(f"Error loading {filepath}: {str(e)}")
                self.data[lang] = []
    
    def _matches_type_filter(self, item_type, filter_type):
        """
        Check if an item's type matches the filter
        
        Args:
            item_type (str): Type of the item
            filter_type (str): Type to filter by
            
        Returns:
            bool: True if matches, False otherwise
        """
        if filter_type == "both":
            return True
            
        # Handle Arabic type filter
        if filter_type in self.type_mappings:
            return item_type == filter_type or item_type == self.type_mappings[filter_type]
            
        # Handle English type filter
        reverse_mappings = {v: k for k, v in self.type_mappings.items()}
        if filter_type in reverse_mappings:
            return item_type == filter_type or item_type == reverse_mappings[filter_type]
            
        return item_type == filter_type
    
    def search(self, query_text, doc_type="both"):
        """
        Search for text in content fields across all loaded JSON files with type filtering
        
        Args:
            query_text (str): Text to search for
            doc_type (str): Type of document to search for ('اللائحة', 'النظام', 'Regulation', 
                          'System', or 'both')
            
        Returns:
            list: List of matching objects from all files
        """
        query_text = query_text.strip().lower()
        if not query_text:
            return []
        
        matches = []
        
        # Search in all loaded files
        for dataset in self.data.values():
            for item in dataset:
                if 'content' in item and item['content'] and 'type' in item:
                    # Check if item matches both text and type criteria
                    if (query_text in item['content'].lower() and 
                        self._matches_type_filter(item['type'], doc_type)):
                        matches.append(item)
        
        return matches

# Create a singleton instance
search_engine = SearchEngine()

def search_content(query_text, doc_type="both"):
    """
    Search for content across all JSON files with type filtering
    
    Args:
        query_text (str): Text to search for
        doc_type (str): Type of document to search for ('اللائحة', 'النظام', 'Regulation', 
                      'System', or 'both')
        
    Returns:
        list: List of matching objects
    """
    return search_engine.search(query_text, doc_type)

if __name__ == "__main__":
    # Example usage
    test_queries = [
        ("tender documents", "System"),
        ("المنافسة", "اللائحة"),
        ("contract", "both")
    ]
    
    for query, doc_type in test_queries:
        results = search_content(query, doc_type)
        print(f"\nFound {len(results)} matches for '{query}' in type '{doc_type}':")
        for i, result in enumerate(results, 1):
            print(f"\nMatch {i}:")
            print(f"Type: {result.get('type', 'N/A')}")
            print(f"Article Number: {result.get('number', 'N/A')}")
            print(f"Content: {result.get('content', 'N/A')[:200]}...")
            print("-" * 80)
