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

        'formview':{
            deps:['jquery','datepicker','datepickerCN'],
            exports:'$.fn.formview'
        },

        //'tableView':{
        //    deps:['jquery'],
        //    exports:'$.fn.tableView'
        //},

        //'BW':{
        //    deps:['jquery','formview','tabview','bootstrap-dialog','slimscroll'],
        //    exports:'BW'
        //}

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

                //没有按 AMD 规范写的插件，需要在 require.config shim 里定义依赖和输出
        'uploader': 'plugins/uploader/uploader',
        'slimscroll':'plugins/slimScroll/jquery.slimscroll',
        'dMenu':'plugins/dMenu/jquery.dMenu',
        'treeview':'plugins/treeView/bootstrap-treeview',

        'datepicker':'plugins/datepicker/bootstrap-datepicker',
        'datepickerCN':'plugins/datepicker/locales/bootstrap-datepicker.zh-CN',
        'Chartjs':'plugins/chart/Chart',
        'formview':'plugins/formView/jquery.formview',

        'BuildWin':'plugins/buildWin/buildWin',
        'echarts':'plugins/echart/echarts'

    }

});



require(['jquery','bootstrap-dialog','BuildWin','echarts','dMenu','slimscroll','treeview'], function ($,BootstrapDialog,BW){





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


    //$('.dropdown-toggle').dropdown();


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


    function getDataSuccess(data){
        globalSetting.uurl=data.globalsetting.uurl;
        data.globalsetting.token=globalSetting.token;

        !! data.globalsetting.title && $('#globalSetting_title').append(data.globalsetting.title) && $('title').append(data.globalsetting.title);
        !! data.globalsetting.emailcount && $('#globalSetting_emailCount').append(data.globalsetting.emailcount);
        !! data.globalsetting.msgcount && $('#globalSetting_msgCount').append(data.globalsetting.msgcount);
        !! data.globalsetting.opimg && $('#globalSetting_opimag').attr('src', data.globalsetting.opimg);
        !! data.globalsetting.opname && $('#globalSetting_opiname').append( data.globalsetting.opname);
        !! data.globalsetting.opdept && $('#globalSetting_opdept').append( data.globalsetting.opdept);



        $('#left-menu-tree').treeview(
            {
                data: $.treeview().dataAdaptor(data.menulist),
                levels:1,
                color:'dodgerblue',
                onhoverColor:'#677695',//'#36749E',

                multiSelect:false,
                selectedColor: '#FFFFFF',
                selectedBackColor: '#428bca',
                onNodeSelected:function(event, node){
                    var req={};
                    req.url=globalSetting.uurl+'?fmname='+node.name+'&fmtoken='+globalSetting.token;
                    getAjax(req,getMenuContentSuccess);
                }
            }
        );
    }

    function getMenuContentSuccess(data){
        if(data.code>=0){
            BW(data,0,'.tabViewContainer');
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
                }
            }
        });

    }
});







