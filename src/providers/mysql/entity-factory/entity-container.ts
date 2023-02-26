import { ColumnPropertyType } from "@/providers/mysql/entity-factory/entity-factory.type";

export class EntityContainer {
  private static nameToListMap: Map<Function, ColumnPropertyType[]> = new Map();

  static getParents(
    classType: Function
  ): Function[] {
    return Array
      .from(this.nameToListMap.entries())
      .map(([parentType]) => parentType)
      .filter((parentType) => classType.prototype instanceof parentType);
  }

  static createByParentTypes(
    classType: Function
  ): ColumnPropertyType[] {
    return this
      .getParents(classType)
      .flatMap((parentClass) => this.nameToListMap.get(parentClass) || []);
  }

  static register(
    classType: Function,
    qvType: ColumnPropertyType
  ) {
    const list: ColumnPropertyType[]
      = this.nameToListMap.get(classType)
      || this.createByParentTypes(classType);
    list.push(qvType);
    this.nameToListMap.set(classType, list);
  }

  static isRegistered(
    classType: Function
  ) {
    return this.nameToListMap.has(classType);
  }

  static findColumnList(
    classType: Function
  ): ColumnPropertyType[] {
    const list: ColumnPropertyType[]
      = this.nameToListMap.get(classType);

    if (list) {
      return list;
    }

    const parentList = this.createByParentTypes(classType);
    this.nameToListMap.set(classType, parentList);
    return parentList;
  }
}