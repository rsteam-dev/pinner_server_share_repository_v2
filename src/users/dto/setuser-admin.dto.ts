import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsString, Length } from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class SetUserDto {
  @IsNumber()
  idx: number;

  @IsString({ message: '이름을 1~20자 이내로 입력해주세요.' })
  @Length(1, 20)
  name: string;

  @IsEmail({}, { message: '이메일을 옳바르게 입력해주세요.' })
  @Transform((value) => rs_htmlclean(value))
  @Length(10, 30, {
    message: '이메일을 10~30자 이내로 입력해주세요.',
  })
  email: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  password: string;

  @IsNumber()
  level: number;
}
