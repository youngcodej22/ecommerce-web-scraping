import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const pagesToScrape = [
        "https://www.mckayson.com/goods/goods_list.php?page=1&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=2&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=3&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=4&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=5&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=6&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=7&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=8&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=9&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=10&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=11&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=12&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=13&cateCd=001",
        "https://www.mckayson.com/goods/goods_list.php?page=14&cateCd=001",
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
                name.includes("스카프")
            ) {
                item.acc = true;
            } else {
                // Optional: Set a default value for other cases
                item.acc = false;
            }
        }

        // ! New는 첫번째 category 한개라서 subCategory 생성 안함

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
        // for (const item of products) {
        //     const name = item.name.toLowerCase();
        //     const gender = item.gender.toLowerCase();

        //     switch (true) {
        //         // * 여성
        //         case (gender.includes("여성용") && name.includes("티셔츠")) ||
        //             (gender.includes("여성용") && name.includes("레이어")) ||
        //             (gender.includes("여성용") &&
        //                 name.includes("베이스레이어")) ||
        //             (gender.includes("여성용") && name.includes("가디건")) ||
        //             (gender.includes("여성용") &&
        //                 name.includes("슬리브리스")) ||
        //             (gender.includes("여성용") && name.includes("블라우스")) ||
        //             (gender.includes("여성용") && name.includes("상의")) ||
        //             (gender.includes("여성용") && name.includes("맨투맨")):
        //             item.size = ["080", "085", "090", "095", "100"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("여성용") && name.includes("스웨터")) ||
        //             (gender.includes("여성용") && name.includes("베스트")) ||
        //             (gender.includes("여성용") && name.includes("니트")):
        //             item.size = [
        //                 "080",
        //                 "085",
        //                 "090",
        //                 "095",
        //                 "100",
        //                 "105",
        //                 "110",
        //             ];
        //             item.season = ["가을", "겨울"];
        //             break;
        //         case (gender.includes("여성용") && name.includes("원피스")) ||
        //             (gender.includes("여성용") && name.includes("점프슈트")):
        //             item.size = ["080", "085", "090", "095"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("여성용") && name.includes("팬츠")) ||
        //             (gender.includes("여성용") && name.includes("레깅스")) ||
        //             (gender.includes("여성용") && name.includes("하의")) ||
        //             (gender.includes("여성용") && name.includes("청바지")) ||
        //             (gender.includes("여성용") && name.includes("조거팬츠")) ||
        //             (gender.includes("여성용") && name.includes("조거 팬츠")):
        //             item.size = [
        //                 "061",
        //                 "064",
        //                 "067",
        //                 "070",
        //                 "073",
        //                 "076",
        //                 "080",
        //                 "084",
        //                 "FRE",
        //             ];
        //             item.season = ["봄", "여름", "가을"];
        //             break;
        //         case (gender.includes("여성용") && name.includes("숏팬츠")) ||
        //             (gender.includes("여성용") && name.includes("숏 팬츠")) ||
        //             (gender.includes("여성용") && name.includes("쇼츠")) ||
        //             (gender.includes("여성용") &&
        //                 name.includes("스커트 팬츠")) ||
        //             (gender.includes("여성용") && name.includes("반바지")) ||
        //             (gender.includes("여성용") &&
        //                 name.includes("버뮤다 팬츠")) ||
        //             (gender.includes("여성용") && name.includes("스커트")) ||
        //             (gender.includes("여성용") && name.includes("랩스커트")) ||
        //             (gender.includes("여성용") && name.includes("큐롯")):
        //             item.size = ["061", "064", "067", "070", "073", "076"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("여성용") && name.includes("자켓")) ||
        //             (gender.includes("여성용") && name.includes("바람막이")) ||
        //             (gender.includes("여성용") &&
        //                 name.includes("윈드 브레이커")) ||
        //             (gender.includes("여성용") && name.includes("점퍼")):
        //             item.size = ["080", "085", "090", "095"];
        //             item.season = ["가을", "겨울"];
        //             break;
        //         case (gender.includes("여성용") && name.includes("카트백")) ||
        //             (gender.includes("여성용") && name.includes("보스턴백")) ||
        //             (gender.includes("여성용") && name.includes("토트백")) ||
        //             (gender.includes("여성용") && name.includes("슬링백")) ||
        //             (gender.includes("여성용") && name.includes("파우치")) ||
        //             (gender.includes("여성용") && name.includes("토시")) ||
        //             (gender.includes("여성용") && name.includes("바이저")) ||
        //             (gender.includes("여성용") && name.includes("햇")) ||
        //             (gender.includes("여성용") && name.includes("버킷백")):
        //             item.size = [
        //                 "00L",
        //                 "00M",
        //                 "018",
        //                 "019",
        //                 "020",
        //                 "021",
        //                 "022",
        //                 "023",
        //                 "024",
        //                 "FRE",
        //                 "230",
        //                 "240",
        //                 "250",
        //                 "260",
        //                 "270",
        //             ];
        //             item.season = ["ALW"];
        //             break;

        //         // * 남성
        //         case (gender.includes("남성용") && name.includes("티셔츠")) ||
        //             (gender.includes("남성용") && name.includes("레이어")) ||
        //             (gender.includes("남성용") &&
        //                 name.includes("베이스레이어")) ||
        //             (gender.includes("남성용") && name.includes("가디건")) ||
        //             (gender.includes("남성용") &&
        //                 name.includes("슬리브리스")) ||
        //             (gender.includes("남성용") && name.includes("상의")) ||
        //             (gender.includes("남성용") && name.includes("맨투맨")):
        //             item.size = ["080", "085", "090", "095", "100"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("남성용") && name.includes("스웨터")) ||
        //             (gender.includes("남성용") && name.includes("베스트")) ||
        //             (gender.includes("남성용") && name.includes("니트")):
        //             item.size = ["095", "100", "105", "110"];
        //             item.season = ["가을", "겨울"];
        //             break;
        //         case (gender.includes("남성용") && name.includes("팬츠")) ||
        //             (gender.includes("남성용") && name.includes("하의")) ||
        //             (gender.includes("남성용") && name.includes("청바지")) ||
        //             (gender.includes("남성용") && name.includes("본딩팬츠")) ||
        //             (gender.includes("남성용") && name.includes("조거팬츠")) ||
        //             (gender.includes("남성용") && name.includes("조거 팬츠")):
        //             item.size = [
        //                 "078",
        //                 "080",
        //                 "082",
        //                 "084",
        //                 "086",
        //                 "088",
        //                 "090",
        //                 "092",
        //             ];
        //             item.season = ["봄", "여름", "가을"];
        //             break;
        //         case (gender.includes("남성용") && name.includes("숏팬츠")) ||
        //             (gender.includes("남성용") && name.includes("숏 팬츠")) ||
        //             (gender.includes("남성용") && name.includes("쇼츠")) ||
        //             (gender.includes("남성용") &&
        //                 name.includes("스커트 팬츠")) ||
        //             (gender.includes("남성용") && name.includes("반바지")) ||
        //             (gender.includes("남성용") &&
        //                 name.includes("버뮤다 팬츠")) ||
        //             (gender.includes("남성용") && name.includes("버뮤다 팬츠")):
        //             item.size = [
        //                 "078",
        //                 "080",
        //                 "082",
        //                 "084",
        //                 "086",
        //                 "088",
        //                 "090",
        //             ];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("남성용") && name.includes("자켓")) ||
        //             (gender.includes("남성용") && name.includes("바람막이")) ||
        //             (gender.includes("남성용") && name.includes("점프슈트")) ||
        //             (gender.includes("남성용") &&
        //                 name.includes("윈드 브레이커")) ||
        //             (gender.includes("남성용") && name.includes("점퍼")):
        //             item.size = ["095", "100", "105", "110", "115"];
        //             item.season = ["가을", "겨울"];
        //             break;
        //         case (gender.includes("남성용") && name.includes("카트백")) ||
        //             (gender.includes("남성용") && name.includes("보스턴백")) ||
        //             (gender.includes("남성용") && name.includes("토트백")) ||
        //             (gender.includes("남성용") && name.includes("슬링백")) ||
        //             (gender.includes("남성용") && name.includes("파우치")) ||
        //             (gender.includes("남성용") && name.includes("토시")) ||
        //             (gender.includes("남성용") && name.includes("바이저")) ||
        //             (gender.includes("남성용") && name.includes("햇")) ||
        //             (gender.includes("남성용") && name.includes("버킷백")):
        //             item.size = [
        //                 "00L",
        //                 "00M",
        //                 "018",
        //                 "019",
        //                 "020",
        //                 "021",
        //                 "022",
        //                 "023",
        //                 "024",
        //                 "FRE",
        //                 "230",
        //                 "240",
        //                 "250",
        //                 "260",
        //                 "270",
        //             ];
        //             item.season = ["ALW"];
        //             break;

        //         // * 공용
        //         case (gender.includes("공용") && name.includes("티셔츠")) ||
        //             (gender.includes("공용") && name.includes("레이어")) ||
        //             (gender.includes("공용") &&
        //                 name.includes("베이스레이어")) ||
        //             (gender.includes("공용") && name.includes("가디건")) ||
        //             (gender.includes("공용") && name.includes("슬리브리스")) ||
        //             (gender.includes("공용") && name.includes("블라우스")) ||
        //             (gender.includes("공용") && name.includes("상의")) ||
        //             (gender.includes("공용") && name.includes("맨투맨")):
        //             item.size = ["080", "085", "090", "095", "100", "105"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("공용") && name.includes("스웨터")) ||
        //             (gender.includes("공용") && name.includes("베스트")) ||
        //             (gender.includes("공용") && name.includes("니트")):
        //             item.size = ["080", "085", "090", "095", "100", "105"];
        //             item.season = ["가을", "겨울"];
        //             break;
        //         case (gender.includes("공용") && name.includes("원피스")) ||
        //             (gender.includes("공용") && name.includes("점프슈트")):
        //             item.size = ["080", "085", "090", "095", "100", "105"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("공용") && name.includes("팬츠")) ||
        //             (gender.includes("공용") && name.includes("레깅스")) ||
        //             (gender.includes("공용") && name.includes("하의")) ||
        //             (gender.includes("공용") && name.includes("청바지")) ||
        //             (gender.includes("공용") && name.includes("조거팬츠")) ||
        //             (gender.includes("공용") && name.includes("조거 팬츠")):
        //             item.size = [
        //                 "061",
        //                 "064",
        //                 "067",
        //                 "070",
        //                 "073",
        //                 "076",
        //                 "080",
        //                 "084",
        //                 "FRE",
        //             ];
        //             item.season = ["봄", "여름", "가을"];
        //             break;
        //         case (gender.includes("공용") && name.includes("숏팬츠")) ||
        //             (gender.includes("공용") && name.includes("숏 팬츠")) ||
        //             (gender.includes("공용") && name.includes("쇼츠")) ||
        //             (gender.includes("공용") && name.includes("스커트 팬츠")) ||
        //             (gender.includes("공용") && name.includes("반바지")) ||
        //             (gender.includes("공용") && name.includes("버뮤다 팬츠")) ||
        //             (gender.includes("공용") && name.includes("스커트")) ||
        //             (gender.includes("공용") && name.includes("랩스커트")) ||
        //             (gender.includes("공용") && name.includes("큐롯")):
        //             item.size = ["061", "064", "067", "070", "073", "076"];
        //             item.season = ["봄", "여름"];
        //             break;
        //         case (gender.includes("공용") && name.includes("자켓")) ||
        //             (gender.includes("공용") &&
        //                 name.includes("윈드 브레이커")) ||
        //             (gender.includes("공용") && name.includes("점퍼")):
        //             item.size = ["080", "085", "090", "095"];
        //             item.season = ["가을", "겨울"];
        //             break;
        //         case (gender.includes("공용") && name.includes("볼케이스")) ||
        //             (gender.includes("공용") && name.includes("키링")) ||
        //             (gender.includes("공용") && name.includes("볼파우치")) ||
        //             (gender.includes("공용") && name.includes("거리측정기")) ||
        //             (gender.includes("공용") && name.includes("우산")) ||
        //             (gender.includes("공용") && name.includes("볼마커")) ||
        //             (gender.includes("공용") && name.includes("보스턴백")) ||
        //             (gender.includes("공용") && name.includes("캐디백")) ||
        //             (gender.includes("공용") && name.includes("헌팅캡")) ||
        //             (gender.includes("공용") && name.includes("웨지 커버")) ||
        //             (gender.includes("공용") && name.includes("볼캡")) ||
        //             (gender.includes("공용") && name.includes("항공커버")):
        //             item.size = ["FRE"];
        //             item.season = ["ALW"];
        //             break;
        //         case gender.includes("공용") && name.includes("골프화"):
        //             item.size = ["230", "240", "250", "260", "270", "280"];
        //             item.season = ["ALW"];
        //             break;
        //         case gender.includes("unspecified"):
        //             item.size = ["FRE"];
        //             item.season = ["ALW"];
        //             break;
        //         default:
        //             item.size = ["FRE"];
        //             item.season = ["ALW"];
        //     }
        // }

        function determineSizeAndSeason(gender, name) {
            const config = {
                여성용: {
                    "티셔츠,레이어,베이스레이어,가디건,슬리브리스,블라우스,상의,맨투맨":
                        {
                            size: ["080", "085", "090", "095", "100"],
                            season: ["봄", "여름"],
                        },
                    "스웨터,베스트,니트": {
                        size: ["080", "085", "090", "095", "100", "105", "110"],
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
                    "카트백,보스턴백,토트백,슬링백,파우치,토시,바이저,햇,버킷백":
                        {
                            size: [
                                "00L",
                                "00M",
                                "018",
                                "019",
                                "020",
                                "021",
                                "022",
                                "023",
                                "024",
                                "FRE",
                                "230",
                                "240",
                                "250",
                                "260",
                                "270",
                            ],
                            season: ["ALW"],
                        },
                },
                남성용: {
                    // Similar structure as "여성용"
                },
                공용: {
                    // Similar structure as "여성용"
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
        "./data/products/products_new.json",
        JSON.stringify(allProducts),
        (err) => {
            if (err) throw err;
            console.log("File saved");
        }
    );

    await browser.close();
}

run();
