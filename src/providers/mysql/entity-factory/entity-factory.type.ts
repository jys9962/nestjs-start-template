export type QueryType =
  Boolean |
  Date |
  Number |
  String |
  Object |
  { new(...args): any } |
  { [key: string]: QueryType } |
  [QueryType]

export type QueryValue<T extends QueryType>
  = T extends BooleanConstructor
  ? boolean
  : T extends NumberConstructor
    ? number
    : T extends StringConstructor
      ? string
      : T extends { new(...args): infer K }
        ? K
        : T extends { [key: string]: QueryType }
          ? { [key in keyof T]: QueryValue<T[key]> }
          : T extends [infer K extends QueryType]
            ? QueryValue<K>[]
            : T

export type TypedResult<T extends QueryType> =
  T extends { new(): infer K }
    ? K
    : {
      [Key in keyof T]: QueryValue<T[Key]>
    }

export type ColumnPropertyType = {
  columnName: string
  type: Function
  propertyName: string
}