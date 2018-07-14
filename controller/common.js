const model = require('../model');

const {
    Movie,
    ShareWebsite,
    Magnet,
} = model;

/**
 * 一个强大的查询接口，传入关键字
 * 会通过模糊匹配检索站内的资源
 * @param ctx
 * @returns {Promise<void>}
 */
const powerQueryResource = async ctx => {
    const page = +ctx.query.page || 1,          //页数
        size = +ctx.query.size || 10,           //每页的数量
        orderProp = ctx.query.orderProp,        //排序的属性
        order = ctx.query.order || 'ASC',       //排序方式。 ASC=>升序，DESC=>降序
        keywords = ctx.query.keywords;
    let findParams = {
        where: {
            $or: {
                movieName: {
                    $like: `%${keywords}%`
                },
                translationName: {
                    $like: `%${keywords}%`
                }
            }
        },
        offset: (page - 1) * size,
        limit: size,
        include: [Magnet]
    };

    if (orderProp && (order === 'ASC' || order === 'DESC')) {
        findParams.order = [
            [orderProp, order]
        ];
    }

    try {
        let result = await Movie.findAll(findParams);
        ctx.easyResponse.success(result);
    } catch (e) {
        console.log(e);
        ctx.easyResponse.error(e.message);
    }
};



module.exports = {
    'GET /queryResource': powerQueryResource,
};