import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsString } from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class UpdAnnualForestDto {
  @IsInt()
  anf_idx: number;

  @IsInt()
  upd_mem_idx: number;

  @IsInt()
  anf_year: number;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  anf_name: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  anf_shp: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  anf_shpname: string;
}
