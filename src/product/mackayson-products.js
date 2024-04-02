import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        "https://www.mckayson.com/goods/goods_list.php?page=2&cateCd=001004"
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
            name.includes("양말") ||
            name.includes("니삭스") ||
            name.includes("캐디백") ||
            name.includes("항공커버") ||
            name.includes("보스턴백") ||
            name.includes("토트백") ||
            name.includes("버킷백") ||
            name.includes("파우치") ||
            name.includes("힙색") ||
            name.includes("케이스") ||
            name.includes("볼케이스") ||
            name.includes("볼파우치") ||
            name.includes("바이져") ||
            name.includes("바이저") ||
            name.includes("헌팅캡") ||
            name.includes("캠프캡") ||
            name.includes("버킷햇") ||
            name.includes("버킷 햇") ||
            name.includes("베레모") ||
            name.includes("모자") ||
            name.includes("장갑") ||
            name.includes("양손장갑") ||
            name.includes("골프장갑") ||
            name.includes("네임택") ||
            name.includes("슈즈") ||
            name.includes("골프화") ||
            name.includes("롱부츠") ||
            name.includes("벨트") ||
            name.includes("머니클립") ||
            name.includes("골프볼") ||
            name.includes("마프") ||
            name.includes("레깅스") ||
            name.includes("팔토시") ||
            name.includes("스카프")
        ) {
            item.acc = true;
        } else {
            // Optional: Set a default value for other cases
            item.acc = false;
        }
    }

    // todo: subCategory 생성, category에 정확한 값 넣기
    for (const item of products) {
        const name = item.name.toLowerCase();
        // if (name.includes("티셔츠")) {
        //     item.subCategory = "티셔츠";
        // } else if (name.includes("팬츠")) {
        //     item.subCategory = "팬츠";
        // }
        switch (true) {
            case name.includes("티셔츠"):
            case name.includes("블라우스"):
            case name.includes("베이스레이어"):
            case name.includes("상의"):
            case name.includes("맨투맨"):
            case name.includes("니트"):
                item.subCategory = "티셔츠";
                break;
            case name.includes("팬츠"):
            case name.includes("하의"):
            case name.includes("청바지"):
            case name.includes("조거팬츠"):
            case name.includes("조거 팬츠"):
                item.subCategory = "팬츠";
                break;
            case name.includes("스웨터"):
                item.subCategory = "스웨터";
                break;
            case name.includes("숏팬츠"):
            case name.includes("숏 팬츠"):
            case name.includes("스커트 팬츠"):
            case name.includes("반바지"):
            case name.includes("버뮤다 팬츠"):
                item.subCategory = "숏팬츠";
                break;
            case name.includes("스커트"):
            case name.includes("큐롯"):
                item.subCategory = "스커트";
                break;
            case name.includes("원피스"):
            case name.includes("점프슈트"):
                item.subCategory = "원피스";
                break;
            case name.includes("자켓"):
            case name.includes("점퍼"):
            case name.includes("바람막이"):
            case name.includes("윈드 브레이커"):
                item.subCategory = "아우터";
                break;
            case name.includes("베스트"):
                item.subCategory = "베스트";
                break;
        }
    }

    console.log("products: ", products);

    // * save data to JSON file
    // fs.writeFile(
    //     "./data/products/product_new_1.json",
    //     JSON.stringify(products),
    //     (err) => {
    //         if (err) throw err;
    //         console.log("File saved");
    //     }
    // );

    await browser.close();
}

run();
