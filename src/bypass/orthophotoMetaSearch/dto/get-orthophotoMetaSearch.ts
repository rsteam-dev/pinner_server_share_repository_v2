import { IsNumber } from 'class-validator';

export class GetOrthophotoMetaSearchDto {
  @IsNumber({}, { message: '위도를 입력해주세요.' })
  lat: number;

  @IsNumber({}, { message: '경도를 입력해주세요.' })
  long: number;
}
