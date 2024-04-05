import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const pagesToScrape = [
        "https://www.mckayson.com/goods/goods_list.php?page=1&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=2&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=3&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=4&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=5&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=6&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=7&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=8&cateCd=008",
        "https://www.mckayson.com/goods/goods_list.php?page=9&cateCd=008",
    ];

    // * insert value for "date"
    function generateRandomDate(start, end) {
        return new Date(
            start.getTime() + Math.random() * (end.getTime() - start.getTime())
        )
            .toISOString()
            .slice(0, 10); // Format: YYYY-MM-DD
    }
    const startDate = new Date("2022-01-01");
    const endDate = new Date("2024-12-31");

    // * insert value for "like"
    function generateRandomLikeCount(minLikes, maxLikes) {
        // Ensure minLikes is smaller than maxLikes
        if (minLikes > maxLikes) {
            [minLikes, maxLikes] = [maxLikes, minLikes]; // Swap values
        }

        const likeRange = maxLikes - minLikes;
        const randomLikes =
            Math.floor(Math.random() * (likeRange + 1)) + minLikes;
        return randomLikes;
    }
    const minLikes = 50;
    const maxLikes = 2000;

    // * insert value for "sale"
    function generateRandomSaleCount(minSales, maxSales) {
        // Ensure minSales is smaller than maxSales
        if (minSales > maxSales) {
            [minSales, maxSales] = [maxSales, minSales]; // Swap values
        }

        const saleRange = maxSales - minSales;
        const randomSales =
            Math.floor(Math.random() * (saleRange + 1)) + minSales;
        return randomSales;
    }
    const minSales = 10;
    const maxSales = 1000;

    // * generate Data and scraping
    let allProducts = [];
    for (const url of pagesToScrape) {
        await page.goto(url);

        // Scrape the current page
        const products = await page.$$eval(
            "#container .item_cont",
            (elements) =>
                elements.map((e) => ({
                    category: e.querySelector(
                        ".item_info_cont .item_tit_box .cate_name"
                    ).innerText,
                    name: e.querySelector(
                        ".item_info_cont .item_tit_box .item_name"
                    ).innerText,
                    price: e.querySelector(
                        ".item_info_cont .item_money_box .item_price span"
                    ).innerText,
                    image: e.querySelector(".item_photo_box img").src,
                    labels: Array.from(
                        e.querySelectorAll(
                            ".item_info_cont .item_icon_box img"
                        ),
                        (imgEl) => [imgEl.src, imgEl.alt] // Create an array of [src, alt] pairs
                    ),
                }))
        );

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

        // * 추가: date
        for (const item of products) {
            item.date = generateRandomDate(startDate, endDate);
        }

        // * 추가 like
        for (const item of products) {
            item.like = generateRandomLikeCount(minLikes, maxLikes);
        }

        // * 추가 sale (sellcnt)
        for (const item of products) {
            item.sale = generateRandomSaleCount(minSales, maxSales);
        }

        // Combine the products from this page with the overall list
        allProducts = allProducts.concat(products);
    }

    // console.log("All products: ", allProducts);

    // * save data to JSON file
    fs.writeFile(
        "./data/products/products_acc.json",
        JSON.stringify(allProducts),
        (err) => {
            if (err) throw err;
            console.log("File saved");
        }
    );

    await browser.close();
}

run();
