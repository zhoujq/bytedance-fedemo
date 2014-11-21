var loginDialog = require('common/loginDialog/loginDialog.js');
var storage = require('common/util/storage.js');
var navTmpl = __inline('nav.tmpl');
module.exports = Pagelet.extend({
    el: '#pagelet-nav',
    events: {
        'click $login': 'onLoginClick'
    },
    channels: {
        'com.toutiao.user change': 'onUserChange'
    },
    init: function(spec) {
        this.dialog = loginDialog();
        this.render(spec);
    },
    render: function (spec) {
        this.$el.html(navTmpl(spec));
    },
    onLoginClick: function (evt) {
        this.dialog.show();
    },
    onUserChange: function (evt, user) {
        this.$dom.username.html(userTmpl(user));
    }
});