import { decodeURIComponentCharset } from 'decode-uri-component-charset';
import * as sha256 from 'sha256';

export function json_parse<T = Record<string, any>>(
  json: string,
  defaultValue: T,
): T {
  try {
    return JSON.parse(json);
  } catch (e) {
    return defaultValue;
  }
}

export function is_true(value: string | number | boolean): boolean {
  if (value === undefined) return false;
  const numberedValue = Number(value);
  if (numberedValue === 0) {
    return false;
  } else {
    return true;
  }
}

// 설정한 날짜 config값 년,일 로 변경
export function changeDay(data: string) {
  switch (data) {
    case '30':
      data = '30일';
      return data;
    case '90':
      data = '90d일';
      return data;
    case '365':
      data = '1년';
      return data;
    case '730':
      data = '2년';
      return data;
    case '1095':
      data = '3년';
      return data;
  }
}

// 설정한 날짜 config값 년,일 로 변경
export function base_url(url: string) {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL + url;
  } else {
    return (
      'http://localhost:' +
      (process.env.NODE_PORT ? process.env.NODE_PORT : 3010) +
      url
    );
  }
}

export function randomString(len: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  const stringLength = len;
  let randomstring = '';
  for (let i = 0; i < stringLength; i++) {
    const rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

export function decodeURIforEUCKR(sStr: string) {
  const cStr = decodeURIComponentCharset(sStr, 'euc-kr');
  return cStr as string;
}

export async function encryptPassword(
  password: string,
  email: string,
): Promise<string> {
  let pw = sha256(process.env.SHA_SALT + password + email);
  for (let i = 0; i < 5000; i++) {
    pw = sha256(process.env.SHA_SALT + pw + email);
  }
  return pw;
}

// export function html_filter(contents) {
//     const deniedTagObj = {
//         //\\s{0,} 공백 처리
//         '<(.*?)html(.*?)>': '[html]',
//         '</html>': '[/html]',
//         '<head(.*?)>': '[head]',
//         '</head>': '[/head]',
//         '<body(.*?)>': '[body]',
//         '</body>': '[/body]',
//         '<script(.*?)>': '[script]',
//         '</script>': '[/script]',
//         '<style(.*?)>': '[style]',
//         '</style>': '[/style]',
//         '<form(.*?)>': '[form]',
//         '</form>': '[/form]',
//         '<button(.*?)>': '[button]',
//         '</button>': '[/button]',
//         '<input(.*?)>': '[input]',
//         '<select(.*?)>': '[select]',
//         '</select>': '[/select]',
//         '<embed(.*?)>': '[embed]',
//         '</embed>': '[/embed]',
//         '<pre(.*?)>': '[pre]',
//         '</pre>': '[/pre]',
//         '<xmp(.*?)>': '[xmp]',
//         '</xmp>': '[/xmp]',
//         '<xml(.*?)>': '[xml]',
//         '</xml>': '[/xml]',
//         '<video(.*?)>': '[video]',
//         '</video>': '[/video]',
//         '<audio(.*?)>': '[audio]',
//         '</audio>': '[/audio]',
//         '<object(.*?)>': '[object]',
//         '</object>': '[/object]',
//         '<textarea(.*?)>': '[textarea]',
//         '</textarea>': '[/textarea]',
//         '<frame(.*?)>': '[frame]',
//         '</frame>': '[/frame]',
//         '<frameset(.*?)>': '[frameset]',
//         '</frameset>': '[/frameset]',
//         '<applet(.*?)>': '[applet]',
//         '</applet>': '[/applet]',
//         '<title(.*?)>': '[title]',
//         '</title>': '[/title]',
//         '<!--(.*?)-->': 'Blocked',
//         // '<![CDATA[': 'Blocked',
//         '<comment>': '[comment]',
//         '<%': '&lt;&#37;',
//         'document.cookie': '[removed]',
//         '(document).cookie': '[removed]',
//         'document.write': '[removed]',
//         '(document).write': '[removed]',
//         '.parentNode': '[removed]',
//         '.innerHTML': '[removed]',
//         '-moz-binding': '[removed]',
//         '(\\(?document\\)?|\\(?window\\)?(\\.document)?)\\.(location|on\\w*)':
//             '[removed]',
//         '([\\"\'])?data\\s*:[^\\1]*?base64[^\\1]*?,[^\\1]*?\\1?': '[removed]',
//         '<link(.*?)>': '[link]',
//         '</link>': '[/link]',
//         '<wbr(.*?)>': '[wbr]',
//         '</wbr>': '[/wbr]',
//         '<option(.*?)>': '[option]',
//         '</option>': '[/option]',
//         '<optgroup(.*?)>': '[optgroup]',
//         '</optgroup>': '[/optgroup]',
//         '<picture(.*?)>': '[picture]',
//         '</picture>': '[/picture]',
//         '<progress(.*?)>': '[progress]',
//         '<meta(.*?)>': '[meta]',
//         '<track(.*?)>': '[track]',
//         '<base(.*?)>': '[base]',
//         '<source(.*?)>': '[source]',
//         '<output(.*?)>': '[base]',
//         '<hr(.*?)>': '[hr]',
//         'display\\s{0,}:\\s{0,}none(;?)': '/*display:none;*/', //display:none 차단
//         'visibility\\s{0,}:\\s{0,}hidden(;?)': '/*visibility:hidden;*/', //visibility:hidden 차단
//         'background-color\\s{0,}:\\s{0,}(.*?)': '/*background-color:blocked;*/', //background-color 차단
//         'background-image\\s{0,}:\\s{0,}(.*?)': '/*background-image:blocked;*/', //background-image 차단
//         'javascript\\s{0,}:(.*)?': 'Blocked', //javascript 차단
//         'jscript\\s{0,}:(.*)?': 'Blocked', //javascript 차단
//         'wscript\\s{0,}:(.*)?': 'Blocked', //javascript 차단
//         'vbscript\\s{0,}:(.*)?': 'Blocked', //javascript 차단
//         'vbs\\s{0,}:(.*)?': 'Blocked', //javascript 차단
//         // 'expressions*((|&#40;)': 'Blocked', //javascript 차단
//         'Redirect\\s+30\\d': 'Blocked', //javascript 차단
//         'onclick\\s{0,}=': 'Blocked=',
//         'ondblclick\\s{0,}=': 'Blocked=',
//         'onload\\s{0,}=': 'Blocked=',
//         'onloadeddata\\s{0,}=': 'Blocked=',
//         'onloadedmetadata\\s{0,}=': 'Blocked=',
//         'draggable\\s{0,}=': 'Blocked=',
//         'onblur\\s{0,}=': 'Blocked=',
//         'onchange\\s{0,}=': 'Blocked=',
//         'oncontextmenu\\s{0,}=': 'Blocked=',
//         'oncopy\\s{0,}=': 'Blocked=',
//         'onerror\\s{0,}=': 'Blocked=',
//         'onfocus\\s{0,}=': 'Blocked=',
//         'onbeforeunload\\s{0,}=': 'Blocked=',
//         'onfocusin\\s{0,}=': 'Blocked=',
//         'onfocusout\\s{0,}=': 'Blocked=',
//         'onhashchange\\s{0,}=': 'Blocked=',
//         'oninput\\s{0,}=': 'Blocked=',
//         'oninvalid\\s{0,}=': 'Blocked=',
//         'onkeydown\\s{0,}=': 'Blocked=',
//         'onkeypress\\s{0,}=': 'Blocked=',
//         'onkeyup\\s{0,}=': 'Blocked=',
//         'onmousedown\\s{0,}=': 'Blocked=',
//         'onmouseenter\\s{0,}=': 'Blocked=',
//         'onmouseleave\\s{0,}=': 'Blocked=',
//         'onmousemove\\s{0,}=': 'Blocked=',
//         'onmouseover\\s{0,}=': 'Blocked=',
//         'onmouseout\\s{0,}=': 'Blocked=',
//         'onmouseup\\s{0,}=': 'Blocked=',
//         'onoffline\\s{0,}=': 'Blocked=',
//         'ononline\\s{0,}=': 'Blocked=',
//         'onpagehide\\s{0,}=': 'Blocked=',
//         'onpageshow\\s{0,}=': 'Blocked=',
//         'onpaste\\s{0,}=': 'Blocked=',
//         'onresize\\s{0,}=': 'Blocked=',
//         'onreset\\s{0,}=': 'Blocked=',
//         'onscroll\\s{0,}=': 'Blocked=',
//         'onsearch\\s{0,}=': 'Blocked=',
//         'onselect\\s{0,}=': 'Blocked=',
//         'onshow\\s{0,}=': 'Blocked=',
//         'onstalled\\s{0,}=': 'Blocked=',
//         'onaborted\\s{0,}=': 'Blocked=',
//         'onsubmit\\s{0,}=': 'Blocked=',
//         'ontoggle\\s{0,}=': 'Blocked=',
//         'ontouchcancel\\s{0,}=': 'Blocked=',
//         'ontouchend\\s{0,}=': 'Blocked=',
//         'ontouchmove\\s{0,}=': 'Blocked=',
//         'ontouchstart\\s{0,}=': 'Blocked=',
//         'onunload\\s{0,}=': 'Blocked=',
//     };
//     for (const [thisDeniedTag, thisChangedTag] of Object.entries(
//         deniedTagObj,
//     )) {
//         const regExp = new RegExp(thisDeniedTag, 'gi');
//         contents = contents.replace(regExp, thisChangedTag);
//     }
//     return contents;
// }
