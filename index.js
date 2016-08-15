/**
 * Created by Administrator on 2016/5/30.
 */





require.config({
    shim:{
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap' //'$.fn.modal'
        },
        //没有 按照 AMD规范写的插件
        'uploader': {
            deps: ['jquery'],
            exports: '$.fn.uploader'
        },

        'slimscroll':{
            deps:['jquery'],
            exports:'$.fn.slimscroll'
        },

        'dMenu':{
            deps:['jquery'],
            exports:'$.fn.dMenu'
        },

        'treeview':{
            deps:['jquery'],
            exports:'$.fn.treeview'
        },

        //'tabview':{
        //    deps:['jquery'],
        //    exports:'$.fn.tabview'
        //},

        'datepicker':{
            deps:['jquery'],
            exports:'$.fn.datepicker'
        },
        'datepickerCN':{
            deps:['datepicker'],
            //exports:'$.fn.datepicker.dates.zh-CN'
        },

        /*
        'formview':{
            deps:['jquery','datepicker','datepickerCN'],
            exports:'$.fn.formview'
        },

        'tableView':{
            deps:['jquery'],
            exports:'$.fn.tableView'
        },

        'BW':{
            deps:['jquery','formview','tabview','bootstrap-dialog','slimscroll'],
            exports:'BW'
        }
        */
    },

    paths: {
        //外部包(require.js 插件)
        //'domReady':'http://cdn.bootcss.com/require-domReady/2.0.1/domReady',

        // js libs
        'jquery': 'jsLib/jquery-1.12.3',
        'bootstrap':'bootstrap/js/bootstrap',
        //插件路径
        'bootstrap-dialog': 'plugins/dialog/js/bootstrap-dialog',
        'tableView':'plugins/tableView/tableView',
        'tabview':'plugins/tabView/tabView',
        'formview':'plugins/formView/jquery.formview',
        'validateX':'plugins/validate/jquery.validateX',
        'PUMsg':'plugins/popUpMsg/popUpMsg',
        'puMenu':'plugins/puMenu/puMenu',
                //没有按 AMD 规范写的插件，需要在 require.config shim 里定义依赖和输出
        'uploader': 'plugins/uploader/uploader',
        'slimscroll':'plugins/slimScroll/jquery.slimscroll',
        'dMenu':'plugins/dMenu/jquery.dMenu',
        'treeview':'plugins/treeView/bootstrap-treeview',

        'datepicker':'plugins/datepicker/bootstrap-datepicker',
        'datepickerCN':'plugins/datepicker/locales/bootstrap-datepicker.zh-CN',
        'Chartjs':'plugins/chart/Chart',


        'BuildWin':'plugins/buildWin/buildWin',
        'echarts':'plugins/echart/echarts'

    }

});



