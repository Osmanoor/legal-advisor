import os
import json
import requests
import shutil

# Create test journey structure
def setup_test_journey():
    # Create base directory
    journey_root = os.path.join('..','backend','data', 'journey')
    os.makedirs(journey_root, exist_ok=True)
    
    # Create level 1
    level1_path = os.path.join(journey_root, '1')
    os.makedirs(level1_path, exist_ok=True)
    
    # Create level 1 info.json
    level1_info = {
        "name": "Getting Started",
        "description": "This level covers the basics you need to know to get started.",
        "order": 1
    }
    with open(os.path.join(level1_path, 'info.json'), 'w') as f:
        json.dump(level1_info, f)
    
    # Create level 1 resources
    with open(os.path.join(level1_path, 'intro.txt'), 'w') as f:
        f.write("This is an introduction to the journey.")
    
    # Create level 2
    level2_path = os.path.join(journey_root, '2')
    os.makedirs(level2_path, exist_ok=True)
    
    # Create level 2 info.json
    level2_info = {
        "name": "Intermediate Concepts",
        "description": "Take your skills to the next level with these resources.",
        "order": 2
    }
    with open(os.path.join(level2_path, 'info.json'), 'w') as f:
        json.dump(level2_info, f)
    
    # Create level 2 resources
    with open(os.path.join(level2_path, 'guide.txt'), 'w') as f:
        f.write("This is a comprehensive guide for intermediate users.")

# Test API endpoints
def test_journey_api():
    # Setup test data
    setup_test_journey()
    
    base_url = "http://localhost:8080"
    
    # Test get all levels
    response = requests.get(f"{base_url}/api/journey/levels")
    print("Get all levels response:", response.status_code)
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) >= 2
    
    # Test get level resources
    response = requests.get(f"{base_url}/api/journey/levels/1")
    print("\nGet level resources response:", response.status_code)
    print(response.json())
    assert response.status_code == 200
    assert 'resources' in response.json()
    assert len(response.json()['resources']) >= 1
    
    # Test view resource
    response = requests.get(f"{base_url}/api/journey/levels/1/resources/intro.txt/view")
    print("\nView resource response:", response.status_code)
    print(response.json().keys())
    assert response.status_code == 200
    assert 'content' in response.json()
    
    # Test download resource
    response = requests.get(f"{base_url}/api/journey/levels/1/resources/intro.txt/download")
    print("\nDownload resource response:", response.status_code)
    assert response.status_code == 200
    assert response.headers['Content-Type'] == 'text/plain; charset=utf-8'

if __name__ == "__main__":
    test_journey_api()