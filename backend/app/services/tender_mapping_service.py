# app/services/tender_mapping_service.py

import os
import json
import datetime
from typing import Dict, List, Any, Optional

class TenderMappingService:
    def __init__(self):
        """Initialize the tender mapping service"""
        self.data_dir = os.path.join('data', 'tender_mapping')
        self.articles_file = os.path.join(self.data_dir, 'final_ar.json')
        
        # Create directory if it doesn't exist
        os.makedirs(self.data_dir, exist_ok=True)
    
    def get_work_types(self) -> List[Dict[str, str]]:
        """Get available work types for dropdown"""
        from app.ProcurementCalculator import WorkType
        
        work_types = []
        for work_type in WorkType:
            work_types.append({
                "id": work_type.name,
                "name": work_type.value
            })
        
        return work_types
    
    def calculate_procurement(self, data: Dict) -> Dict:
        """
        Calculate procurement information based on input data
        
        Args:
            data: Dictionary containing work_type, budget, start_date, and project_duration
            
        Returns:
            Dictionary with calculated procurement information
        """
        try:
            # Extract input values
            work_type = data.get('work_type')
            budget = float(data.get('budget', 0))
            start_date_str = data.get('start_date')
            project_duration = int(data.get('project_duration', 0))
            holidays = data.get('holidays', [])
            
            # Import the necessary classes from the implementation
            from app.ProcurementCalculator import ProcurementSystem
            
            # Initialize procurement system
            procurement_system = ProcurementSystem(articles_file=self.articles_file)
            
            # Process the input
            result = procurement_system.process_input(
                work_type=work_type,
                budget=budget,
                start_date=start_date_str,
                project_duration=project_duration,
                holidays=holidays
            )
            
            return result
            
        except Exception as e:
            print(f"Error calculating procurement: {str(e)}")
            return {"error": str(e)}