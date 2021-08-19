import { IsBoolean, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
