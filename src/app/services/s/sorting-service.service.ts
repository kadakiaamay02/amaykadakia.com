import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortingServiceService {
  constructor() { }

  /**
   * Sorts an array of objects by a given key (ascending or descending).
   * @param arr Array of objects to sort
   * @param key Key of the object to sort by
   * @param direction 'asc' | 'desc' (default: 'desc')
   */
  sortByKey<T>(arr: T[], key: keyof T, direction: 'asc' | 'desc' = 'desc'): T[] {
    return arr.slice().sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === 'asc' ? -1 : 1;
      if (bVal == null) return direction === 'asc' ? 1 : -1;
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
