import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class SetLabelGroupNameDto {
  @IsInt()
  lbg_idx: number;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  lbg_name: string;
}
