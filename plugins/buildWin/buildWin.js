/**
 * Created by Administrator on 2016/6/14.
 */

+(
    function(window,factory){
    if(typeof define==='function' && define.amd){
        define('BuildWin',["jquery",'bootstrap-dialog','Chartjs','tabview','slimscroll','tableView','formview'],factory);
    }else if( typeof window !=='undefined' && !!window.jQuery){
       return  factory(window,jQuery);
    }


    }(typeof window !== "undefined" ? window : this, function($,BootstrapDialog,Chart)

    {
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

                col_first:'col-sm-2',
                col_second:'col-sm-8',
                offset_2col:'col-sm-offset-2'
            }
        };

        //这些 _cssClass  外部用来控制 样式的
        var _cssClass={
            modulesContainer:'modulesContainer',
            modulePanel:'modulePanel',
            buttonDiv:'buttonPanel',
            buttonGrid:'win-buttonGrid',
            button:'win-button',
            panelContent:'win-panelContent'
        };

        var logError = function (message) {
            if (window.console) {
                window.console.error(message);
            }
        };

        var BuildWin=function(data, windowsIndex ,selector){
            if($.isArray(data.windows) && data.windows[windowsIndex] ){
                this.data=data;
                this.winData=data.windows[windowsIndex];
                this.winDataCopy=$.extend({},this.winData); // 请不要操作任何 winDataCopy 里的数据，用来覆盖 winData,当要重置时。
                this.$selector=$(selector);

                //当传入表单（formview）modulesAdptData和 winModules 做数据匹配，从  winModules 拷贝一份数据  this.modulesAdptData=[{type:1, fields[]},{},{},{}]
                //直接传入 插件（formview）,任何 input 数据改动，都会直接改动 modulesAdptData 里的数据，等 writeBack()被调用时，再将这些值覆盖回 winmodules
                // 1代表 form， 4代表 report（dataGrid）
                this.modulesAdptData=[];


                this.getButtonsForTableRow(this.winData);




                this.init(this.winData, this.data.DataGUID ,selector);


                return {

                    writeBack: $.proxy(this.writeBack,this)

                };


            }else{
                logError('data.windows 不是 array 或 windowsIndex 超出数组范围');
            }
        };


        BuildWin.prototype.init=function(winData, windowID ,selector){
            ((selector) && (typeof selector==='string' || selector instanceof jQuery) ) ? this.buildInTabView(winData,windowID,selector)  : this.buildInDialog(winData);
        };

        BuildWin.prototype.update=function(data, windowsIndex) {
            if ($.isArray(data.windows) && data.windows[windowsIndex]) {
                this.closeTabView();
                this.data = data;
                this.winData = data.windows[windowsIndex];
                this.winDataCopy = $.extend({}, this.winData); // 请不要操作任何 winDataCopy 里的数据，用来覆盖 winData,当要重置时。


                //当传入表单（formview）modulesAdptData和 winModules 做数据匹配，从  winModules 拷贝一份数据  this.modulesAdptData=[{type:1, fields[]},{},{},{}]
                //直接传入 插件（formview）,任何 input 数据改动，都会直接改动 modulesAdptData 里的数据，等 writeBack()被调用时，再将这些值覆盖回 winmodules
                // 1代表 form， 4代表 report（dataGrid）
                this.modulesAdptData = [];

                this.getButtonsForTableRow(this.winData);

                this.init(this.winData, this.data.DataGUID, this.$selector);
            }

        };

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
        BuildWin.prototype.buildInDialog=function(winData){
            var _this=this;
            var $modules_Div=$(_html.div).addClass(_cssClass.modulesContainer);


            //模块（form 或 report）
            var winmodules= winData.winmodules;

           if ($.isArray(winmodules)) {
               for( var index=0, length=winmodules.length; index<length; index++){
                   var module=winmodules[index];
                   var $module_Div=$(_html.div).addClass(_cssClass.modulePanel);
                   _this.modulesAdptData.push({uID:module.uid});
                   if(module.mtype){
                       switch(module.mtype){

                           //如果是表单
                           case _moduleType.form:
                               _this.modulesAdptData[_this.modulesAdptData.length-1].mtype=_moduleType.form;
                               //建立 表单
                               _this.buildForm(module,$module_Div,_this.modulesAdptData.length-1);
                               break;

                           //如果是 grid
                           case _moduleType.report:
                               _this.buildReport(module,$module_Div);
                               break;
                           //如果是 chart
                           case _moduleType.chart:
                               if ($('.chartContainer').length>0){
                                   _this.buildChart(module,$('.chartContainer'));
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





            var newDialog=new BootstrapDialog({
                size: BootstrapDialog.SIZE_WIDE,
                title: winData.caption
            });

            //窗口按钮
            var $buttons_Div=$(_html.div).addClass(_cssClass.buttonDiv +' ' +_defaultStyle.bs.offset_2col +' '+_defaultStyle.bs.col_second);
            this.buildButtons(winData.buttons,$buttons_Div,newDialog);


            //包含 按钮和 模块（form 或 report）
            var $panelContent=$(_html.div).append($modules_Div).append($buttons_Div).css('overflow-x', 'auto');

            $panelContent.slimScroll({
                height:'100%',
                width:'100%'
            });

            newDialog.setMessage($panelContent);
            newDialog.open();


        };

        //在 tab里建窗口
        BuildWin.prototype.buildInTabView=function(winData,windowID,selector){
            $(selector).length<1 && logError('buildInTabView 没有元素被选中哇');

            var _this=this;


            var $modules_Div=$(_html.div).addClass(_cssClass.modulesContainer);

            //模块（form 或 report）
            var winmodules= winData.winmodules;
            ($.isArray(winmodules)) &&
            $.each(winmodules, function(index,module){
                var $module_Div=$(_html.div).addClass(_cssClass.modulePanel);
                _this.modulesAdptData.push({uID:module.uid})
                if(module.mtype){
                    switch(module.mtype){

                        //如果是表单
                        case _moduleType.form:
                            _this.modulesAdptData[_this.modulesAdptData.length-1].mtype=_moduleType.form;
                            //建立 表单
                            _this.buildForm(module,$module_Div,_this.modulesAdptData.length-1);
                            break;

                        //如果是 grid(表格)
                        case _moduleType.report:
                            _this.buildReport(module,$module_Div);
                            break;

                    }
                    $modules_Div.append($module_Div);
                }else{
                    logError('缺少 module.mtype 不能解析');
                }
            });


            //窗口按钮
            var $buttons_Div=$(_html.div).addClass(_cssClass.buttonDiv +' ' +_defaultStyle.bs.offset_2col +' '+_defaultStyle.bs.col_second);
            this.buildButtons(winData.buttons,$buttons_Div);


            //包含 按钮和 模块（form 或 report） 'overflow-x':'hidden',overflow: auto;
            var $panelContent=$(_html.div)
                .addClass(_cssClass.panelContent)
                .css({'background-color': '#ededed'})
                .append($modules_Div)
                .append($buttons_Div);


            var tabviewData=[];
            tabviewData.push({
                id: winData.name,
                tab:winData.caption,
                panel:$panelContent,
                isActive: true
            });

            //.slimScroll({height:'100%'});
            this.$selector.tabview({
                isDataWritable:true,
                data:tabviewData
            });

            $panelContent.slimScroll({
                height:'100%',
                size:'14px',
            });
        };

        BuildWin.prototype.closeTabView=function(){
            // if(this.data.DataGUID){
            this.$selector.tabview('deleteItem', this.winData.name);
            return true;

            // }else{
            //     alert('缺少 DataGUID,不能操作删除');
            //     return false;
            //  }
        };

        BuildWin.prototype.buildForm=function(module,$moduleDiv,moduleIndex){
            //  var formData={};
            var _this=this;
            (! module.uid)&& logError('form uid 缺少 module uid');
            if(this.modulesAdptData[moduleIndex]){
                this.modulesAdptData[moduleIndex].formID=module.uid;
                this.modulesAdptData[moduleIndex].formTitle=module.caption;
                this.modulesAdptData[moduleIndex].controlList=[];
            }else{
                logError('please passing a correct index for buildform \'moduleIndex')
            }

            if($.isArray(module.winmodfields) ) {

                $.each(module.winmodfields, function (index, control) {
                    // console.log(index);

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
                        '12':'option',
                        '21':'psw',
                        '22':'multi',
                        '23':'files',
                        '24':'richtext'
                    }[control.FDefType];



                    if((inputType=='option'|| inputType=='multi' )&& $.isArray(control.FLinks)){
                        var   dataOption=[];
                        $.each(control.FLinks,function(index, FLink){
                            dataOption.push({
                                id:FLink.uid,
                                caption: FLink.caption,
                                checked:FLink.checked
                            });
                        });
                    }
                    _this.modulesAdptData[moduleIndex].controlList.push({
                        label: control.FCaption,
                        isLabelDisplay: true,
                        dataType: inputType,
                        inputReadOnly:control.FReadonly,
                        inputMultiLine:control.FMultiLine,
                        placeholder: control.InpuHint,
                        dataID: control.FDefName,
                        data: control.FValueX,
                        dataOption: dataOption,
                        required: true
                    });


                });

                //用 formview 插件，formData建立data.
                $moduleDiv.formview({
                    data: _this.modulesAdptData[moduleIndex],
                    isDataWritable:true});



            }else{
                logError('there is no data for module.winmodfields');
            }


        };

        BuildWin.prototype.buildReport=function(module,$moduleDiv){
            var _this=this,
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
                    funModName:_this.data.name,
                    url:module.winmodfields.Body.uurl,

                    onGoToPageClick:function(evt,goToPageIndex,pSetting){
                        if(goToPageIndex != pSetting.pageIndex){
                            var reqGotoPage={
                                url:'http://'+pSetting.url+'?fmname='+pSetting.funModName+'&fmctrlid=3033&fmpageindex='+goToPageIndex
                            }
                            _this.sendAjax( reqGotoPage, $.proxy(_this.onGoToPageSuccess,_this) , undefined , undefined,{tableContainer:$moduleDiv});
                        }

                    }
                };

            $moduleDiv.tableView({
                tableID:'ms-table',
                Head:tableHeader,
                Data:tableData,
                paginationSetting:paginationSetting,
                rowSettings:{
                    buttons: _this.getButtonsForTableRow(_this.winData),
                    onRowButtonClick: function (evt,rowIndex ,$row,rowData,buttonData) {
                        if (typeof _this.data.DataGUID =='string' && _this.data.DataGUID.length>0){
                            _this.data.DataGUID= _this.data.DataGUID + ','+ rowData[0];
                        }else{
                            _this.data.DataGUID= _this.data.DataGUID + rowData[0];
                        }
                        var req={
                            url:''
                        };
                        switch(buttonData.ctrlid){
                            case _ctrl.delete:
                                //_this.data.ctrlid='3005';

                                req.url='http://'+_this.data.uurl+'?fmname='+_this.data.name+'&fmctrlid='+_ctrl.delete+'&fmdatauid='+rowData[0]+'&fmtoken='+globalSetting.token;
                                break;
                            case _ctrl.open:
                                //  _this.data.ctrlid='3006';
                                req.url='http://'+_this.data.uurl+'?fmname='+detailWinID+'&fmctrlid='+_ctrl.open+'&fmdatauid='+rowData[0]+'&fmtoken='+globalSetting.token;
                                break;
                            case _ctrl.create:
                                //_this.data.ctrlid:'3004'
                                req.url='http://'+_this.data.uurl+'?fmname='+detailWinID+'&fmctrlid='+_ctrl.create+'&fmdatauid='+''+'&fmtoken='+globalSetting.token;
                                break;
                            default:
                                if(parseInt(buttonData.ctrlid)>3032 && parseInt(buttonData.ctrlid)<4000){
                                    req.url='http://'+buttonData.uurl; //+'?fmname='+detailWinID+'&fmctrlid='+buttonData.ctrlid+'&fmdatauid='+''+'&fmtoken='+globalSetting.token;
                                }else if(parseInt(buttonData.ctrlid)>=4000){
                                    //req.url='http://'+buttonData.uurl +'?fmdatauid='+_this.data.DataGUID;
                                    //Remove By JetLeeX 2016-07-21　uurl拼接错误,
                                    req.url='http://'+buttonData.uurl +'&fmdatauid='+rowData[0];
                                }
                                break;

                        }
                        if(buttonData.uurl && buttonData.uurl.length>0){req.type='get'; }
                        _this.sendAjax( req, $.proxy(_this.onRowButtonSuccess,_this) , undefined , $.proxy(_this.buttonError,_this),{tableContainer:$moduleDiv,action:buttonData});
                    }
                }

            });
        };

        BuildWin.prototype.buildChart=function(module,$ChartDiv){
            var _this=this,
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









 /*           [
                {
                    label: 'Scatter Dataset',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 9,
                    pointHitRadius: 10,
                    data: lineData
                }
            ] */

            var scatterChart = new Chart(ctx_line, {
                type: 'line',
                data: {
                    datasets:lineDataSets
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom'
                        }]
                    }
                }
            });



        };

        BuildWin.prototype.buildButtons=function(buttonsData,$buttons_Div,dialog){

            if(!buttonsData) return;
            if($.isArray(buttonsData)){
                var _this=this;
                $.each(buttonsData, $.proxy(function(index, buttonData){
                    if (buttonData.styleex<1){
                        var $buttonGrid=$(_html.div)
                            .addClass(_cssClass.buttonGrid)
                            .appendTo($buttons_Div);

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


                        var $button=$(_html.button)
                            .attr('type','button')
                            .addClass( 'btn btn-block'+' '+ buttonTypeCss + ' '+_cssClass.button )
                            .html(buttonData.caption)
                            .appendTo($buttonGrid);

                        $button.on('click',{buttonData:buttonData },function(evt){

                            _this.writeBack(); //读取表单里的文字
                            _this.data.ctrlid= evt.data.buttonData.ctrlid;

                            var  url='http://';
                            url += ( typeof evt.data.buttonData.uurl==='string' && !!evt.data.buttonData.uurl.length>0)? evt.data.buttonData.uurl:  _this.data.uurl;
                            var data=( typeof evt.data.buttonData.uurl==='string' && !!evt.data.buttonData.uurl.length>0)?  '': _this.data;
                            data.token=globalSetting.token;
                            var req={
                                url: url,//+'&fmtoken='+globalSetting.token
                                data:JSON.stringify(data)
                            };
                            if(buttonData.uurl && buttonData.uurl.length>0){req.type='get'; }
                            _this.sendAjax( req, $.proxy(_this.buttonCallBackSuccess,_this) , undefined , $.proxy(_this.buttonError,_this), dialog);
                            if(!!dialog && dialog instanceof BootstrapDialog){
                                dialog.close();
                            }
                        });
                    }


                },this));




            }else {
                logError('please make  function buildButtons  buttonsData is passed in by array');
            }

        };

        BuildWin.prototype.buttonCallBackSuccess=function(data,beforeAjaxData){
            if(typeof data.DataGUID==='string' && data.DataGUID.length>0 ){
                this.data=data;
            }

            if(!!data.code && data.code>0){
                var msg='';

                if(!!data.ctrlid){
                    switch(data.ctrlid){
                        case _ctrl.save:
                            msg='保存/修改 ';
                            this.winTip( msg+'成功');
                            break;
                        case _ctrl.find:
                            msg='查询';
                            this.winTip( msg+'成功');
                            //如果是dialog 老的关掉，new  BuildWin 只传2个参数= buildWinInDialog
                            if(!!beforeAjaxData && beforeAjaxData instanceof BootstrapDialog){
                                beforeAjaxData.close();
                                new BuildWin(data,0);
                            }else{
                                this.update(data,0);
                            }


                            break;

                        case _ctrl.delete:
                            msg='删除 ';
                            if( this.closeTabView() ){
                                this.data=null;
                                this.WinData=null;
                                this.winDataCopy=null;
                                this.$selector=null;
                                this.modulesAdptData=null;
                                this.winTip( msg+'成功');
                            }
                            break;
                        case _ctrl.create:
                            new BuildWin(data,0 );
                            break;
                    }

                }



            }else{

                this.winTip('操作失败');

            }
        };

        BuildWin.prototype.buttonError=function(XMLHttpRequest, textStatus, errorThrown){
            var msg= "XMLHttpRequest Status:" + XMLHttpRequest.status +"\n"
                + "XMLHttpRequest readyState: "+ XMLHttpRequest.readyState +"\n"
                + "textStatus: " + textStatus  +"\n"
                + "error:" + errorThrown;

            this.winTip(msg);

        };

        BuildWin.prototype.onRowButtonSuccess=function(data,beforeAjaxData){

            if(data.windows && $.isArray(data.windows )){
                //查看
                if(beforeAjaxData.action.ctrlid==_ctrl.open){
                    new BuildWin(data,0);
                }
                //新建
                else if(beforeAjaxData.action.ctrlid==_ctrl.create){
                    new BuildWin(data,0);
                }
                //删除
                else if(beforeAjaxData.action.ctrlid==_ctrl.delete){
                    BootstrapDialog.show(
                        {

                            title: '删除',
                            size: BootstrapDialog.SIZE_SMALL,
                            message: '<span style="font-size:2em; margin-left: 35%">确认删除</span>',

                            buttons: [
                                {
                                    label: '取消',
                                    cssClass: 'btn-primary',
                                    action: function(dialog) {
                                        dialog.close();
                                    }
                                },
                                {
                                    label: '确认',
                                    cssClass: 'btn-warning',
                                    action: function(dialog) {
                                        dialog.close();
                                        $.each( data.windows[0].winmodules,function(index,winmodule){
                                            if(winmodule.mtype==_moduleType.report){
                                                var newData= winmodule.winmodfields.Body.Data;
                                                beforeAjaxData.tableContainer.tableView('updateDataRows','newData','', newData);
                                            }

                                        });


                                    }
                                }
                            ]
                        }
                    );


                }
                //button ctrlID>3032
                else if(parseInt(beforeAjaxData.action.ctrlid)>3032 && parseInt(beforeAjaxData.action)<4000){
                    new BuildWin(data,0);

                }else if(parseInt(beforeAjaxData.action.ctrlid)>=4000){
                    //beforeAjaxData.action.uurl
                }

            }else(logError('onRowButtonSuccess: data.windows object does not exist'))
        };

        BuildWin.prototype.onGoToPageSuccess=function(data, beforeAjaxData){
            this.update(data,0);
        }

        BuildWin.prototype.winTip=function(msg){
            // var _this=this;
            if(!!msg && !!this.$selector){

                var $msgDiv=$(_html.div).append(msg).addClass('messageTip');
                this.$selector.append($msgDiv);
                window.setTimeout(function(){$msgDiv.remove()},3000);
            }

        };

        BuildWin.prototype.writeBack=function(){
            var _this=this;


            if( this.winData  ){
                var winModules=this.winData.winmodules;
                if($.isArray(winModules)&& $.isArray(this.modulesAdptData) && winModules.length ==this.modulesAdptData.length){

                    $.each(winModules,function(index,module){

                        if(_this.modulesAdptData[index].uID==module.uid){
                            if(_this.modulesAdptData[index].mtype==module.mtype==_moduleType.form) {

                                if( $.isArray(module.winmodfields)
                                    && $.isArray(_this.modulesAdptData[index].controlList)
                                    && module.winmodfields.length==_this.modulesAdptData[index].controlList.length)
                                {

                                    var moduelAdptData=_this.modulesAdptData[index];
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

            return  this.winData;

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
                }
            });

        }

        var BW=function(data, windowsIndex ,selector){
                new BuildWin(data, windowsIndex ,selector);
        };

        return BW;
    })
);