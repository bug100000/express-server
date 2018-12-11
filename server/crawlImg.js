var express = require('express');
const superagent = require('superagent');
//nodejs里一个非常方便的客户端请求代理模块
const cheerio = require('cheerio');
//Node.js 版的jQuery
const async = require('async');
//fs操作IO
const fs = require('fs');
//url模块
const url = require('url');
const request = require('request');

const savePic = require('../module/savePic');

/* GET home page. */
var crawlImg = {
    crawlImgUrl: async function (req, response) {
        // 定义需要用到的变量
        const hupuUrl = 'https://bbs.hupu.com/selfie-1';
        let ssr = [];
        let allUrl = [];
        let curCount = 0;
        let result = [];
        for (let i = 1; i <= 4; i++) {
            hupuUrl2 = 'https://bbs.hupu.com/selfie-' + i;
            //for循环把五页的页面循环出来
            var res = await superagent.get(hupuUrl2);
            //通过superagent去请求每一页
            //cheerio  nodejs版的JQ 
            let $ = cheerio.load(res.text);
            //获取首页所有的链接
            $('.titlelink>a:first-child').each(async function (idx, element) {
                let $element = $(element);
                let href = url.resolve(hupuUrl2, $element.attr('href'));
                allUrl.push(href);
                curCount++;
                result = await aa(href, ssr, result);
                // console.log(result.length, 14);
                if (result.length == 144) {
                    response.json(result);
                }
            });
        }
        // return result;
    }
}

async function aa(href, ssr, result) {
    //获取到此url，异步进行以下操作，此操作为进入到这个帖子中爬取数据
    var res = await superagent.get(href);
    let $ = cheerio.load(res.text);
    let add = href;
    let title = $('.bbs-hd-h1>h1').attr('data-title');//帖子标题
    let tximg = $('.headpic:first-child>img').attr('src');//用户头像
    let txname = $('.j_u:first-child').attr('uname');//用户ID
    let contentimg1 = $('.quote-content>p:nth-child(1)>img').attr('src');//爆照图1
    let contentimg2 = $('.quote-content>p:nth-child(2)>img').attr('src');//爆照图2
    let contentimg3 = $('.quote-content>p:nth-child(3)>img').attr('src');//爆照图3
    ssr.push({
        'tx': tximg,
        'name': txname,
        'pic': contentimg1, contentimg2, contentimg3
    });
    //把数据存储到一个对象里
    let stad = {
        "address": add,
        "title": title,
        "ID": txname,
        "touxiang": tximg,
        "pic1": contentimg1,
        "pic2": contentimg2,
        "pic3": contentimg3
    };
    let picArr = [tximg, contentimg1, contentimg2, contentimg3];
    //通过fs模块把数据写入本地json
    result.push(stad);
    // 将数据保存到本地
    fs.appendFile('data/result1.json', JSON.stringify(stad), 'utf-8', function (err) {
        if (err) throw new Error(err);
        //console.log("数据写入success...");
    });
    // 将图片下载至本地
    savePic(picArr);
    //定义一个以title为文件夹名的路径，作为以后下载图片时使用
    // let lujin = 'data/' + title + '/';
    //判断文件夹是否存在
    // fs.exists('data/001', function (exists) {
    // if (!exists) {
    // fs.mkdir("data/001", function (err) {
    // if (err) {
    //     throw err;
    // }
    // async.mapSeries(picArr, function (item, callback) {
    // setTimeout(function () {
    //downloadPic方法下载图片
    // downloadPic(item, 'data/' + (new Date()).getTime() + '.jpg');
    // callback(null, item);
    // }, 400);
    // }, function (err, results) {});
    // });
    // console.log('ye')
    // } else {
    // console.log('er')
    // }
    // })
    return result;
}

module.exports = crawlImg;