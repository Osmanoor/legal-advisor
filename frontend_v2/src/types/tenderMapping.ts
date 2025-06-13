// src/types/tenderMapping.ts

export interface WorkType {
  id: string;
  name: string;
}

// Represents a single stage in the procurement timeline
export interface TenderStage {
  id: string; // Using name as ID if no unique ID from API
  name: string;
  start_date: string; // ISO format string
  end_date: string;   // ISO format string
  duration: number;
  is_working_days: boolean;
  notes?: string | null;
  original_duration?: number;
}

// Represents a key-value pair for the "Competition Details" tab
export interface TenderDetail {
  key: string;
  label: string;
  value: string;
  icon?: string;
}

// Represents a regulation/source for the "General Regulations" tab
export interface TenderRegulation {
  id: string; // Using content as ID if no unique ID from API
  type: 'system' | 'regulation';
  content: string;
  summary: string;
}

// The main result object from the API after calculation
// --- FIX: Added missing properties from API response ---
export interface TenderCalculationResult {
  report_title?: string; // Make optional if not always present
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
  regulations_summary: string[];
  regulations_sources: TenderRegulation[];
}