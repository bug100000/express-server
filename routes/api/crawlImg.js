var express = require('express');
var router = express.Router();

var crawlImg = require('../../server/crawlImg');

/* GET home page. */
router.get('/', async function (req, res, next) {
    // console.log(1);
    var result = await crawlImg.crawlImgUrl(req, res);
    // console.log(result.length, 17);
    // res.json(result);
});

module.exports = router;
