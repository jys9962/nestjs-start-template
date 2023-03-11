import { Injectable } from '@nestjs/common'
import { QueryType, TypedResult } from '@/shared/entity-factory/entity-column.type'
import { EntityColumnContainer } from '@/shared/entity-factory/entity-column.container'
import { ObjectUtil } from '@/common/utils/object.util'
import { EntityColumnUtil } from '@/shared/entity-factory/entity-column.util'

@Injectable()
export class EntityFactoryService {

  create<T extends QueryType>(
    item: object,
    typeObject: T,
  ): TypedResult<T> {
    item = ObjectUtil.parseDotNotation(item)

    const isEntity = EntityColumnUtil.isClassType(typeObject)
    if (isEntity) {
      return this.createEntity(item, typeObject as any)
    }

    return Object
      .keys(typeObject)
      .reduce(
        (
          acc,
          propertyName,
        ) => {
          const propertyType: QueryType = typeObject[propertyName]
          const value = item[propertyName]

          this.checkValid(item, propertyName, propertyType)

          acc[propertyName] = this.convertType(value, propertyType as Function)
          return acc
        },
        {},
      ) as any
  }

  createEntity<T>(
    item: object,
    classType: { new(): T },
  ): T {
    item = ObjectUtil.parseDotNotation(item)

    const columnInfoList = EntityColumnContainer.getInfo(classType)
    return columnInfoList.reduce(
      (
        acc,
        { type, columnName, propertyName },
      ) => {
        const value = item[columnName]
        if (typeof value === 'undefined') {
          return acc
        }

        acc[propertyName] = this.convertType(value, type)

        return acc
      },
      new classType(),
    )
  }

  private convertType(
    value: any,
    type: Function,
  ) {
    if (Array.isArray(type)) {
      return (value || [])
        .map(v => this.convertType(v, type[0]))
    }
    if (value == null) {
      return null
    }
    if (Array.isArray(value)) {
      return value.map(t => this.convertType(t, type))
    }
    if (type == null) {
      return value
    }
    if (type === Number) {
      return Number(value)
    }
    if (type === String) {
      return String(value)
    }
    if (type === Boolean) {
      return value === '1'
        || value === 1
        || value === true
    }
    if (type === Date) {
      return new Date(value)
    }
    if (type === Object) {
      return value
    }

    if (Object.values(value).every(t => t == null)) {
      return null
    }

    return this.createEntity(value, type as any)
  }

  private checkValid(
    item: object,
    propertyName: string,
    propertyType: QueryType,
  ) {
    const value = item[propertyName]

    if (typeof value === 'undefined') {
      console.error('TYPE ERROR', propertyName, propertyType)
      throw new Error(`TYPE ERROR ${propertyName}`)
    }

    if (
      Array.isArray(propertyType) &&
      value !== null &&
      !Array.isArray(value)
    ) {
      console.error('TYPE ERROR', propertyName, propertyType)
      throw new Error(`TYPE ERROR ${propertyName}`)
    }
  }
}