//$(document).ready(function(){
//
//
//    $('#menu-LeftPush').dMenu({
//        type:'push-left',      // the Menu type
//        wrapperID:'#l-middle-content', // the wrapper id
//        menuToggleBtnID:'#menuToggleBtn-LeftPush', // the menu toggle button
//    });
//
//    $('#menu-LeftTopPush').dMenu({
//        type:'push-left',      // the Menu type
//        wrapperID:'#l-header-Content', // the wrapper id
//        menuToggleBtnID:'#menuToggleBtn-LeftPush', // the menu toggle button
//    });
//
//
//    $('.dropdown-toggle').dropdown();
//
//
//    $('.l-menu-wrapper').slimScroll({
//        height:'100%',
//        size:'14px'
//    });
//
//
//    //给menu 取数据
//    var req={url:'../bin/gemsmenulist.php'};
//    getAjax(req,getDataSuccess);
//
//
//
//
//
//
//
//
//
//
//    //
//    //$('#getForm')
//    //    .on('click',function(){
//    //
//    //        var req={
//    //            url:'../bin/gemsfunmod.php?fmname=MSUP_BaseInfo'
//    //        };
//    //
//    //        getAjax(req,getYChangData);
//    //
//    //    });
//    //
//    //$('#getReport').on('click',function(){
//    //
//    //    var req={
//    //        url:'../bin/gemsfunmod.php?fmname=FMSSupplyList'
//    //
//    //    };
//    //
//    //
//    //    getAjax(req,getReportData);
//    //});
//    //
//    //function getYChangData(data){
//    //    BW(data,0,'.tabViewContainer');
//    //}
//    //
//    //function getReportData(data){
//    //    BW(data,0,'.tabViewContainer');
//    //}
//
//    function getDataSuccess(data){
//        globalSetting=data.globalsetting;
//
//
//
//        $('#left-menu-tree').treeview(
//            {
//                data: $.treeview().dataAdaptor(data.menulist),
//                levels:1,
//                color:'dodgerblue',
//                onhoverColor:'#677695',//'#36749E',
//
//                multiSelect:false,
//                selectedColor: '#FFFFFF',
//                selectedBackColor: '#428bca',
//                onNodeSelected:function(event, node){
//                    var req={};
//                    req.url=globalSetting.uurl+'?fmname='+node.name+'&fmtoken='+globalSetting.token;
//                    getAjax(req,getMenuContentSuccess);
//                }
//            }
//        );
//
//    }
//
//    function getMenuContentSuccess(data){
//        if(data.code>=0){
//            BW(data,0,'.tabViewContainer');
//        }
//    }
//
//});











// test data


var winData={
    "code": 1,
    "msg": "ok",
    "token": "",
    "uurl": "192.168.10.201:86/lngyes/bin/gemsfunmod.php",
    "DataGUID": "",
    "uid": "c2743d01-0405-4046-9b39439cf1fb52",
    "caption": "基础信息",
    "name": "MSUP_BaseInfo",
    "windows": [
        {
            "uid": "00b30e98-1707-47fe-82f78e418d8e4d",
            "caption": "液场基本信息",
            "name": "MSUP_Win",
            "buttons": [
                {
                    "uid": "8cf2a552-5520-42d0-a65d1fc9a9e463",
                    "caption": "保存(&S)",
                    "ctrlid": "3001",
                    "ctrlname": ""
                },
                {
                    "uid": "9663e28d-aa56-4a14-a1d2d6ca1db2e2",
                    "caption": "删除(&S)",
                    "ctrlid": "3005",
                    "ctrlname": ""
                }
            ],
            "winmodules": [
                {
                    "uid": "a68be429-536d-48b5-a96c159315abde",
                    "caption": "液场基础信息",
                    "mtype": "1",
                    "DetailWinID": "",
                    "DataGUID": "",
                    "UpIDValX": "",
                    "FlagValX": "",
                    "ctrlid": "3004",
                    "winmodfields": [
                        {
                            "uID": "5a4dbd1e-f5bf-49a4-aed676f800e77c",
                            "FCaption": "索引",
                            "FDefName": "uID",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "40",
                            "FValMax": "9999999999.000000",
                            "FValMin": "0.000000",
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": "64",
                            "FStyleEx": "0",
                            "FValueX": ""
                        },
                        {
                            "uID": "7685fbcb-50a1-4e94-a5f1dccb0384ca",
                            "FCaption": "客户编号",
                            "FDefName": "MID",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "50",
                            "FValMax": "9999999999.000000",
                            "FValMin": "0.000000",
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": "3589",
                            "FStyleEx": "0",
                            "FValueX": ""
                        },
                        {
                            "uID": "054e8a0b-dba2-4a9a-9127a9988eedbc",
                            "FCaption": "公司名称",
                            "FDefName": "Caption",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "50",
                            "FValMax": "9999999999.000000",
                            "FValMin": "0.000000",
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": "3589",
                            "FStyleEx": "0",
                            "FValueX": ""
                        },
                        {
                            "uID": "bf2f281c-4b65-4ac2-87aa983148d8b2",
                            "FCaption": "产品名称",
                            "FDefName": "SProduct",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "50",
                            "FValMax": "9999999999.000000",
                            "FValMin": "0.000000",
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": "3589",
                            "FStyleEx": "0",
                            "FValueX": ""
                        },
                        {
                            "uID": "0d7d4bf9-523c-4322-badfdc48a83803",
                            "FCaption": "区域",
                            "FDefName": "SArea",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "40",
                            "FValMax": null,
                            "FValMin": null,
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": null,
                            "FStyleEx": null,
                            "FValueX": ""
                        },
                        {
                            "uID": "1d8ee45b-b737-4a39-b53e56d1fb5771",
                            "FCaption": "负责人",
                            "FDefName": "MainManager",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "40",
                            "FValMax": null,
                            "FValMin": null,
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": null,
                            "FStyleEx": null,
                            "FValueX": ""
                        },
                        {
                            "uID": "6eb6bb4f-5b6f-41d5-b83d4496c12b7c",
                            "FCaption": "电话",
                            "FDefName": "Telephone",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "40",
                            "FValMax": null,
                            "FValMin": null,
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": null,
                            "FStyleEx": null,
                            "FValueX": ""
                        },
                        {
                            "uID": "9de10f54-a955-4d0c-98e0390e14547f",
                            "FCaption": "地址",
                            "FDefName": "SAddress",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "400",
                            "FValMax": null,
                            "FValMin": null,
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": null,
                            "FStyleEx": null,
                            "FValueX": ""
                        },
                        {
                            "uID": "561630e0-8f31-41cc-b395f8e26cc341",
                            "FCaption": "备注",
                            "FDefName": "MNote",
                            "FDefValX": "",
                            "FDefType": "2",
                            "FDefSize": "4000",
                            "FValMax": null,
                            "FValMin": null,
                            "ErrHint": "",
                            "InpuHint": "",
                            "FStyle": null,
                            "FStyleEx": null,
                            "FValueX": ""
                        }
                    ]
                }
            ]
        }
    ],
    "ctrlid": "3004"
};


