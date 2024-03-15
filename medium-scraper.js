/**
 * * puppeteer는 2가지 버전 존재
 * * - puppeteer와 puppeteer-core (brightdata툴과 같이 사용 가능)
 */

// https://mckayson.com/goods/goods_list.php?cateCd=001

import puppeteer from "puppeteer";

async function getProductData() {
    let browser;

    try {
        // launch browser and open new blank page
        browser = await puppeteer.launch();
        const page = await browser.newPage();

        // set viewport
        await page.setViewport({
            width: 1080,
            height: 768,
        });

        // change navigation timeout from default 30 seconds to 2 minutes
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        // navigate to url
        // product페이지 아니라 홈
        await page.goto("https://www.mckayson.com");

        // https://www.mckayson.com/goods/goods_list.php?cateCd=001
        // click on link to products page
        // await page.click("a[href='/goods/goods_list.php?cateCd=001");

        // wait for next page button to appear
        // button a태그 등 해당하는 것을 넣자
        // await page.waitForSelector("pagination ul li a");

        // get products data
        const productData = [];

        const productElements = await page.$$("#container .item_cont");

        productElements.forEach(async (el, index) => {
            // const image = await el.$eval(".item_photo_box > a > img", (el) => el.getAttribute("src"));
            const category = await el.$eval(
                ".item_info_cont > .item_tit_box > .cate_name > a",
                (el) => el.textContent
            );
            const name = await el.$eval(
                ".item_info_cont > .item_tit_box > a > .item_name",
                (el) => el.textContent
            );
            const price = await el.$eval(
                ".item_info_cont > .item_money_box > .flex_box > .item_price.1 > span",
                (el) => el.textContent
            );

            // const labels = [];
            // for (const el of productElements) {
            //     const iconBoxElements = await el.$$(
            //         ".item_info_cont .item_icon_box"
            //     );

            //     for (const iconBoxElement of iconBoxElements) {
            //         const labelSrc = await iconBoxElement.$eval("img", (img) =>
            //             img.getAttribute("src")
            //         );
            //         labels.push(labelSrc);
            //     }
            // }

            // console.log(labels);

            productData.push({
                // image,
                category,
                name,
                price,
                // labels,
            });

            // log data
            if (index === productElements.lenght - 1) {
                console.log(productData);
                await browser?.close();
            }
        });
    } catch (e) {
        console.log("error: ", e);
        await browser?.close();
    }
    // finally {
    // ! 여기에 있으면 에러 발생.
    // TargetCloseError: Protocol error (DOM.resolveNode): Target closed at CallbackRegistry.clear
    // await browser?.close();
    // }
}

getProductData();
