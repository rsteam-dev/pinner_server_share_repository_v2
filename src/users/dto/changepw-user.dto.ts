import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class ChangePwUserDto {
  @IsEmail({}, { message: '이메일을 옳바르게 입력해주세요.' })
  @Transform((value) => rs_htmlclean(value))
  @Length(10, 30, {
    message: '이메일을 10~30자 이내로 입력해주세요.',
  })
  email: string;

  @IsString({ message: '변경할 비밀번호를 입력해주세요.' })
  @Transform((value) => rs_htmlclean(value))
  password: string;

  @IsString({ message: '유효한 인증이 아닙니다.' })
  eth_email_number: string;
}
