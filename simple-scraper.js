import * as cheerio from "cheerio";

async function getProductData() {
    const response = await fetch("https://www.mckayson.com/main/index.php");

    // convert response into text
    // text(): html, json(): json
    const text = await response.text();
    // console.log('text: ', text);

    // load body data
    const $ = cheerio.load(text);

    // create empty array to store data
    const productData = [];

    // get product cards
    $("#container .item_cont").each((index, element) => {
        const image = $(element).find(".item_photo_box > a > img").attr("src");
        const category = $(element)
            .find(".item_info_cont > .item_tit_box > .cate_name > a")
            .text();
        const name = $(element)
            .find(".item_info_cont > .item_tit_box > a > .item_name")
            .text();
        const price = $(element)
            .find(
                ".item_info_cont > .item_money_box > .flex_box > .item_price.1 > span"
            )
            .text();

        const labels = [];
        $(element)
            .find(".item_info_cont .item_icon_box")
            .each((index, imgEl) => {
                const labelSrc = $(imgEl)
                    .find("img")
                    .map((i, img) => $(img).attr("src"))
                    .get();
                labels.push(...labelSrc);
            });

        // push data to array
        productData.push({
            image,
            category,
            name,
            price,
            labels,
        });
    });

    // console.log("data: ", productData);
    // productData.forEach((el, i) => {
    //     console.log("el", i, el);
    // });
}

getProductData();
