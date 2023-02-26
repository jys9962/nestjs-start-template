export class MapUtil {

  static groupby<T, K>(
    list: T[],
    keyGetter: (t: T) => K,
  ): Map<K, T[]> {
    return (list || [])
      .reduce(
        (
          acc,
          t,
        ) => {
          const key: K = keyGetter(t)
          const list: T[] = acc.get(key) || []
          list.push(t)
          acc.set(key, list)
          return acc
        },
        new Map(),
      )
  }

  static nestedBy<T, K, J>(
    list: T[],
    key1Getter: (t: T) => K,
    key2Getter: (t: T) => J,
  ): Map<K, Map<J, T>> {
    return new Map(
      Array
        .from(
          this.groupby(list, key1Getter).entries(),
        )
        .map(
          ([key1, subList]) => [key1, this.by(subList, key2Getter)],
        ),
    )
  }

  static by<T, K>(
    list: T[],
    keyGetter: (t: T) => K,
  ): Map<K, T> {
    return new Map(
      list.map(
        (t) => [keyGetter(t), t],
      ),
    )
  }
}
