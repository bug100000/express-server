var express = require('express');
var formidable = require('formidable');
var fs = require("fs");
var path = require("path");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log(req.query);

    res.send({ "code": 0 });
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    console.log(req.headers);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('fields', fields);//表单传递的input数据  
        console.log('files', files);//上传文件数据  
        //do somthing......  
    });

    res.send({ "code": 0 });
});

router.post('/img', function (req, res, next) {
    console.log(req.body);
    console.log(req.headers);
    res.header('Content-Type', 'image/jpeg');
    rf.readImg(path.join('F:/development/learn/node-server/public/images/01.jpg'), res);
});

var rf = {
    readfileSync: function (path) {//同步读取
        var data = fs.readFileSync(path, 'utf-8');
        console.log(data);
        console.log("同步方法执行完毕");
    },

    readfile: function (path, recall) {//异步执行
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                recall(data);   //回调recall函数，它是闭包函数，它会存储原来的response对象
                console.log(data.toString());
            }
        });
        console.log("异步方法执行完毕");

    },

    readImg: function (path, res) {
        fs.readFile(path, 'binary', function (err, file) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.write(file, 'binary');
                res.end();
            }
        });
    }
}

module.exports = router;
