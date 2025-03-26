# generate_journey_data.py
import os
import json
import random
from datetime import datetime, timedelta

# Base directory
data_dir = 'backend/data/journey'

# Ensure directory exists
os.makedirs(data_dir, exist_ok=True)

# Level names and descriptions
levels = [
    {
        "id": "1",
        "name": "Introduction to Procurement",
        "description": "Basic concepts and principles of government procurement processes.",
        "order": 1
    },
    {
        "id": "2",
        "name": "Procurement Planning",
        "description": "Strategic planning and needs assessment for government procurement projects.",
        "order": 2
    },
    {
        "id": "3",
        "name": "Tender Preparation",
        "description": "Developing specifications, requirements, and tender documents.",
        "order": 3
    },
    {
        "id": "4",
        "name": "Bid Evaluation",
        "description": "Methods and criteria for evaluating bids and selecting suppliers.",
        "order": 4
    },
    {
        "id": "5",
        "name": "Contract Management",
        "description": "Monitoring contract performance and handling disputes and amendments.",
        "order": 5
    }
]

# Create Arabic versions
levels_ar = [
    {
        "id": "1",
        "name": "مقدمة في المشتريات",
        "description": "المفاهيم والمبادئ الأساسية لعمليات المشتريات الحكومية.",
        "order": 1
    },
    {
        "id": "2",
        "name": "التخطيط للمشتريات",
        "description": "التخطيط الاستراتيجي وتقييم الاحتياجات لمشاريع المشتريات الحكومية.",
        "order": 2
    },
    {
        "id": "3",
        "name": "إعداد المناقصات",
        "description": "تطوير المواصفات والمتطلبات ومستندات المناقصة.",
        "order": 3
    },
    {
        "id": "4",
        "name": "تقييم العطاءات",
        "description": "طرق ومعايير تقييم العطاءات واختيار الموردين.",
        "order": 4
    },
    {
        "id": "5",
        "name": "إدارة العقود",
        "description": "مراقبة أداء العقود والتعامل مع النزاعات والتعديلات.",
        "order": 5
    }
]

# Sample resource types
resource_types = ["pdf", "docx", "pptx", "xlsx", "txt"]

# Create level directories and info files
for level in levels_ar:
    level_dir = os.path.join(data_dir, level["id"])
    os.makedirs(level_dir, exist_ok=True)
    
    # Create info.json
    with open(os.path.join(level_dir, 'info.json'), 'w', encoding='utf-8') as f:
        json.dump(level, f, ensure_ascii=False, indent=2)
    
    # Create sample resources
    for i in range(1, 3):  # 2 resources per level
        resource_type = random.choice(resource_types)
        resource_name = f"resource_{i}.{resource_type}"
        resource_path = os.path.join(level_dir, resource_name)
        
        # Create a sample content for the resource
        with open(resource_path, 'w', encoding='utf-8') as f:
            f.write(f"Sample content for {resource_name} in level {level['id']}\n")
            f.write(f"This is a {resource_type} file for {level['name']}\n")
            f.write("Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n")
            
        print(f"Created {resource_path}")

print(f"Journey data generated in {data_dir}")


# Print Arabic versions for reference
print("\nArabic translations for reference:")
for level in levels_ar:
    print(f"Level {level['id']}: {level['name']} - {level['description']}")