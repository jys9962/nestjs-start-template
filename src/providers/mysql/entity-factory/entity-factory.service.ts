import { Injectable } from "@nestjs/common";
import { EntityContainer } from "@/providers/mysql/entity-factory/entity-container";
import { QueryType, QueryValue, ColumnPropertyType, TypedResult } from "@/providers/mysql/entity-factory/entity-factory.type";

@Injectable()
export class EntityFactory {
  createList<T>(
    list: object[],
    type: { new(): T }
  ): T[] {
    return list.map(
      (item) => this.create(item, type)
    );
  }

  create<T>(
    item: object,
    classType: { new(): T }
  ): T {
    const instance = new classType();
    const typeList = EntityContainer.findColumnList(classType);
    this.setValueByItem(
      instance,
      typeList,
      item
    );

    return instance;
  }

  createTyped<T extends QueryType>(
    item: object,
    type: T
  ): TypedResult<T> {
    return Object
      .keys(type)
      .reduce(
        (
          container,
          propName
        ) => {
          const propType: QueryType = type[propName];
          container[propName] = this.createTypedItem(item, propName, propType);
          return container;
        },
        {}
      ) as any;
  }

  createTypedItem<T extends QueryType>(
    item: Record<string, any>,
    propName: string,
    propType: T
  ): QueryValue<T> {
    const value = item[propName];
    const isClass = EntityContainer.isRegistered(propType as Function);
    const basicTypeList: QueryType[] = [String, Number, Boolean, Date, Object];
    const isBasicType = basicTypeList.includes(propType);

    if (
      !isClass &&
      typeof value === "undefined"
    ) {
      console.error("TYPE ERROR", propName, propType);
      throw new Error(`TYPE ERROR ${propName}`);
    }

    if (Array.isArray(propType)) {
      return (item[propName] || [])
        .map(v => this.convert(v, propType[0]));
    }

    if (isBasicType) {
      return this.convert(value, propType as Function);
    }

    const sliceSize = `$${propName}$`.length + 1;
    const nestedItem = Object
      .keys(item)
      .filter(t => t.startsWith(`$${propName}$`))
      .reduce((
        acc,
        t
      ) => {
        acc[t.slice(sliceSize)] = item[t];
        return acc;
      }, {});

    if (Object.keys(nestedItem).length === 0) {
      console.error("TYPE ERROR", propName, propType);
      throw new Error(`TYPE ERROR ${propName}`);
    }

    const isEveryNull = Object
      .values(nestedItem)
      .every((value) => value === null);
    if (isEveryNull) {
      return null;
    }

    return this.convert(nestedItem, propType as Function);
  }

  setValueByItem<T>(
    instance: T,
    typeList: ColumnPropertyType[],
    item: object
  ) {
    typeList
      .filter(
        ({ columnName }) => !columnName.startsWith("$")
      )
      .forEach(
        ({ type, columnName, propertyName }) => {
          const value = item[columnName];
          if (typeof value === "undefined") {
            return;
          }
          instance[propertyName] = this.convert(value, type);
        }
      );

    typeList
      .filter(
        ({ columnName }) => columnName.startsWith("$")
      )
      .forEach(
        ({ type, columnName, propertyName }) => {
          const sliceLength = columnName.length + 2;
          const nestedItem = Object
            .keys(item)
            .filter(key => key.startsWith(columnName))
            .reduce((
              acc,
              key
            ) => {
              acc[key.slice(sliceLength)] = item[key];
              return acc;
            }, {});

          instance[propertyName] = this.create(nestedItem, type as any);
        }
      );
  }

  private convert(
    value: any,
    type: Function
  ) {
    if (value == null) {
      return null;
    }
    if (Array.isArray(value)) {
      return value.map(t => this.convert(t, type));
    }
    if (type == null) {
      return value;
    }
    if (type === Number) {
      return Number(value);
    }
    if (type === String) {
      return String(value);
    }
    if (type === Boolean) {
      return value === "1"
        || value === 1
        || value === true;
    }
    if (type === Date) {
      return new Date(value);
    }
    if (type === Object) {
      return value;
    }

    return this.create(value, type as any);
  }
}