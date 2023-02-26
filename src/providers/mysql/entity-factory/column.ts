import { EntityContainer } from "@/providers/mysql/entity-factory/entity-container";

export function Column(
  name: string,
  type?: Function
) {
  return (
    target: object,
    key: string
  ): void => {
    const classType = target.constructor;

    EntityContainer.register(classType, {
      type: type,
      columnName: name,
      propertyName: key
    });
  };
}
