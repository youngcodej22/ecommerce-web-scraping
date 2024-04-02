import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        "https://www.mckayson.com/goods/goods_list.php?page=3&cateCd=001"
    );

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
    fs.writeFile("./data/product_new.json", JSON.stringify(products), (err) => {
        if (err) throw err;
        console.log("File saved");
    });

    await browser.close();
}

run();
