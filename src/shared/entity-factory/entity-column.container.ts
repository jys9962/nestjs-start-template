import { ColumnInfo } from '@/shared/entity-factory/entity-column.type'

export class EntityColumnContainer {
  private static nameToListMap: Map<Function, ColumnInfo[]> = new Map()

  static getParents(
    classType: Function,
  ): Function[] {
    return Array
      .from(this.nameToListMap.entries())
      .map(([parentType]) => parentType)
      .filter((parentType) => classType.prototype instanceof parentType)
  }

  static createByParentTypes(
    classType: Function,
  ): ColumnInfo[] {
    return this
      .getParents(classType)
      .flatMap((parentClass) => this.nameToListMap.get(parentClass) || [])
  }

  static setInfo(
    classType: Function,
    qvType: ColumnInfo,
  ) {
    const list: ColumnInfo[]
      = this.nameToListMap.get(classType)
      || this.createByParentTypes(classType)
    list.push(qvType)
    this.nameToListMap.set(classType, list)
  }

  static hasInfo(
    classType: Function,
  ) {
    return this.nameToListMap.has(classType)
  }

  static getInfo(
    classType: Function,
  ): ColumnInfo[] {
    const list: ColumnInfo[]
      = this.nameToListMap.get(classType)

    if (list) {
      return list
    }

    const parentList = this.createByParentTypes(classType)
    this.nameToListMap.set(classType, parentList)
    return parentList
  }
}