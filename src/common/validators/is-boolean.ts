import { applyDecorators } from '@nestjs/common';
import { IsBoolean as isBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export function IsBoolean() {
  return applyDecorators(
    Type(() => Boolean),
    isBoolean(),
  );
}
