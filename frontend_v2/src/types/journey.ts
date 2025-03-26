// src/types/journey.ts
export interface JourneyResource {
    id: string;
    name: string;
    description?: string;
    type: string;
    mime_type: string;
    size: number;
    created_time: string;
    modified_time: string;
  }
  
  export interface JourneyLevel {
    id: string;
    name: string;
    description: string;
    order: number;
    resources?: JourneyResource[];
  }
  
  export interface Journey {
    levels: JourneyLevel[];
    total_levels: number;
  }