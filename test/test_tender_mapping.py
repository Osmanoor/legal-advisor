import datetime
from dataclasses import dataclass
from enum import Enum, auto
from typing import List, Dict, Optional, Union, Tuple
import pandas as pd
import re
from html_gen import save_html_report

class ProcurementType(Enum):
    """Enum representing different procurement types"""
    GENERAL_COMPETITION = "منافسة عامة"
    LIMITED_COMPETITION = "منافسة محدودة"
    DIRECT_PURCHASE = "الشراء المباشر"
    FRAMEWORK_AGREEMENT = "الاتفاقية الاطارية"
    TWO_STAGE_COMPETITION = "المنافسة على مرحلتين"
    REVERSE_AUCTION = "المزايدة العكسية"
    UNDEFINED = "غير محدد"


class WorkType(Enum):
    """Enum representing different work types"""
    GENERAL_WORK = "جميع الاعمال (جميع المنافسات التي لا تنطبق على الخيارات الأخرى)"
    LIMITED_SUPPLIERS = "محدودية الموردين والمقاولين"
    URGENT_CASES = "الحالات العاجلة"
    CONSULTING_SERVICES = "الخدمات الاستشارية"
    CHARITABLE_LIMITED = "الجمعيات الخيرية/الكيانات الغير هادفة (منافسة محدودة)"
    EXCLUSIVE_WORK = "الاعمال الحصرية المتوفرة لدي متعهد واحد"
    EMERGENCY_CASES = "الحالات الطارئة"
    CHARITABLE_DIRECT = "الجمعيات الخيرية/الكيانات الغير هادفة (شراء مباشر)"
    NATIONAL_SECURITY = "حماية مصالح الامن الوطني"
    UNDEFINED_QUANTITIES = "الحالات التي يتعذر فيها تحديد الكميات/الأصناف/حجم الاعمال او موعد تنفيذها"
    UNDEFINED_SPECS = "الحالات التي يتعذر فيها تحديد المواصفات الفنية والشروط التعاقدية النهائية تحديدا كاملا ودقيقأ"
    COMPETITIVE_GOODS = "السلع التي لها سوق تنافسي فعال ومتوفرة لدي اكثر من مورد"


@dataclass
class WorkTypeGuideline:
    """Guidelines for work types"""
    text: str
    referenced_articles: List[int]


