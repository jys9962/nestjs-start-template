import { IsNumber, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'

export class PagingDto {
  @Transform(t => !!+t.value ? +t.value : null)
  @Min(1)
  @Max(1000)
  @IsNumber()
  readonly page: number

  @Transform(t => !!+t.value ? +t.value : null)
  @Min(1)
  @Max(1000)
  @IsNumber()
  readonly count: number

  get offset(): number {
    return (this.page - 1) * this.count
  }
}