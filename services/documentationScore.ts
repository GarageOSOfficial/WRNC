import type {
  DocumentationCategoryKey,
  DocumentationCategoryScore,
  DocumentationRecommendation,
  DocumentationScoreInput,
  DocumentationScoreResult,
} from '../types/documentationScore';

const CATEGORY_WEIGHTS: Record<DocumentationCategoryKey, number> = {
  vehicleInformation: 12,
  activityHistory: 10,
  maintenanceRecords: 10,
  photos: 10,
  receipts: 8,
  registration: 8,
  insurance: 8,
  warrantyDocuments: 8,
  manuals: 8,
  titles: 8,
};

const CATEGORY_LABELS: Record<DocumentationCategoryKey, string> = {
  vehicleInformation: 'Vehicle Information',
  activityHistory: 'Activity History',
  maintenanceRecords: 'Maintenance Records',
  photos: 'Photos',
  receipts: 'Receipts',
  registration: 'Registration',
  insurance: 'Insurance',
  warrantyDocuments: 'Warranty Documents',
  manuals: 'Manuals',
  titles: 'Titles',
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateCategoryScores(input: DocumentationScoreInput): DocumentationCategoryScore[] {
  const { vehicle, activities, documents } = input;
  const categories = Object.keys(CATEGORY_WEIGHTS) as DocumentationCategoryKey[];

  return categories.map((key) => {
    let score = 0;
    const evidence: string[] = [];

    switch (key) {
      case 'vehicleInformation': {
        if (vehicle?.year) {
          score += 4;
          evidence.push('Vehicle year recorded');
        }
        if (vehicle?.make && vehicle?.model) {
          score += 4;
          evidence.push('Make and model recorded');
        }
        if (vehicle?.vin) {
          score += 4;
          evidence.push('VIN recorded');
        }
        break;
      }
      case 'activityHistory': {
        const detailedActivities = activities.filter((activity) => Boolean(activity.title || activity.description));
        if (activities.length > 0) {
          score += 5;
        }
        if (detailedActivities.length > 0) {
          score += 5;
        }
        evidence.push(`${activities.length} ${activities.length === 1 ? 'activity' : 'activities'} recorded`);
        break;
      }
      case 'maintenanceRecords': {
        const maintenanceActivities = activities.filter((activity) =>
          activity.title?.toLowerCase().includes('maintenance') || activity.description?.toLowerCase().includes('maintenance')
        );
        if (maintenanceActivities.length > 0) {
          score += 10;
          evidence.push('Maintenance activity recorded');
        }
        break;
      }
      case 'photos': {
        const photoDocuments = documents.filter((document) => document.mimeType.startsWith('image/'));
        if (photoDocuments.length > 0) {
          score += 10;
        }
        evidence.push(`${photoDocuments.length} ${photoDocuments.length === 1 ? 'photo' : 'photos'} uploaded`);
        break;
      }
      case 'receipts': {
        const receipts = documents.filter((document) => document.documentType.toLowerCase().includes('receipt'));
        if (receipts.length > 0) {
          score += 8;
          evidence.push('Receipt documents present');
        }
        break;
      }
      case 'registration': {
        const registration = documents.filter((document) => document.documentType.toLowerCase().includes('registration'));
        if (registration.length > 0) {
          score += 8;
          evidence.push('Registration document present');
        }
        break;
      }
      case 'insurance': {
        const insurance = documents.filter((document) => document.documentType.toLowerCase().includes('insurance'));
        if (insurance.length > 0) {
          score += 8;
          evidence.push('Insurance document present');
        }
        break;
      }
      case 'warrantyDocuments': {
        const warranty = documents.filter((document) => document.documentType.toLowerCase().includes('warranty'));
        if (warranty.length > 0) {
          score += 8;
          evidence.push('Warranty document present');
        }
        break;
      }
      case 'manuals': {
        const manuals = documents.filter((document) => document.documentType.toLowerCase().includes('manual'));
        if (manuals.length > 0) {
          score += 8;
          evidence.push('Manual document present');
        }
        break;
      }
      case 'titles': {
        const titles = documents.filter((document) => document.documentType.toLowerCase().includes('title'));
        if (titles.length > 0) {
          score += 8;
          evidence.push('Title document present');
        }
        break;
      }
    }

    return {
      key,
      label: CATEGORY_LABELS[key],
      score: clampScore((score / CATEGORY_WEIGHTS[key]) * 100),
      maxScore: 100,
      evidence: evidence.length > 0 ? evidence : ['No evidence found for this category'],
    };
  });
}

export function calculateDocumentationScore(input: DocumentationScoreInput): DocumentationScoreResult {
  const categories = calculateCategoryScores(input);
  const weightedSum = categories.reduce((total, category) => total + category.score * 0.1, 0);
  const overallScore = clampScore(weightedSum);

  return {
    overallScore,
    categories,
    recommendations: generateRecommendations(input, categories),
  };
}

export function generateRecommendations(
  input: DocumentationScoreInput,
  categories?: DocumentationCategoryScore[]
): DocumentationRecommendation[] {
  const scoreCategories = categories ?? calculateCategoryScores(input);
  const recommendations: DocumentationRecommendation[] = [];

  scoreCategories.forEach((category) => {
    if (category.score >= 100) {
      return;
    }

    const impact = category.score < 50 ? 'high' : category.score < 80 ? 'medium' : 'low';
    const action = category.key === 'vehicleInformation'
      ? 'Add the vehicle year, make/model, and VIN to improve the base record.'
      : category.key === 'activityHistory'
        ? 'Record more vehicle activities with descriptive titles or notes.'
        : category.key === 'maintenanceRecords'
          ? 'Log maintenance events so service history is easy to review.'
          : category.key === 'photos'
            ? 'Upload photos to create a richer visual history.'
            : category.key === 'receipts'
              ? 'Add receipts to capture purchase and upkeep evidence.'
              : category.key === 'registration'
                ? 'Upload registration documents to support ownership records.'
                : category.key === 'insurance'
                  ? 'Store insurance paperwork for quick access.'
                  : category.key === 'warrantyDocuments'
                    ? 'Add warranty documents for coverage details.'
                    : category.key === 'manuals'
                      ? 'Upload manuals and reference documents.'
                      : 'Add title documents to complete the ownership trail.';

    recommendations.push({
      category: category.key,
      title: `${category.label} needs attention`,
      message: `${action} Current score: ${category.score}/100.`,
      impact,
    });
  });

  return recommendations;
}
