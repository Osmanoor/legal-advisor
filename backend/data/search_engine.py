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
    
    def _load_json_files(self):
        """Load JSON files into memory"""
        for lang, filepath in self.json_files.items():
            try:
                with open(filepath, 'r', encoding='utf-8') as file:
                    self.data[lang] = json.load(file)
            except Exception as e:
                print(f"Error loading {filepath}: {str(e)}")
                self.data[lang] = []
    
    def search(self, query_text):
        """
        Search for text in content fields across all loaded JSON files
        
        Args:
            query_text (str): Text to search for
            
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
                if 'content' in item and item['content']:
                    if query_text in item['content'].lower():
                        matches.append(item)
        
        return matches

# Create a singleton instance
search_engine = SearchEngine()

# Function to be imported and used by other modules
def search_content(query_text):
    """
    Search for content across all JSON files
    
    Args:
        query_text (str): Text to search for
        
    Returns:
        list: List of matching objects
    """
    return search_engine.search(query_text)

if __name__ == "__main__":
    # Example usage
    query = "tender documents"
    results = search_content(query)
    
    print(f"Found {len(results)} matches for '{query}':")
    for i, result in enumerate(results, 1):
        print(f"\nMatch {i}:")
        print(f"Article Number: {result.get('number', 'N/A')}")
        print(f"Content: {result.get('content', 'N/A')[:200]}...")  # First 200 chars
        print("-" * 80)
