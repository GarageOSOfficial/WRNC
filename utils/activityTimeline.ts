import type { Activity, ActivityType } from '../types/activity';

export interface TimelineFilters {
  sortDirection: 'asc' | 'desc';
  activityType: ActivityType | 'all';
  status: 'all' | 'active' | 'archived';
  startDate: string;
  endDate: string;
}

export interface TimelineSection {
  title: string;
  data: Activity[];
}

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

function parseDateValue(value: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getComparableTimestamp(activity: Activity) {
  return parseDateValue(activity.activityDate)?.getTime() ?? 0;
}

export function sortTimelineActivities(
  activities: Activity[],
  sortDirection: TimelineFilters['sortDirection']
) {
  return [...activities].sort((left, right) => {
    const timeDiff = getComparableTimestamp(left) - getComparableTimestamp(right);
    if (timeDiff !== 0) {
      return sortDirection === 'asc' ? timeDiff : -timeDiff;
    }

    const createdDiff = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    return sortDirection === 'asc' ? createdDiff : -createdDiff;
  });
}

export function filterTimelineActivities(
  activities: Activity[],
  filters: TimelineFilters
) {
  const startDate = filters.startDate ? parseDateValue(filters.startDate) : null;
  const endDate = filters.endDate ? parseDateValue(filters.endDate) : null;

  return activities.filter((activity) => {
    if (filters.activityType !== 'all' && activity.activityType !== filters.activityType) {
      return false;
    }

    if (filters.status === 'active' && activity.archivedAt) {
      return false;
    }

    if (filters.status === 'archived' && !activity.archivedAt) {
      return false;
    }

    const activityDate = parseDateValue(activity.activityDate);
    if (!activityDate) {
      return false;
    }

    if (startDate && activityDate < startDate) {
      return false;
    }

    if (endDate) {
      const inclusiveEndDate = new Date(endDate);
      inclusiveEndDate.setHours(23, 59, 59, 999);
      if (activityDate > inclusiveEndDate) {
        return false;
      }
    }

    return true;
  });
}

export function buildTimelineSections(activities: Activity[]): TimelineSection[] {
  const grouped = new Map<string, Activity[]>();

  activities.forEach((activity) => {
    const activityDate = parseDateValue(activity.activityDate) ?? new Date(activity.createdAt);
    const title = monthFormatter.format(activityDate);
    const items = grouped.get(title) ?? [];
    items.push(activity);
    grouped.set(title, items);
  });

  return Array.from(grouped.entries()).map(([title, data]) => ({ title, data }));
}

export function selectTimelineSections(
  activities: Activity[],
  filters: TimelineFilters
): TimelineSection[] {
  const filtered = filterTimelineActivities(activities, filters);
  const sorted = sortTimelineActivities(filtered, filters.sortDirection);
  return buildTimelineSections(sorted);
}

export function formatTimelineDate(value: string) {
  const parsed = parseDateValue(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export function getActivityPreviewPhotoUrl(activity: Activity) {
  return activity.photos[0] ?? null;
}

export function getActivityCost(activity: Activity) {
  const value = activity.metadata?.cost;
  return typeof value === 'number' ? value : null;
}

export function getActivityOdometer(activity: Activity) {
  const value = activity.metadata?.odometer;
  return typeof value === 'number' ? value : null;
}
