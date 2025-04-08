import requests
import json
from datetime import datetime, timedelta
import sys

# Server URL
BASE_URL = "http://localhost:8080/api/tender-mapping"

def get_work_types():
    """Test getting work types for dropdown"""
    try:
        response = requests.get(f"{BASE_URL}/work-types")
        
        if response.status_code == 200:
            work_types = response.json()
            print("✅ Successfully fetched work types")
            print(f"Found {len(work_types)} work types:")
            for i, work_type in enumerate(work_types[:3], 1):
                print(f"  {i}. {work_type['name']} (ID: {work_type['id']})")
            if len(work_types) > 3:
                print(f"  ... and {len(work_types) - 3} more")
            
            return work_types
        else:
            print(f"❌ Failed to get work types: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error getting work types: {str(e)}")
        return None

def test_calculate_procurement(work_type, budget, start_date=None, project_duration=6):
    """Test calculating procurement details with specified parameters"""
    if start_date is None:
        # Use tomorrow as the default start date
        start_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
    data = {
        "work_type": work_type,
        "budget": budget,
        "start_date": start_date,
        "project_duration": project_duration,
        "holidays": [] # Optional list of holiday dates
    }
    
    print(f"\nTesting procurement calculation with:")
    print(f"  Work Type: {work_type}")
    print(f"  Budget: {budget:,} SAR")
    print(f"  Start Date: {start_date}")
    print(f"  Project Duration: {project_duration} months")
    
    try:
        response = requests.post(
            f"{BASE_URL}/calculate", 
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Successfully calculated procurement details")
            print(f"Procurement Type: {result['procurement_type']}")
            print(f"Total Duration: {result['total_duration']} days")
            print(f"Number of Stages: {len(result['stages'])}")
            
            # Print some details about stages
            print("\nStages:")
            for i, stage in enumerate(result['stages'], 1):
                print(f"  {i}. {stage['name']}: {stage['start_date']} to {stage['end_date']} ({stage['duration']} days)")
            
            # Print referenced articles if any
            if result.get('referenced_articles'):
                print(f"\nReferenced articles: {result['referenced_articles']}")
            
            # Save the result to a JSON file for inspection
            filename = f"procurement_result_{start_date}_{budget}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            print(f"\nFull result saved to {filename}")
            
            return result
        else:
            print(f"❌ Failed to calculate procurement: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error calculating procurement: {str(e)}")
        return None

def main():
    print("Testing Tender Mapping API...")
    
    # Test getting work types
    work_types = get_work_types()
    
    if not work_types:
        print("Couldn't fetch work types. Exiting.")
        sys.exit(1)
    
    # Get a work type for testing
    consulting_services = None
    general_work = None
    
    for work_type in work_types:
        if "استشارية" in work_type['name']:
            consulting_services = work_type['name']
        if "جميع الاعمال" in work_type['name']:
            general_work = work_type['name']
    
    # Test with consulting services - high budget
    if consulting_services:
        test_calculate_procurement(
            work_type=consulting_services,
            budget=6000000,
            project_duration=12
        )
    
    # Test with general work - low budget
    if general_work:
        test_calculate_procurement(
            work_type=general_work,
            budget=50000,
            project_duration=3
        )
    
    # Test with general work - medium budget
    if general_work:
        test_calculate_procurement(
            work_type=general_work,
            budget=450000,
            project_duration=6
        )
    
    print("\nAPI testing completed.")

if __name__ == "__main__":
    main()