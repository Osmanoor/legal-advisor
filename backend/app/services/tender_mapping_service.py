# app/services/tender_mapping_service.py

import os
import json
from typing import Dict, List, Any, Optional
from dataclasses import asdict
from app.config import Config

from app.models.tender_mapping import (
    TenderAttribute, 
    TenderType, 
    MappingRule, 
    TenderCategoryOptions,
    TenderMappingResult
)

class TenderMappingService:
    def __init__(self):
        """Initialize the tender mapping service"""
        self.data_dir = Config.TENDER_MAPPING_DIR
        self.options_file = os.path.join(self.data_dir, 'options.json')
        self.mapping_rules_file = os.path.join(self.data_dir, 'mapping_rules.json')
        
        # Create directory if it doesn't exist
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize default data if files don't exist
        self._initialize_default_data()
        
        # Load data
        self.options = self._load_options()
        self.mapping_rules = self._load_mapping_rules()
    
    def _initialize_default_data(self):
        """Initialize default data if files don't exist"""
        # Default options
        if not os.path.exists(self.options_file):
            default_options = {
                "الجهات الحكومية": [
                    "وزارة التعليم",
                    "وزارة الصحة",
                    "وزارة الإسكان",
                    "وزارة النقل",
                    "البلديات"
                ],
                "أنواع المنتجات والخدمات": [
                    "معدات تقنية",
                    "مواد بناء",
                    "أدوية ومستلزمات طبية",
                    "خدمات استشارية",
                    "معدات كهربائية"
                ],
                "الميزانية": [
                    "< 500,000 ريال",
                    "500,000 - 1,000,000 ريال",
                    "1,000,000 - 5,000,000 ريال",
                    "5,000,000 - 10,000,000 ريال",
                    "> 10,000,000 ريال"
                ],
                "المدة الزمنية": [
                    "أقل من شهر",
                    "1 - 3 أشهر",
                    "3 - 6 أشهر",
                    "6 - 12 شهرًا",
                    "أكثر من سنة"
                ],
                "شروط الدفع": [
                    "دفعة مقدمة",
                    "دفعات مجدولة",
                    "دفعة واحدة بعد التنفيذ",
                    "دفعات حسب الإنجاز"
                ],
                "تصنيف الموردين": [
                    "موردون معتمدون",
                    "شركات مقاولات معتمدة",
                    "موردون محليون",
                    "شركات استشارية"
                ]
            }
            
            with open(self.options_file, 'w', encoding='utf-8') as f:
                json.dump(default_options, f, ensure_ascii=False, indent=2)
        
        # Default mapping rules
        if not os.path.exists(self.mapping_rules_file):
            default_mapping_rules = {
                "mapping_rules": [
                    {
                        "conditions": {
                            "الجهات الحكومية": "وزارة التعليم",
                            "أنواع المنتجات والخدمات": "معدات تقنية",
                            "الميزانية": "< 500,000 ريال",
                            "المدة الزمنية": "1 - 3 أشهر",
                            "تصنيف الموردين": "موردون معتمدون"
                        },
                        "matched_tender_type": "منافسة توريد معدات تقنية",
                        "attributes": {
                            "فترة التوريد": "30 يومًا",
                            "التصنيف المطلوب": "موردون معتمدون في قطاع تقنية المعلومات",
                            "نظام الدفع": "دفعة واحدة بعد التنفيذ"
                        }
                    },
                    {
                        "conditions": {
                            "الجهات الحكومية": "وزارة الإسكان",
                            "أنواع المنتجات والخدمات": "مواد بناء",
                            "الميزانية": "5,000,000 - 10,000,000 ريال",
                            "المدة الزمنية": "6 - 12 شهرًا",
                            "تصنيف الموردين": "شركات مقاولات معتمدة"
                        },
                        "matched_tender_type": "منافسة مقاولات وإنشاءات",
                        "attributes": {
                            "فترة التنفيذ": "12 شهرًا",
                            "نظام الدفع": "دفعات حسب الإنجاز",
                            "متطلبات التأهيل": "تصنيف درجة أولى في المقاولات"
                        }
                    },
                    {
                        "conditions": {
                            "الجهات الحكومية": "وزارة الصحة",
                            "أنواع المنتجات والخدمات": "أدوية ومستلزمات طبية",
                            "الميزانية": "1,000,000 - 5,000,000 ريال",
                            "المدة الزمنية": "3 - 6 أشهر",
                            "تصنيف الموردين": "موردون معتمدون"
                        },
                        "matched_tender_type": "منافسة توريد مستلزمات طبية",
                        "attributes": {
                            "فترة التوريد": "90 يومًا",
                            "التصنيف المطلوب": "موردون معتمدون في القطاع الصحي",
                            "نظام الدفع": "دفعات مجدولة"
                        }
                    },
                    {
                        "conditions": {
                            "الجهات الحكومية": "وزارة النقل",
                            "أنواع المنتجات والخدمات": "خدمات استشارية",
                            "الميزانية": "1,000,000 - 5,000,000 ريال",
                            "المدة الزمنية": "6 - 12 شهرًا",
                            "تصنيف الموردين": "شركات استشارية"
                        },
                        "matched_tender_type": "منافسة خدمات استشارية",
                        "attributes": {
                            "فترة التنفيذ": "9 أشهر",
                            "متطلبات التأهيل": "خبرة سابقة في مشاريع مماثلة",
                            "نظام الدفع": "دفعات حسب الإنجاز"
                        }
                    },
                    {
                        "conditions": {
                            "الجهات الحكومية": "البلديات",
                            "أنواع المنتجات والخدمات": "معدات كهربائية",
                            "الميزانية": "500,000 - 1,000,000 ريال",
                            "المدة الزمنية": "1 - 3 أشهر",
                            "تصنيف الموردين": "موردون محليون"
                        },
                        "matched_tender_type": "منافسة توريد معدات بلدية",
                        "attributes": {
                            "فترة التوريد": "45 يومًا",
                            "نظام الدفع": "دفعة واحدة بعد التنفيذ",
                            "متطلبات إضافية": "تقديم عينات للفحص قبل التوريد"
                        }
                    }
                ]
            }
            
            with open(self.mapping_rules_file, 'w', encoding='utf-8') as f:
                json.dump(default_mapping_rules, f, ensure_ascii=False, indent=2)
    
    def _load_options(self) -> Dict[str, List[str]]:
        """Load options from file"""
        with open(self.options_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _load_mapping_rules(self) -> List[MappingRule]:
        """Load mapping rules from file"""
        with open(self.mapping_rules_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return [MappingRule(**rule) for rule in data['mapping_rules']]
    
    def get_categories(self) -> List[TenderCategoryOptions]:
        """Get all categories and their options"""
        categories = []
        for category, options in self.options.items():
            categories.append(TenderCategoryOptions(
                category=category,
                options=options
            ))
        return categories
    
    def _calculate_match_score(self, rule: MappingRule, inputs: Dict[str, str]) -> float:
        """
        Calculate how well a rule matches the input
        Returns a score between 0 and 1, where 1 is a perfect match
        """
        matched_conditions = 0
        total_conditions = len(rule.conditions)
        
        for condition_key, condition_value in rule.conditions.items():
            if condition_key in inputs and inputs[condition_key] == condition_value:
                matched_conditions += 1
        
        return matched_conditions / total_conditions if total_conditions > 0 else 0
    
    def map_tender_type(self, inputs: Dict[str, str], threshold: float = 0.2) -> TenderMappingResult:
        """
        Map inputs to the most suitable tender type
        
        Args:
            inputs: Dict of selected category values
            threshold: Minimum score to consider a match
            
        Returns:
            TenderMappingResult: Result containing matched tender type and score
        """
        # Calculate match scores for all rules
        rule_scores = []
        for rule in self.mapping_rules:
            score = self._calculate_match_score(rule, inputs)
            if score >= threshold:
                rule_scores.append((rule, score))
        
        # Sort by score in descending order
        rule_scores.sort(key=lambda x: x[1], reverse=True)
        
        if not rule_scores:
            # No matches found
            return TenderMappingResult(
                matched_tender_type=TenderType(
                    name="غير محدد",
                    attributes=[],
                    description="لم يتم العثور على نوع منافسة مناسب للمعايير المحددة"
                ),
                confidence_score=0,
                message="لم يتم العثور على نوع منافسة مناسب"
            )
        
        # Get the best match
        best_rule, best_score = rule_scores[0]
        
        # Create result
        main_result = TenderType(
            name=best_rule.matched_tender_type,
            attributes=[
                TenderAttribute(name=key, value=value) 
                for key, value in best_rule.attributes.items()
            ]
        )
        
        # Get alternative matches
        alternatives = []
        for rule, score in rule_scores[1:3]:  # Get top 2 alternatives if available
            alternatives.append(
                TenderType(
                    name=rule.matched_tender_type,
                    attributes=[
                        TenderAttribute(name=key, value=value) 
                        for key, value in rule.attributes.items()
                    ]
                )
            )
        
        # Generate a message based on the match quality
        message = "تم العثور على منافسة مناسبة"
        if best_score < 0.7:
            message = "تم العثور على منافسة قد تكون مناسبة، ولكن درجة التطابق منخفضة"
        
        return TenderMappingResult(
            matched_tender_type=main_result,
            confidence_score=best_score,
            alternative_types=alternatives if alternatives else None,
            message=message
        )
    
    def save_mapping_rule(self, rule: MappingRule) -> bool:
        """
        Save a new mapping rule
        
        Args:
            rule: The mapping rule to save
            
        Returns:
            bool: True if successfully saved, False otherwise
        """
        try:
            # Load current rules
            with open(self.mapping_rules_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add new rule
            data['mapping_rules'].append({
                "conditions": rule.conditions,
                "matched_tender_type": rule.matched_tender_type,
                "attributes": rule.attributes
            })
            
            # Save updated rules
            with open(self.mapping_rules_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            # Reload rules
            self.mapping_rules = self._load_mapping_rules()
            
            return True
        except Exception as e:
            print(f"Error saving mapping rule: {str(e)}")
            return False