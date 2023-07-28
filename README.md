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


#### 1-(4) `iconv`  vs `iconv-lite`
|iconv|iconv-lite|
|------|---|
| `npm install iconv` | `npm install iconv` |
|문자코드를 다른 문자코드로 변환|문자코드를 utf-8 로 변환 또는 utf-8 을 다른 문자로 변환 <br> ( utf-8을 기준으로 동작) <br> npm install detect-character-encoding <br> => 문자열이 인코딩된 형태를 확인 하는 패키지 <br>|


