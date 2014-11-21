/**
 * 登录本身接口设计拥有较大缺陷，股采用重构前逻辑
 * @type {String}
 */
var login_ajax = '/auth/login/';
var userinfo_ajax = '/user/info/';
var snslogin_url = '/auth/connect/?type=toutiao&platform=';
var curUser = null;
var locked = false;
var closeTimer = '';
var loginByLoc = function (spec) {
    spec = spec || {};
    if (locked) {
        return;
    }
    locked = true;
    var successCb = spec.successCb || function(){};
    var errorCb = spec.errorCb || function(){};
    $.ajax({
        url: login_ajax,
        type: 'POST',
        dataType: 'json',
        context: this,
        data: spec.data,
        success: function (rs) {
            locked = false;
            rs = rs || {};
            if (rs.message !== 'success') {
                return errorCb(rs);
            }
            curUser = rs.user;
            successCb(curUser);
            listener.trigger('com.toutiao.user', 'change', curUser);
        },
        error: function () {
            locked = false;
            errorCb({});
        }
    });
};

var loginByOther = function (pid, spec) {
    var width = 610;
    var height = 505;
    var url = snslogin_url + pid;
    var left = Math.max((window.screen.width - width)/2, 0);
    var top = Math.max((window.screen.height - height)/2, 0);
    var parm = 'location=0,toolbar=0,status=0,resizable=0,scrollbars=1,width=610,height=505,top='+top+',left='+left;
    var loginWindow = window.open(url, "login", parm);
    try {
        loginWindow.focus();
    } catch(e){}
    whenClosed(loginWindow, spec);
};
var whenClosed = function(windowObj, spec){
    var closed = true;
    try{
        closed = windowObj.closed;
    } catch(e){}
    if (closed){
        clearTimeout(arguments.callee.timer);
        checkLogin(spec);
    } else{
        closeTimer = setTimeout(function(){
            whenClosed(windowObj, spec);
        }, 1000);
    }
};
var checkLogin = function (spec) {
    spec = spec || {};
    var loginCb = spec.successCb || function(){};
    var unLoginCb = spec.errorCb || function(){};
    var sid = $.cookie('sessionid');
    if (!sid) {
        unLoginCb();
    } else if(sid && curUser){
        loginCb(curUser);
    } else {
        getUserInfo(spec);
    }
};

var getUserInfo = function (spec) {
    spec = spec || {};
    var successCb = spec.successCb || function(){};
    var errorCb = spec.errorCb || function(){};
    $.ajax({
        url: userinfo_ajax,
        type: 'get',
        cache: false,
        dataType: 'json',
        success: function (rs) {
            rs = rs || {};
            if (rs.message === 'error') {
                return errorCb(rs);
            }
            curUser = rs;
            successCb(curUser);
            listener.trigger('com.toutiao.user', 'change', curUser);
        },
        error: function () {
            errorCb({});
        }
    });
};

module.exports = {
    checkLogin: checkLogin,
    getUserInfo: getUserInfo,
    loginByLoc: loginByLoc,
    loginByOther: loginByOther
};