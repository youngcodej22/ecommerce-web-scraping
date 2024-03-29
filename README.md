# ecommerce-web-scraping

custom-ecommerce-refactoring Repository를 위한 crawling

## usage

`package.json`파일에 `scripts`에 해당하는 파일로 변경해서 사용

## packages

-   cheerio

### 사용해볼 것

**중요! web scraping을 하기 어려운 사이트들도 있다.**

-   보안이 견고해서 scraping하는 사람이 접근하기 못하게 할 수도 있다.
-   갑자기 HTML구조가 변경될 수도 있다. (유저가 hover하거나 클릭 등 어려가지 부분들도 포함)

이러한 부분들을 쉽게 해결하기 위해 도움을 주는 도구들이 있다.

-   Bright Data
-   [puppeteer](https://www.npmjs.com/package/puppeteer)
-   selenium
-   playwright

---

## error

### 1. node, import error (node.js에서 import 사용 시 에러 발생)

-   에러

```sh
(node:14744) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension.
(Use `node --trace-warnings ...` to show where the warning was created)
C:\Users\YB\Documents\dev\projects\ecommerce-web-scraping\simple-scraper.js:1
import * as cheerio from 'cheerio';
^^^^^^

SyntaxError: Cannot use import statement outside a module
    at internalCompileFunction (node:internal/vm:73:18)
    at wrapSafe (node:internal/modules/cjs/loader:1176:20)
    at Module._compile (node:internal/modules/cjs/loader:1218:27)
    at Module._extensions..js (node:internal/modules/cjs/loader:1308:10)
    at Module.load (node:internal/modules/cjs/loader:1117:32)
    at Module._load (node:internal/modules/cjs/loader:958:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47
```

-   해결
    -   package.json에 `"type": "module"`을 넣는다.

<br />

### 2. cheerio 사용 시 tag 선택 주의

-   문제
    -   예를 들어, `div>.wrap>.product>p`가 있을 때, `div>.p`를 찾을 수 없다.
-   해결
    -   `div p` 이런 식으로 하든가, CSS 선택자를 정확하게 작성해야한다.

<br />

### 3 cheerio 사용 중 product label에서 array를 제거하는 방법 (spread연산자)

-   문제

```js
// ** 크롤링을 하는 과정에서 .wrap>(div>img*3) 형식의 마크업이었다. 아래 코드의 경우 labels.push(labelSrc);를 하게 되면 이중 배열이 되어서 배열을 제거해야했다.
const labels = [];
$(element)
    .find(".item_info_cont .item_icon_box")
    .each((index, imgEl) => {
        const labelSrc = $(imgEl)
            .find("img")
            .map((i, img) => $(img).attr("src"))
            .get();

        // 이중배열 문제!
        // labels.push(labelSrc);
        labels.push(...labelSrc);
    });
```

-   해결
    -   결국 `labels.push(...labelSrc);` Spread 연산자로 해결하였다.

<br />

## 특이사항

-   문제
    -   기존에 사이트에 있는 데이터에는 `"acc"`라는 데이터가 없다.
    -   그렇지만 현재 만들고 있는 쇼핑몰 프로젝트에서 스크래핑한 데이터 + `"acc": true`와 같은 데이터를 합치고 싶었다.
-   해결
    -   **기존에 스크래핑한 데이터 중 `"name"` 데이터에서 acc(악세서리)에 해당하는 키워드를 파악. (햇, 볼캡, 등...)**
    -   아래 코드 참고. `includes()`를 이용해서 데이터를 추가시켰다.

```js
// mackayson-home.js
// ...위에는 puppeteer를 이용한 스크래핑한 기존 코드

// todo: acc에 해당하는 아래 키워드에 해당하는 것만 true로 한다.
// * acc 카테고리 키워드: 햇, 볼캡, 파우치, 보스턴백, 양말, 니삭스,
for (const item of products) {
    const name = item.name.toLowerCase();
    if (
        name.includes("햇") ||
        name.includes("볼캡") ||
        name.includes("파우치") ||
        name.includes("보스턴백") ||
        name.includes("양말") ||
        name.includes("니삭스")
    ) {
        item.acc = true;
    } else {
        // Optional: Set a default value for other cases
        item.acc = false;
    }
}
```

<br />

---

## 참고

-   [ByteGrad](https://www.youtube.com/watch?v=BGzK0xd-F5A)
-   [Josh tried coding](https://www.youtube.com/watch?v=9zwyfrVv3hg)
-   [TraversyMedia](https://www.youtube.com/watch?v=S67gyqnYHmI)
-   [Michael Kitas](https://www.youtube.com/watch?v=URGkzNC-Nwo&list=PLuJJZ-W1NwdqgvE0D-1SMS7EpWIC5cKqu)
-   [beyond fireship](https://www.youtube.com/watch?v=qo_fUjb02ns)
-   [tabnine-cheerio, get image](https://www.tabnine.com/code/javascript/functions/cheerio/src)
-   [mackayson](https://www.mckayson.com/)