var fromView={

    formID:'123456789', formTitle:'员工表',
    controlList:[
        {label:'姓名', isLabelDisplay:true, dataType:'txt',placeholder:'请填写姓名',dataID:'name',data:'张三',dataOption:'',required:true},
        {label:'用户名', isLabelDisplay:true, dataType:'txt',placeholder:'请填写用户名',dataID:'userName',data:'',dataOption:'',required:true},
        {label:'称昵', isLabelDisplay:true, dataType:'txt',placeholder:'请填写称昵',dataID:'nickName',data:'',dataOption:'',required:false},
        {label:'邮箱', isLabelDisplay:true, dataType:'email',placeholder:'请填写邮箱',dataID:'email',data:'',dataOption:'',required:true},
        {label:'密码', isLabelDisplay:true, dataType:'psw',placeholder:'',dataID:'password',data:'',dataOption:'',required:true},
        {label:'确认密码', isLabelDisplay:true, dataType:'psw',placeholder:'',dataID:'passwordC',data:'',dataOption:'',required:true},
        {label:'性别', isLabelDisplay:true, dataType:'bool',placeholder:'male',dataID:'gender',data:'male',dataOption:[{id:'male',caption:'男'},{id:'female',caption:'女'}],required:true},
        {label:'工种', isLabelDisplay:true, dataType:'option',placeholder:'worker',dataID:'profession',data:'writer',dataOption:[{id:'teacher',caption:'老师'},{id:'worker',caption:'工人'},{id:'writer',caption:'作家'}],required:true},
        {label:'生日', isLabelDisplay:true, dataType:'date',placeholder:'',dataID:'birthday',data:'1986/04/08',dataOption:'',required:true},
        {label:'部门', isLabelDisplay:true,dataType:'custom',placeholder:'',dataID:'department',data:'',dataOption:{},required:true},
        {label:'注册资金', isLabelDisplay:true,dataType:'currency',currencyType:'',placeholder:'',dataID:'companyRegister',data:'2000',dataOption:{},required:true}
    ]
};


