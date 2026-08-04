import type { Activity } from './activity';
import type { Document } from './document';
import type { DocumentationCategoryScore, DocumentationRecommendation, DocumentationScoreResult } from './documentationScore';
import type { Vehicle } from './vehicle';

export interface BuildPassportLink {
  label: string;
  route?: string;
  action?: 'back';
}

export interface BuildPassportTextValue {
  label: string;
  value: string;
}

export interface BuildPassportVehicleSummary {
  title: string;
  subtitle: string;
  details: BuildPassportTextValue[];
  sourceLinks: BuildPassportLink[];
}

export interface BuildPassportTimelineSummary {
  totalActivities: number;
  activeActivities: number;
  archivedActivities: number;
  latestActivity: Activity | null;
  sourceLinks: BuildPassportLink[];
}

export interface BuildPassportDocumentationSummary {
  overallScore: number;
  totalDocuments: number;
  activeDocuments: number;
  archivedDocuments: number;
  photoDocuments: number;
  latestDocument: Document | null;
  categories: DocumentationCategoryScore[];
  sourceLinks: BuildPassportLink[];
}

export interface BuildPassportBreakdownItem {
  label: string;
  count: number;
}

export interface BuildPassportStatistics {
  totalActivities: number;
  activeActivities: number;
  archivedActivities: number;
  totalDocuments: number;
  activeDocuments: number;
  archivedDocuments: number;
  totalPhotos: number;
  maintenanceActivities: number;
  activityTypeBreakdown: BuildPassportBreakdownItem[];
  documentTypeBreakdown: BuildPassportBreakdownItem[];
  documentationScore: number;
}

export interface BuildPassportRecommendation extends DocumentationRecommendation {
  route?: string;
  action?: 'back';
  sourceLabel: string;
}

export interface BuildPassportResult {
  generatedAt: string;
  vehicleSummary: BuildPassportVehicleSummary;
  timelineSummary: BuildPassportTimelineSummary;
  documentationSummary: BuildPassportDocumentationSummary;
  statistics: BuildPassportStatistics;
  recommendations: BuildPassportRecommendation[];
  documentationScore: DocumentationScoreResult;
}

export interface BuildPassportInput {
  vehicle: Vehicle | null | undefined;
  activities: Activity[];
  documents: Document[];
  documentationScore: DocumentationScoreResult;
}