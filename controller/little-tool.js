const {
    createWebThumbnails
} = require('../tool/web-thumbnail-getter');
const {
    getThumbnails
} = require('../tool/image-magick');
const url = require('url');
const mkdir = require('make-dir');
const path = require('path');
const model = require('../model');

mkdir('static/thumbnails')
    .then(path => {
        console.log(`create path: ${path}`);
    });

const BASE_THUMBNAILS_PATH = 'static/thumbnails';
const BASE_PATH = 'thumbnails';
const ShareWebsite = model.ShareWebsite;

const pushWebsite = async ctx => {
    const {
        title,
        website,
        description,
        category,
    } = ctx.request.body;
    const urlObj = url.parse(website);
    const savePath = path.join(BASE_THUMBNAILS_PATH, urlObj.host);
    const sp = await createWebThumbnails(website, `${savePath}.png`);
    await getThumbnails(sp, `${savePath}-thumb.png`, 204, 120);
    const result = `${path.join(BASE_PATH, urlObj.hostname)}-thumb.png`;
    ctx.easyResponse.success(result);

    ShareWebsite.create({
        title: title,
        website: website,
        description: description,
        cover: result,
        category: category,
    });
};

const getWebsites = async ctx => {
    const category = ctx.query.category;
    console.log(category);
    let findParams = {
        where: {
            category: {
                $like: `%${category}%`
            }
        }
    };
    let result = await ShareWebsite.findAll(findParams);
    ctx.easyResponse.success(result);
};


module.exports = {
    'POST /pushWebsite': pushWebsite,
    'GET /getWebsite': getWebsites,
};