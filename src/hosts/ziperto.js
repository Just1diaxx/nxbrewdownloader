const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://ziperto.com";

async function searchGame(query) {
    const url = `${BASE_URL}/?s=${encodeURIComponent(query)}`;

    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(res.data);

    const results = [];

    $(".post-list article").each((i, article) => {
        const container = $(article);

        const title = container.find(".post-title a").text().trim();

        const link = container.find(".post-title a").attr("href");

        const img =
            container.find(".post-thumbnail img").attr("src") ||
            container.find(".post-thumbnail img").attr("data-src") ||
            "";

        if (!title.toLowerCase().includes("switch")) return;

        results.push({
            title,
            link,
            img
        });
    });

    return results;
}

async function getDownloadBlocks(url) {
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const $ = cheerio.load(res.data);

    const blocks = {};

    $("p").each((i, el) => {
        const strong = $(el).find("strong").first();
        if (!strong.length) return;

        const title = strong.text().trim();

        if (!title.toLowerCase().includes("download")) return;

        const links = [];

        $(el).find("a[href*='ouo.io'], a[href*='url=ouo.io']").each((_, a) => {
            links.push({
                host: $(a).text().trim(),
                link: $(a).attr("href")
            });
        });

        if (links.length) {
            blocks[title] = links;
        }
    });

    return blocks;
}

module.exports = { searchGame, getDownloadBlocks };