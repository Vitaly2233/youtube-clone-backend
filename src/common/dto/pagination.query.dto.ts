import { IsNumber } from '../validators/is-number';

export class PaginationQueryDto {
  @IsNumber()
  take: number;

  @IsNumber()
  skip: number;
}
