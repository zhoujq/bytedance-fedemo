/**
 * @fileoverview  Pagelet基类
 */
window.Pagelet = (function() {
    var self;
    var bindBrowserEventArray = [],
        bindChannelEventArray = [];
    var _init = function(spec) {
        self.$el = $(self.el);
        if (!self.$el.length) { return; }
        if (typeof self.template === 'function') {
            self.$el.html(self.template());
        }
        _paeseDOM();
        if (self.init && $.isFunction(self.init)) {
            self.init(spec);
        }
        _bind();
    };
    /**
     * 将带有data-node标示的功能节点统一放置到this.$dom内
     */
    var _paeseDOM = function() {
        self.$dom = {};
        var html = self.$el.html() || '';
        var selectors = html.match(/data-node="([^"]*)"/img) || [];
        var item, key;
        for (var i = selectors.length - 1; i >= 0; i--) {
            item = selectors[i];
            key = item.split('=')[1].replace(/"/g, '');
            self.$dom[key] = self.$el.find('[' + item + ']');
        }
    };
    var _bind = function() {
        var events = self.events,
            channels = self.channels;
        var bindEventSplitter = /^(\S+)\s*(.*)$/;
        var isDataNode = /^\$/;
        var eventName, selector, channelName, match;
        if (events && events instanceof Object) {
            $.each(events, function(key, method) {
                if (!$.isFunction(method)) {
                    method = self[method];
                }
                if (!method) {
                    return true;
                }
                match = key.match(bindEventSplitter);
                eventName = match[1];
                selector = match[2];
                /**
                 * 支持以$开头的选择器
                 * 例：$followBtn === [data-node="followBtn"]
                 */
                if (isDataNode.test(selector)) {
                    selector = '[data-node="'+selector.replace('$', '')+'"]';
                }
                _bindBrowserEvent(eventName, selector, method);
            });
        }
        if (channels && channels instanceof Object) {
            $.each(channels, function(key, method) {
                if (!$.isFunction(method)) {
                    method = self[method];
                }
                if (!method) {
                    return true;
                }
                match = key.match(bindEventSplitter);
                channelName = match[1];
                eventName = match[2];
                _bindCustomerEvent(channelName, eventName, method);
            });
        }
    };
    /**
     * 浏览器事件绑定
     * @param  {String} eventName 事件名，如click等
     * @param  {String} selector  出发事件的元素
     * @param  {function} method  事件处理函数
     */
    var _bindBrowserEvent = function(eventName, selector, method) {
        var el = self.el || 'body';
        if (selector) {
            $(el).on(eventName, selector, $.proxy(method, self));
        } else {
            $(el).on(eventName, $.proxy(method, self));
        }
        bindBrowserEventArray.push([eventName, selector, method]);
    };
    /**
     * 绑定广播事件
     * @param  {string} eventName 事件触发的频道，如common.page
     * @param  {string} selector  自定义事件名称，如switchstart等
     * @param  {function} method  事件处理函数
     */
    var _bindCustomerEvent = function(channelName, eventName, method) {
        listener.on(channelName, eventName, $.proxy(method, self));
        bindChannelEventArray.push([channelName, eventName, method]);
    };
    /**
     * 解绑浏览器事件
     */
    var _unbindBrowserEvent = function(eventName, selector, method) {
        var el = self.el || 'body';
        if (selector) {
            $(el).off(eventName, selector, method);
        } else {
            $(el).off(eventName, method);
        }
    };
    /**
     * 解绑广播事件
     */
    var _unbindChannelEvent = function(channelName, eventName, method) {
        listener.off(channelName, eventName, method);
    };
    /**
     * 切页后的处理，包括调用组件自定义destroy方法,解绑事件，解除引用，利于垃圾回收
     */
    var _destroy = function() {
        if (self.destroy && $.isFunction(self.destroy)) {
            self.destroy();
            self.destroy = null;
        }
        $.each(bindBrowserEventArray, function(index, arr) {
            _unbindBrowserEvent(arr[0], arr[1], arr[2]);
        });
        $.each(bindChannelEventArray, function(index, arr) {
            _unbindChannelEvent(arr[0], arr[1], arr[2]);
        });
        bindBrowserEventArray = [];
        bindChannelEventArray = [];
        self.el = undefined;
    };

    function Pagelet(spec) {
        _init(spec);
    }
    /**
     * @param  {Object} obj 组件对象实例
     * @return {function}  扩展Pagelet基类后的组件构造函数
     */
    Pagelet.extend = function(obj) {
        var parent = this;
        var child = function() {
            self = this;
            return parent.apply(this, arguments);
        };
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();
        Surrogate = null;
        $.extend(child.prototype, obj);
        child.create = function(spec) {
            new child(spec);
        };
        return child;
    };
    return Pagelet;
})();