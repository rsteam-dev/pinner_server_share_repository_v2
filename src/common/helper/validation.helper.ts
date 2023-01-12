import { TransformFnParams } from 'class-transformer';
import { encode } from 'html-entities';
export function rs_htmlclean(data: TransformFnParams) {
  const { value, key, obj } = data;
  if (value === undefined || value === null) return value;
  if (typeof value === 'string') {
    //String 일 경우
    if (IsJsonString(value)) {
      //JSON 일경우 바이패스
      return value;
    } else {
      //JSON 이 아닐경우 보안처리
      return encode(value.trim());
    }
  } else if (Array.isArray(value)) {
    //Array 일 경우 [String] 만 가능
    const returnArr = [];
    for (const thisValue of value) {
      if (typeof thisValue !== 'string') {
        throw new Error(
          `this key "` +
            key +
            `"'s value type is not [String]; obj =` +
            JSON.stringify(obj),
        );
      }
      returnArr.push(encode(thisValue.trim()));
    }
    return returnArr;
  } else {
    throw new Error(
      `this key "` +
        key +
        `"'s value type is not String; obj =` +
        JSON.stringify(obj),
    );
  }
}

function IsJsonString(str: string) {
  try {
    const json = JSON.parse(str);
    return typeof json === 'object';
  } catch (e) {
    return false;
  }
}