var treeData1=[
    {
        "uid": "0a6a0fa9-b271-466c-898d137a3fcaae",
        "name": "YSystem",
        "title": "系统",
        "token": "d41d8cd98f00b204e9800998ecf8427e",
        "menu": [
            {
                "uid": "494aed25-6ca9-4bc4-90e3e027970656",
                "name": "FMTRoleList",
                "title": "系统角色信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "5c410279-fdfa-4228-b8cdf2ec578904",
                "name": "FMTUserBaseInfo",
                "title": "系统账户基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c188fcd9-f2a1-42af-bf28cfd3217676",
                "name": "FMTRoleBaseInfo",
                "title": "系统角色基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c693ebd9-8da4-4e96-943d9f4fc5d8e4",
                "name": "FMTUserList",
                "title": "系统账户信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "ec8041fc-cb57-4452-a586f59d57d0fd",
                "name": "FMTPowerList",
                "title": "系统权限信息列表",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "f6e2d1df-2e83-4a0c-872833b6d9e3af",
                "name": "FMTPowerBaseInfo",
                "title": "系统权限基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            }
        ]
    },
    {
        "uid": "27bfe57d-283c-4288-987e32a4e0f6ce",
        "name": "YSupplier",
        "title": "液厂",
        "token": "d41d8cd98f00b204e9800998ecf8427e",
        "menu": [
            {
                "uid": "187c4502-9c22-48a1-b7d7ae9a161954",
                "name": "FMSRoleList",
                "title": "液厂角色信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e",

            },
            {
                "uid": "528fc0fd-f07e-4f52-92ab10b4a26bfc",
                "name": "FMSSupplyList",
                "title": "液厂信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "673aa7e4-f131-4ad2-b6f46fb4f81916",
                "name": "FMSRoleBaseInfo",
                "title": "液厂角色基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c2743d01-0405-4046-9b39439cf1fb52",
                "name": "FMSupplyBaseInfo",
                "title": "液厂基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c3ab6887-35b0-44be-b5ffd77b20ae30",
                "name": "FMSPowerList",
                "title": "液厂权限列表",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "d20111fd-c07a-4a07-8f2b2ade46d2d0",
                "name": "FMSPowerBaseInfo",
                "title": "液厂权限基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "ef355f43-f7bb-4ede-96ddd5265d4fd3",
                "name": "FMSUserList",
                "title": "液场账户信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "f72f94fd-a481-4333-900a61f9f8fd20",
                "name": "FMSUserBaseInfo",
                "title": "液厂账户基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            }
        ]
    },
    {
        "uid": "4b13f631-f647-458c-92f1844508c09a",
        "name": "YPlan",
        "title": "计划",
        "token": "d41d8cd98f00b204e9800998ecf8427e",
        "menu": [
            {
                "uid": "187c4502-9c22-48a1-b7d7ae9a161954",
                "name": "FMSRoleList",
                "title": "液厂角色信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "528fc0fd-f07e-4f52-92ab10b4a26bfc",
                "name": "FMSSupplyList",
                "title": "液厂信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "673aa7e4-f131-4ad2-b6f46fb4f81916",
                "name": "FMSRoleBaseInfo",
                "title": "液厂角色基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c2743d01-0405-4046-9b39439cf1fb52",
                "name": "FMSupplyBaseInfo",
                "title": "液厂基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c3ab6887-35b0-44be-b5ffd77b20ae30",
                "name": "FMSPowerList",
                "title": "液厂权限列表",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "d20111fd-c07a-4a07-8f2b2ade46d2d0",
                "name": "FMSPowerBaseInfo",
                "title": "液厂权限基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "ef355f43-f7bb-4ede-96ddd5265d4fd3",
                "name": "FMSUserList",
                "title": "液场账户信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "f72f94fd-a481-4333-900a61f9f8fd20",
                "name": "FMSUserBaseInfo",
                "title": "液厂账户基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            }
        ]
    },
    {
        "uid": "57612b59-acc5-4cb4-ae7b3021f39c97",
        "name": "YIndent",
        "title": "订单",
        "token": "d41d8cd98f00b204e9800998ecf8427e",
        "menu": [
            {
                "uid": "187c4502-9c22-48a1-b7d7ae9a161954",
                "name": "FMSRoleList",
                "title": "液厂角色信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "528fc0fd-f07e-4f52-92ab10b4a26bfc",
                "name": "FMSSupplyList",
                "title": "液厂信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "673aa7e4-f131-4ad2-b6f46fb4f81916",
                "name": "FMSRoleBaseInfo",
                "title": "液厂角色基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c2743d01-0405-4046-9b39439cf1fb52",
                "name": "FMSupplyBaseInfo",
                "title": "液厂基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "c3ab6887-35b0-44be-b5ffd77b20ae30",
                "name": "FMSPowerList",
                "title": "液厂权限列表",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "d20111fd-c07a-4a07-8f2b2ade46d2d0",
                "name": "FMSPowerBaseInfo",
                "title": "液厂权限基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "ef355f43-f7bb-4ede-96ddd5265d4fd3",
                "name": "FMSUserList",
                "title": "液场账户信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "f72f94fd-a481-4333-900a61f9f8fd20",
                "name": "FMSUserBaseInfo",
                "title": "液厂账户基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            }
        ]
    },
    {
        "uid": "e843a6c2-ecf1-47e5-ad75dd9c803a37",
        "name": "Ybuyer",
        "title": "会员",
        "token": "d41d8cd98f00b204e9800998ecf8427e",
        "menu": [
            {
                "uid": "0f86d652-4697-46ad-b7f5b403b919cd",
                "name": "FMMUserList",
                "title": "会员账户信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "28cd50dc-94f4-4dc1-8181d3d6ba35da",
                "name": "FMMRoleList",
                "title": "会员角色信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "335c7bdf-34bd-46bc-ad59c34436db0c",
                "name": "FMMemberBaseInfo",
                "title": "会员基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "9b0a038d-d6f8-4f29-8daa12ad744725",
                "name": "FMMPowerList",
                "title": "会员权限信息列表",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "a29ece30-0525-4427-a82dae63f3b291",
                "name": "FMMPowerBaseInfo",
                "title": "会员权限基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "a4975189-9f6b-4d67-b9b0555082dc01",
                "name": "FMMMemberList",
                "title": "会员信息查找",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "b51b22e1-df01-40c3-942b002f30f76a",
                "name": "FMMUserBaseInfo",
                "title": "会员账户基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            },
            {
                "uid": "dfeb1451-9bfc-4569-b133f5d457f39b",
                "name": "FMMRoleBaseInfo",
                "title": "会员角色基础信息",
                "token": "d41d8cd98f00b204e9800998ecf8427e"
            }
        ]
    }
];


//var treeData=[
//    {
//        "uid": "0a6a0fa9-b271-466c-898d137a3fcaae",
//        "name": "YSystem",
//        "title": "系统",
//        "menu": [
//            {
//                "uid": "08e35748-29a3-4934-b1d1da1a4bc91e",
//                "name": "OrgInfo",
//                "title": "组织结构"
//            },
//            {
//                "uid": "24028771-db7e-4020-a140247e81d5a1",
//                "name": "BaseInfo",
//                "title": "基础信息"
//            },
//            {
//                "uid": "a2f1a57b-411e-4033-855870fd1a7686",
//                "name": "LimitInfo",
//                "title": "权限"
//            },
//            {
//                "uid": "e7beaac2-d3e6-497d-af879108b16720",
//                "name": "RoleInfo",
//                "title": "角色"
//            },
//            {
//                "uid": "f88e19c6-feab-4049-a4dd88cd4129f5",
//                "name": "EmpInfo",
//                "title": "员工信息"
//            }
//        ]
//    },
//    {
//        "uid": "27bfe57d-283c-4288-987e32a4e0f6ce",
//        "name": "YSupplier",
//        "title": "液场",
//        "menu": [
//            {
//                "uid": "124810e3-c137-4cc4-bf5d9af0619bb6",
//                "name": "OrgInfo",
//                "title": "组织结构"
//            },
//            {
//                "uid": "58cb4035-ce85-43bf-b261449578d5bf",
//                "name": "LimitInfo",
//                "title": "权限"
//            },
//            {
//                "uid": "65564f07-8c1d-457a-8a6e78dec14a0d",
//                "name": "EmpInfo",
//                "title": "员工信息"
//            },
//            {
//                "uid": "676cb2a4-f13c-4367-877606e7f4176d",
//                "name": "RoleInfo",
//                "title": "角色"
//            },
//            {
//                "uid": "c2743d01-0405-4046-9b39439cf1fb52",
//                "name": "BaseInfo",
//                "title": "基础信息"
//            }
//        ]
//    },
//    {
//        "uid": "4b13f631-f647-458c-92f1844508c09a",
//        "name": "YPlan",
//        "title": "计划",
//        "menu": [
//            {
//                "uid": "124810e3-c137-4cc4-bf5d9af0619bb6",
//                "name": "OrgInfo",
//                "title": "组织结构"
//            },
//            {
//                "uid": "58cb4035-ce85-43bf-b261449578d5bf",
//                "name": "LimitInfo",
//                "title": "权限"
//            },
//            {
//                "uid": "65564f07-8c1d-457a-8a6e78dec14a0d",
//                "name": "EmpInfo",
//                "title": "员工信息"
//            },
//            {
//                "uid": "676cb2a4-f13c-4367-877606e7f4176d",
//                "name": "RoleInfo",
//                "title": "角色"
//            },
//            {
//                "uid": "c2743d01-0405-4046-9b39439cf1fb52",
//                "name": "BaseInfo",
//                "title": "基础信息"
//            }
//        ]
//    },
//    {
//        "uid": "57612b59-acc5-4cb4-ae7b3021f39c97",
//        "name": "YIndent",
//        "title": "订单",
//        "menu": [
//            {
//                "uid": "124810e3-c137-4cc4-bf5d9af0619bb6",
//                "name": "OrgInfo",
//                "title": "组织结构"
//            },
//            {
//                "uid": "58cb4035-ce85-43bf-b261449578d5bf",
//                "name": "LimitInfo",
//                "title": "权限"
//            },
//            {
//                "uid": "65564f07-8c1d-457a-8a6e78dec14a0d",
//                "name": "EmpInfo",
//                "title": "员工信息"
//            },
//            {
//                "uid": "676cb2a4-f13c-4367-877606e7f4176d",
//                "name": "RoleInfo",
//                "title": "角色"
//            },
//            {
//                "uid": "c2743d01-0405-4046-9b39439cf1fb52",
//                "name": "BaseInfo",
//                "title": "基础信息"
//            }
//        ]
//    },
//    {
//        "uid": "e843a6c2-ecf1-47e5-ad75dd9c803a37",
//        "name": "Ybuyer",
//        "title": "会员",
//        "menu": [
//            {
//                "uid": "4082d184-0ae4-4919-85daf450887f13",
//                "name": "OrgInfo",
//                "title": "组织结构"
//            },
//            {
//                "uid": "42d2956e-e9b7-47a9-99f1ccd4df3920",
//                "name": "LimitInfo",
//                "title": "权限"
//            },
//            {
//                "uid": "5b35c8fb-7ead-4b07-a1354b0edebfcf",
//                "name": "EmpInfo",
//                "title": "员工信息"
//            },
//            {
//                "uid": "a15ea7aa-80f6-4b7d-8b3e754d7bea27",
//                "name": "RoleInfo",
//                "title": "角色"
//            },
//            {
//                "uid": "b7913244-007e-4026-ba6384d4187876",
//                "name": "BaseInfo",
//                "title": "基础信息"
//            }
//        ]
//    }
//];