require(['jquery','bootstrap-dialog','BuildWin','PUMsg','echarts','dMenu','slimscroll','treeview','puMenu'], function ($,BootstrapDialog,BW){





    $('#menu-LeftPush').dMenu({
        type:'push-left',      // the Menu type
        wrapperID:'#l-middle-content', // the wrapper id
        menuToggleBtnID:'#menuToggleBtn-LeftPush', // the menu toggle button
    });

    $('#menu-LeftTopPush').dMenu({
        type:'push-left',      // the Menu type
        wrapperID:'#l-header-Content', // the wrapper id
        menuToggleBtnID:'#menuToggleBtn-LeftPush', // the menu toggle button
    });



    $('.l-menu-wrapper').slimScroll({
        height:'100%',
        size:'14px'
    });

    //给menu 取数据
    var req={url:'../bin/gemsmenulist.php'+'?fmtoken='+globalSetting.token};
    getAjax(req,getDataSuccess);

    //
    //var ctx_bar = document.getElementById("BarChart").getContext('2d');
    //ctx_bar.fillRect(10,10,500,500);
    //
    //var Chart_Bar = new Chart(ctx_bar, {
    //    type: 'bar',
    //    data: {
    //        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //        datasets: [{
    //            label: '# of Votes',
    //            data: [11, 8, 3, 5, 2, 3],
    //            backgroundColor: [
    //                'rgba(255, 99, 132, 0.2)',
    //                'rgba(54, 162, 235, 0.2)',
    //                'rgba(255, 206, 86, 0.2)',
    //                'rgba(75, 192, 192, 0.2)',
    //                'rgba(153, 102, 255, 0.2)',
    //                'rgba(255, 159, 64, 0.2)'
    //            ],
    //            borderColor: [
    //                'rgba(255,99,132,1)',
    //                'rgba(54, 162, 235, 1)',
    //                'rgba(255, 206, 86, 1)',
    //                'rgba(75, 192, 192, 1)',
    //                'rgba(153, 102, 255, 1)',
    //                'rgba(255, 159, 64, 1)'
    //            ],
    //            borderWidth: 1
    //        }]
    //    },
    //    options: {
    //        scales: {
    //            yAxes: [{
    //                ticks: {
    //                    beginAtZero:true
    //                }
    //            }]
    //        }
    //    }
    //});

    //var ctx_line=document.getElementById("LineChart");
    //var Chart_Line= new Chart(ctx_line,{
    //    type: 'line',
    //    data:{
    //        labels: ["January", "February", "March", "April", "May", "June", "July"],
    //        datasets: [
    //            {
    //                label: "My First dataset",
    //                fill: false,
    //                lineTension: 0.1,
    //                backgroundColor: "rgba(75,192,192,0.4)",
    //                borderColor: "rgba(75,192,192,1)",
    //                borderCapStyle: 'butt',
    //                borderDash: [],
    //                borderDashOffset: 0.0,
    //                borderJoinStyle: 'miter',
    //                pointBorderColor: "rgba(75,192,192,1)",
    //                pointBackgroundColor: "#fff",
    //                pointBorderWidth: 1,
    //                pointHoverRadius: 5,
    //                pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //                pointHoverBorderColor: "rgba(220,220,220,1)",
    //                pointHoverBorderWidth: 2,
    //                pointRadius: 9,
    //                pointHitRadius: 10,
    //                data: [65, 59, 80, 81, 56, 55, 40],
    //            }
    //        ]
    //    }
    //
    //
    //
    //});

    $('#globalSetting_opiname').parents('li').first().PUMenu({
        data:[
            {
            "name": "logout",
            "title": "注销",

            },

            {
                "name": "changePWD",
                "title": "修改密码",
            }
        ],
        onMenuItemClick:function(event, itemData){
          if(  itemData.data.name=='logout' ){

              getAjax({url: window.globalSetting.logouturl});

              window.globalSetting=null;
              var re=/\/[a-zA-Z0-9_-]*/g,
                  pathArr=window.location.pathname.match(re),
                  cookiePath=pathArr[0];

              CookieUtil.clear('eaosoft_token_lngyes',cookiePath);
              window.location.href='../index.html';

          }else if(  itemData.data.name=='changePWD' ){

              window.open(globalSetting.passreset);
          }
        },

    })

    if(globalSetting.debug){
        var errorMsg= new PUMsg();
        window.onerror = function(errorMessage, scriptURI, lineNumber) {
            errorMsg.setErrorMsg('');
            errorMsg.setErrorMsg('error: ' + errorMessage);
            errorMsg.showErrorMsg();
        }
    }


    function getDataSuccess(data){
        $.extend(true,globalSetting,data.globalsetting);
       // data.globalsetting.token=globalSetting.token;

        !! globalSetting.title && $('#globalSetting_title').append(globalSetting.title) && $('title').append(globalSetting.title);
        !! globalSetting.emailcount && $('#globalSetting_emailCount').append(globalSetting.emailcount);
        !! globalSetting.msgcount && $('#globalSetting_msgCount').append(globalSetting.msgcount);
        !! globalSetting.opimg && $('#globalSetting_opimag').attr('src', globalSetting.opimg);
        !! globalSetting.opname && $('#globalSetting_opiname').append( globalSetting.opname);
        !! globalSetting.opdept && $('#globalSetting_opdept').append( globalSetting.opdept);



        $('#left-menu-tree').treeview(
            {
                data: $.treeview().dataAdaptor(data.menulist),
                levels:1,
                color:'dodgerblue',
                onhoverColor:'#677695',//'#36749E',

                multiSelect:false,
                selectedColor: '#FFFFFF',
                selectedBackColor: '#428bca',
                onNodeClick:function(event, node){
                    var req={},
                        pMsg=new PUMsg({
                            overLayUltimateTime:7000,
                            onOverLayUltimate:function(event,puMsg){
                                if(globalSetting.debug){
                                    puMsg.setErrorMsg('数据解析失败，请查看console');
                                    puMsg.showErrorMsg();
                                }

                            }
                        });
                    req.url=globalSetting.uurl+'?fmname='+node.name+'&fmtoken='+globalSetting.token;
                    if(node.nodes && $.isArray(node.nodes) && node.nodes.length>0){
                        //memnu（nodes） 下有子菜单你哦的是
                    }else{
                        getAjax(req,getMenuContentSuccess,undefined,undefined,{pMessage:pMsg});
                         pMsg.showOverLay();
                    }


                }
            }
        );
    }

    function getMenuContentSuccess(data,preAjaxData){
        if(data.code>=0){

            BW(data,0,'.tabViewContainer');
            if(preAjaxData.pMessage instanceof PUMsg){

                preAjaxData.pMessage.removeOverLay();
                preAjaxData.pMessage.setSuccMsg('加载成功');
                preAjaxData.pMessage.showSuccMsg();
            }
        }
    }

    function getAjax(Request,Success,Complete, Error,preAjaxData ) {
        var ajaxObject = $.ajax({
            url: Request.url ||'',    //请求的url地址
            dataType: Request.dataType || 'json' ,   //返回格式为json
            async: Request.async || true, //请求是否异步，默认为异步
            data:Request.data ||'' ,    //参数值
            type: Request.type ||'post',   //请求方式
            success: function(data) {
                if(typeof Success==="function"){
                    Success(data,preAjaxData);
                }

            },
            complete: function(data) {
                if(typeof Complete==="function"){
                    Complete(data,ajaxObject);
                }

            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest Status:" + XMLHttpRequest.status +"\n"
                    + "XMLHttpRequest readyState: "+ XMLHttpRequest.readyState +"\n"
                    + "textStatus: " + textStatus  +"\n"
                    + "error:" + errorThrown
                );
                if(typeof Error ==='function'){
                    Error(XMLHttpRequest,textStatus,errorThrown);

                    if(preAjaxData.pMessage instanceof PUMsg){
                        preAjaxData.pMessage.removeOverLay();
                        preAjaxData.pMessage.setErrorMsg('加载失败:'+"XMLHttpRequest Status:" + XMLHttpRequest.status +"\n"
                            + "XMLHttpRequest readyState: "+ XMLHttpRequest.readyState +"\n"
                            + "textStatus: " + textStatus  +"\n"
                            + "error:" + errorThrown);
                        preAjaxData.pMessage.showErrorMsg();
                    }
                }
            }
        });

    }
});


