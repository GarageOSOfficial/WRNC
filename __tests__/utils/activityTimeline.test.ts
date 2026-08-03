import type { Activity } from '../../types/activity';
import {
  buildTimelineSections,
  filterTimelineActivities,
  selectTimelineSections,
  sortTimelineActivities,
} from '../../utils/activityTimeline';

const activities: Activity[] = [
  {
    id: 'act-1',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Maintenance',
    title: 'Brake Service',
    description: 'Replaced pads and flushed fluid.',
    activityDate: '2026-08-01',
    createdAt: '2026-08-01T18:00:00.000Z',
    updatedAt: null,
    photos: [],
    attachments: [],
    metadata: { odometer: 125000, cost: 249.99 },
    archivedAt: null,
  },
  {
    id: 'act-2',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Progress Update',
    title: 'Weekend Photos',
    description: 'Captured fresh shots after the wash.',
    activityDate: '2026-06-21',
    createdAt: '2026-06-21T17:00:00.000Z',
    updatedAt: null,
    photos: ['https://example.com/photo.jpg'],
    attachments: [],
    metadata: null,
    archivedAt: null,
  },
  {
    id: 'act-3',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Maintenance',
    title: 'Archived Inspection',
    description: 'Historical inspection entry.',
    activityDate: '2026-07-15',
    createdAt: '2026-07-15T16:00:00.000Z',
    updatedAt: null,
    photos: [],
    attachments: [],
    metadata: null,
    archivedAt: '2026-07-16T00:00:00.000Z',
  },
];

describe('activityTimeline utilities', () => {
  it('sorts newest first and oldest first deterministically', () => {
    expect(sortTimelineActivities(activities, 'desc').map((activity) => activity.id)).toEqual([
      'act-1',
      'act-3',
      'act-2',
    ]);
    expect(sortTimelineActivities(activities, 'asc').map((activity) => activity.id)).toEqual([
      'act-2',
      'act-3',
      'act-1',
    ]);
  });

  it('filters by activity type, archived status, and inclusive date range', () => {
    const filtered = filterTimelineActivities(activities, {
      sortDirection: 'desc',
      activityType: 'Maintenance',
      status: 'archived',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
    });

    expect(filtered.map((activity) => activity.id)).toEqual(['act-3']);
  });

  it('groups timeline sections by month and year', () => {
    const sections = buildTimelineSections(sortTimelineActivities(activities, 'desc'));

    expect(sections.map((section) => section.title)).toEqual([
      'August 2026',
      'July 2026',
      'June 2026',
    ]);
  });

  it('selects grouped sections from the active filter set', () => {
    const sections = selectTimelineSections(activities, {
      sortDirection: 'desc',
      activityType: 'all',
      status: 'active',
      startDate: '',
      endDate: '',
    });

    expect(sections.flatMap((section) => section.data.map((activity) => activity.id))).toEqual([
      'act-1',
      'act-2',
    ]);
  });
});