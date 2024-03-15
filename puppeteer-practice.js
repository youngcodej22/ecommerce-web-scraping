/**
 * traversy - media
 * https://www.youtube.com/watch?v=S67gyqnYHmI
 */

import fs from "fs";
import puppeteer from "puppeteer";

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.traversymedia.com");

    // 웹 페이지 이미지 스크랩핑
    // await page.screenshot({ path: "example.png", fullPage: true });
    // await page.pdf({ path: "example.pdf", format: "A4" });

    // const html = await page.content();
    // const title = await page.evaluate(() => document.title);
    // const text = await page.evaluate(() => document.body.innerText);
    // const links = await page.evaluate(() => Array.from(document.querySelectorAll("a"), (e) => e.href))

    // * 방법 1
    // const courses = await page.evaluate(() =>
    //     Array.from(document.querySelectorAll("#cscourses .card"), (e) => ({
    //         title: e.querySelector(".card-body h3").innerText,
    //         level: e.querySelector(".card-body .level").innerText,
    //         url: e.querySelector(".card-footer a").href,
    //         image: e.querySelector(".card-footer img").src,
    //     }))
    // );

    // * 방법 2 (Array.from()없이)
    const courses = await page.$$eval("#cscourses .card", (elements) =>
        elements.map((e) => ({
            title: e.querySelector(".card-body h3").innerText,
            level: e.querySelector(".card-body .level").innerText,
            url: e.querySelector(".card-footer a").href,
            image: e.querySelector(".card-footer img").src,
        }))
    );
    console.log("courses", courses);

    // save data to JSON file
    fs.writeFile("./data/courses.json", JSON.stringify(courses), (err) => {
        if (err) throw err;
        console.log("File saved");
    });

    await browser.close();
}

run();
