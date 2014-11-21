var user = require('common/util/user.js');
var template = __inline('loginDialog.tmpl');

var mask = '<div class="mask"></div>';
var instanceObj = null;

var DELAY = 1500;
var LoginDialog = function () {
    this.$el = $(template());
    this.$pwd = this.$el.find('[data-node="password"]');
    this.$errorMsg = this.$el.find('[data-node="errorMsg"]');
    this.$form = this.$el.find('');
    this.$mask = $(mask);
    this.curUser = null;
    this.bindEvent();
    this.inDom = false;
};
LoginDialog.prototype = {
    bindEvent: function () {
        this.$el.on('submit', '[data-node="loginForm"]', $.proxy(this.onFormSubmit, this));
        this.$el.on('click', '[data-node="snsLogin"]', $.proxy(this.onSnsLoginClick, this));
        this.$el.on('click', '[data-node="close"]', $.proxy(this.hide, this));
    },
    showError: function (msg) {
        var that = this;
        if (this.errorMsgTimer) {
            clearTimeout(this.errorMsgTimer);
        }
        this.$errorMsg.html(msg);
        this.$errorMsg.show();
        this.errorMsgTimer = setTimeout(function () {
            that.$errorMsg.hide();
            that.$errorMsg.html('');
        }, 2000);
    },
    show: function (spec) {
        var $win = $(window);
        this.curSpec = spec || {};
        if (!this.inDom) {
            this.$el.appendTo('body');
            this.$mask.appendTo('body');
            this.inDom = true;
        }
        this.$el.show();
        this.$mask.show();
        this.$el.css({
            left: $win.scrollLeft() + ($win.width() - this.$el.width())/2,
            top: $win.scrollTop() + ($win.height() - this.$el.height())/2
        });
    },
    hide: function () {
        this.$el.hide();
        this.$mask.hide();
    },
    onFormSubmit: function (evt) {
        evt.preventDefault();
        if (this.locked) {
            return;
        }
        this.locked = true;
        var $target = $(evt.currentTarget);
        var data = $target.serialize();
        var that = this;
        user.loginByLoc({
            data: data,
            successCb: function (rs) {
                if (typeof that.curSpec.successCb === 'function') {
                    this.curSpec.successCb(rs);
                }
            },
            errorCb: function (rs) {
                that.$pwd.val('');
                that.showError(rs.detail || '登陆失败');
                if (typeof that.curSpec.errorCb === 'function') {
                    this.curSpec.errorCb(rs);
                }
            }
        });
    },
    onSnsLoginClick: function (evt) {
        var $target = $(evt.currentTarget);
        var pid = $target.data('pid');
        this.hide();
        user.loginByOther(pid, this.curSpec);
    }
};

module.exports = function () {
    if (!instanceObj) {
        instanceObj = new LoginDialog();
    }
    return instanceObj;
};