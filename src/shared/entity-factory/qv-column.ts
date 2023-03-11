import { EntityColumnContainer } from '@/shared/entity-factory/entity-column.container'

export function QvColumn(
  columnName?: string,
  propertyType?: Function,
): PropertyDecorator {
  return function (
    object: Object,
    propertyName: string | symbol,
  ): void {

    columnName = columnName
      || propertyName as string
    propertyType = propertyType
      || Reflect.getMetadata('design:type', object, propertyName)
      || null

    EntityColumnContainer.setInfo(
      object.constructor,
      {
        type: propertyType,
        columnName: columnName,
        propertyName: propertyName as string,
      },
    )
  }
}