@dataclass
class ProcurementConfig:
    """Configuration for procurement system business rules"""
    
    # Budget thresholds
    DIRECT_PURCHASE_THRESHOLD = 100000
    LIMITED_COMPETITION_THRESHOLD = 500000
    CONTRACT_THRESHOLD = 300000  # Below this, purchase order is used instead of contract
    
    # Document thresholds
    DOUBLE_FILE_THRESHOLD = 5000000
    
    # Bank guarantee thresholds
    INITIAL_GUARANTEE_THRESHOLD = 25000000
    PERFORMANCE_GUARANTEE_THRESHOLD = 5000000
    
    # Default values for "تطبق" (applicable)
    DEFAULT_APPLY_DAYS = 7
    
    # Standard holidays (official holidays)
    STANDARD_HOLIDAYS = [
        datetime.date(2022, 4, 5),
        datetime.date(2022, 5, 7),
        datetime.date(2022, 6, 12),
        datetime.date(2023, 1, 1),
        datetime.date(2023, 4, 5),
        datetime.date(2024, 2, 2)
    ]
    
    # Guidelines for each work type
    WORK_TYPE_GUIDELINES = {
        WorkType.GENERAL_WORK: WorkTypeGuideline(
            text="الضوابط العامة",
            referenced_articles=[]
        ),
        'GENERAL_WORK_500K': WorkTypeGuideline(
            text="اذا تجاوزت العروض مبلغ 500 الف ولم يتم التخفيض, تلغي وتطرح منافسة عامة",
            referenced_articles=[]
        ),
        'GENERAL_WORK_100K': WorkTypeGuideline(
            text="يجوز دعوة مورد واحد او اكثر",
            referenced_articles=[]
        ),
        WorkType.LIMITED_SUPPLIERS: WorkTypeGuideline(
            text="1- نشر الإعلان في المنصة لتأكد من عدم توفر مقاولين او موردين اخرين لمجال الخدمة . اذا ثبث توفر اكثر من 5 موردين تطرح منافسة عامة",
            referenced_articles=[]
        ),
        WorkType.URGENT_CASES: WorkTypeGuideline(
            text="1- ان لا تكون من الاعمال التي يمكن التخطيط لها 2- لاتعد عاجل اذا تباطات الجهة في التنفيذ 3- لا تكون من الاعمال ذات التنفيذ المستمر و لا تتحمل إجراءات المنافسة العامة",
            referenced_articles=[]
        ),
        WorkType.CONSULTING_SERVICES: WorkTypeGuideline(
            text="1- تقديم العروض في مظروفين مالي وفني 2- يمكن طرحها بأسلوب الشراء المباشر اذا توفرت فيها شروط الشراء المباشر (المادة 33)",
            referenced_articles=[33]
        ),
        WorkType.CHARITABLE_LIMITED: WorkTypeGuideline(
            text="1- ان تكون الاعمال التي تقدم داخلة ضمن نشاطها التجاري الذي انشاءت من اجلة. 2- ان تقوم بتنفيذ الاعمال بنفسها",
            referenced_articles=[]
        ),
        WorkType.EXCLUSIVE_WORK: WorkTypeGuideline(
            text="1- لا يوجد لها بديل يمكن الحصول علية من مصادر اخرئ (المادة 46) 2- الحاجة الضرورية لتامين السلع والمشتريات. 3- ان يتم تختيم خطاب الحصرية من الغرفة التجارية عند تقدم اكثر من شركة اثناء الاعلان بوجود خطاب الحصرية يمهل لمدة أسبوع لتقديم الخطاب",
            referenced_articles=[46]
        ),
        WorkType.EMERGENCY_CASES: WorkTypeGuideline(
            text="1- وجود تهديد لسلامة والصحة العامة او الممتلكات او الخسائر (المادة 48) 2- ان لا يترتب عليها استخدام اجراءات المنافسة العامة او المحدودة بسبب طول مدة الاجراءت",
            referenced_articles=[48]
        ),
        WorkType.CHARITABLE_DIRECT: WorkTypeGuideline(
            text="1- ان تكون الاعمال التي تقدم داخلة ضمن نشاطها التجاري الذي انشاءت من اجلة (المادة 47) 2- لا يوجد غيرة يقدم الاعمال والمشتريات المطلوبة",
            referenced_articles=[47]
        ),
        WorkType.NATIONAL_SECURITY: WorkTypeGuideline(
            text="1 لا يمكن معة استخدام المنافسة العامة او المحدودة & اعداد تقرير يلزم الأسباب التي دعتها لاستخدام هذا الأسلوب وتزويد ديوان المراقبة بة",
            referenced_articles=[]
        ),
        WorkType.UNDEFINED_QUANTITIES: WorkTypeGuideline(
            text="1- اذا تعذر تحديد كمية الأصناف او الخدمات او موعد تنفيذها 2-اذا ضهرت الحاجة الى التعاقد على نحو متكرر للحصول على السلع او الخدمات او اذا كان متوقع مستقبلا وجود الحاجة الى شراء سلع او خدمات الالتزام بالتالي اثناء الطرح 1- تحديد نوع الاتفاقية ( مغلقة او مفتوحة) 2- تحديد عدد اطراف الاتفاقية من مقدمي الخدمة .3 - تحديد كمية الاعمال والمشتريات المتوقعة .4- طريقة صرف المقابل المالي .5- الأسعار خلال مدة الاتفاقية . 6- مدة الاتفاقية .7- ان لا تتجاوز الاتفاقية المغلقة 3 سنوات و 4 سنوات للاتفاقية المفتوحة",
            referenced_articles=[]
        ),
        WorkType.UNDEFINED_SPECS: WorkTypeGuideline(
            text="يتم الإعلان عن المرحلة الاولي في البوابة وفقأ لإجراءات المنافسة العامة , تقدم عروض أولية من دون ذكر أسعار العروض, كما يجوز للجهة دون الزم المتقدمين بأسعار استرشاديه على ان يلتزمو في المرحلة الثانية بتثبيت أسعار العروض , يتم الإعلان في البوابة الالكترونية عن العروض المجتازة, تقوم الجهة في المرحلة الثانية بتجهيز وثائق المنافسة ومعايير التقييم, وارسال الدعوات الي اصحاب العروض المجتازة حسب اجراءات المنافسة العامة",
            referenced_articles=[]
        ),
        WorkType.COMPETITIVE_GOODS: WorkTypeGuideline(
            text="1- يتم تحديد وقت بداية ونهاية للمزايدة العكسية 2- ان تقتصر المزايدة على السلع الجاهزة التوفرة في السوق",
            referenced_articles=[]
        )
    }
    
    # Define the 8 standard stages
    STANDARD_STAGES = [
        {
            "name": "مرحلة استلام العروض في المنصة",
            "duration_key": "announcement_period",
            "fallback_key": "review_period",
            "working_days": False,  # Regular days, not working days
            "skip_conditions": []
        },
        {
            "name": "مرحلة فتح العروض",
            "duration": 3,
            "working_days": True,
            "apply_conditions": [
                {"key": "procurement_type", "values": [
                    ProcurementType.GENERAL_COMPETITION,
                    ProcurementType.TWO_STAGE_COMPETITION,
                    ProcurementType.LIMITED_COMPETITION
                ]}
            ],
            "skip_conditions": []
        },
        {
            "name": "مرحلة التقييم الفني",
            "duration": 5,
            "working_days": True,
            "skip_conditions": []
        },
        {
            "name": "لجنة فحص العروض",
            "duration": 9,
            "working_days": True,
            "reduce_conditions": [
                {"key": "procurement_type", "values": [ProcurementType.DIRECT_PURCHASE], "reduce_to": 5}
            ],
            "skip_conditions": []
        },
        {
            "name": "مرحلة لجنة التأهيل",
            "duration": 9,
            "working_days": True,
            "skip_conditions": [
                {"key": "procurement_type", "values": [ProcurementType.DIRECT_PURCHASE]}
            ]
        },
        {
            "name": "مرحلة اصدار خطاب الترسية",
            "duration": 1,
            "working_days": True,
            "skip_conditions": []
        },
        {
            "name": "مرحلة فترة التوقف",
            "duration_key": "performance_guarantee",
            "working_days": True,
            "skip_conditions": []
        },
        {
            "name": "مرحلة التعاقد",
            "duration": 18,
            "working_days": True,
            "reduce_conditions": [
                {"key": "budget", "condition": "less_than", "value": 300000, "reduce_to": 5, 
                 "notes": "تم تقليل المدة لأن المشروع أقل من 300 ألف ريال ويتم الاكتفاء بامر شراء"},
                {"key": "final_guarantee", "values": ["غير مطلوبة"], "reduce_by": 7, 
                 "notes": "تم تقليل المدة لأن الضمان النهائي غير مطلوب"}
            ],
            "skip_conditions": []
        }
    ]


