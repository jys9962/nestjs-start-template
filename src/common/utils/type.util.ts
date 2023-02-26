export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

// 함수 제외
export type NonFunctionProperties<T>
  = Pick<T, NonFunctionPropertyNames<T>>;


// string 카멜케이스 변환
export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>

// object key 카멜케이스 변환
export type ObjectToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends {} ? ObjectToCamelCase<T[K]> : T[K]
}

export type StartWith<T extends string> = `${T}${string}`

export type Split<S extends string, D extends string> =
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

type Trim<S extends string> =
  S extends ` ${infer T}`
    ? Trim<T>
    : S extends `${infer T} `
      ? Trim<T>
      : S

