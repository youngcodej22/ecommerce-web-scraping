import fs from "fs";
import puppeteer from "puppeteer";
import ColorThief from "colorthief";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ! dominantColor의 rgb를 가지고 블랙, 화이트 처럼 색깔 분류 함수
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function classifyColor(rgb) {
    const [r, g, b] = rgb;
    const [h, s, l] = rgbToHsl(r, g, b);

    if (h <= 0 && s <= 0 && l <= 0) return "블랙";
    if (h >= 0 && s <= 0 && l >= 100) return "화이트";
    if (l >= 10 && l < 40) return "다크그레이";
    if (l >= 40 && l < 60) return "그레이";
    if (l >= 60 && l < 90) return "라이트그레이";

    // if (h >= 0 && h < 15 && s >= 80 && l >= 80) return "레드";
    // if (h >= 15 && h < 30) return "버건디";
    // if (h >= 30 && h < 45) return "와인";
    // if (h >= 45 && h < 60) return "카멜";
    // if (h >= 60 && h < 75) return "오렌지";
    // if (h >= 75 && h < 90) return "골드";
    // if (h >= 90 && h < 105) return "옐로우";
    // if (h >= 105 && h < 120) return "핑크";
    // if (h >= 120 && h < 135) return "라이트그린";
    // if (h >= 135 && h < 150) return "그린";
    // if (h >= 150 && h < 165) return "민트";
    // if (h >= 165 && h < 180) return "라이트블루";
    // if (h >= 180 && h < 195) return "블루";
    // if (h >= 195 && h < 210) return "네이비";
    // if (h >= 210 && h < 225) return "퍼플";
    // if (h >= 225 && h < 240) return "베이지";
    // if (h >= 240 && h < 255) return "아이보리";
    // if (h >= 255 && h < 270) return "실버";
    // if (h >= 270 && h < 285) return "카키";
    // if (h >= 285 && h < 300) return "브라운";
    // if (h >= 300 && h < 315) return "코랄";
    // if (h >= 315 && h < 330) return "라임";
    // if (h >= 330 && h < 345) return "차콜";
    // if (h >= 345 && h < 360) return "라이트베이지";
    // if (h >= 150 && h < 165) return "다크그린";

    // if (h >= 300 && h < 315) return "퍼플";
    // if (h >= 315 && h < 330) return "베이지";
    // if (h >= 330 && h < 345) return "아이보리";

    if (h >= 0 && h < 15 && s >= 80 && l >= 80) return "레드";
    if (h >= 15 && h < 30 && s >= 80 && l >= 60 && l < 70) return "버건디";
    if (h >= 30 && h < 45 && s >= 50 && l >= 50 && l < 60) return "와인";
    if (h >= 45 && h < 60 && s >= 50 && l >= 50 && l < 70) return "카멜";
    if (h >= 60 && h < 75 && s >= 70 && l >= 50 && l < 70) return "오렌지";
    if (h >= 75 && h < 90 && s >= 70 && l >= 50 && l < 70) return "골드";
    if (h >= 90 && h < 105 && s >= 70 && l >= 50 && l < 70) return "옐로우";
    if (h >= 105 && h < 120 && s >= 50 && l >= 60 && l < 80) return "핑크";
    if (h >= 120 && h < 135 && s >= 50 && l >= 50 && l < 70)
        return "라이트그린";
    if (h >= 135 && h < 150 && s >= 50 && l >= 40 && l < 60) return "그린";
    if (h >= 150 && h < 165 && s >= 50 && l >= 50 && l < 70) return "민트";
    if (h >= 165 && h < 180 && s >= 50 && l >= 50 && l < 70)
        return "라이트블루";
    if (h >= 180 && h < 195 && s >= 50 && l >= 40 && l < 60) return "블루";
    if (h >= 195 && h < 210 && s >= 50 && l >= 30 && l < 50) return "네이비";
    if (h >= 210 && h < 225 && s >= 50 && l >= 40 && l < 60) return "퍼플";
    if (h >= 225 && h < 240 && s >= 30 && l >= 70 && l < 90) return "베이지";
    if (h >= 240 && h < 255 && s >= 30 && l >= 80 && l < 100) return "아이보리";
    if (h >= 255 && h < 270 && s >= 30 && l >= 70 && l < 90) return "실버";
    if (h >= 270 && h < 285 && s >= 50 && l >= 40 && l < 60) return "카키";
    if (h >= 285 && h < 300 && s >= 50 && l >= 30 && l < 50) return "브라운";
    if (h >= 300 && h < 315 && s >= 70 && l >= 50 && l < 70) return "코랄";
    if (h >= 315 && h < 330 && s >= 70 && l >= 50 && l < 70) return "라임";
    if (h >= 330 && h < 345 && s >= 50 && l >= 30 && l < 50) return "차콜";
    if (h >= 345 && h < 360 && s >= 30 && l >= 70 && l < 90)
        return "라이트베이지";
    if (h >= 150 && h < 165 && s >= 50 && l >= 30 && l < 50) return "다크그린";

    // return "unknown";
    return "";
}

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
        "https://www.mckayson.com/goods/goods_list.php?page=10&cateCd=008",
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

        // ! 1페이지부터 8페이지까찌라 [0] 경우 1페이지를 말함
        const imageSrcList = products.map((product) => product.image);

        for (const image of imageSrcList) {
            const response = await fetch(image);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(new Uint8Array(arrayBuffer));
            const imagePath = path.join(__dirname, "temp_image.jpg");
            fs.writeFileSync(imagePath, buffer);

            const dominantColor = await ColorThief.getColor(imagePath);

            fs.unlinkSync(imagePath); // Clean up the temporary image file

            // const rgb = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
            // 색상 분류
            const colorName = classifyColor(dominantColor);

            // $$eval을 사용하여 상품명 가져오기
            // const originalProductName = await page.$$eval(
            //     ".item_info_cont .item_tit_box .item_name",
            //     (names) => names.map((name) => name.innerText)[0]
            // );

            // name: e.querySelector(
            //             ".item_info_cont .item_tit_box .item_name"
            //         ).innerText,

            // const updatedProductName = `${originalProductName} ${colorName}`;
            // console.log(`상품명: ${updatedProductName}`);

            // Update the product name with the color name
            products.forEach((product) => {
                // if (product.image === image) {
                //     product.name = `${product.name} ${colorName}`;
                // }
                if (
                    product.image === image &&
                    !product.name.includes(colorName)
                ) {
                    product.name = `${product.name} ${colorName}`;
                } else {
                    product.name = `${product.name}`;
                }
            });
        }

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
                case name.includes("다크그레이"):
                    item.color = "다크그레이";
                    break;
                case name.includes("라이트그레이"):
                    item.color = "라이트그레이";
                    break;
                case name.includes("그레이"):
                    item.color = "그레이";
                    break;
                case name.includes("실버"):
                    item.color = "실버";
                    break;
                case name.includes("카키"):
                    item.color = "카키";
                    break;
                case name.includes("브라운"):
                    item.color = "브라운";
                    break;
                case name.includes("레드"):
                    item.color = "레드";
                    break;
                case name.includes("버건디"):
                    item.color = "버건디";
                    break;
                case name.includes("와인"):
                    item.color = "와인";
                    break;
                case name.includes("카멜"):
                    item.color = "카멜";
                    break;
                case name.includes("오렌지"):
                    item.color = "오렌지";
                    break;
                case name.includes("골드"):
                    item.color = "골드";
                    break;
                case name.includes("옐로우"):
                    item.color = "옐로우";
                    break;
                case name.includes("핑크"):
                    item.color = "핑크";
                    break;
                case name.includes("라이트그린"):
                    item.color = "라이트그린";
                    break;
                case name.includes("그린"):
                    item.color = "그린";
                    break;
                case name.includes("민트"):
                    item.color = "민트";
                    break;
                case name.includes("라이트블루"):
                    item.color = "라이트블루";
                    break;
                case name.includes("블루"):
                    item.color = "블루";
                    break;
                case name.includes("네이비"):
                    item.color = "네이비";
                    break;
                case name.includes("퍼플"):
                    item.color = "퍼플";
                    break;
                case name.includes("베이지"):
                    item.color = "베이지";
                    break;
                case name.includes("아이보리"):
                    item.color = "아이보리";
                    break;
                case name.includes("라이트베이지"):
                    item.color = "라이트베이지";
                    break;
                case name.includes("다크그린"):
                    item.color = "다크그린";
                    break;
                case name.includes("코랄"):
                    item.color = "코랄";
                    break;
                case name.includes("라임"):
                    item.color = "라임";
                    break;
                case name.includes("차콜"):
                    item.color = "차콜";
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

            switch (true) {
                case name.includes("캐디백"):
                case name.includes("항공커버"):
                case name.includes("하프백"):
                    item.subCategory = "가방";
                    item.thirdCategory = "캐디백";
                    break;
                case name.includes("보스턴백"):
                case name.includes("토트백"):
                case name.includes("버킷백"):
                case name.includes("카트백"):
                    item.subCategory = "가방";
                    item.thirdCategory = "보스턴백";
                    break;
                case name.includes("파우치"):
                case name.includes("힙색"):
                case name.includes("케이스"):
                case name.includes("볼파우치"):
                    item.subCategory = "가방";
                    item.thirdCategory = "파우치";
                    break;
                case name.includes("슬링백"):
                case name.includes("볼케이스"):
                case name.includes("볼파우치"):
                    item.subCategory = "가방";
                    item.thirdCategory = "ETC";
                    break;
                case name.includes("바이져"):
                case name.includes("바이저"):
                case name.includes("포인트"):
                case name.includes("볼캡"):
                case name.includes("헌팅캡"):
                case name.includes("캠프캡"):
                case name.includes("캡비니"):
                case name.includes("방한모자"):
                case name.includes("버킷햇"):
                case name.includes("버킷 햇"):
                case name.includes("햇"):
                    item.subCategory = "용품";
                    item.thirdCategory = "모자";
                    break;
                case name.includes("양말"):
                case name.includes("니삭스"):
                    item.subCategory = "용품";
                    item.thirdCategory = "양말";
                    break;
                case name.includes("장갑"):
                case name.includes("양손장갑"):
                case name.includes("양손 장갑"):
                    item.subCategory = "용품";
                    item.thirdCategory = "장갑";
                    break;
                case name.includes("키링"):
                case name.includes("슈즈"):
                case name.includes("롱부츠"):
                case name.includes("부츠"):
                case name.includes("골프화"):
                case name.includes("슈즈"):
                case name.includes("스파이크"):
                case name.includes("마스크"):
                case name.includes("방한마스크"):
                case name.includes("방한 마스크"):
                case name.includes("넥워머"):
                case name.includes("워머"):
                case name.includes("레그워머"):
                case name.includes("핸드워머"):
                case name.includes("토시"):
                case name.includes("벨트"):
                    item.subCategory = "용품";
                    item.thirdCategory = "기타";
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
                    골프화: {
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
                    골프화: {
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
                    골프화: {
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
