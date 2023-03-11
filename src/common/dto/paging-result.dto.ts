export class PagingResultDto<T> {
  constructor(
    readonly list: T[],
    readonly count: number,
  ) {}
}