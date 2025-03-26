// src/types/tenderMapping.ts
export interface TenderCategory {
    category: string;
    options: string[];
  }
  
  export interface TenderAttribute {
    name: string;
    value: string;
  }
  
  export interface TenderType {
    name: string;
    attributes: TenderAttribute[];
    description?: string;
  }
  
  export interface TenderMappingResult {
    matched_tender_type: TenderType;
    confidence_score: number;
    alternative_types?: TenderType[];
    message?: string;
  }
  
  export interface MappingRule {
    conditions: Record<string, string>;
    matched_tender_type: string;
    attributes: Record<string, string>;
  }