import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class GetUserListDataDto {
  @IsNumber()
  skip: number;

  @IsBoolean()
  @IsOptional()
  active: boolean;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  level: number;
}
