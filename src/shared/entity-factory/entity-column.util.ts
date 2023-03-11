import { EntityColumnContainer } from '@/shared/entity-factory/entity-column.container'

export class EntityColumnUtil {

  static isClassType(
    type: any,
  ) {
    return (type as any).prototype
      && EntityColumnContainer.hasInfo(type)
  }

  static asColumn(
    as: string,
    columnName: string,
  ) {
    return `${as}.${columnName}`
  }

  static isObjectColumn(
    objectPropertyName: string,
    propertyName: string,
  ): boolean {
    return objectPropertyName.startsWith(`${propertyName}.`)
  }

  static parseEntityColumn(
    item: object,
    propertyName: string,
  ) {
    const sliceSize = `${propertyName}.`.length
    const result = Object
      .keys(item)
      .filter(
        (objectPropertyName) => this.isObjectColumn(objectPropertyName, propertyName),
      )
      .reduce(
        (
          acc,
          objectPropertyName,
        ) => {
          acc[objectPropertyName.slice(sliceSize)] = item[objectPropertyName]
          return acc
        },
        {},
      )

    if (Object.keys(result).length === 0) {
      console.error('TYPE ERROR', propertyName)
      throw new Error(`TYPE ERROR ${propertyName}`)
    }

    const isEveryNull = Object
      .values(result)
      .every((value) => value === null)

    return isEveryNull
      ? null
      : result
  }

}