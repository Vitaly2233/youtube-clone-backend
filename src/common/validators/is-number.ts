import { applyDecorators } from '@nestjs/common';
import { IsNumber as isNumber } from 'class-validator';
import { Type } from 'class-transformer';

export function IsNumber() {
  return applyDecorators(
    Type(() => Number),
    isNumber(),
  );
}
