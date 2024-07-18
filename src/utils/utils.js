import fs from "fs";
import path from "path";
import ColorThief from "colorthief";
import fetch from "node-fetch";

export const colorNames = [
    { en: "BLK", ko: "블랙" },
    { en: "WHI", ko: "화이트" },
    { en: "DGY", ko: "다크그레이" },
    { en: "GRE", ko: "그레이" },
    { en: "LGR", ko: "라이트그레이" },
    { en: "RED", ko: "레드" },
    { en: "BUR", ko: "버건디" },
    { en: "WHN", ko: "와인" },
    { en: "CAM", ko: "카멜" },
    { en: "ORG", ko: "오렌지" },
    { en: "GOL", ko: "골드" },
    { en: "YLW", ko: "옐로우" },
    { en: "PNK", ko: "핑크" },
    { en: "LGN", ko: "라이트그린" },
    { en: "GRN", ko: "그린" },
    { en: "MIN", ko: "민트" },
    { en: "LBL", ko: "라이트블루" },
    { en: "BLU", ko: "블루" },
    { en: "NVY", ko: "네이비" },
    { en: "LAV", ko: "퍼플" },
    { en: "BEG", ko: "베이지" },
    { en: "IVY", ko: "아이보리" },
    { en: "SIL", ko: "실버" },
    { en: "KHA", ko: "카키" },
    { en: "BRO", ko: "브라운" },
    { en: "CRL", ko: "코랄" },
    { en: "LIM", ko: "라임" },
    { en: "CHA", ko: "차콜" },
    { en: "LBE", ko: "라이트베이지" },
    { en: "DGN", ko: "다크그린" },
];

// ! dominantColor의 rgb를 가지고 블랙, 화이트 처럼 색깔 분류 함수
export function rgbToHsl(r, g, b) {
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

export function classifyColor(rgb) {
    const [r, g, b] = rgb;
    const [h, s, l] = rgbToHsl(r, g, b);

    if (h <= 0 && s <= 0 && l <= 0) return "블랙"; // Black
    if (h >= 0 && s <= 0 && l >= 100) return "화이트"; // White
    if (l >= 10 && l < 40) return "다크그레이"; // Dark grey
    if (l >= 40 && l < 60) return "그레이"; // Grey
    if (l >= 60 && l < 90) return "라이트그레이"; // Light grey
    if (h >= 0 && h < 10 && s >= 90 && l >= 50 && l < 60) return "레드"; // Red
    if (h >= 330 && h < 360 && s >= 50 && l >= 20 && l < 50) return "버건디"; // Burgundy
    if (h >= 300 && h < 330 && s >= 50 && l >= 20 && l < 50) return "와인"; // Wine
    if (h >= 35 && h < 45 && s >= 50 && s < 80 && l >= 50 && l < 70)
        return "카멜"; // Camel
    if (h >= 30 && h < 35 && s >= 90 && l >= 50 && l < 60) return "오렌지"; // Orange
    if (h >= 45 && h < 60 && s >= 70 && l >= 50 && l < 70) return "골드"; // Gold
    if (h >= 60 && h < 65 && s >= 70 && l >= 50 && l < 70) return "옐로우"; // Yellow
    if (h >= 300 && h < 330 && s >= 50 && l >= 60 && l < 80) return "핑크"; // Pink
    if (h >= 120 && h < 150 && s >= 50 && l >= 60 && l < 90)
        return "라이트그린"; // Light Green
    if (h >= 90 && h < 130 && s >= 40 && l >= 30 && l < 60) return "그린"; // Green
    if (h >= 131 && h < 150 && s >= 50 && l >= 50 && l < 80) return "민트"; // Mint
    if (h >= 180 && h < 210 && s >= 50 && l >= 60 && l < 85)
        return "라이트블루"; // Light Blue
    if (h >= 210 && h < 240 && s >= 60 && l >= 40 && l < 60) return "블루"; // Blue
    if (h >= 240 && h < 250 && s >= 70 && l >= 15 && l < 30) return "네이비"; // Navy
    if (h >= 260 && h < 300 && s >= 40 && l >= 40 && l < 70) return "퍼플"; // Purple
    if (h >= 30 && h < 40 && s >= 30 && l >= 70 && l < 90) return "베이지"; // Beige
    if (h >= 40 && h < 50 && s >= 60 && l >= 80 && l < 90) return "아이보리"; // Ivory
    if (h >= 0 && h < 30 && s <= 10 && l >= 80 && l < 90) return "실버"; // Silver
    if (h >= 60 && h < 80 && s >= 30 && s <= 50 && l >= 15 && l < 40)
        return "카키"; // Khaki
    if (h >= 30 && h < 40 && s >= 50 && s <= 70 && l >= 10 && l < 40)
        return "브라운"; // Brown
    if (h >= 0 && h < 20 && s >= 70 && l >= 30 && l < 40) return "코랄"; // Coral
    if (h >= 70 && h < 90 && s >= 70 && l >= 50 && l < 70) return "라임"; // Lime
    if (h >= 0 && h < 20 && s <= 10 && l >= 15 && l < 20) return "차콜"; // Charcoal
    if (h >= 30 && h < 50 && s >= 30 && s < 50 && l >= 80 && l < 90)
        return "라이트베이지"; // Light Beige
    if (h >= 90 && h < 140 && s >= 30 && s < 50 && l >= 10 && l < 20)
        return "다크그린"; // Dark Green

    return "";
}

export async function getDominantColor(imageUrl, __dirname) {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    const imagePath = path.join(__dirname, "temp_image.jpg");
    fs.writeFileSync(imagePath, buffer);

    const dominantColor = await ColorThief.getColor(imagePath);

    fs.unlinkSync(imagePath); // Clean up the temporary image file

    return dominantColor;
}

// * insert value for "date"
export function generateRandomDate(start, end) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    )
        .toISOString()
        .slice(0, 10); // Format: YYYY-MM-DD
}

// * insert value for "like"
export function generateRandomLikeCount(minLikes, maxLikes) {
    // Ensure minLikes is smaller than maxLikes
    if (minLikes > maxLikes) {
        [minLikes, maxLikes] = [maxLikes, minLikes]; // Swap values
    }

    const likeRange = maxLikes - minLikes;
    return Math.floor(Math.random() * (likeRange + 1)) + minLikes;
}

// * insert value for "sale"
export function generateRandomSaleCount(minSales, maxSales) {
    // Ensure minSales is smaller than maxSales
    if (minSales > maxSales) {
        [minSales, maxSales] = [maxSales, minSales]; // Swap values
    }

    const saleRange = maxSales - minSales;
    return Math.floor(Math.random() * (saleRange + 1)) + minSales;
}
