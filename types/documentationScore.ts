import type { Activity } from './activity';
import type { Document } from './document';
import type { Vehicle } from './vehicle';

export type DocumentationCategoryKey =
  | 'vehicleInformation'
  | 'activityHistory'
  | 'maintenanceRecords'
  | 'photos'
  | 'receipts'
  | 'registration'
  | 'insurance'
  | 'warrantyDocuments'
  | 'manuals'
  | 'titles';

export interface DocumentationCategoryScore {
  key: DocumentationCategoryKey;
  label: string;
  score: number;
  maxScore: number;
  evidence: string[];
}

export interface DocumentationRecommendation {
  category: DocumentationCategoryKey;
  title: string;
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export interface DocumentationScoreResult {
  overallScore: number;
  categories: DocumentationCategoryScore[];
  recommendations: DocumentationRecommendation[];
}

export interface DocumentationScoreInput {
  vehicle: Vehicle | null | undefined;
  activities: Activity[];
  documents: Document[];
}
