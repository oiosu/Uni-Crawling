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