@dataclass
class ProcurementInput:
    """Input data for procurement calculation"""
    work_type: WorkType
    budget: float
    start_date: datetime.date
    project_duration_months: int
    holidays: List[datetime.date] = None


@dataclass
class ProcurementStage:
    """A stage in the procurement process"""
    name: str
    start_date: datetime.date
    end_date: datetime.date
    duration: int
    is_working_days: bool
    notes: str = ""


@dataclass
class ProcurementResult:
    """Result of procurement calculation"""
    procurement_type: ProcurementType
    announcement_period: Union[int, str]
    review_period: Union[int, str]
    required_participants: Union[int, str]
    sme_priority: str
    performance_guarantee: Union[int, str]
    initial_guarantee: str
    final_guarantee: str
    file_structure: str
    implementation_guidelines: str
    referenced_articles: List[int]
    stages: List[ProcurementStage]
    total_duration: int
    
    def get_attr_as_int(self, attr_name: str, default: int = 0) -> int:
        """Get an attribute as integer with fallback to default"""
        value = getattr(self, attr_name, default)
        if isinstance(value, int):
            return value
        
        # Try to extract number from string
        if isinstance(value, str):
            match = re.search(r'(\d+)', value)
            if match:
                return int(match.group(1))
        
        return default


class DateCalculator:
    """Handles date calculations considering working days and holidays"""
    
    @staticmethod
    def add_regular_days(start_date: datetime.date, days: int) -> datetime.date:
        """Add regular calendar days to a date"""
        if isinstance(days, str):
            try:
                days = int(days)
            except ValueError:
                return start_date  # Return original date if days is not a valid number
                
        return start_date + datetime.timedelta(days=days)
    
    @staticmethod
    def add_working_days(start_date: datetime.date, days: int, 
                         holidays: List[datetime.date] = None) -> datetime.date:
        """
        Add working days to a date, skipping weekends and holidays
        Similar to WORKDAY.INTL in Excel
        """
        if holidays is None:
            holidays = []
        
        # Convert to set for faster lookup
        holiday_set = set(holidays)
        
        # Convert string to int if needed
        if isinstance(days, str):
            try:
                days = int(days)
            except ValueError:
                return start_date  # Return original date if days is not a valid number
        
        current_date = start_date
        days_added = 0
        
        while days_added < days:
            current_date += datetime.timedelta(days=1)
            # Skip weekends (Friday and Saturday in Arabic countries)
            if current_date.weekday() < 5 and current_date not in holiday_set:
                days_added += 1
                
        return current_date


