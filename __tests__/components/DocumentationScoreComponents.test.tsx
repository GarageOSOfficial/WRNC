import React from 'react';
import { render } from '@testing-library/react-native';
import { DocumentationScoreCard } from '../../components/workspace/DocumentationScoreCard';
import { DocumentationScoreBreakdown } from '../../components/workspace/DocumentationScoreBreakdown';
import { DocumentationRecommendations } from '../../components/workspace/DocumentationRecommendations';
import { DocumentationCategoryProgress } from '../../components/workspace/DocumentationCategoryProgress';

describe('documentation score components', () => {
  it('renders the score card', () => {
    const { getByText } = render(<DocumentationScoreCard score={72} />);
    expect(getByText('72/100')).toBeTruthy();
  });

  it('renders scored categories in the breakdown', () => {
    const { getByText } = render(
      <DocumentationScoreBreakdown categories={[{ key: 'vehicleInformation', label: 'Vehicle Information', score: 50, maxScore: 100, evidence: ['Recorded'] }]} />
    );
    expect(getByText('Vehicle Information')).toBeTruthy();
    expect(getByText('50/100')).toBeTruthy();
  });

  it('renders activity and photo evidence without a misleading score', () => {
    const { getByText, queryByText } = render(
      <DocumentationScoreBreakdown categories={[
        { key: 'activityHistory', label: 'Activity History', score: 100, maxScore: 100, evidence: ['8 activities recorded', '7 with title or notes'] },
        { key: 'photos', label: 'Photos', score: 100, maxScore: 100, evidence: ['12 photos uploaded'] },
      ]} />
    );

    expect(getByText('8 activities recorded, 7 with title or notes')).toBeTruthy();
    expect(getByText('12 photos uploaded')).toBeTruthy();
    expect(queryByText('100/100')).toBeNull();
  });

  it('renders recommendations', () => {
    const { getByText } = render(
      <DocumentationRecommendations recommendations={[{ category: 'photos', title: 'Photos need attention', message: 'Upload photos', impact: 'medium' }]} />
    );
    expect(getByText('Photos need attention')).toBeTruthy();
  });

  it('renders scored category progress', () => {
    const { getByText } = render(
      <DocumentationCategoryProgress category={{ key: 'manuals', label: 'Manuals', score: 80, maxScore: 100, evidence: ['Recorded'] }} />
    );
    expect(getByText('80% complete')).toBeTruthy();
  });

  it('renders factual activity progress instead of completeness', () => {
    const { getByText, queryByText } = render(
      <DocumentationCategoryProgress category={{ key: 'activityHistory', label: 'Activity History', score: 100, maxScore: 100, evidence: ['8 activities recorded', '7 with title or notes'] }} />
    );
    expect(getByText('8 activities recorded · 7 with title or notes')).toBeTruthy();
    expect(queryByText('100% complete')).toBeNull();
  });
});
