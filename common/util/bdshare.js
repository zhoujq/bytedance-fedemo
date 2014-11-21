var BDUID = '6649976';

var BDCOMMIT = "http://s.share.baidu.com/";
/**
 * 不知道干嘛用的，原代码搬过来的
 * @type {[type]}
 */
var getL = function () {
    var n1 = new Date().getTime();
    var n2 = new Date().getTime() + 1000;
    var n3 = new Date().getTime() + 3000;
    return n1.toString(32) + n2.toString(32) + n3.toString(32);
};

var generateRandom = function(str, n) {
    var m = str.length;
    var s = "";
    for (var i = 1; i <= n; i++) {
        var r = Math.floor(m * Math.random());
        s = s + str.charAt(r);
    }
    return s;
};
var generateLinkid = function() {
    var time = new Date().toString(36);
    var random = generateRandom("0123456789abcdefghijklmnopqrstuvwxyz", 3);
    return time + random;
};
module.exports = function (type, spec) {
    spec = spec || {};
    var l = getL();
    var btntype = 0;
    var weibotext = '';
    var txt = document.title;
    var wbuid = spec.wbuid || '';
    var linkid = generateLinkid();
    var trackEventType = window.isAppPage ? 'app' : 'detail/list';
    var pic = encodeURIComponent(spec.pic || '');
    var urls = encodeURIComponent(spec.url || '');
    var comment = encodeURIComponent(spec.comment || '');
    var desc = encodeURIComponent(spec.desc || '');
    if (type === "tsina") {
        txt = (spec.text || txt) + (spec.weibotext || weibotext);
    } else {
        if (type === "tqq") {
            spec.text = spec.text.replace("@今日头条", "@headlineapp");//腾讯微博的fix
        }
        txt = spec.text || txt;
    }
    txt = encodeURIComponent(txt.substring(0, 300));
    var urlParams = "?click=1&url=" + urls + "&uid=" + BDUID + "&to=" + type + "&type=text&relateUid=" + wbuid + "&pic=" + pic + "&title=" + txt + "&key=&sign=on&desc=" + desc + "&comment=" + comment + "&searchPic=0&l=" + l + "&linkid=" + linkid + "&sloc=&apiType=0&buttonType=" + btntype;
    var shareUrl = BDCOMMIT + urlParams;
    var bdStatistics = BDCOMMIT + "commit" + urlParams + "&t=" + Math.random();
    var sendRequest = function() {
        var list = [];
        return function(src) {
            var index = list.push(new Image()) - 1;
            list[index].onload = function() {
                list[index] = list[index].onload = null;
            };
            list[index].src = src;
        };
    } ();
    setTimeout(function() {
        sendRequest(bdStatistics);
    }, 1500);
    // _gaq.push(['_trackEvent', trackEventType, "share", type]);
    window.open(shareUrl, "_blank", "height=500,width=700,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no");
};