class ProcurementCalculator:
    """Main class for procurement calculations"""
    
    def __init__(self, config: ProcurementConfig = None):
        self.config = config or ProcurementConfig()
    
    def extract_numeric_value(self, value: Union[int, str]) -> Union[int, str]:
        """Extract numeric value from string like '7 أيام' -> 7"""
        if isinstance(value, int):
            return value
            
        if isinstance(value, str):
            # Try to find numbers in the string
            match = re.search(r'(\d+)', value)
            if match:
                return int(match.group(1))
        
        return value
    
    def calculate_procurement_type(self, input_data: ProcurementInput) -> ProcurementType:
        """Determine procurement type based on work type and budget"""
        work_type = input_data.work_type
        budget = input_data.budget
        
        # Replicate the E3 formula logic
        if work_type == WorkType.GENERAL_WORK:
            if budget < self.config.DIRECT_PURCHASE_THRESHOLD:
                return ProcurementType.DIRECT_PURCHASE
            elif budget <= self.config.LIMITED_COMPETITION_THRESHOLD:
                return ProcurementType.LIMITED_COMPETITION
            else:
                return ProcurementType.GENERAL_COMPETITION
        
        # Handle specific work types
        work_type_to_procurement = {
            WorkType.LIMITED_SUPPLIERS: ProcurementType.LIMITED_COMPETITION,
            WorkType.URGENT_CASES: ProcurementType.LIMITED_COMPETITION,
            WorkType.CONSULTING_SERVICES: ProcurementType.LIMITED_COMPETITION,
            WorkType.CHARITABLE_LIMITED: ProcurementType.LIMITED_COMPETITION,
            WorkType.EXCLUSIVE_WORK: ProcurementType.DIRECT_PURCHASE,
            WorkType.EMERGENCY_CASES: ProcurementType.DIRECT_PURCHASE,
            WorkType.CHARITABLE_DIRECT: ProcurementType.DIRECT_PURCHASE,
            WorkType.NATIONAL_SECURITY: ProcurementType.DIRECT_PURCHASE,
            WorkType.UNDEFINED_QUANTITIES: ProcurementType.FRAMEWORK_AGREEMENT,
            WorkType.UNDEFINED_SPECS: ProcurementType.TWO_STAGE_COMPETITION,
            WorkType.COMPETITIVE_GOODS: ProcurementType.REVERSE_AUCTION
        }
        
        return work_type_to_procurement.get(work_type, ProcurementType.UNDEFINED)
    
    def get_implementation_guidelines(self, work_type: WorkType, budget: float) -> Tuple[str, List[int]]:
        """Get implementation guidelines based on work type and budget"""
        
        # Special handling for GENERAL_WORK based on budget
        if work_type == WorkType.GENERAL_WORK:
            if budget <= self.config.DIRECT_PURCHASE_THRESHOLD:
                # Use GENERAL_WORK_100K guidelines
                guideline = self.config.WORK_TYPE_GUIDELINES.get('GENERAL_WORK_100K')
                if guideline:
                    return guideline.text, guideline.referenced_articles
            elif budget <= self.config.LIMITED_COMPETITION_THRESHOLD:
                # Use GENERAL_WORK_500K guidelines
                guideline = self.config.WORK_TYPE_GUIDELINES.get('GENERAL_WORK_500K')
                if guideline:
                    return guideline.text, guideline.referenced_articles
        
        # Use standard guidelines for the work type
        guideline = self.config.WORK_TYPE_GUIDELINES.get(work_type)
        if guideline:
            return guideline.text, guideline.referenced_articles
        
        return "لا توجد ضوابط محددة", []
    
    def calculate_announcement_period(self, procurement_type: ProcurementType, 
                                     work_type: WorkType, budget: float) -> Union[int, str]:
        """Calculate announcement period based on procurement type and budget"""
        # Replicate the E4 formula logic
        if procurement_type == ProcurementType.GENERAL_COMPETITION:
            if budget < 5000000:
                return 15
            elif budget < 100000000:
                return 30
            else:
                return 60
        elif procurement_type == ProcurementType.LIMITED_COMPETITION:
            if work_type == WorkType.LIMITED_SUPPLIERS:
                return 20
            elif work_type in [WorkType.URGENT_CASES, WorkType.CONSULTING_SERVICES]:
                return "لم يحدد"
            else:
                return "لم يحدد"
        elif procurement_type == ProcurementType.DIRECT_PURCHASE:
            if work_type == WorkType.EXCLUSIVE_WORK:
                return 10  # Changed from "10 أيام (اعلان)" to numeric 10
            else:
                return "لم يحدد"
        elif procurement_type in [ProcurementType.FRAMEWORK_AGREEMENT, 
                                ProcurementType.TWO_STAGE_COMPETITION,
                                ProcurementType.REVERSE_AUCTION]:
            return 15
        else:
            return "لم يحدد"
    
    def calculate_review_period(self, procurement_type: ProcurementType, 
                               work_type: WorkType, budget: float) -> Union[int, str]:
        """Calculate review period based on procurement type and budget"""
        # Replicate the E5 formula logic but return numeric values when possible
        if procurement_type == ProcurementType.GENERAL_COMPETITION:
            return self.config.DEFAULT_APPLY_DAYS  # تطبق (Applicable) -> default value
        elif procurement_type == ProcurementType.LIMITED_COMPETITION:
            if work_type == WorkType.GENERAL_WORK and budget <= 500000:
                return 7  # Changed from "7 أيام" to numeric 7
            elif work_type == WorkType.CONSULTING_SERVICES:
                return 7  # Changed from "7 أيام" to numeric 7
            else:
                return 5  # Default value for "حسب الحالة" (case-by-case)
        elif procurement_type == ProcurementType.DIRECT_PURCHASE:
            if work_type == WorkType.GENERAL_WORK:
                return 7  # Changed from "7 أيام" to numeric 7
            else:
                return 5  # Default value for "حسب الحالة" (case-by-case)
        elif procurement_type in [ProcurementType.FRAMEWORK_AGREEMENT, 
                                ProcurementType.TWO_STAGE_COMPETITION,
                                ProcurementType.REVERSE_AUCTION]:
            return self.config.DEFAULT_APPLY_DAYS  # تطبق (Applicable) -> default value
        else:
            return 5  # Default value for "حسب الحالة" (case-by-case)
    
    def calculate_participants(self, procurement_type: ProcurementType, 
                              work_type: WorkType, budget: float) -> Union[int, str]:
        """Calculate required number of participants"""
        # Replicate the E6 formula logic
        if procurement_type == ProcurementType.LIMITED_COMPETITION:
            if work_type == WorkType.GENERAL_WORK and budget <= 500000:
                return 5  # Changed from "5 شركات" to numeric 5
            elif work_type == WorkType.LIMITED_SUPPLIERS:
                return "العدد المحدود"
            elif work_type == WorkType.URGENT_CASES:
                return "اكبر عدد من المتنافسين"
            elif work_type == WorkType.CONSULTING_SERVICES:
                return 5  # Changed from "5 مكاتب على الأقل" to numeric 5
            elif work_type == WorkType.CHARITABLE_LIMITED:
                return "اكثر من كيان غير ربحي"
            else:
                return "لم يحدد"
        else:
            return "لم يحدد"
    
    def calculate_sme_priority(self, procurement_type: ProcurementType, 
                              work_type: WorkType, budget: float) -> str:
        """Calculate if SME priority applies"""
        # Replicate the E8 formula logic
        if ((procurement_type == ProcurementType.LIMITED_COMPETITION and 
             work_type == WorkType.GENERAL_WORK and budget <= 500000) or
            (procurement_type == ProcurementType.DIRECT_PURCHASE and 
             work_type == WorkType.GENERAL_WORK and budget < 100000)):
            return "الشركات الصغيرة والمتوسطة"
        else:
            return "لم يحدد"
    
    def calculate_performance_guarantee(self, procurement_type: ProcurementType, budget: float) -> Union[int, str]:
        """Calculate if performance guarantee is required"""
        # Replicate the E9 formula logic with numeric values
        if procurement_type in [ProcurementType.DIRECT_PURCHASE, 
                              ProcurementType.FRAMEWORK_AGREEMENT, 
                              ProcurementType.REVERSE_AUCTION]:
            return 0  # "لا ينطبق" -> 0 for not applicable
        else:
            return 5 if budget >= 5000000 else 0
    
    def calculate_initial_guarantee(self, budget: float) -> str:
        """Calculate if initial guarantee is required"""
        # Replicate the E10 formula logic
        return "مطلوبة" if budget >= 25000000 else "غير مطلوبة"
    
    def calculate_final_guarantee(self, budget: float, project_duration: int) -> str:
        """Calculate if final guarantee is required"""
        # Replicate the E11 formula logic
        return "مطلوبة" if (budget >= 5000000 or project_duration > 12) else "غير مطلوبة"
    
    def calculate_file_structure(self, budget: float) -> str:
        """Calculate required file structure"""
        # Replicate the E13 formula logic
        return "ملفين" if budget >= 5000000 else "ملف واحد"
    
    def check_stage_conditions(self, stage_info: Dict, result: ProcurementResult, input_data: ProcurementInput) -> Tuple[bool, int, str]:
        """
        Check if a stage should be skipped or have its duration reduced
        
        Returns:
            Tuple of (include_stage, adjusted_duration, notes)
        """
        # Check skip conditions
        if "skip_conditions" in stage_info:
            for condition in stage_info.get("skip_conditions", []):
                if "key" in condition and "values" in condition:
                    key = condition["key"]
                    values = condition["values"]
                    
                    if key == "procurement_type" and result.procurement_type in values:
                        return False, 0, "تم تجاوز هذه المرحلة بسبب نوع المنافسة"
        
        # Get base duration
        duration = stage_info.get("duration", 0)
        notes = ""
        
        # Get duration from key if specified
        if "duration_key" in stage_info:
            duration = result.get_attr_as_int(stage_info["duration_key"], 0)
            
            # If duration is still 0 and there's a fallback key, use it
            if duration == 0 and "fallback_key" in stage_info:
                duration = result.get_attr_as_int(stage_info["fallback_key"], 0)
        
        # Check apply conditions (if stage only applies to certain procurement types)
        if "apply_conditions" in stage_info:
            for condition in stage_info.get("apply_conditions", []):
                if "key" in condition and "values" in condition:
                    key = condition["key"]
                    values = condition["values"]
                    
                    if key == "procurement_type" and result.procurement_type not in values:
                        return False, 0, "تم تجاوز هذه المرحلة لأنها لا تنطبق على نوع المنافسة"
        
        # Check reduce conditions
        if "reduce_conditions" in stage_info:
            for condition in stage_info.get("reduce_conditions", []):
                if "key" in condition:
                    key = condition["key"]
                    
                    # Check budget-based conditions
                    if key == "budget" and "condition" in condition and "value" in condition:
                        condition_type = condition["condition"]
                        value = condition["value"]
                        
                        if condition_type == "less_than" and input_data.budget < value:
                            if "reduce_to" in condition:
                                duration = condition["reduce_to"]
                            elif "reduce_by" in condition:
                                duration -= condition["reduce_by"]
                            notes = condition.get("notes", "تم تقليل المدة")
                    
                    # Check procurement type conditions
                    elif key == "procurement_type" and "values" in condition:
                        values = condition["values"]
                        if result.procurement_type in values:
                            if "reduce_to" in condition:
                                duration = condition["reduce_to"]
                            elif "reduce_by" in condition:
                                duration -= condition["reduce_by"]
                            notes = condition.get("notes", "تم تقليل المدة")
                    
                    # Check final guarantee condition
                    elif key == "final_guarantee" and "values" in condition:
                        values = condition["values"]
                        if result.final_guarantee in values:
                            if "reduce_to" in condition:
                                duration = condition["reduce_to"]
                            elif "reduce_by" in condition:
                                duration -= condition["reduce_by"]
                            notes = condition.get("notes", "تم تقليل المدة")
        
        return True, duration, notes
    
    def generate_timeline(self, input_data: ProcurementInput, 
                          result: ProcurementResult) -> List[ProcurementStage]:
        """Generate timeline for procurement process"""
        date_calculator = DateCalculator()
        stages = []
        
        # Combine user-provided holidays with standard holidays
        all_holidays = list(self.config.STANDARD_HOLIDAYS)
        if input_data.holidays:
            all_holidays.extend(input_data.holidays)
        
        current_date = input_data.start_date
        
        # Create stages with calculated dates
        for stage_info in self.config.STANDARD_STAGES:
            # Check if stage should be included and get adjusted duration
            include_stage, duration, notes = self.check_stage_conditions(
                stage_info, result, input_data
            )
            
            if not include_stage:
                continue
            
            # Determine if we use working days or regular days
            is_working_days = stage_info.get("working_days", True)
            
            # Calculate end date
            if is_working_days:
                end_date = date_calculator.add_working_days(
                    current_date, duration, all_holidays
                )
            else:
                end_date = date_calculator.add_regular_days(
                    current_date, duration
                )
            
            # Create stage
            stages.append(ProcurementStage(
                name=stage_info["name"],
                start_date=current_date,
                end_date=end_date,
                duration=duration,
                is_working_days=is_working_days,
                notes=notes
            ))
            
            # Update current date for next stage
            current_date = end_date
        
        return stages
    
    def calculate(self, input_data: ProcurementInput) -> ProcurementResult:
        """Calculate complete procurement information"""
        # Calculate procurement type
        procurement_type = self.calculate_procurement_type(input_data)
        
        # Calculate other requirements
        announcement_period = self.calculate_announcement_period(
            procurement_type, input_data.work_type, input_data.budget
        )
        review_period = self.calculate_review_period(
            procurement_type, input_data.work_type, input_data.budget
        )
        participants = self.calculate_participants(
            procurement_type, input_data.work_type, input_data.budget
        )
        sme_priority = self.calculate_sme_priority(
            procurement_type, input_data.work_type, input_data.budget
        )
        performance_guarantee = self.calculate_performance_guarantee(
            procurement_type, input_data.budget
        )
        initial_guarantee = self.calculate_initial_guarantee(input_data.budget)
        final_guarantee = self.calculate_final_guarantee(
            input_data.budget, input_data.project_duration_months
        )
        file_structure = self.calculate_file_structure(input_data.budget)
        
        # Get implementation guidelines
        implementation_guidelines, referenced_articles = self.get_implementation_guidelines(
            input_data.work_type, input_data.budget
        )
        
        # Create basic result
        result = ProcurementResult(
            procurement_type=procurement_type,
            announcement_period=announcement_period,
            review_period=review_period,
            required_participants=participants,
            sme_priority=sme_priority,
            performance_guarantee=performance_guarantee,
            initial_guarantee=initial_guarantee,
            final_guarantee=final_guarantee,
            file_structure=file_structure,
            implementation_guidelines=implementation_guidelines,
            referenced_articles=referenced_articles,
            stages=[],
            total_duration=0
        )
        
        # Generate timeline
        result.stages = self.generate_timeline(input_data, result)
        
        # Calculate total duration (calendar days between start of first stage and end of last stage)
        if result.stages:
            first_stage = result.stages[0]
            last_stage = result.stages[-1]
            total_days = (last_stage.end_date - first_stage.start_date).days
            result.total_duration = total_days
        else:
            result.total_duration = 0
        
        return result


