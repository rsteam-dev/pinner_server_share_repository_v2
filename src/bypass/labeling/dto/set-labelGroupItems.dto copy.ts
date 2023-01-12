import { Transform } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class SetLabelGroupItemsDto {
  @IsInt()
  lbg_idx: number;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  lbg_labels: string;
}
