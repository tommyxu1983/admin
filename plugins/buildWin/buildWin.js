/**
 * Created by Administrator on 2016/6/14.
 */

+(
    function(window,factory){
    if(typeof define==='function' && define.amd){
        define('BuildWin',['jquery','bootstrap-dialog','FileSaver','Chartjs','PUMsg','tabview','slimscroll','tableView','formview','validateX'],factory);
    }else if( typeof window !=='undefined' && !!window.jQuery){
       return  factory(jQuery);
    }


    }(typeof window !== "undefined" ? window : this, function($,BootstrapDialog,saveAs,Chart)

    {


        function GUID() {
            this.date = new Date();

            /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
            if (typeof this.newGUID != 'function') {

                /* 生成GUID码 */
                GUID.prototype.newGUID = function() {
                    this.date = new Date();
                    var guidStr = '';
                    sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                    sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                    for (var i = 0; i < 9; i++) {
                        guidStr += Math.floor(Math.random()*16).toString(16);
                    }
                    guidStr += sexadecimalDate;
                    guidStr += sexadecimalTime;
                    while(guidStr.length < 32) {
                        guidStr += Math.floor(Math.random()*16).toString(16);
                    }
                    return this.formatGUID(guidStr);
                }

                /*
                 * 功能：获取当前日期的GUID格式，即8位数的日期：19700101
                 * 返回值：返回GUID日期格式的字条串
                 */
                GUID.prototype.getGUIDDate = function() {
                    return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
                }

                /*
                 * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933
                 * 返回值：返回GUID日期格式的字条串
                 */
                GUID.prototype.getGUIDTime = function() {
                    return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero( parseInt(this.date.getMilliseconds() / 10 ));
                }

                /*
                 * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现
                 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串
                 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串
                 */
                GUID.prototype.addZero = function(num) {
                    if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                        return '0' + Math.floor(num);
                    } else {
                        return num.toString();
                    }
                }

                /*
                 * 功能：将y进制的数值，转换为x进制的数值
                 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10
                 * 返回值：返回转换后的字符串
                 */
                GUID.prototype.hexadecimal = function(num, x, y) {
                    if (y != undefined) {
                        return parseInt(num.toString(), y).toString(x);
                    } else {
                        return parseInt(num.toString()).toString(x);
                    }
                }

                /*
                 * 功能：格式化32位的字符串为GUID模式的字符串
                 * 参数：第1个参数表示32位的字符串
                 * 返回值：标准GUID格式的字符串
                 */
                GUID.prototype.formatGUID = function(guidStr) {
                    var str1 = guidStr.slice(0, 8) + '-',
                        str2 = guidStr.slice(8, 12) + '-',
                        str3 = guidStr.slice(12, 16) + '-',
                        str4 = guidStr.slice(16, 20) + '-',
                        str5 = guidStr.slice(20);
                    return str1 + str2 + str3 + str4 + str5;
                }
            }
        }

        var undefined;
        var _ctrl={
            save:'3001',
            find:'3003',
            create:'3004',
            delete:'3005',
            open:'3006',
        };


        if (typeof $ === 'undefined') {
            throw new Error( + 'buildWin\'s  requires jQuery');
        }

        var _html={
            div:'<div></div>',
            button:'<button></button>'
        };

        var _moduleType={
            form:'1',
            report:'4',
            chart:'17'
        };
        var _defaultStyle={
            bs:{

                row:'row',

                col_sm_3:'col-sm-2',
                col_sm_8:'col-sm-8',
                offset_2col:'col-sm-offset-2'
            }
        };

        //这些 _cssClass  外部用来控制 样式的
        var _cssClass={
            modulesContainer:'win-modulesContainer',
            modulePanel:'modulePanel',
            buttonsContainer:'win-buttonsContainer',
            buttonsContainerBanner:'banner',
            buttonsContainerContent:'content',
            buttonsContainerToggle:'buttonCollapse',
            buttonDiv:'buttonPanel',
            buttonGrid:'win-buttonGrid',
            button:'win-button',
            panelContent:'win-panelContent',

        };

        var logError = function (message) {
            if (window.console) {
                window.console.error(message);
                if(globalSetting.debug){
                    throw new Error(message);
                }
            }
        };


        function DataPackCache () {
            this.arr_dataPack=[];
        }

        DataPackCache.prototype = {

            add: function(liDataPack,windIndex){
                var instanceOfGUID = new GUID(),
                    guID = instanceOfGUID.newGUID(),
                    index4Windows = -1,
                     hasDataPack=false;
                if(liDataPack.windows && liDataPack.windows.length && liDataPack.windows.length>0 ){
                    if(windIndex>=0){
                        index4Windows=windIndex;
                    }

                }

                hasDataPack= this.arr_dataPack.some(function(item){
                     return item.key==guID;
                });

                if(! hasDataPack ){
                    this.arr_dataPack.push({
                        key: guID,
                        data: liDataPack,
                        winData: liDataPack.windows[index4Windows],
                        winDataCopy: $.extend({},liDataPack.windows[index4Windows]),
                        modulesAdptData:[]
                    })
                    return guID;
                }else{
                    return undefined;
                }
            },

            get:function(guid){
                var liDataPk=this.arr_dataPack.filter(function(item,index){
                    return item.key == guid;
                });

                if(liDataPk.length && liDataPk.length==1){
                    return  liDataPk[0];
                }else{
                    return undefined;
                }

            },

            remove: function(guid){
                var index4RemoveItem=-1;
                this.arr_dataPack.forEach(function(item,index){
                    if(item.key == guid){
                        index4RemoveItem = index;
                    }
                });

                if( index4RemoveItem>=0 ){
                    this.arr_dataPack.splice(index4RemoveItem,1);
                    return true;
                }else{
                    return false;
                }

            }

        };



        var BuildWin=function(selector){
            var buildwinSelf = this;
            this.dataPKCache = new DataPackCache();
            this.$selector = $(selector);

            /*               this.data=data;
             this.winData=data.windows[windowsIndex];
             this.winDataCopy=$.extend({},this.winData); // 请不要操作任何 winDataCopy 里的数据，用来覆盖 winData,当要重置时。
             this.$selector=$(selector);

             //当传入表单（formview）modulesAdptData和 winModules 做数据匹配，从  winModules 拷贝一份数据  this.modulesAdptData=[{type:1, fields[]},{},{},{}]
             //直接传入 插件（formview）,任何 input 数据改动，都会直接改动 modulesAdptData 里的数据，等 writeBack()被调用时，再将这些值覆盖回 winmodules
             // 1代表 form， 4代表 report（dataGrid）
             this.modulesAdptData=undefined;
             */

       //      this.getButtonsForTableRow(this.winData);



         /*    this.init(liDataPack, windowIndex , method);*/




            if($(selector).length ==1){
                this.$selector = $(selector);
                return{
                    buildTab : function(liDataPack, windowIndex){
                        buildwinSelf.initBuild.call(buildwinSelf,liDataPack,'tab',windowIndex);
                    },

                    buildDialog : function(liDataPack, windowIndex){
                        buildwinSelf.initBuild.call(buildwinSelf,liDataPack,'dialog',windowIndex);
                    }
                }

            }else{
                throw new Error('please pass the right selector for BW');
            }

        };
        
        BuildWin.prototype.initBuild=function(liDataPack,method,windowIndex ){

            var _winIndex= $.isNumeric(windowIndex)? parseInt(windowIndex,10) : 0,
                dataPackGuID = this.dataPKCache.add(liDataPack, _winIndex);

            if($.isArray(liDataPack.windows) && liDataPack.windows[_winIndex] ){
                if(method =='tab'){

                    this.buildInTabView(liDataPack.windows[_winIndex],dataPackGuID,this.$selector);

                }else if (method=='dialog'){

                    this.buildInDialog(liDataPack.windows[_winIndex],dataPackGuID);

                }else{
                    console.log('don\'t have this method to buildwin');
                }
            }
            else{
                logError('data.windows 不是 array 或 windowsIndex 超出数组范围');
            }
        };

        /*BuildWin.prototype.update=function(liDataPack,windowsIndex,oldDataPKGUid, $updateModuleDiv) {
            //$updateModuleDiv table

            var me=this, dataPKGUid,localDataPack;



            if ($.isArray(liDataPack.windows) && liDataPack.windows[windowsIndex]) {
               // this.closeTabView();

                if( me.dataPKCache.remove(oldDataPKGUid)){


                    //当传入表单（formview）modulesAdptData和 winModules 做数据匹配，从  winModules 拷贝一份数据  this.modulesAdptData=[{type:1, fields[]},{},{},{}]
                    //直接传入 插件（formview）,任何 input 数据改动，都会直接改动 modulesAdptData 里的数据，等 writeBack()被调用时，再将这些值覆盖回 winmodules
                    // 1代表 form， 4代表 report（dataGrid）
                    //this.modulesAdptData = [];

                    /!*this.getButtonsForTableRow(localDataPack.winData);*!/

                    if($updateModuleDiv){

                        dataPKGUid = me.dataPKCache.add(liDataPack,windowsIndex);
                        localDataPack = me.dataPKCache.get(dataPKGUid);
                        $.each( localDataPack.winData.winmodules,function(index,winmodule){

                            xxxxxxx modulesAdptData

                            if(winmodule.mtype==_moduleType.report){
                                me.buildReport(winmodule,$updateModuleDiv,dataPKGUid)

                            }

                        });
                    }else{
                        me.initBuild(liDataPack, 'tab', 0);
                    }

                }else{
                    throw new Error('Error: can\'t remove dataPack');
                }



            }

        };*/

        BuildWin.prototype.getButtonsForTableRow=function(winData){
            var buttons=[];
            if ($.isArray(winData.buttons)){
                $.each(winData.buttons, function(index,button){
                    if(button.styleex>0){
                        [].push.call(buttons,{innerHTML:button.caption,id:button.ctrlid,icon:button.icon,data:button})
                    }


                });
            }

            return buttons;
        };

        //在dialog(跳出窗口) 建窗口
        BuildWin.prototype.buildInDialog=function(winData,dataPackGuID){
            var me=this,
                hasForminModules=false,
                modulesAdptData=[],
                $modules_Div=$(_html.div).addClass(_cssClass.modulesContainer);

            var newDialog=new BootstrapDialog({
                size: BootstrapDialog.SIZE_WIDE,
                title: winData.caption,
                data:{'dataPackGID4Dialog': dataPackGuID},
                onhide: function(dialogRef){
                    var guid = dialogRef.getData('dataPackGID4Dialog');
                    me.dataPKCache.remove(guid);
                },
            });

            //模块（form 或 report）
            var winmodules= winData.winmodules;

           if ($.isArray(winmodules)) {
               // this.modulesAdptData 这里被初始化
               me.dataPKCache.get(dataPackGuID).modulesAdptData = modulesAdptData;
               for( var index=0, length=winmodules.length; index<length; index++){
                   var module=winmodules[index];
                   var $module_Div=$(_html.div).addClass(_cssClass.modulePanel);
                   modulesAdptData.push({uID:module.uid});
                   if(module.mtype){
                       switch(module.mtype){

                           //如果是表单
                           case _moduleType.form:
                               modulesAdptData[modulesAdptData.length-1].mtype=_moduleType.form;
                               //建立 表单
                               me.buildForm(module,$module_Div,modulesAdptData.length-1,dataPackGuID,newDialog);
                               hasForminModules=true;
                               break;

                           //如果是 grid
                           case _moduleType.report:
                               me.buildReport(module,$module_Div,dataPackGuID,newDialog);
                               break;
                           //如果是 chart
                           case _moduleType.chart:
                               if ($('.chartContainer').length>0){
                                   me.buildChart(module,$('.chartContainer'));
                               }else{
                                   console.log('please in html file define your <div class="chartContainer"><canvas id="LineChart" width="500" height="600"></canvas></div>');
                               }

                               return;
                               break;

                       }

                       $modules_Div.append($module_Div);
                   }else{
                       logError('缺少 module.mtype 不能解析');
                   }
               }
           }

            //包含 按钮和 模块（form 或 report）
            var $panelContent=$(_html.div)
                .append($modules_Div)
               /* .append($buttons_Div)*/
                .css('overflow-x', 'auto');

            //窗口按钮
            if( ! hasForminModules){
                var $buttons_Div=$(_html.div).addClass(_cssClass.buttonDiv +' ' +_defaultStyle.bs.offset_2col +' '+_defaultStyle.bs.col_sm_8);
                me.buildModuleButtons(winData.buttons,$buttons_Div,dataPackGuID,newDialog);
                $panelContent.append($buttons_Div);
            }
            $panelContent.slimScroll({
                height:'100%',
                width:'100%'
            });

            newDialog.setMessage($panelContent);
            newDialog.open();


        };

        //在 tab里建窗口
        BuildWin.prototype.buildInTabView=function(winData,dataPackGuID,selector){

       /*     winData.winmodules=[1,2,3,4,556]

            var localdataPk=this.dataPKCache.get(dataPackGuID);*/


            $(selector).length<1 && logError('buildInTabView 没有元素被选中哇');

            var me=this,
                hasFormInModules=false,
                modulesAdptData=[],

                $modulesContainer_Div=$(_html.div).addClass(_cssClass.modulesContainer),
                $module_Div,
                //模块（form 或 report）
                winmodules= winData.winmodules;
            if ($.isArray(winmodules)){
                //winmodule,这里被初始化；
                me.dataPKCache.get(dataPackGuID).modulesAdptData = modulesAdptData;
                $.each(winmodules, function(index,module){
                    $module_Div=$(_html.div).addClass(_cssClass.modulePanel);
                    modulesAdptData.push({uID:module.uid})
                    if(module.mtype){
                        switch(module.mtype){

                            //如果是表单
                            case _moduleType.form:
                                modulesAdptData[modulesAdptData.length-1].mtype=_moduleType.form;
                                hasFormInModules=true;
                                //建立 表单
                                me.buildForm(module,$module_Div,modulesAdptData.length-1,dataPackGuID);
                                break;

                            //如果是 grid(表格)
                            case _moduleType.report:
                                me.buildReport(module,$module_Div,dataPackGuID);
                                break;
                        }
                        $modulesContainer_Div.append($module_Div);
                    }else{
                        logError('缺少 module.mtype 不能解析');
                    }
                });
            }
            else{
                console.log('winmodules 不是array');
            }

            //包含 按钮和 模块（form 或 report） 'overflow-x':'hidden',overflow: auto;
            var $panelContent=$(_html.div)
                .addClass(_cssClass.panelContent)
                .css({'background-color': '#ededed'});

            //用来建立module按钮(不包括form, table里的按钮): 如果数据里有form,就不进入。
            if( ! hasFormInModules){
                var $buttons_Div=$(_html.div).addClass(_cssClass.buttonsContainer);
                me.buildModuleButtons(winData.buttons,$buttons_Div,dataPackGuID);
                $panelContent.append($buttons_Div);
            }

            //  module
             $panelContent.append($modulesContainer_Div);




            var tabviewData=[];
            tabviewData.push({
                id: winData.name,
                dataPackGuID:dataPackGuID,
                tab:winData.caption,
                panel:$panelContent,
                isActive: true
            });

            //.slimScroll({height:'100%'});
            this.$selector.tabview({
                isDataWritable:true,
                data:tabviewData,
                onTabClose:function(evt,arguments){
                  if (! me.dataPKCache.remove(arguments.dataPackGuIDFromTab)){
                      throw new Error('can\'t remove datapack with correct GUID');
                  };
                }
            });

            $panelContent.slimScroll({
                height:'100%',
                size:'14px',
            });
        };

        BuildWin.prototype.closeTabView=function(dataPackGuID){
            // if(this.data.DataGUID){
            var me = this,
            liDataPack = me.dataPKCache.get(dataPackGuID);
            me.$selector.tabview('deleteItem', liDataPack.winData.name);
            return true;

            // }else{
            //     alert('缺少 DataGUID,不能操作删除');
            //     return false;
            //  }
        };

        BuildWin.prototype.buildForm=function(module,$moduleDiv,moduleIndex,dataPackGuID,dialog){
            //  var formData={};
            var me=this,
                localdataPackGuID = dataPackGuID,
                liDataPack = me.dataPKCache.get(dataPackGuID),
                modulesAdptData = liDataPack.modulesAdptData,
                winData = me.dataPKCache.get(dataPackGuID).winData;
            (! module.uid)&& logError('form uid 缺少 module uid');
            if(modulesAdptData[moduleIndex]){
                modulesAdptData[moduleIndex].formID=module.uid;
                modulesAdptData[moduleIndex].formTitle=module.caption;
                modulesAdptData[moduleIndex].controlList=[];
            }else{
                logError('please passing a correct index for buildform \'moduleIndex')
            }

            if($.isArray(module.winmodfields) ) {
                //数据 适配
                $.each(module.winmodfields, function (index, control) {

                    var inputType = {
                        '1': 'text',
                        '2': 'text',
                        '3': 'integer',
                        '4': 'integer',
                        '5': 'float',
                        '6': 'float',
                        '7': 'float',
                        '8': 'date',
                        '9': 'time',
                        '10':'dateTime',
                        '12':'option',
                        '21':'psw',
                        '22':'multi',
                        '23':'files',
                        '24':'richtext',
                        '25':'steps',
                        '26':'img'
                    }[control.FDefType];



                    if((inputType=='option'|| inputType=='multi' || inputType==='steps' )&& $.isArray(control.FLinks)){
                        var   dataOption=[];
                        $.each(control.FLinks,function(index, FLink){
                            dataOption.push({
                                id:FLink.uid,
                                caption: FLink.caption,
                                checked:FLink.checked
                            });
                        });
                    }
                    modulesAdptData[moduleIndex].controlList.push({
                        label: control.FCaption,
                        isLabelDisplay: true,
                        dataType: inputType,
                        inputReadOnly:control.FReadonly,
                        inputMultiLine:control.FMultiLine,
                        placeholder: control.InpuHint,
                        dataID: control.FDefName,
                        data: control.FValueX,
                        dataOption: dataOption,
                        validateRules: control.valivalue,
                        FNoNewLine: control.FNoNewLine

                    });


                });

                var formButtons= winData.buttons? me.buildFormButtons(winData.buttons,dataPackGuID,dialog):[];


                //用 formview 插件，formData建立data.
                $moduleDiv.formview({
                    data: modulesAdptData[moduleIndex],
                    isDataWritable:true,
                    buttons:formButtons});

                //用 validate 插件， 来校验
                if($moduleDiv.find('form').length>0){

                    var vRules=$moduleDiv.formview('getVRules');

                    $moduleDiv.find('form').validateX({
                        rules: vRules,
                        onValidateAtServer:function(evt,validateData){
                            var request;

                                me.writeBack(localdataPackGuID); //读取表单里的文字
                                request={url:validateData.url,data: JSON.stringify(liDataPack.data)};

                            me.sendAjax(request,me.onValidateOnServerSuccess,undefined,undefined,validateData);
                        }
                    });

                }

            }else{
                logError('there is no data for module.winmodfields');
            }
        };

        BuildWin.prototype.buildReport=function(module,$moduleDiv,dataPackGuID, dialog4Parent){
            var me=this,
                localdataPackGuID=dataPackGuID,
                liDataPack = me.dataPKCache.get(dataPackGuID),//modulesAdptData ,winData
                tableHeader=module.winmodfields.Body.Head,
                tableData=module.winmodfields.Body.Data,
                detailWinID=module.DetailWinID,
                paginationSetting= {
                    pageCount:module.winmodfields.Body.pageCount,
                    pageIndex:module.winmodfields.Body.pageIndex,
                    rowEnd:module.winmodfields.Body.rowEnd,
                    rowStart:module.winmodfields.Body.rowStart,
                    rows:module.winmodfields.Body.rows,
                    totalPages:module.winmodfields.Body.totalPages,
                    totalRows:module.winmodfields.Body.totalRows,
                    funModName:liDataPack.data.name,
                    url:module.winmodfields.Body.uurl,

                    onGoToPageClick: $.proxy(function(evt,goToPageIndex,pSetting,clickTarget){
                        var reqGotoPage={}, pageIndex=goToPageIndex;
                        //如果是goto page 输入框
                        if(goToPageIndex=='goToPage' ){
                           var inputValue= $(clickTarget).find('input').val();

                            if( parseInt(inputValue)>0 && parseInt(inputValue)<=pSetting.totalPages){
                                pageIndex=inputValue-1;
                            }else{
                                pageIndex=-1
                            }
                        }

                        //如果到达页码不等于当前页码，执行！
                        if(pageIndex>=0 && pageIndex != pSetting.pageIndex ){
                            this.writeBack(localdataPackGuID);
                            liDataPack.data.PageIndex = pageIndex ;

                            reqGotoPage={
                                url:'http://'+pSetting.url+'?fmname='+pSetting.funModName+'&fmctrlid=3033&fmpageindex='+pageIndex+'&fmtoken='+globalSetting.token,

                                data:JSON.stringify( liDataPack.data)
                            }
                            me.sendAjax( reqGotoPage, $.proxy(me.onGoToPageSuccess,me) , undefined , undefined,{dialog:dialog4Parent,dataPKGuID4Button:localdataPackGuID});
                        }

                    },me)
                };


            $moduleDiv.empty();

            $moduleDiv.tableView({
                tableID:'ms-table',
                Head:tableHeader,
                Data:tableData,
                paginationSetting:paginationSetting,
                rowSettings:{
                    buttons: me.getButtonsForTableRow(liDataPack.winData),
                    onRowButtonClick: function (evt,rowIndex ,$row,rowData,buttonData) {
                        var message4Dialog;
                        if (typeof liDataPack.data.DataGUID =='string' && liDataPack.data.DataGUID.length>0){
                            liDataPack.data.DataGUID= liDataPack.data.DataGUID + ','+ rowData[0];
                        }else{
                            liDataPack.data.DataGUID= liDataPack.data.DataGUID + rowData[0];
                        }
                        var req={
                            url:''
                        };

                        var ctrlID=parseInt(buttonData.ctrlid);

                        if(ctrlID>=5000 && ctrlID<6000 ){

                            var newDialog=new BootstrapDialog({
                                size: BootstrapDialog.SIZE_WIDE,
                            });
                            var replaceURL =buttonData.uurl.replace(/_ROW_DATA_GUID_/g,rowData[0].toString());
                            req={
                                url:replaceURL,
                                dataType:'html',
                                type:'get'
                            };


                            me.sendAjax( req, $.proxy(me.on5k6kButtonSuccess,me) , undefined ,undefined , newDialog);


                        }else if(ctrlID>=6000 && ctrlID<7000 ){
                            var replaceURL =buttonData.uurl.replace(/_ROW_DATA_GUID_/g,rowData[0].toString());
                            window.open(replaceURL);
                        }
                        else{

                            switch(buttonData.ctrlid){
                                case _ctrl.delete:
                                    //_this.data.ctrlid='3005';
                                    req.url='http://'+liDataPack.data.uurl+'?fmname='+liDataPack.data.name+'&fmctrlid='+_ctrl.delete+'&fmdatauid='+rowData[0]+'&fmtoken='+globalSetting.token;
                                    break;

                                case "3030":
                                    //下线
                                    req.url='http://'+liDataPack.data.uurl+'?fmname='+liDataPack.data.name+'&fmctrlid='+'3030'+'&fmdatauid='+rowData[0]+'&fmtoken='+globalSetting.token;
                                    break;
                                case _ctrl.open:
                                    //  _this.data.ctrlid='3006';
                                    req.url='http://'+liDataPack.data.uurl+'?fmname='+detailWinID+'&fmctrlid='+_ctrl.open+'&fmdatauid='+rowData[0]+'&fmtoken='+globalSetting.token;
                                    break;
                                case _ctrl.create:
                                    //_this.data.ctrlid:'3004'
                                    req.url='http://'+liDataPack.data.uurl+'?fmname='+detailWinID+'&fmctrlid='+_ctrl.create+'&fmdatauid='+''+'&fmtoken='+globalSetting.token;
                                    break;
                                default:
                                    var replaceURL =buttonData.uurl.replace(/_ROW_DATA_GUID_/g,rowData[0].toString());
                                    if(parseInt(buttonData.ctrlid)>3032 && parseInt(buttonData.ctrlid)<4000){
                                        req.url='http://'+replaceURL; //+'?fmname='+detailWinID+'&fmctrlid='+buttonData.ctrlid+'&fmdatauid='+''+'&fmtoken='+globalSetting.token;
                                    }else if(parseInt(buttonData.ctrlid)>=4000 && parseInt(buttonData.ctrlid)<5000){
                                        //Remove By JetLeeX 2016-07-21　uurl拼接错误,
                                        req.url='http://'+replaceURL +'&fmdatauid='+rowData[0];
                                    }
                                    break;

                            }
                            //3030 下线
                            if(buttonData.ctrlid==_ctrl.delete || buttonData.ctrlid=='3030'){


                                if(buttonData.ctrlid==_ctrl.delete){
                                    message4Dialog='删除';
                                }else if(buttonData.ctrlid=='3030'){
                                    message4Dialog='下线';
                                }

                                BootstrapDialog.show(
                                    {

                                        title: message4Dialog,
                                        size: BootstrapDialog.SIZE_SMALL,
                                        message: '<span style="font-size:2em; margin-left: 35%">确认'+message4Dialog +'?</span>',
                                        draggable: true,
                                        buttons: [

                                            {
                                                label: '确认',
                                                cssClass: 'btn-warning',
                                                action: function(dialog) {
                                                    me.sendAjax( req, $.proxy(me.onReportButtonsSuccess,me) , undefined , $.proxy(me.buttonError,me),{dialog:dialog4Parent,action:buttonData,dataPKGuID4Button:liDataPack.key});
                                                    dialog.close();
                                                }
                                            },
                                            {
                                                label: '取消',
                                                cssClass: 'btn-primary',
                                                action: function(dialog) {
                                                    dialog.close();
                                                }
                                            }

                                        ]
                                    }
                                );
                            }
                            else{
                                //用来更新 外部窗口跳出，修改外部窗口数据时，用来更新本窗口的数据
                                var  oldUrl='http://';
                                oldUrl +=  liDataPack.data.uurl;

                                var oldData=liDataPack.data;
                                oldData.token=globalSetting.token;
                                var oldReq={
                                    url: oldUrl,//+'&fmtoken='+globalSetting.token
                                    data:JSON.stringify(oldData)
                                };
                                //用来更新
                                me.sendAjax( req, $.proxy(me.onReportButtonsSuccess,me) , undefined , $.proxy(me.buttonError,me),{dialog:dialog4Parent,action:buttonData,dataPKGuID4Button:liDataPack.key});
                            }

                        }
                    }


                },
                onCheckRow:function(event,data){
                    if($.isArray(data)){
                        liDataPack.data.DataGUID='';
                        $.each(data,function(index,item){
                            liDataPack.data.DataGUID=liDataPack.data.DataGUID+ item.oData[0]+',';

                        });
                    }
                }

            });
        };

        BuildWin.prototype.buildChart=function(module,$ChartDiv){
            var me=this,
             $divCharModule;

            if($ChartDiv.find('.chartModule').length>0){
                $divCharModule=$ChartDiv.find('.chartModule');
                $divCharModule.empty();
            }else{
                $divCharModule =$(_html.div).addClass('chartModule');
            }



            $ChartDiv.append($divCharModule);


            $ChartDiv.find('.chartContainer_close').on('click',function(){
                $ChartDiv.hide('slow');
            });

            var ctx_line =document.createElement('canvas');
            $divCharModule.append(ctx_line);
            $ChartDiv.show('slow');

            var lineDataSets=[];
            if( $.isArray(module.winmodfields.Body.Head) ) {
                $.each(module.winmodfields.Body.Head,function(index,item){ //dataSet

                    // the dataSet start form the third items of module.winmodfields.Body.Head(skip the first 2)
                    if(index>1){

                        var SingleSetXY=[];  // [{x,y},{x,y},{x,y},{x,y}]

                        if( $.isArray(module.winmodfields.Body.Data) ) {
                            $.each(module.winmodfields.Body.Data,function(i,DataRow){
                                if(!!DataRow.length && DataRow.length  == module.winmodfields.Body.Head.length ){
                                    var X=DataRow[1],
                                     Y=DataRow[index];
                                    SingleSetXY.push({
                                        x:X,
                                        y:Y
                                    });
                                }else{
                                    console.log('module.winmodfields.Body.Data[i] is not array , or  item.length != module.winmodfields.Body.Head , can\'t plot');
                                }
                            });
                        }else{
                            console.log('module.winmodfields.Body.Head is not array, can\'t plot');
                        }
                        var rgbaLine = {

                            '2': "rgba(255,99,132,1)",
                            '3': 'rgba(54, 162, 235, 1)',
                            '4': 'rgba(255, 206, 86, 1)',
                            '5': 'rgba(75, 192, 192, 1)',
                            '6': 'rgba(153, 102, 255, 1)',
                        }[index];
                        lineDataSets.push({
                            label:item,
                            lineTension:0.5,
                            borderColor:rgbaLine,
                            data:SingleSetXY
                        });

                    } // dataSet
                });
            }
            else{
                console.log('module.winmodfields.Body.Head is not array, can\'t plot');
            }

        };

        BuildWin.prototype.buildFormButtons=function(buttonsData,dataPackGuID,dialog){
            var me=this,
                buttonsArray=[],
                liDataPack = me.dataPKCache.get(dataPackGuID);//modulesAdptData ,winData

            if($.isArray(buttonsData)){

                $.each(buttonsData, $.proxy(function(index, buttonData){
                    var button={}
                    if (buttonData.styleex<1){

                        var buttonTypeCss='btn-default';
                        switch(buttonData.ctrlid){
                            case _ctrl.save:  //保存
                                buttonTypeCss= 'btn-primary';
                                break;

                            case _ctrl.find: //查找
                                buttonTypeCss= 'btn-primary';
                                break;

                            case _ctrl.create: // 创建
                                buttonTypeCss= 'btn-primary';
                                break;
                            case _ctrl.delete: // 删除
                                buttonTypeCss= 'btn-warning'
                                break;
                        }

                        buttonData.dataPKGuID=dataPackGuID;


                        button={
                            label:buttonData.caption,
                            cssClass:buttonTypeCss,
                            data4Button:buttonData,
                            action:function(evt,formView,data4Button){
                                var dataPKGUID4FormBTN=data4Button.dataPKGuID;
                                me.writeBack(dataPKGUID4FormBTN); //读取表单里的文字
                                liDataPack.data.ctrlid= data4Button.ctrlid;


                                //用 validate 插件， 来校验
                                var validateX;
                                if(formView.$form.validateX() instanceof $.validator) {
                                    validateX=formView.$form.validateX();
                                }
                                else{
                                    //初始化validate 插件
                                    formView.$form.validateX({rules:formView.vRules,
                                        onValidateAtServer:function(evt,data){
                                            var request;
                                            me.writeBack(dataPKGUID4FormBTN); //读取表单里的文字
                                            request={url:data.url,data: JSON.stringify(liDataPack.data)};
                                            me.sendAjax(request,me.onValidateOnServerSuccess,undefined,undefined,data);
                                        }

                                    });
                                    validateX=formView.$form.validateX();
                                }

                                //如果校验不成功
                                if(! validateX.isAllValid()){
                                    validateX.showOremoveAllErrorOnPage();
                                }//如果校验成功，发送请求
                                else{
                                    //销毁验证 里的 事件和 setInterval
                                    validateX.destroy();
                                    var req, url,replaceurl,batchNOpenDialog;

                                    if(data4Button.ctrlid>=5000 && data4Button.ctrlid<6000 ){
                                        //alert('>=5000  <6000');
                                        var newDialog=new BootstrapDialog({
                                            size: BootstrapDialog.SIZE_WIDE,
                                        });

                                        replaceurl =  data4Button.uurl.replace(/_ROW_DATA_GUID_/g,liDataPack.data.DataGUID);
                                        me.writeBack(dataPKGUID4FormBTN);
                                        req={
                                            data: JSON.stringify(liDataPack.data),
                                            url: replaceurl
                                        }

                                        me.sendAjax( req, $.proxy(me.on5k6kButtonSuccess,me) , undefined ,undefined , newDialog);

                                    }else if(data4Button.ctrlid>=6000 && data4Button.ctrlid<7000 ){
                                        /*window.location.href=data4Button.uurl;*/
                                        window.open(data4Button.uurl);
                                    }
                                    else{
                                        url='http://';

                                        // 3040到 3059 批量操作：1. data4Button 带 url 就要跳页面，2. data4Button 不带 url 就要刷新页面（开tab, 关tab）
                                        if( ( data4Button.ctrlid>=3040 && data4Button.ctrlid<=3059 ) ){
                                           if(typeof data4Button.uurl==='string' && !!data4Button.uurl.length>0){
                                               url += data4Button.uurl
                                              batchNOpenDialog = true;
                                           }else{
                                               batchNOpenDialog=false;
                                               url +=  liDataPack.data.uurl;
                                           }


                                            replaceurl =  url.replace(/_ROW_DATA_GUID_/g,liDataPack.data.DataGUID);
                                            data = liDataPack.data;
                                            req = {
                                                url: replaceurl,//+'&fmtoken='+globalSetting.toke
                                                data:JSON.stringify(data)
                                            };
                                            me.sendAjax( req, $.proxy(me.onFormButtonsSuccess,me) , undefined , $.proxy(me.buttonError,me), {batchNOpenDialog:batchNOpenDialog,dialog:dialog,dataPKGuID4Button:dataPKGUID4FormBTN });
                                        }
                                        else //常规按钮： 比如查询,  删除
                                        {
                                            //如果按钮带uurl，执行某些特定功能
                                            if(typeof data4Button.uurl==='string' && !!data4Button.uurl.length>0)
                                            {
                                                url += data4Button.uurl;
                                                data = '';
                                            }else{
                                                url +=  liDataPack.data.uurl;
                                                data = liDataPack.data;
                                            }

                                            data.token=globalSetting.token;

                                            if(liDataPack.data.DataGUID && liDataPack.data.DataGUID.length>0 ) // 比如：批量删除
                                            {
                                                replaceurl =  url.replace(/_ROW_DATA_GUID_/g,liDataPack.data.DataGUID);
                                            }else{
                                                replaceurl= url
                                            }

                                            replaceurl= url;
                                             req={
                                                url: replaceurl,
                                                data:JSON.stringify(data)
                                            };
                                            //3013 导出
                                            if(data4Button.ctrlid==3013){
                                                /*req.dataType = 'html';*/
                                               /* me.sendAjax( req, $.proxy(me.onFormButtonsSuccess,me) , undefined , $.proxy(me.buttonError,me), {dialog: dialog,dataPKGuID4Button:dataPKGUID4FormBTN});*/
                                                me.exportsXHR(req);
                                            }else{

                                                me.sendAjax( req, $.proxy(me.onFormButtonsSuccess,me) , undefined , $.proxy(me.buttonError,me), {dialog: dialog,dataPKGuID4Button:dataPKGUID4FormBTN});
                                            }

                                            //如果传过来参数 dialog 存在，则关闭 dialog
                                            if(!!dialog && dialog instanceof BootstrapDialog){
                                                    dialog.close();
                                            }

                                        }
                                    }

                                }

                            }

                        };

                        buttonsArray.push(button);
                    }


                },this));

            }else {
                logError('please make  function buildModuleButtons  buttonsData is passed in by array');
                buttonsArray=[];
            }

           return buttonsArray;

        };

        BuildWin.prototype.onFormButtonsSuccess=function(successData,beforeAjaxData){
            var me=this/*,
                successDataPackGUID*/;
            if(typeof successData.DataGUID==='string' && successData.DataGUID.length>0 ){
             /*   successDataPackGUID= me.dataPKCache.add(successData,0);*/
            }
            var msgTip= new PUMsg();
            if(!!successData.code && successData.code>0){
                var msg='';

                if(!!successData.ctrlid){
                    switch(successData.ctrlid){
                        case _ctrl.save:
                            msg='保存/修改 ';

                            break;
                        case _ctrl.find:
                            msg='查询';

                            //如果是dialog 老的关掉，new  BuildWin 只传2个参数= buildWinInDialog
                            if(!!beforeAjaxData.dialog && beforeAjaxData.dialog instanceof BootstrapDialog){
                                beforeAjaxData.dialog.close();
                                /*beforeAjaxData.dataPKGuID4Button*/
                                 me.initBuild(successData,'dialog',0);
                            }else{

                                me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                                me.initBuild(successData,'tab',0);
                            }
                            
                            break;

                        case _ctrl.delete:
                            msg='删除 ';

                            if(!!beforeAjaxData.dialog && beforeAjaxData.dialog instanceof BootstrapDialog){
                                beforeAjaxData.dialog.close();
                               // me.initBuild(successData,'dialog',0);
                            }else{
                                me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                                me.initBuild(successData,'tab',0);
                                /*me.updateReport(successData,0);*/
                            }


                            break;
                        case _ctrl.create:
                            me.initBuild(successData,'dialog',0);
                            break;
                        default:
                            if(parseInt(successData.ctrlid)>=3040 && parseInt(successData.ctrlid)<=3059 ){
                                //如果是 批量审批意见（审批拒绝，或审批通过），关闭 dialog, 并刷新tab页面
                                if(!!beforeAjaxData.dialog && beforeAjaxData.dialog instanceof BootstrapDialog){

                                    if(beforeAjaxData.batchNOpenDialog){
                                        me.initBuild(successData,'dialog',0);
                                    }else{
                                        if( parseInt(successData.ctrlid) == 3048 )// 提交
                                        {
                                            beforeAjaxData.dialog.close();
                                             me.initBuild(successData,'dialog',0);
                                        }else if( parseInt(successData.ctrlid) == 3041 ||  parseInt(successData.ctrlid) == 3042) //审批通过，审批拒绝
                                        {
                                            beforeAjaxData.dialog.close();
                                        }

                                    }


                                }else{
                                    //如果是批量操作，平且按钮里有uurl: 说明要打开 new dialog
                                    if(beforeAjaxData.batchNOpenDialog){
                                        me.initBuild(successData,'dialog',0);
                                    }else{
                                        me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                                        me.initBuild(successData,'tab',0);
                                    }

                                }

                            }
                            break;
                    }
                    msgTip.setSuccMsg('操作成功： '+ successData.msg);
                    msgTip.showSuccMsg(2000);
                }



            }else{
                if(parseInt(this.code)<= -10000 ){
                    msgTip.setErrorMsg( successData.msg);
                    msgTip.showErrorMsg(2000);
                    window.location.href='../index.html';
                }else{
                    msgTip.setErrorMsg('操作成功： '+ successData.msg);
                    msgTip.showErrorMsg(2000);
                }
            }


        };

        BuildWin.prototype.buildModuleButtons=function(buttonsData,$buttons_Div,dataPackGuID,dialog4Parent){

            var $buttonsContent=$('<div></div>').addClass(_cssClass.buttonsContainerContent),
                $buttonsBanner = $('<div></div>').addClass(_cssClass.buttonsContainerBanner),
                $collapse = $('<span>+</span>').addClass(_cssClass.buttonsContainerToggle);

            $buttons_Div.append( $buttonsBanner );
            $buttons_Div.append( $buttonsContent );
            $buttonsBanner.append($collapse);

            $collapse.on('click',function(){
                $buttonsContent.toggle('slow');
            });


            if(!buttonsData) return;
            if($.isArray(buttonsData)){
                var me=this,
                    liDataPack = me.dataPKCache.get(dataPackGuID);//modulesAdptData ,winData
                $.each(buttonsData, $.proxy(function(index, buttonData){
                    if (buttonData.styleex<1){
                        var $buttonGrid=$(_html.div)
                            .addClass(_cssClass.buttonGrid)
                            .appendTo($buttonsContent);

                        var buttonTypeCss='btn-default';
                        switch(buttonData.ctrlid){
                            case _ctrl.save:  //保存
                                buttonTypeCss= 'btn-primary';
                                break;

                            case _ctrl.find: //查找
                                buttonTypeCss= 'btn-primary';
                                break;

                            case _ctrl.create: // 创建
                                buttonTypeCss= 'btn-primary';
                                break;
                            case _ctrl.delete: // 删除
                                buttonTypeCss= 'btn-warning'
                                break;
                            default:
                                buttonTypeCss= 'btn-primary';
                                break;
                        }


                        var $button=$(_html.button)
                            .attr('type','button')
                            .addClass( 'btn btn-block'+' '+ buttonTypeCss + ' '+_cssClass.button )
                            .html(buttonData.caption)
                            .appendTo($buttonGrid);

                        $button.on('click',{buttonData:buttonData },function(evt){
                            me.writeBack(dataPackGuID); //读取表单里的文字
                            liDataPack.data.ctrlid= evt.data.buttonData.ctrlid;

                            var  url='http://';
                            url += ( typeof evt.data.buttonData.uurl==='string' && !!evt.data.buttonData.uurl.length>0)? evt.data.buttonData.uurl:  liDataPack.data.uurl;
                            var data=( typeof evt.data.buttonData.uurl==='string' && !!evt.data.buttonData.uurl.length>0)?  '': liDataPack.data;
                            data.token=globalSetting.token;
                            var req={
                                url: url,//+'&fmtoken='+globalSetting.token
                                data:JSON.stringify(data)
                            };
                            if(buttonData.uurl && buttonData.uurl.length>0){req.type='get'; }
                            me.sendAjax( req, $.proxy(me.onModuleButtonsSuccess,me) , undefined , undefined, {dialog:dialog4Parent,dataPKGuID4Button:dataPackGuID});
                            if(!!dialog4Parent && dialog4Parent instanceof BootstrapDialog){
                                dialog4Parent.close();
                            }
                        });
                    }


                },this));

            }else {
                logError('please make  function buildModuleButtons  buttonsData is passed in by array');
            }

        };

        BuildWin.prototype.onModuleButtonsSuccess=function(data,beforeAjaxData){
            var me= this
            if(typeof data.DataGUID==='string' && data.DataGUID.length>0 ){
                this.data=data;
            }
            var msgTip=new PUMsg();
            if(!!data.code && data.code>0){
                var msg='';

                if(!!data.ctrlid){
                    switch(data.ctrlid){
                        case _ctrl.save:
                            msg='保存/修改 ';

                            break;
                        case _ctrl.find:
                            msg='查询';

                            //如果是dialog 老的关掉，new  BuildWin 只传2个参数= buildWinInDialog
                            if(beforeAjaxData.dialog &&  beforeAjaxData.dialog instanceof BootstrapDialog){
                                beforeAjaxData.dialog.close();
                                me.initBuild(data,'dialog',0);
                            }else{
                                me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                                me.initBuild(data,'tab',0);
                            }

                            break;

                        case _ctrl.delete:
                            msg='删除 ';
                            me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                            me.initBuild(data,'tab',0);
                            break;
                        case _ctrl.create:
                            me.initBuild(data,'dialog',0);;
                            break;
                    }

                }

                msgTip.setSuccMsg('操作成功： '+ data.msg);
                msgTip.showSuccMsg(2000);

            }else{

                if(parseInt(this.code)<= -10000 ){
                    msgTip.setSuccMsg('操作成功： '+ data.msg);
                    msgTip.showSuccMsg(2000);
                    window.location.href='../index.html';
                }else{
                    msgTip.setSuccMsg('操作成功： '+ data.msg);
                    msgTip.showSuccMsg(2000);
                }

            }
        };

        BuildWin.prototype.onReportButtonsSuccess=function(successData,beforeAjaxData){
            var msgTip= new PUMsg(),
                me=this;


            if(!!successData.code && successData.code>0){
                if(parseInt(beforeAjaxData.action.ctrlid)<4000){

                    if(successData.windows && $.isArray(successData.windows )){

                        //查看
                        if(beforeAjaxData.action.ctrlid==_ctrl.open){
                            me.initBuild(successData,'dialog',0);
                        }
                        //新建
                        else if(beforeAjaxData.action.ctrlid==_ctrl.create){
                            me.initBuild(successData,'dialog',0);
                        }
                        //删除
                        else if(beforeAjaxData.action.ctrlid==_ctrl.delete){

                            /*if(beforeAjaxData.tableContainer && beforeAjaxData.tableContainer.length>0 && beforeAjaxData.tableContainer.has('table') ){
                                me.update(successData,0,beforeAjaxData.dataPKGuID4Button,beforeAjaxData.tableContainer);
                            }else{
                                me.update(successData,0,beforeAjaxData.dataPKGuID4Button);
                            }*/
                            if(beforeAjaxData.dialog &&  beforeAjaxData.dialog instanceof BootstrapDialog){
                                beforeAjaxData.dialog.close();
                                me.initBuild(successData,'dialog',0);
                            }else{
                                me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                                me.initBuild(successData,'tab',0);
                            }


                        }
                        //button ctrlID>3032
                        else if(parseInt(beforeAjaxData.action.ctrlid)>3032 && parseInt(beforeAjaxData.action.ctrlid)<4000){

                            // 比如点击表单里 的审核按钮，在dialog 里生成审批意见，审批完成，关闭dialog, 对tab里的数据进行更新，BuildWin,需要传入第4个 参数 beforeAjaxData.preRequest。
                            if(parseInt(beforeAjaxData.action.ctrlid)>=3040 && parseInt(beforeAjaxData.action.ctrlid)<=3059){
                                me.initBuild(successData,'dialog',0);
                            }else{
                                me.initBuild(successData,'dialog',0);
                            }

                        }

                    }
                    else {
                        logError('onRowButtonSuccess: successData.windows object does not exist')
                    }

                }
                else if(  parseInt(beforeAjaxData.action.ctrlid)>=4000 && parseInt(beforeAjaxData.action.ctrlid)<5000 )
                {
                    msgTip.setSuccMsg('操作成功： '+ successData.msg);
                    msgTip.showSuccMsg(2000);


                }
                msgTip.setSuccMsg('操作成功： '+ successData.msg);
                msgTip.showSuccMsg(2000);
            }else{

                if(parseInt(this.code)<= -10000 ){
                    msgTip.setErrorMsg('操作失败： '+ successData.msg);
                    msgTip.showErrorMsg();
                    window.location.href='../index.html';
                }else{
                    msgTip.setErrorMsg('操作失败： '+ successData.msg);
                    msgTip.showErrorMsg();
                }

            }



        };

        BuildWin.prototype.onGoToPageSuccess=function(successData, beforeAjaxData){
            var me=this;
            /*if(beforeAjaxData.tableContainer && beforeAjaxData.tableContainer.length>0 && beforeAjaxData.tableContainer.has('table') ){
                me.update(data,0,beforeAjaxData.dataPKGuID4Button,beforeAjaxData.tableContainer);
            }else{
               console.log('onGoToPageSuccess, must have beforeAjaxData.tableContainer');
            }*/

            if(beforeAjaxData.dialog &&  beforeAjaxData.dialog instanceof BootstrapDialog){
                beforeAjaxData.dialog.close();
                me.initBuild(successData,'dialog',0);
            }else{
                me.closeTabView(beforeAjaxData.dataPKGuID4Button);
                me.initBuild(successData,'tab',0);
            }
        };

        BuildWin.prototype.on5k6kButtonSuccess=function(data,beforeAjaxData){
            if(beforeAjaxData && beforeAjaxData instanceof BootstrapDialog){
                beforeAjaxData.setMessage(data);
                beforeAjaxData.open();
            }

        };
        BuildWin.prototype.onValidateOnServerSuccess=function(data,beforeAjaxData){
            var me=this,
                validator = beforeAjaxData.validator,
                element = beforeAjaxData.element,
                singleValidator;

            if( !! ( singleValidator=validator.isInValidateCache(element) )  ){
                if(data.code>=0){

                    //如果等于 100，
                    if(data.code=='100'){
                        if(beforeAjaxData.$form instanceof $){
                            var preID= beforeAjaxData.$form.attr('id'),
                                ID,
                                $item;

                            $.each(data.fieldinfo,function(index,item){
                                ID = preID+'-'+item.FDefName;
                                $item = beforeAjaxData.$form.find('#'+ID);
                                if($item.length>0){
                                    $item.val(item.FValueX);
                                }


                            });

                        }
                    }
                    singleValidator.isValidateOnServerPassed=true;
                }else{
                    singleValidator.isValid=false;
                    singleValidator.errorMsg.push(data.msg);
                    validator.showOremoveErrorOnPage(singleValidator);
                }
            }

        };


        BuildWin.prototype.writeBack=function(dataPackGuID){
            var me=this,
                dataPack = me.dataPKCache.get(dataPackGuID),
                modulesAdptData = dataPack.modulesAdptData;


            if( dataPack.winData  ){
                var winModules=dataPack.winData.winmodules;
                if($.isArray(winModules)&& $.isArray(modulesAdptData) && winModules.length ==modulesAdptData.length){

                    $.each(winModules,function(index,module){

                        if(modulesAdptData[index].uID==module.uid){
                            if(modulesAdptData[index].mtype==module.mtype==_moduleType.form) {

                                if( $.isArray(module.winmodfields)
                                    && $.isArray(modulesAdptData[index].controlList)
                                    && module.winmodfields.length==modulesAdptData[index].controlList.length)
                                {

                                    var moduelAdptData=modulesAdptData[index];
                                    $.each(module.winmodfields,function(i){
                                        //if(i==13){
                                        //    var kk;
                                        //}
                                        if(module.winmodfields[i].FDefName == moduelAdptData.controlList[i].dataID){

                                            if(module.winmodfields[i].FDefType=="22" && moduelAdptData.controlList[i].dataType=="multi"){
                                                // 22 multi 多选 配对
                                                if($.isArray(module.winmodfields[i].FLinks) && $.isArray(moduelAdptData.controlList[i].dataOption) ){
                                                    $.each( module.winmodfields[i].FLinks,function(index,FLink){
                                                        if(FLink.uid==moduelAdptData.controlList[i].dataOption[index].id){
                                                            FLink.checked=moduelAdptData.controlList[i].dataOption[index].checked;
                                                        }else{
                                                            logError('FLink.uid 和 moduelAdptData.controlList[i].dataOption(index).id 不匹配')
                                                        }


                                                    });
                                                }else logError('Flink for multi selector is not array')
                                                // 22 multi 多选 配对
                                            }else{
                                                module.winmodfields[i].FValueX= moduelAdptData.controlList[i].data;
                                            }

                                        }else{
                                            logError('module.winmodfields['+index+'].FDefName 和 _this.modulesAdptData.controlist['+index+'].dataID 不匹配')
                                        }

                                    });
                                }else{
                                    logError(' module.winmodfields.length!=_this.modulesAdptData[index].controlList.length')
                                }


                            } else if(module.mtype==_moduleType.report) {
                                return;
                                //alert('report 数据 稍后实现');
                            }
                            else{logError( '_this.modulesAdptData[index].mtype is not correct' );}

                        }
                        else{
                            logError('this.modulesAdptData[index].uID !=module.uid');
                        }
                    });

                }else{
                    logError('getdata()\'error, winModules.length != this.modulesAdptData.length');
                    return undefined;
                }



            }else {

                return undefined;
            }

            return dataPack.winData;

        };

        BuildWin.prototype.sendAjax=function(Request,Success,Complete, Error,preAjaxData ) {
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

                    if(globalSetting.debug){
                        var popUpMsg = new PUMsg();
                        popUpMsg.setErrorMsg("XMLHttpRequest Status:" + XMLHttpRequest.status +"\n"
                            + "XMLHttpRequest readyState: "+ XMLHttpRequest.readyState +"\n"
                            + "textStatus: " + textStatus  +"\n"
                            + "error:" + errorThrown)
                        popUpMsg.showErrorMsg();
                    }


                }
            });

        };
        BuildWin.prototype.exportsXHR = function(request){
            var xhr;
            
            //如果还有未处理完的XHR请求正在进行，就中断它
            if(xhr && xhr.readyState !=0){
                xhr.abort();
            }

            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            }else if (window.ActiveXObject){
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }

            //创建异步POST请求(根据需求，修改这行代码)
            xhr.open("POST",request.url,true);

            //定义接收状态变更通知的函数
            xhr.onreadystatechange=readyStateChange.bind(this,xhr);

             //设置请求头信息，以便让PHP知道这是一个表单提交
         /*   xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

            xhr.overrideMimeType('text/plain; charset=x-user-defined');*/
             xhr.responseType = 'blob';
            //将数据传送到服务器上
            xhr.send( request.data );

            console.time('requestStart');

            function readyStateChange(xhr) {
                //状态4表示数据已经准备好了,并且请求是200OK
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var blob = new Blob([xhr.response], {type: 'xls;charset=utf-8'});

                    console.time('saveAs');
                    saveAs(blob, "exports.xls");
                    console.timeEnd('saveAs');

                }

                console.timeEnd('requestStart');
            }


        };



        var BW=function(selector){
                return new BuildWin(selector);
        };

        return BW;
    })
);




