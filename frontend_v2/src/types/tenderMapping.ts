// Updated src/types/tenderMapping.ts

export interface WorkType {
  id: string;
  name: string;
}

export interface TenderStage {
  name: string;
  start_date: string;
  end_date: string;
  duration: number;
  is_working_days: boolean;
  notes: string;
}

export interface TenderCalculationResult {
  procurement_type: string;
  announcement_period: string | number;
  review_period: string | number;
  required_participants: string;
  sme_priority: string;
  performance_guarantee: string | number;
  initial_guarantee: string;
  final_guarantee: string;
  file_structure: string;
  implementation_guidelines: string;
  referenced_articles: number[];
  referenced_articles_data: any[];
  stages: TenderStage[];
  total_duration: number;
}

// Keep other existing interfaces if needed
export interface TenderCategory {
  category: string;
  options: string[];
}

export interface MappingRule {
  conditions: Record<string, string>;
  matched_tender_type: string;
  attributes: Record<string, string>;
}