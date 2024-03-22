import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.mckayson.com");

    // 웹 페이지 이미지 스크랩핑
    // await page.screenshot({ path: "example.png", fullPage: true });
    // await page.pdf({ path: "example.pdf", format: "A4" });

    // const html = await page.content();
    // const title = await page.evaluate(() => document.title);
    // const text = await page.evaluate(() => document.body.innerText);
    // const links = await page.evaluate(() => Array.from(document.querySelectorAll("a"), (e) => e.href))

    // * 방법 1
    // ! Error: cannot read properties innerText : ".item_info_cont  .cate_name a"가 없는 경우도 있어서 ".item_info_cont .item_tit_box .cate_name"의 innerText로 처리
    // const products = await page.evaluate(() =>
    //     Array.from(document.querySelectorAll("#container .item_cont"), (e) => ({
    //         category: e.querySelector(
    //             ".item_info_cont .item_tit_box .cate_name"
    //         ).innerText,
    //         name: e.querySelector(".item_info_cont .item_tit_box .item_name")
    //             .innerText,
    //         price: e.querySelector(
    //             ".item_info_cont .item_money_box .item_price span"
    //         ).innerText,
    //         image: e.querySelector(".item_photo_box img").src,
    //         labels: Array.from(
    //             e.querySelectorAll(".item_info_cont .item_icon_box img"),
    //             (imgEl) => imgEl.src
    //         ),
    //     }))
    // );

    // * 방법 2 (Array.from()없이)
    // const products = await page.$$eval("#container .item_cont", (elements) =>
    //     elements.map((e) => ({
    //         category: e.querySelector(
    //             ".item_info_cont .item_tit_box .cate_name"
    //         ).innerText,
    //         name: e.querySelector(".item_info_cont .item_tit_box .item_name")
    //             .innerText,
    //         price: e.querySelector(
    //             ".item_info_cont .item_money_box .item_price span"
    //         ).innerText,
    //         image: e.querySelector(".item_photo_box img").src,
    //         labels: {
    //             labelImage: Array.from(
    //                 e.querySelectorAll(".item_info_cont .item_icon_box img"),
    //                 (imgEl) => imgEl.src
    //             ),
    //             labelAlt: Array.from(
    //                 e.querySelectorAll(".item_info_cont .item_icon_box img"),
    //                 (imgEl) => imgEl.alt
    //             ),
    //         },
    //     }))
    // );

    // todo: scraping에 없는 데이터 acc를 넣는다. (tabs에서 상품 구분을 위해)
    // todo: 데이터를 스크래핑할 때 기존 사이트에서 가지고 있지 않는 acc 데이터 추가
    const products = await page.$$eval("#container .item_cont", (elements) =>
        elements.map((e) => ({
            category: e.querySelector(
                ".item_info_cont .item_tit_box .cate_name"
            ).innerText,
            name: e.querySelector(".item_info_cont .item_tit_box .item_name")
                .innerText,
            price: e.querySelector(
                ".item_info_cont .item_money_box .item_price span"
            ).innerText,
            image: e.querySelector(".item_photo_box img").src,
            labels: Array.from(
                e.querySelectorAll(".item_info_cont .item_icon_box img"),
                (imgEl) => [imgEl.src, imgEl.alt] // Create an array of [src, alt] pairs
            ),
        }))
    );

    // const products = await page.$$eval("#container .item_cont", (elements) =>
    //     elements.map((e) => {
    //         console.log("e:", e);
    //         return {
    //             name: e.querySelector(
    //                 ".item_info_cont .item_tit_box .item_name"
    //             ).innerText,
    //         };
    //     })
    // );

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

    // console.log("products: ", products);

    // * save data to JSON file
    fs.writeFile("./data/homeproduct.json", JSON.stringify(products), (err) => {
        if (err) throw err;
        console.log("File saved");
    });

    await browser.close();
}

run();
