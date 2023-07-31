# Uni-crawling
### 🔥 Uni-crawling Node.js

#### 1. Node.js 크롤링 코드 

```javascript
const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;

const getHtml = async () => {
  try {
    return await axios.get("
<http://ratio.uwayapply.com/Sl5KOkJKJmB9YWhKemZUZg==>");
} catch (error) {
  console.error(error);
  }
};

getHtml()
  .then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("#Div_001 > table:nth-child(3)");

    $bodyList.each(function(i, elem) {
      ulList[i] = {
        title: $(this).find('#Tr_001_000010000 > td:nth-child(1)').text(),
      };
    });

    const data = ulList.filter(n => n.title);
    return data;
})
.then(res => log(res));
```

![image](https://github.com/oiosu/Uni-crawling/assets/99783474/3c56a93a-ee6e-4ccc-b228-d0af75466500)


#### 1-(1) 크롤링 결과 한글이 아닌 다른 기호로 깨짐 발생 확인
> encodeURL 과 해결할 수 있는 라이브러리 탐색

#### 1-(2) 인프런 홈페이지 크롤링 시 적용했던 encodeURI 시도
```javascript
return await axios.get("https://www.inflearn.com/courses?s=" +
encodeURI(keyword))
```
* encodeURI 시도 시 TypeError: Cannot read properties of undefined (reading 'data') 오류 발생
> const $ = cheerio.load(html.data); 의 data 부분이 문제가 있는 것인지 생각해보았다.

```javascript
return await
axios.get(encodeURI("http://ratio.uwayapply.com/Sl5KOkJKJmB9YWhKemZUZg=="));
```
> 위와 같이 코드를 작성해보았지만 한글이 아닌 같은 깨짐이 발생


#### 1-(3) `iconv`  vs `iconv-lite`
|iconv|iconv-lite|
|------|---|
| `npm install iconv` | `npm install iconv` |
|문자코드를 다른 문자코드로 변환|문자코드를 utf-8 로 변환 또는 utf-8 을 다른 문자로 변환 <br> ( utf-8을 기준으로 동작) <br> npm install detect-character-encoding <br> => 문자열이 인코딩된 형태를 확인 하는 패키지 <br>|

> iconv을 설치 시 에러 발생으로 iconv-lite 설치함
> ```javascript
> const iconv = require('iconv-lite'); //한글깨짐 방지
> const content = iconv.decode(html.data, "EUC-KR".toString())
> const $ = cheerio.load(content);
> ```
> 위와 같이 코드 추가 및 수정 함 & 결과 : 다른 문자로 깨지는 것을 확인
> ![image](https://github.com/oiosu/Uni-crawling/assets/99783474/c86e12ff-307b-4df8-a15b-4678629e5b8d)
> Iconv-lite warning: decode()-ing strings is deprecated. <br>
> Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding <br>
> : Iconv-lite 경고: decode()-ing 문자열은 더 이상 사용되지 않습니다. <br>
> https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding을 참조하십시오. <br>

◼ 😥  Buffer? 
> node.js는 버퍼구조 내에 바이너리 데이터를 생성하고 읽고, 쓰고 조작하기 위한 buffer 모듈을제공한다.
> 전역적으로 선언되기 때문에 require도 필요가 없다. 
> ✔ net 과 socket 을 지탱하고 있는 원천적인 부품들
> * buffer : 데이터가 흐르는 가장 원천적인 통로
> * stream : 열려있는 연결을 만드는데 가장 원천적인 부품
> * process : 프로세스
> * events : 이벤트 감지
> * async hooks : 이벤트 동시다발적 컨트롤
> * http_parser : c로 만들어진 http parser


#### 1-(4) 일단 가져오고 싶은 데이터를 순서대로 작성하기
```javascript
$bodyList.each(function(i, elem) {
      ulList[i] = {
        title: $(this).find('#Tr_001_000010000 > td:nth-child(1)').text(),
        recruit: $(this).find('#Tr_001_000010000 > td:nth-child(2)').text(),
        support: $(this).find('#Tr_001_000010000 > td:nth-child(3)').text(),
        rate: $(this).find('#Tr_001_000010000 > td:nth-child(4)').text(),
      };
});
```

![image](https://github.com/oiosu/Uni-crawling/assets/99783474/9ed60f77-2be0-4f82-b347-481a8e6c33ae)


#### 2. 문제가 되는 코드 수정하기 


##### 2-(1) require 대신 Node.js 최신 구문의 `import` 문 사용하기 
```javascript
import axios from "axios";
import cheerio from "cheerio";
import { log } from "console";
import iconv from "iconv-lite";
```

#### 2-(2) `iconv-lite` 는 업데이트 되지 않고 있는 모듈이기 때문에 `iconv-lite-umd` 로 변경하기 
```javascript
import iconv from "iconv-lite-umd";
```

#### 2-(3) 오류 발생 
```bash
(node:7540) Warning: To load an ES module, set "type": "module" in the
package.json or use the .mjs extension.
```
```bash
SyntaxError: Cannot use import statement outside a module
at internalCompileFunction (node:internal/vm:73:18)
at wrapSafe (node:internal/modules/cjs/loader:1178:20)
at Module._compile (node:internal/modules/cjs/loader:1220:27)
at Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
at Module.load (node:internal/modules/cjs/loader:1119:32)
at Module._load (node:internal/modules/cjs/loader:960:12)
at Function.executeUserEntryPoint [as runMain]
(node:internal/modules/run_main:81:12)
at node:internal/main/run_main_module:23:47
```

> set "type": "module" in the package.json <br>
> : package.json 에 type: module 을 추가하는 해결 방안 선택함

* 실행 명령어
##### --experimental-modules 플래그 사용 
```bash
node --experimental-modules index.mjs
```
![image](https://github.com/oiosu/Uni-crawling/assets/99783474/368c63a2-0929-4928-923f-148e45b6e505)
> 여전히 한글깨짐이 발생하고 있음을 확인되었다.

---

#### ◼ .MJS 파일에 대해 알아보기 
* .MJS: NODE.JS 애플리케이션에서 ECMA 모듈(ECMAScript Module)로 사용되는 JavaScript소스 코드 파일
* Node.js 의 native 모듈 시스템은 JS 코드를 구성하기 위해 코드를 여러 파일로 분할하는데 사용되는 CommonJS이다.
* 모듈이 CommonJS 인지 ES6인지 식별하기 위해 Node.js에서 사용하는 유일한 방법이다.
* ECMAScript 모듈은 재사용을 위해 JavaScript 코드를 패키징하기 위한 표준 형식이다.

#### ◼ CommonJS와 ES Modules은 왜 함께 할 수 없는가? 
|CommonJS(이하CJS)|ESM Script(이하 MJS)|
|------|---|
| `require()`와 `module.exports`를 사용 | `import`와 `export`를 사용 |

(1) ESM 에서는 require() 사용할 수 없다. 오로지 import 만 가능하다. <br>
(2) CJS도 마찬가지로 import 를 사용할 수는 없다. <br>
(3) ESM에서 CJS를 import 하여 사용할 수는 있지만 오로지 default import만 가능하다. <br>
`import ___ from lodash` 그러나 CJS가 `named export` 를 사용하고 있다면 `named import import` <br>
`{ shuffle } from 'lodash` 와 같은 것은 불가능하다. <br>
(4) ESM을 CJS에서 `require()` 로 가져올 수는 있다. 그러나 이는 별로 권장되지 않는다. <br>
(5) CJS는 기본값으로 지정되어 있다. 따라서 ESM 모드를 사용하기 위해서는 `opt-in`해야 한다.  <br>
`.js` 를 `.mjs` 로 바꾸거나, `package.json` 에 `"type": "module"` 옵션을 넣는 방법이 있다. <br>
(기존에 `CJS`를 쓰던 것은 `.cjs` 로 바꾸면 된다.) <br>
* 출처 : https://yceffort.kr/2020/08/commonjs-esmodules


#### 3. 한글깨짐 해결하기 

(1) `axios.get` 요청에 `{ responseType: "arraybuffer" }` 를 추가하여 응답 데이터를 `arraybuffer` 형식으로 받기 <br>
> * arraybuffer : 자바스크립트에서 구현된 버퍼이며 고정된 크기의 메모리 공간에 바이너리 데이터를 저장하는 객체이다. <br>
> * buffer <br>
> : 임시 메모리 공간에 저장하는 Binary 형태의 데이터 객체이다. <br>
> : 바이너리 데이터란, 컴퓨터가 이해할 수 있는 0100 1001 형태의 이진수로 이루어진 데이터를 말한다. <br>
> : 바이너리 데이터는 해석 방식에 따라 문자, 숫자, 배열, 이미지, 오디오 등으로 변환되어 사용된다. <br>
> * 자바스크립트의 buffer <br>
> : 특정 크기의 메모리 공간에 바이너리 데이터를 저장해두는 객체 <br>
> : 데이터가 저장될 메모리의 크기는 개발자가 바이트(byte) 단위로 직접 지정 가능 <br>


(2) iconv.decode 를 사용하여 받은 arraybuffer 를 EUC-KR 인코딩으로 디코드합니다. 
* 계속되는 오류 해결하기 <br>
```bash
npm ERR! code ETARGET
npm ERR! notarget No matching version found for type@module.
npm ERR! notarget In most cases you or one of your dependencies are requesting
npm ERR! notarget a package version that doesn't exist.
npm ERR! A complete log of this run can be found in:
npm ERR! C:\Users\bestsu\AppData\Local\npm-cache\_logs\2023-07-
17T02_05_35_294Z-debug-0.log

PS C:\Users\bestsu\Desktop\백석대학교 크롤링> npm install iconv-lite
npm ERR! code ETARGET
npm ERR! notarget No matching version found for type@module.
npm ERR! notarget In most cases you or one of your dependencies are requesting
npm ERR! notarget a package version that doesn't exist.
npm ERR! A complete log of this run can be found in:
npm ERR! C:\Users\bestsu\AppData\Local\npm-cache\_logs\2023-07-
17T02_18_50_104Z-debug-0.log

```

* iconv-lite 버전 확인하기
```bash
npm show iconv-lite version
```

* 지속적으로 모듈 설치 후 실행한 결과 한글 깨짐 사라짐을 확인할 수 있었다.
> 모듈을 설치한 후 오류가 지속적으로 발생한다면, 모듈 설치 후 컴퓨터를 다시 off/on 하자

![image](https://github.com/oiosu/Uni-crawling/assets/99783474/61668423-d44b-40bb-a723-13aa9850e3f9)




#### 4. 엑셀파일로 만들기 
```bash
npm install xlsx
```
```bash
npm ERR! code ETARGET
npm ERR! notarget No matching version found for type@module.
npm ERR! notarget In most cases you or one of your dependencies are requesting
npm ERR! notarget a package version that doesn't exist.
npm ERR! A complete log of this run can be found in:
npm ERR! C:\Users\bestsu\AppData\Local\npm-cache\_logs\2023-07-
17T04_46_48_106Z-debug-0.log
```

> 위와 같은 오류가 지속적으로 발생 확인

(1) `npm` 최신 버전 확인하기
```bash
npm -v
```

(2) `npm` 최신 버전으로 업그레이드 하기 
```bash
npm install -g npm
```

(3) 다시 `xlsx` 모듈 설치하기 
```bash
npm install xlsx
```

(4) `npm` 캐시 삭제에 대해 알아보기
* 강제 삭제 
```bash
npm cache clean --force
```

(5) 오류 체크 및 해결 
```bash
npm cache verify
```

```bash
// 결과
Cache verified and compressed (~\AppData\Local\npm-cache\_cacache)
Content verified: 15 (5738701 bytes)
Index entries: 15
Finished in 0.136s
```
```bash
캐시 확인 및 압축(~\AppData\Local\npm-cache\_cacache)
확인된 콘텐츠: 15(5738701바이트)
색인 항목: 15
0.136초 만에 완료
```


---

#### [다시 정리]
> 파일 다시 생성하고 npm init -y 후 다시 설치하기
```bash
npm init -y
```
```bash
npm install axios cheerio
```
```bash
npm install xlsx
```
```bash
node --experimental-modules index.mjs
```

> `mjs` 파일 말고 자바스크립트 파일로 실행해도 가능!

