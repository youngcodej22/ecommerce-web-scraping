import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const pagesToScrape = [
        "https://www.mckayson.com/goods/goods_list.php?page=1&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=2&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=3&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=4&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=5&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=6&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=7&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=8&cateCd=003",
        "https://www.mckayson.com/goods/goods_list.php?page=9&cateCd=003",
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

        // * 컬러
        for (const item of products) {
            const name = item.name.toLowerCase();

            switch (true) {
                case name.includes("화이트"):
                    item.color = "화이트";
                    break;
                case name.includes("블랙"):
                    item.color = "블랙";
                    break;
                case name.includes("네이비"):
                    item.color = "네이비";
                    break;
                case name.includes("베이지"):
                case name.includes("라이트베이지"):
                    item.color = "베이지";
                    break;
                case name.includes("핑크"):
                    item.color = "핑크";
                    break;
                case name.includes("코랄"):
                    item.color = "코랄";
                    break;
                case name.includes("그린"):
                case name.includes("다크그린"):
                    item.color = "그린";
                    break;
                case name.includes("블루"):
                    item.color = "블루";
                    break;
                case name.includes("라임"):
                    item.color = "라임";
                    break;
                case name.includes("오렌지"):
                    item.color = "오렌지";
                    break;
                case name.includes("레드"):
                    item.color = "레드";
                    break;
                case name.includes("퍼플"):
                    item.color = "퍼플";
                    break;
                case name.includes("민트"):
                    item.color = "민트";
                    break;
                case name.includes("그레이"):
                case name.includes("차콜"):
                case name.includes("다크그레이"):
                case name.includes("라이트그레이"):
                    item.color = "그레이";
                    break;
                case name.includes("카키"):
                    item.color = "카키";
                    break;
                case name.includes("아이보리"):
                    item.color = "아이보리";
                    break;
                default:
                    item.color = "무색";
            }
        }

        // * acc
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
                name.includes("스카프") ||
                name.includes("웨지 커버")
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
                case name.includes("베이스레이어"):
                case name.includes("맨투맨"):
                case name.includes("상의"):
                    item.subCategory = "상의";
                    item.thirdCategory = "티셔츠";
                    break;
                case name.includes("스웨터"):
                    item.subCategory = "상의";
                    item.thirdCategory = "스웨터";
                    break;
                case name.includes("팬츠"):
                case name.includes("청바지"):
                case name.includes("조거팬츠"):
                case name.includes("조거 팬츠"):
                case name.includes("두잉 팬츠"):
                case name.includes("하의"):
                    item.subCategory = "하의";
                    item.thirdCategory = "팬츠";
                    break;
                case name.includes("숏팬츠"):
                case name.includes("반바지"):
                case name.includes("버뮤다 팬츠"):
                case name.includes("쇼츠"):
                    item.subCategory = "하의";
                    item.thirdCategory = "숏팬츠";
                    break;
                case name.includes("자켓"):
                case name.includes("집업"):
                case name.includes("윈드브레이커"):
                case name.includes("윈드 브레이커"):
                case name.includes("바람막이"):
                case name.includes("점프슈트"):
                    item.subCategory = "아우터";
                    item.thirdCategory = "점퍼";
                    break;
                case name.includes("베스트"):
                    item.subCategory = "아우터";
                    item.thirdCategory = "베스트";
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

        // todo: insert value for "filtering", 성별, 컬러, 사이즈, 계절, 가격
        // * 성별
        for (const item of products) {
            const genderLabel = item.labels.find((label) =>
                ["여성용", "남성용", "공용"].includes(label[1])
            );
            if (genderLabel) {
                item.gender = genderLabel[1]; // Assigns "여성용", "남성용", or "공용"
            } else {
                item.gender = "Unspecified"; // Default value if no gender-specific label is found
            }
        }

        // * 사이즈 , 계절
        function determineSizeAndSeason(gender, name) {
            const config = {
                여성용: {
                    "티셔츠,레이어,베이스레이어,가디건,슬리브리스,블라우스,상의,맨투맨":
                        {
                            size: ["080", "085", "090", "095", "100"],
                            season: ["봄", "여름"],
                        },
                    "스웨터,베스트,니트": {
                        size: ["080", "085", "090", "095", "100", "105"],
                        season: ["가을", "겨울"],
                    },
                    "원피스,점프슈트": {
                        size: ["080", "085", "090", "095"],
                        season: ["봄", "여름"],
                    },
                    "팬츠,레깅스,하의,청바지,조거팬츠,조거 팬츠": {
                        size: [
                            "061",
                            "064",
                            "067",
                            "070",
                            "073",
                            "076",
                            "080",
                            "084",
                            "FRE",
                        ],
                        season: ["봄", "여름", "가을"],
                    },
                    "숏팬츠,숏 팬츠,쇼츠,스커트 팬츠,반바지,버뮤다 팬츠,스커트,랩스커트,큐롯":
                        {
                            size: ["061", "064", "067", "070", "073", "076"],
                            season: ["봄", "여름"],
                        },
                    "자켓,바람막이,윈드 브레이커,점퍼": {
                        size: ["080", "085", "090", "095"],
                        season: ["가을", "겨울"],
                    },
                    "캐디백,항공커버,하프백,보스턴백,토트백,버킷백,카트백,파우치,힙색,케이스,볼파우치,슬링백,볼케이스,토시,버킷백,양말,니삭스,장갑,양손장갑,양손 장갑,키링,슈즈,롱부츠,부츠,골프화,슈즈,스파이크,마스크,방한마스크,방한 마스크,넥워머,워머,레그워머,핸드워머,토시,벨트":
                        {
                            size: ["FRE"],
                            season: ["ALW"],
                        },
                    "바이저,바이져,포인트,볼캡,헌팅캡,캠프캡,캡비니,방한모자,버킷햇,버킷 햇,햇":
                        {
                            size: ["00L", "00M", "FRE"],
                            season: ["ALW"],
                        },
                    "골프화": {
                        size: ["230", "240", "250", "260", "270", "280"],
                        season: ["ALW"],
                    },
                },
                남성용: {
                    "티셔츠,레이어,베이스레이어,가디건,슬리브리스,상의,맨투맨":
                        {
                            size: ["095", "100", "105", "110"],
                            season: ["봄", "여름"],
                        },
                    "스웨터,베스트,니트": {
                        size: ["095", "100", "105", "110"],
                        season: ["가을", "겨울"],
                    },
                    "팬츠,하의,청바지,본딩팬츠,조거팬츠,조거 팬츠": {
                        size: [
                            "078",
                            "080",
                            "082",
                            "084",
                            "086",
                            "088",
                            "090",
                            "092",
                        ],
                        season: ["봄", "여름", "가을"],
                    },
                    "숏팬츠,숏 팬츠,쇼츠,반바지,버뮤다 팬츠": {
                        size: [
                            "078",
                            "080",
                            "082",
                            "084",
                            "086",
                            "088",
                            "090",
                            "092",
                        ],
                        season: ["봄", "여름"],
                    },
                    "자켓,바람막이,윈드 브레이커,점퍼,점프슈트": {
                        size: ["095", "100", "105", "110"],
                        season: ["가을", "겨울"],
                    },
                    "캐디백,항공커버,하프백,보스턴백,토트백,버킷백,카트백,파우치,힙색,케이스,볼파우치,슬링백,볼케이스,토시,버킷백,양말,니삭스,장갑,양손장갑,양손 장갑,키링,슈즈,롱부츠,부츠,골프화,슈즈,스파이크,마스크,방한마스크,방한 마스크,넥워머,워머,레그워머,핸드워머,토시,벨트":
                        {
                            size: ["FRE"],
                            season: ["ALW"],
                        },
                    "바이저,바이져,포인트,볼캡,헌팅캡,캠프캡,캡비니,방한모자,버킷햇,버킷 햇,햇":
                        {
                            size: ["00L", "00M", "FRE"],
                            season: ["ALW"],
                        },
                    "골프화": {
                        size: ["230", "240", "250", "260", "270", "280"],
                        season: ["ALW"],
                    },
                },
                공용: {
                    "티셔츠,레이어,베이스레이어,가디건,슬리브리스,블라우스,상의,맨투맨":
                        {
                            size: [
                                "080",
                                "085",
                                "090",
                                "095",
                                "100",
                                "105",
                                "110",
                            ],
                            season: ["봄", "여름"],
                        },
                    "스웨터,베스트,니트": {
                        size: ["080", "085", "090", "095", "100", "105", "110"],
                        season: ["가을", "겨울"],
                    },
                    "원피스,점프슈트": {
                        size: ["080", "085", "090", "095", "100", "105"],
                        season: ["봄", "여름"],
                    },
                    "팬츠,하의,청바지,레깅스,본딩팬츠,조거팬츠,조거 팬츠": {
                        size: [
                            "078",
                            "080",
                            "082",
                            "084",
                            "086",
                            "088",
                            "090",
                            "092",
                        ],
                        season: ["봄", "여름", "가을"],
                    },
                    "숏팬츠,숏 팬츠,쇼츠,반바지,버뮤다 팬츠": {
                        size: [
                            "078",
                            "080",
                            "082",
                            "084",
                            "086",
                            "088",
                            "090",
                            "092",
                        ],
                        season: ["봄", "여름"],
                    },
                    "자켓,바람막이,윈드 브레이커,점퍼,점프슈트": {
                        size: ["080", "085", "090", "095", "100", "105", "110"],
                        season: ["가을", "겨울"],
                    },
                    "캐디백,항공커버,하프백,보스턴백,토트백,버킷백,카트백,파우치,힙색,케이스,볼파우치,슬링백,볼케이스,토시,버킷백,양말,니삭스,장갑,양손장갑,양손 장갑,키링,슈즈,롱부츠,부츠,골프화,슈즈,스파이크,마스크,방한마스크,방한 마스크,넥워머,워머,레그워머,핸드워머,토시,벨트":
                        {
                            size: ["FRE"],
                            season: ["ALW"],
                        },
                    "바이저,바이져,포인트,볼캡,헌팅캡,캠프캡,캡비니,방한모자,버킷햇,버킷 햇,햇":
                        {
                            size: ["00L", "00M", "FRE"],
                            season: ["ALW"],
                        },
                    "골프화": {
                        size: ["230", "240", "250", "260", "270", "280"],
                        season: ["ALW"],
                    },
                    "볼케이스,키링,볼파우치,거리측정기,우산,볼마커,웨지 커버, 항공커버, 항공 커버":
                        {
                            size: ["FRE"],
                            season: ["ALW"],
                        },
                },
            };

            for (const key in config[gender]) {
                const items = key.split(",");
                if (items.some((item) => name.includes(item))) {
                    return config[gender][key];
                }
            }

            return { size: ["FRE"], season: ["ALW"] }; // Default case
        }

        for (const item of products) {
            const name = item.name.toLowerCase();
            const gender = item.gender.toLowerCase();
            const { size, season } = determineSizeAndSeason(gender, name);
            item.size = size;
            item.season = season;
        }

        // Combine the products from this page with the overall list
        allProducts = allProducts.concat(products);
    }

    // console.log("All products: ", allProducts);

    // * save data to JSON file
    fs.writeFile(
        "./data/products/products_men.json",
        JSON.stringify(allProducts),
        (err) => {
            if (err) throw err;
            console.log("File saved");
        }
    );

    await browser.close();
}

run();
