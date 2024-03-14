# ecommerce-web-scraping

custom-ecommerce-refactoring Repository를 위한 crawling

## packages

-   cheerio

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

---

## 참고

-   [ByteGrad](https://www.youtube.com/watch?v=BGzK0xd-F5A)
-   [Josh tried coding](https://www.youtube.com/watch?v=9zwyfrVv3hg)
-   [TraversyMedia](https://www.youtube.com/watch?v=S67gyqnYHmI)
-   [tabnine-cheerio, get image](https://www.tabnine.com/code/javascript/functions/cheerio/src)

7:36초