class ProcurementSystem:
    """Main interface for the procurement system"""
    
    def __init__(self, config_file: str = None):
        # Load configuration from file if provided
        self.config = ProcurementConfig()
        self.calculator = ProcurementCalculator(self.config)
    
    def process_input(self, work_type: str, budget: float, start_date: str,
                     project_duration: int, holidays: List[str] = None) -> Dict:
        """
        Process user input and return procurement information
        
        Args:
            work_type: Type of work (in Arabic)
            budget: Budget amount
            start_date: Start date string (YYYY-MM-DD)
            project_duration: Project duration in months
            holidays: List of holiday dates (YYYY-MM-DD)
            
        Returns:
            Dictionary with procurement information
        """
        # Convert string inputs to proper types
        start_date_obj = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        holiday_dates = []
        
        if holidays:
            holiday_dates = [
                datetime.datetime.strptime(date, "%Y-%m-%d").date() 
                for date in holidays
            ]
        
        # Map string work type to enum
        try:
            work_type_enum = WorkType(work_type)
        except ValueError:
            # Default to general work if not found
            work_type_enum = WorkType.GENERAL_WORK
        
        # Create input object
        input_data = ProcurementInput(
            work_type=work_type_enum,
            budget=budget,
            start_date=start_date_obj,
            project_duration_months=project_duration,
            holidays=holiday_dates
        )
        
        # Calculate result
        result = self.calculator.calculate(input_data)
        
        # Convert result to dictionary for easy serialization
        return self._result_to_dict(result)
    
    def _result_to_dict(self, result: ProcurementResult) -> Dict:
        """Convert result to dictionary for output"""
        stages_dict = []
        
        for stage in result.stages:
            stages_dict.append({
                "name": stage.name,
                "start_date": stage.start_date.strftime("%Y-%m-%d"),
                "end_date": stage.end_date.strftime("%Y-%m-%d"),
                "duration": stage.duration,
                "is_working_days": stage.is_working_days,
                "notes": stage.notes
            })
        
        return {
            "procurement_type": result.procurement_type.value,
            "announcement_period": result.announcement_period,
            "review_period": result.review_period,
            "required_participants": result.required_participants,
            "sme_priority": result.sme_priority,
            "performance_guarantee": result.performance_guarantee,
            "initial_guarantee": result.initial_guarantee,
            "final_guarantee": result.final_guarantee,
            "file_structure": result.file_structure,
            "implementation_guidelines": result.implementation_guidelines,
            "referenced_articles": result.referenced_articles,
            "stages": stages_dict,
            "total_duration": result.total_duration
        }


# Example usage
if __name__ == "__main__":
    procurement_system = ProcurementSystem()
    
    # Example input
    result = procurement_system.process_input(
        work_type="جميع الاعمال (جميع المنافسات التي لا تنطبق على الخيارات الأخرى)",
        budget=600000,
        start_date="2025-03-01",
        project_duration=12,
        holidays=["2025-05-01", "2025-05-02"]  # Example holidays
    )
    
    # Print result
    import json
    save_html_report(result, "procurement_report.html", "مجتمع مشترون")
    with open("output.json", "w", encoding='utf-8') as f:
        json.dump(result,f, indent=2, ensure_ascii=False)
