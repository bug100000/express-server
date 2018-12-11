var http = require("http");
var https = require("https");
var fs = require("fs");

// var url = "http://s0.hao123img.com/res/img/logo/logonew.png";

var num = 1;
function savePic(url) {
    for (let index = 0; index < url.length; index++) {
        let urlz = url[index];
        if (/https/.test(urlz)) {
            https.get(urlz, function (res) {
                var imgData = "";

                res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

                res.on("data", function (chunk) {
                    imgData += chunk;
                });

                res.on("end", function () {
                    fs.writeFile("./data/001/" + num + ".jpg", imgData, "binary", function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(num + " down success(https)");
                        num++;
                    });
                });
            });
        } else {
            http.get(urlz, function (res) {
                var imgData = "";

                res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

                res.on("data", function (chunk) {
                    imgData += chunk;
                });

                res.on("end", function () {
                    fs.writeFile("./data/001/" + num + ".jpg", imgData, "binary", function (err) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(num + " down success(http)");
                        num++;
                    });
                });
            });
        }
    }
}

module.exports = savePic;
