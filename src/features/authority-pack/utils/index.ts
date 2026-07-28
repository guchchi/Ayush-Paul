import { type ActionItem } from '../types';

export const PackUtils = {
  sortByPriority(items: ActionItem[]): ActionItem[] {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return [...items].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  },
  
  formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
