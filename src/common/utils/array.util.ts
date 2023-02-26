import { MapUtil } from "./map.util";

export class ArrayUtil {

  static isSame<T>(
    list1: T[],
    list2: T[],
    checkSort: boolean
  ) {
    if (list1.length !== list2.length) {
      return false;
    }

    if (checkSort) {
      return list1.every((
        v,
        i
      ) => v === list2[i]);
    }

    const t1Map = new Map(list1.map(t => [t, true]));
    return list2.every(t => t1Map.has(t));
  }

  static except<T>(
    list1: T[],
    list2: T[]
  ) {
    const set1 = new Set(list1);
    list2.forEach(t => set1.delete(t));
    return Array.from(set1);
  }

  static distinct<T>(list: T[]): T[] {
    return Array.from(new Set(list));
  }

  static isContain<T>(
    list1: T[],
    list2: T[]
  ) {
    const map = MapUtil.by(list1, t => t);
    return list2.every(t => map.has(t));
  }

  static isUnique<T>(list: T[]): boolean {
    return new Set(list).size === list.length;
  }

  static isOverlaps<T>(
    list1: T[],
    list2: T[]
  ): boolean {
    const map = MapUtil.by(list1, t => t);
    return list2.some(t => map.has(t));
  }
}
