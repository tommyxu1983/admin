/**
 * Created by Administrator on 2016/7/5.
 */



require.config({

    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap' //'$.fn.modal'
        },
        //没有 按照 AMD规范写的插件
        'uploader': {
            deps: ['jquery'],
            exports: '$.fn.uploader'
        }


    },

    paths: {
        jquery: '../jsLib/jquery-1.11.3',
        domReady:'http://cdn.bootcss.com/require-domReady/2.0.1/domReady.js', //外部包

        'bootstrap':'../bootstrap/js/bootstrap',
        'bootstrap-dialog': '../plugins/dialog/js/bootstrap-dialog',

        'uploader': '../plugins/uploader/uploader' , //插件路径
    }




});

require(['jquery','bootstrap-dialog','uploader'], function ($,BootstrapDialog){

    //alert($.isArray([]));
       BootstrapDialog.show(
        {
            title: '删除',
            size: BootstrapDialog.SIZE_SMALL,
            message: '<span style="font-size:2em; margin-left: 35%">确认删除</span>'
        }
     );

    $('#uploader').uploader();

});