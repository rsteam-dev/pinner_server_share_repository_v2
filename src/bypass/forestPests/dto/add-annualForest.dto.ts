import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class AddAnnualForestDto {
  @IsInt()
  mem_idx: number;

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

export class AddAnnualForestBody {
  data: AddAnnualForestBodyData[];
}

export class AddAnnualForestBodyData {
  @IsInt()
  idx: number;

  @IsInt()
  year: number;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  name: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  shp: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  shpname: string;

  @IsBoolean()
  delete: boolean;
}
