//【必要】当前子项目名称
var PROJECT_NAME = 'bytefe';

//开发发布目录
var DEPLOY = {
    receiver: 'http://10.4.17.164:8999/receiver',
    dev_root: '/data00/home/zhoujiequn/repos/ss_site'
};

fis.config.merge({
    projectname: PROJECT_NAME,
    statics: '/resource',
    templates: '/template'
    // roadmap: {
    //     domain: ['http://s0.pstatp.com', 'http://s2.pstatp.com']
    // },
});

fis.config.merge({
    deploy: {
        dev : [{
            receiver: DEPLOY.receiver,
            //从产出的结果的static目录下找文件
            from : '/resource',
            //保存到远端机器
            to : DEPLOY.dev_root + '/webroot'
        }, {
            receiver: DEPLOY.receiver,
            //从产出的结果的static目录下找文件
            from : '/template',
            //保存到远端机器
            to : DEPLOY.dev_root + '/djangosite/templates',
            replace : {
                from : '{{{path}}}',
                to : 'template/' + PROJECT_NAME
            }
        }],
        online: [{
            from : '/resource',
            //保存到远端机器
            to : './output/webroot'
        }, {
            from : '/template',
            //保存到远端机器
            to : './output/djangosite/templates',
            replace : {
                from : '{{{path}}}',
                to : 'template/' + PROJECT_NAME
            }
        }]
    }
});
//打包配置
fis.config.set('pack', {
    '/static/pkg/core.js': [
        'common/**.js'
    ],
    '/static/pkg/core.css': [
        'common/**.less'
    ],
    '/static/pkg/lib.js': [
        'static/js/lib/mod.js',
        'static/js/lib/listener.js',
        'static/js/lib/jquery.js',
        'static/js/lib/jquery.cookie.js',
        'static/js/lib/underscore.js',
        'static/js/lib/pagelet.js'
    ],
    '/static/pkg/index.js': [
        'pagelet/nav/nav.js',
        //将list.js从index.js包中移除，采用require.async异步加载
        // 'pagelet/list/list.js'
    ],
    '/static/pkg/index.css': [
        'pagelet/nav/nav.less',
        'pagelet/list/list.less'
    ]
});
