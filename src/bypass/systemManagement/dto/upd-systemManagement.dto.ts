import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class UpdateSystemManagementDto {
  @IsString()
  @Transform((value) => rs_htmlclean(value))
  key: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  value: string;
}
