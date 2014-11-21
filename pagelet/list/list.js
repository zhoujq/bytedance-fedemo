var template = __inline('./list.tmpl');
module.exports = Pagelet.extend({
    el: '#pagelet-list',
    events: {
        'click $share': 'onShareClick'
    },
    channels: {
        'com.toutiao.feedlist refresh': 'onFeedListRefresh'
    },
    init: function (spec) {
        this.render(spec);
    },
    render: function (spec) {
        this.$el.html(template(spec));
    }
});