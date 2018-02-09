//自動回應留言
//自動回應某篇的留言 直接回應在下方 非私密回覆
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const urlencode = require('urlencode');
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>GGGGGGGGGGGGGGGGG<a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";

// The rest of the code implements the routes for our Express server.
let app = express();
const FB_APP_ID = process.env.FACEBOOK_APP_ID;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
let fbShortenToken = process.env.fbtk20;

//固定抓某篇文章的ID (粉絲團ID+PostID)
let postid="495470820818248_565034437195219";
//粉絲團ID
let fansPageid="495470820818248";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

app.get('/web', function(req, res) {
    //let arg = req.query.msg;
    arg="ABC";
    //weeklyFacebookPost(arg);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>GGGGGGGGAA.=${arg}</body></html>`);
    //res.write(messengerButton);
    res.end();
  });

  app.post('/webhook', function (req, res) {
    console.log(req.body);
    var data = req.body;
    if (data.object === 'page') {

      data.entry.forEach(function(entry) {
        console.log("-----entry-----");
        console.log(entry);
        entry.changes.forEach(function(event) {
            console.log("-----event-----");
            console.log(event);
            if (event.value.post_id==postid && event.field=="feed" && event.value.sender_id!=fansPageid) {
              weeklyFacebookPost( event.value.message , event.value.sender_name , event.value.comment_id);
            } 

          });
          
      });
      res.sendStatus(200);
    }
  });

 
function weeklyFacebookPost(msg,name , commentId) {
    "use strict";
    let extend_token_url = `https://graph.facebook.com/v2.10/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&amp&client_secret=${FB_APP_SECRET}&amp&fb_exchange_token=${fbShortenToken}`
    //定期更新Token

    request(extend_token_url, function(err, response, body){
        let access_token = JSON.parse(body).access_token;
        // 因為Token只少每60天都必須延長一次，所以改成每週發文時都將上禮拜的Token換成這裡的新Token

        fbShortenToken = access_token;
        // 拿 使用者授權應用程式的Token 換成 Po文權限的Token

        request(`https://graph.facebook.com/${fansPageid}?fields=access_token&access_token=${access_token}`, function (err, response, body) {

            let access_token = JSON.parse(body).access_token;
            let post_link = 'https://www.facebook.com/Mr4.Lab2.0/';
            //let post_message = querystring.parse(arg);
            var ansmsg ="";
            if (msg!=null){
            console.log("msg.lenght=" + msg.length);
            if ( !isNaN(msg) && msg.length == 8)
              {
                var scnum = 0;
                scnum = parseInt(msg.substr(0,1),10)+ parseInt(msg.substr(1,1),10)+ parseInt(msg.substr(2,1),10)
                + parseInt(msg.substr(3,1),10)+ parseInt(msg.substr(4,1),10)+ parseInt(msg.substr(5,1),10)+
                parseInt(msg.substr(6,1),10)+ parseInt(msg.substr(7,1),10);
                console.log("scnum1=" + scnum);
                var tmp_num ="0";
                if (scnum >=10){
                  tmp_num =scnum.toString();
                  scnum = parseInt(tmp_num.substr(0,1),10)+ parseInt(tmp_num.substr(1,1),10);
                }
                if (scnum >=10){
                  tmp_num =scnum.toString();
                  scnum = parseInt(tmp_num.substr(0,1),10)+ parseInt(tmp_num.substr(1,1),10);
                }
                if (scnum >=10){
                  tmp_num =scnum.toString();
                  scnum = parseInt(tmp_num.substr(0,1),10)+ parseInt(tmp_num.substr(1,1),10);
                }
                console.log("scnum2=" + scnum);
                if (scnum==1){ansmsg="恭喜您抽中上上籤(憑籤詩回NOVA免費送LED隨行燈乙份)，今年財神超眷顧你，不管是就業或創業，存款大增富貴無窮。";}
                if (scnum==2){ansmsg="恭喜您抽中大吉(憑籤詩回NOVA免費送LED隨行燈乙份)，今年運勢高漲，荷包滿滿，事業順利愛情更是大豐收喔。";}
                if (scnum==3){ansmsg="恭喜您抽中小吉(憑籤詩回NOVA免費送LED隨行燈乙份)，今年吉星照命財運大增，貴人協力下財運大漲，運勢一路攀升。";}
                if (scnum==4){ansmsg="恭喜您抽中吉(憑籤詩回NOVA免費送LED隨行燈乙份)， 今年喜事一波接一波，財路大開，事業發展迅速，名利兼收。";}
                if (scnum==5){ansmsg="恭喜您抽中大大吉(憑籤詩回NOVA免費送LED隨行燈乙份)，今年桃花大開情場得意，與戀人甜甜蜜蜜，與家人和和睦睦，超完美。";}
                if (scnum==6){ansmsg="恭喜您抽中小吉(憑籤詩回NOVA免費送LED隨行燈乙份)，今年事業運平穩，有貴人幫助，無論加薪或升職運都有不俗的提升。";}
                if (scnum==7){ansmsg="恭喜您抽中上上籤(憑籤詩回NOVA免費送LED隨行燈乙份)，今年吉星非常庇佑你，事業上突飛猛進，升職加薪，得到上司的賞識與提拔。";}
                if (scnum==8){ansmsg="恭喜您抽中上上籤(憑籤詩回NOVA免費送LED隨行燈乙份)，今年的你財祿雙至好旺旺，不僅會富還會貴，權利名利更跨進一大步。";}
                if (scnum==9){ansmsg="恭喜您抽中大吉(憑籤詩回NOVA免費送LED隨行燈乙份)，今年雀財吉星相助，家業興旺，事業成功，日子蒸蒸日上，幸福和美，不讓人羨慕都難吶！。";}
                
              }
              else
                {
                  ansmsg="矮油!您所回覆的格式錯誤，請依照貼文規則填寫喔！小編馬上會奉上您今年的運勢~ !";
                }
            let post_message = urlencode(ansmsg, 'utf-8');
            let comment_id = commentId;
            //console.log("urlencode msg="+urlencode(msg, 'utf-8'));
            //console.log("msg="+msg);
            //let post_page_url = `https://graph.facebook.com/v2.10/${fansPageid}/feed?message=${post_message}&link=${post_link}&access_token=${access_token}`;
            let post_page_url = `https://graph.facebook.com/v2.10/${comment_id}/comments?message=${post_message}&access_token=${access_token}`;
            console.log("post_page_url = "+post_page_url);
            //操作頁面權限的Token發文

              request.post(post_page_url, function (err, response, body) {
                  console.log(body);
              })
            setTimeout(function2, 120000);
          }
        })
    });
} 

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port %s", server.address().port);
  });


  function function2() {
    // all the stuff you want to happen after that pause
    console.log('Blah blah blah blah extra-blah');
}
