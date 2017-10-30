/**
* bilibili-card-hexo
* https://github.com/duoduoeeee/bilibili-card-hexo.git
* Copyright (c) 2017, duoduoeeee
* 

* Syntax:
* {% bishi [av_id] %} or {% bishi [av_id] [page] %}
*/

var headers = {
  'Host': 'api.bilibili.com',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'DNT': '1',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6',
  'Cookie': '',
  'Referer': 'https://bilibili.com/read/home',
}

function formatSeconds(value) {
    var theTime = parseInt(value);// 需要转换的时间秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    var theTime3 = 0;// 天
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
            if(theTime2 > 24){
                //大于24小时
                theTime3 = parseInt(theTime2/24);
                theTime2 = parseInt(theTime2%24);
            }
        }
    }
    var result = '';
    if(theTime > 0){
        result = "00:"+parseInt(theTime);
    }
    if(theTime1 > 0) {
        result = ""+parseInt(theTime1)+":"+result;
    }
    if(theTime2 > 0) {
        result = ""+parseInt(theTime2)+":"+result;
    }
    if(theTime3 > 0) {
        result = ""+parseInt(theTime3)+":"+result;
    }
    return result;
}

hexo.extend.tag.register('bishi', function(args){
  var avid = parseInt(args[0]);
  var page = parseInt(args[1]) || 1;
  var config = hexo.config.bilibili || {};
  var url = 'https://api.bilibili.com/x/article/archives?ids=' + avid + '&jsonp=jsonp';
  var maintitle;
  var playtimes;
  var archivelength;
  var danmakucount;
  var category;
  var coverurl;
  request (url, headers, function(err, res, buffer){
    if (err != null) {
      maintitle = "视频不可用。";
      playtimes = "0";
      var archivelengthprocessed = "00:00";
      danmakucount = "0";
      category = "NULL";
      return;
    }
    try {
      data = JSON.parse(buffer);
      maintitle = data.data[avid].title;
      playtimes = data.data[avid].stat.view;
      archivelength = data.data[avid].duration;
      danmakucount = data.data[avid].stat.danmaku;
      var archivelengthprocessed = new formatSeconds(archivelength);
      category = data.data[avid].tname;
      coverurl = data.data[avid].pic;
      var coverurlprocessed = coverurl.replace(/^http/, 'https') + '@300w_188h.jpg';
    }
    catch (e) {
      maintitle = "视频不见了哟～";
      playtimes = "0";
      archivelengthprocessed = "00:00";
      danmakucount = "0";
      category = "NULL";
    }
  }
  return '<figure class="img-box" contenteditable="false">'
          + '<div class="card-container">'
          + '<div class="card">'
          + '<a class="video-holder slim-border" href="' + 'https://www.bilibili.com/video/av' + avid + 'target="_blank">'
          + '<div class="video-cover">'
          + '<div class="video-cover-layer">'
          + '<i class="icon icon-video"></i>'
          + '</div>'
          + '<img class="bili-img" src="' + coverurlprocessed + '">'
          + '<span class="duration">' + archivelengthprocessed + '</span>'
          + '</div>'
          + '<div class="video-info-container">'
          + '<p class="title">' + maintitle + '</p>'
          + '<p class="card-status"><span class="play-num">播放'
          + '<span>' + playtimes + '</span></span><span>弹幕'
          + '<span>' + danmakucount +'</span></span>'
          + '</p>'
          + '<div class="partition">'
          + '<span class="card-label"></span>'
          + '<span>' + category + '</span><span>'
          + '</span>'
          + '</div></div></a></div></div></figure>';
});
