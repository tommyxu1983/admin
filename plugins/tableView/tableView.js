/**
 * Created by Administrator on 2016/6/14.
 */


//+function($,window,undefined){
//    var pluginName='tableView';
//
//
//    var _default={
//        tableID:'',
//        Head:[],
//        Data:[[]],
//        rowsPerPage:5,
//        isDataWritable:false, // 传进来的数据 Data[[]] 是否可被直接修改；
//        hasOwnStyle:false,
//        tableBordered:true,
//        hasTickBox:true,
//
//        rowSettings:{
//            buttons:[],
//            // buttons handler
//            onRowButtonClick: undefined,
//        },
//
//        isShowingCheckBox:true,
//
//        // Event handlers
//
//
//
//    };
//    // _default.rowSettings.buttons[0]={
//    //  innerHtml:'删', 'id':'', action:'', data:''
//    // }
//
//    var hasOwnStyle=false;
//
//    //需要自己定义
//    var _style={
//        trHead:pluginName+'-trHead',
//        trData:pluginName+'-trData',
//        paginationContainer:pluginName+'-paginationContainer',
//        pagination:pluginName+'-pagination',
//        paginationDetail: pluginName+'-paginationDetail',
//        trButtons: pluginName+'-trButtons',
//        checkBox: pluginName+'-inputCheckBox',
//        inputCheckAll:pluginName+'-inputCheckAll',
//        inputCheckRow:pluginName+'-inputCheckRow',
//    };
//
//    var _bs={
//
//            table_responsive:'table-responsive',
//            table: 'table',
//            table_striped:'table-striped',
//            table_condensed:'table-condensed',
//            table_bordered : 'table-bordered',
//            table_hover:' table-hover',
//
//            pagination:'pagination',
//            pull_left:'pull-left',
//            pull_right:'pull-right',
//
//
//    };
//
//    var _html={
//        table:'<table></table>',
//        thead:'<thead></thead>',
//        tbody:'<tbody></tbody>',
//        tr:'<tr></tr>',
//        th:'<th></th>',
//        td:'<td></td>',
//        div:'<div></div>',
//        ul:'<ul></ul>',
//        li:'<li></li>',
//        a:'<a></a>',
//        select:'<select></select>',
//        option:'<option></option>',
//        button:'<button></button>',
//        checkBox:'<input type="checkbox" />'
//    };
//
//    var css=function(){
//       var args=[].slice.call(arguments);
//        var result='';
//        if(!hasOwnStyle){
//            $.each(args,function(index){
//                result=result+ args[index] + ' ';
//            });
//        }
//        return result;
//    };
//
//    var some=function(arr, fn){
//        var hasItem=false;
//        if(!arr.length){return hasItem;}
//
//        for(var i= 0, l=arr.length; i<l; i++){
//            hasItem= fn.call(null,arr[i],i,arr); // this=null, item=arr[i], i=index, arr=array
//            if(hasItem){
//                break;
//            }
//        }
//        return (!hasItem)? false: hasItem;
//    };
//
//
//    var cut=function(arr,startIndex,endIndex){
//        if(!$.isArray(arr)){
//            return arr;
//        }
//
//        (endIndex===undefined) && (endIndex=arr.length-1);
//
//        if( ! ( startIndex>=0 && endIndex>=0 && startIndex<=endIndex && endIndex<arr.length ) ){
//           return  arr;
//        }
//
//        var result=[];
//        for(var i=0,l=arr.length; i<l;i++){
//            ( i<startIndex || i>endIndex) && result.push(arr[i]);
//
//        }
//        return result;
//    };
//
//    var TableView=function(element ,options){
//        this.settings= $.extend({},_default,options);
//
//        if(this.settings.isDataWritable){
//            this.settings.Data=options.Data;
//        }
//
//        this.$element=$(element);
//        hasOwnStyle=this.settings.hasOwnStyle;
//        this.init(this.settings)
//
//    };
//
//
//
//    TableView.prototype.init=function(){
//
//            this.$table=undefined;
//            this.$tHead=undefined;
//            this.$tBody=undefined;
//
//            this.dataRowNow=0;
//
//            this.dataSplit=[]; //经过 rowsPerPage 计算出来的每一页有多少数据
//            this.checkedRow=[]; //存放 勾选中的 row
//
//
//            this.$element.addClass(css(_bs.table_responsive));
//
//            this.initTable();
//            this.$element.append(this.buildPagination());
//            // initTable 之后，才能 subscribe events
//            this.subEvents();
//
//
//
//    };
//
//    TableView.prototype.destory=function(){
//        $.removeData(this.$element,pluginName);
//    };
//
//    TableView.prototype.subEvents=function(){
//       this.unsubEvnts();
//        var _this=this;
//        //内部事件
//                //row 操作 Button
//        if($.isArray(this.settings.rowSettings.buttons) &&  this.settings.rowSettings.buttons.length>0 ){
//            this.$element.on('click', 'tr button.'+_style.trButtons ,function(){
//             var buttonData=  $(this).data('buttonData');
//             var rowData=   $(this).data('rowData');
//                _this.$element.trigger('onRowButtonClick',[rowData.rowIndex ,rowData.$row,rowData.oData,buttonData])
//            });
//        }
//                //checkBox
//        this.$element.on('click','input.'+_style.checkBox,function(){
//            var $checkBox=$(this);
//            //checkAll
//            if($checkBox.hasClass(_style.inputCheckAll)){
//                //_this.checkedRow=[];
//                _this.$element.find('.'+_style.inputCheckRow).each(function(i, checkbox){
//                    var rowData= $(checkbox).data('rowData');
//                    var index=-1;
//                    var hasStored=some(_this.checkedRow,function(item,j){
//                        index=j;
//                        return  item.rowIndex == rowData.rowIndex;
//                    });
//
//
//                    if($checkBox.is(':checked') && !hasStored){
//                        [].push.call(_this.checkedRow,rowData);
//                        checkbox.checked=true;
//                    }
//                    else if(!$checkBox.is(':checked') && hasStored){
//                        checkbox.checked=false;
//                        _this.checkedRow= cut( _this.checkedRow,index,index);
//                    }
//
//                });
//
//            //check Row
//            }
//            else if( $checkBox.hasClass(_style.inputCheckRow) ){
//                var rowData= $(this).data('rowData');
//                var index=-1;
//                var hasStored=some(_this.checkedRow,function(item,i){
//                    index=i;
//                    return  item.rowIndex == rowData.rowIndex;
//                });
//
//                if(this.checked && !hasStored){
//                        [].push.call(_this.checkedRow,rowData);
//                }else if (!this.checked && hasStored){
//                    _this.checkedRow= _this.checkedRow= cut( _this.checkedRow,index,index);;
//                }
//
//            }
//
//        });
//
//        //外部事件
//        if(typeof this.settings.rowSettings.onRowButtonClick==='function'){
//            this.$element.on('onRowButtonClick', this.settings.rowSettings.onRowButtonClick);
//        }
//
//
//    };
//
//    TableView.prototype.unsubEvnts=function(){
//        this.$element.off('click');
//        this.$element.off('onRowCURD', this.settings.onRowButtonClick);
//    };
//
//    //初始化表
//    TableView.prototype.initTable=function(){
//
//
//        this.$table=$(_html.table)
//            .addClass(css(_bs.table,_bs.table_bordered,_bs.table_striped,_bs.table_condensed,_bs.table_hover))
//            .attr('id', this.settings.tableID);
//
//
//        //把 thead, 系上 table //把 tbody  系上 table
//        this.$tHead=$(_html.thead);
//        this.$tBody=$(_html.tbody);
//
//
//
//        this.updateDataRows('init');// buildDataRows 画出 所有dataCell
//        this.$element.append(this.$table);
//
//    };
//
//
//    //初始化，数据更新，全部由 updateDataRows来控制
//    TableView.prototype.updateDataRows=function(key,value,data){
//         // data [[]] 参数是当外部调用 tableView, 传入的数新表格内容。配合 key=newData
//
//        var totalPages=0, pageNow=0;
//
//        switch (key){
//            case 'init':
//
//                totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
//                this.dataSplit=this.divideData(this.settings.Data,this.settings.rowsPerPage,totalPages);
//                pageNow=1;
//                break;
//
//            case 'rowsPerPage':
//
//                this.settings.rowsPerPage=parseInt(value);
//                 totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
//                this.dataSplit=this.divideData(this.settings.Data,this.settings.rowsPerPage,totalPages);
//                pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
//
//                break;
//            case 'prePage':
//
//                pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
//                if(pageNow>1){
//                    this.dataRowNow-=this.settings.rowsPerPage;
//                    pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
//                }else if(pageNow<=1){
//                    pageNow=0;
//                }
//
//                break;
//            case 'nextPage':
//                pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
//                totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
//                if(pageNow<totalPages){
//                    this.dataRowNow+=this.settings.rowsPerPage;
//                    pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
//                }else{
//                    pageNow<0
//                }
//
//                break;
//            case 'page':
//
//                alert('need to implement')
//
//                break;
//            case 'newData':
//                if($.isArray(data)){
//                    this.settings.Data=data;
//                    if(data.length>0){
//
//                        //如果老数据的 dataRowNow 是 最后一条数据，返回的新数据有可能小于老数据（删除返回时）
//                        this.dataRowNow= this.dataRowNow < data.length?this.dataRowNow : data.length-1
//
//
//
//                        totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
//                        this.dataSplit=this.divideData(this.settings.Data,this.settings.rowsPerPage,totalPages);
//                        pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
//                    }else{
//                        this.$tBody.empty();
//                        pageNow=0;
//                    }
//
//                }else{
//                    logError('新传的表格数据不是array唷');
//
//                    pageNow=0;
//                }
//                break;
//
//        }
//
//        if(pageNow>0){
//            this.buildTableHead(this.settings.Head);
//
//            this.buildDataRows(this.dataSplit,pageNow);
//
//        }else if(pageNow=0){
//
//            logError('pageNow=0');
//
//        }else{
//
//            logError('something wrong with updateDataRows, or not data');
//        }
//
//    };
//
//    TableView.prototype.buildTableHead=function(dataTHead){
//
//        if (!$.isArray(dataTHead)){
//            logError('dataTHead is not array, can\'t build table head' );
//            this.$tHead.empty();
//        }
//
//        this.$tHead.detach();
//        this.$tHead.empty();
//
//
//        var _this=this;
//        //画出表头
//
//        var $trHead=$(_html.tr)
//            .addClass(_style.trHead);
//
//        //画出全选勾选
//        if(this.settings.isShowingCheckBox){
//            var input_selectAll=$(_html.checkBox).addClass(_style.checkBox +' '+_style.inputCheckAll);
//            $trHead.append( $(_html.th).append(input_selectAll));
//        }
//
//
//        $.each(dataTHead,function(index,item){
//            if(!(index==0 && item.toLowerCase()=='uid')){
//                $(_html.th).append(item).appendTo($trHead);
//            }
//
//        });
//
//        //设置操作
//        if($.isArray(_this.settings.rowSettings.buttons) &&  _this.settings.rowSettings.buttons.length>0 ){
//            $trHead.append( $(_html.th).append('操作'));
//        }
//
//        this.$tHead.append($trHead);
//        this.$tHead.appendTo(this.$table);
//    };
//
//
//
//    TableView.prototype.buildDataRows=function(dataSplit,pageNow){
//
//        if (!$.isArray(dataSplit) || pageNow>dataSplit.length){
//            logError('buildDataRows either this.dataSplit is not array, or thisPage>dataSplit.length ');
//            this.$tBody.empty();
//        }
//
//        var _this=this;
//        //先清空以前的东东
//        //this.$table.find('.'+_style.trData).remove();
//        this.$tBody.detach();
//        this.$tBody.empty();
//
//        if ($.isArray( dataSplit[pageNow-1] ) ){
//            $.each(dataSplit[pageNow-1],function(i,row){
//                var rowIndex=_this.settings.rowsPerPage *(pageNow-1)+i
//
//                var $trData=$(_html.tr).addClass(_style.trData);
//
//                //设置勾选
//                if(_this.settings.isShowingCheckBox){
//
//                    var input_selectRow=$(_html.checkBox).addClass(_style.checkBox +' '+_style.inputCheckRow);
//
//                    input_selectRow.data('rowData', {rowIndex:rowIndex,$row: $trData, oData:row });
//
//                    var hasStored=false;
//                    for(var i= 0,l=_this.checkedRow.length; i<l; i++){
//                        (_this.checkedRow[i].rowIndex==rowIndex)&&(hasStored=true);
//                        if(hasStored){break};
//                    }
//                    if(hasStored){
//                        input_selectRow.attr('checked',true);
//                    }
//
//                    $trData.append( $(_html.th).append(input_selectRow));
//                }
//
//
//                $.each(row,function(j,item){
//                    if(j==0){
//                        $trData.attr('id',('datarow'+'-'+item ));
//                    }else{
//                        $(_html.td).append(item).appendTo($trData);
//                    }
//
//                });
//
//                // 画出操作按钮
//                if($.isArray(_this.settings.rowSettings.buttons) &&  _this.settings.rowSettings.buttons.length>0 )
//                {
//
//                    $trData.append(
//                        $(_html.th).append( _this.buildDataRowButtons(_this.settings.rowSettings.buttons,rowIndex,$trData,row))
//                    );
//
//                }
//
//
//
//                _this.$tBody.append($trData);
//
//            });
//        }
//
//
//
//        this.$tBody.appendTo(this.$table);
//    };
//
//
//    TableView.prototype.buildDataRowButtons=function(buttons,rowIndex,$tr,rowOData){
//        var buttonsContainer=$(_html.div);
//
//        $.each(buttons,function(index,item){
//
//            var $button=$(_html.button)
//                 .append(( !!item.innerHTML && item.innerHTML.jquery)? item.innerHTML.clone(true): item.innerHTML)
//                .addClass('btn btn-default')
//                .addClass(_style.trButtons) //用来 绑定事件，也可以在外部定义按钮的 样式 css
//                .css('margin-right','5px');
//            //存放数据，等待触发器调用
//            $button.data('buttonData', item.data);
//            $button.data('rowData', {rowIndex:rowIndex,$row: $tr, oData:rowOData });
//            buttonsContainer.append($button);
//        });
//
//
//        return buttonsContainer;
//    }
//
//
//    TableView.prototype.divideData=function(oData,rowsPerPage,totalPages){
//        //var oData=this.settings.Data;
//        //var rowsPerPage= this.settings.rowsPerPage;
//        //var pages=this.getNumberOfPages();
//
//        var dataSplit=[];
//        for(var i=1; i<=totalPages; i++){
//            var tempArr= [].slice.call(oData,(i-1)*rowsPerPage,i*rowsPerPage);
//            [].push.call(dataSplit,tempArr);
//        }
//        return dataSplit;
//    };
//
//    TableView.prototype.getTotalPages=function(arrData,rowsPerPage){
//
//        if($.isArray(arrData) && arrData.length>0 ){
//          return  Math.ceil(arrData.length/rowsPerPage);
//        }
//        else
//        {
//            return 0;
//        }
//
//    };
//
//
//    //根据现有的 dataRowNow，来计算 PageNow
//    TableView.prototype.getPageNow=function(dataSplit,dataRowNow){
//
//        var number=0;
//        var page=1;
//
//        number=number+ dataSplit[page-1].length;
//
//        while(number<=dataRowNow){
//            number=number+ dataSplit[page-1].length;
//            page++;
//        }
//        return page;
//    };
//
//    TableView.prototype.css=function(bsClass){
//        return hasOwnStyle? bsClass: '';
//    };
//
//    TableView.prototype.buildPagination=function(){
//        var _this=this;
//
//        var $div_PageContainer =  $(_html.div).addClass(_style.paginationContainer);
//        var $div_PageLeft=$(_html.div);
//        var $div_pageRight=$(_html.div);
//        var $ul_pages=$(_html.ul)
//
//
//        if(!this.hasOwnStyle){
//            $div_PageContainer.css({'display':'block', });//  {'':'', '':'', '':''}
//            $div_PageLeft.css({'margin-top':'10px', 'margin-bottom':'10px'});
//            $div_pageRight.css( { 'margin-top':'10px', 'margin-bottom':'10px'});
//
//            $div_PageLeft.addClass(css(_bs.pull_left));
//            $div_pageRight.addClass(css(_bs.pull_right,_bs.pagination));
//
//            $ul_pages.addClass(css(_bs.pagination));
//        }
//
//
//
//        //显示多少项
//        var $select=$(_html.select)
//            .on('change', function(evt){
//                _this.updateDataRows('rowsPerPage',this.value);
//            });
//
//
//        var rowsPerPageOptions=[10,25,50,100];
//         [].unshift.call(rowsPerPageOptions,parseInt(_this.settings.rowsPerPage));
//        $.each(rowsPerPageOptions, $.proxy(function(index,item){
//            var $option=$(_html.option)
//                .attr({'value':item})
//                .append(item+'条/页');
//            (_this.rowsPerPage==item)&& $option.attr('selected','selected');
//            $select.append($option);
//        },this));
//        $div_PageLeft.append($select);
//
//
//
//
//        //翻页 div
//
//        var $a=$(_html.a).attr('href','javascript:void(0)');
//        var $li_pre=$(_html.li).append($a.clone(true).append('<<'));
//        var $li_nex=$(_html.li).append($a.clone(true).append('>>'));
//        var $li_more=$(_html.li).append($a.clone().append('...'));
//
//
//
//
//
//        $li_pre.on('click',function(evt){
//            _this.updateDataRows('prePage');
//            evt.stopPropagation();
//        });
//
//        $li_nex.on('click',function(evt){
//            _this.updateDataRows('nextPage');
//            evt.stopPropagation();
//        });
//
//
//        $ul_pages.append($li_pre).append($li_more).append($li_nex);
//
//        $div_PageContainer
//            .append($div_PageLeft)
//            .append($div_pageRight.append($ul_pages));
//
//        return $div_PageContainer;
//
//
//
//    };
//
//
//
//    TableView.prototype.getCheckedRow=function(){
//        return this.checkedRow;
//    };
//
//
//    var logError = function (message) {
//        if (window.console) {
//            window.console.error(message);
//        }
//    };
//
//
//    $.fn[pluginName]=function(options){
//        var method,
//            args=[].slice.call(arguments,1);
//
//        $.each(this,function(){
//
//            var $this=$(this),
//                old= $this.data(pluginName);
//
//            if(typeof options==='string'){
//                if(!old){
//                    logError('this'+ pluginName +'has\'s been initialised, can not call method:'+ options)
//                }
//                else if( !$.isFunction(old[options]) ){
//                    logError('in'+ pluginName +',No such method:' + options)
//                }
//                else{
//                    old[options].apply(old,args);
//                }
//
//            }else if(typeof options==='object' ){
//                $this.data(pluginName, new TableView( this, options) )
//            }
//        });
//
//        return method || this;
//
//    };
//
//
//}(jquery,window);
//


+function(window,factory){



    if(typeof define==='function' && define.amd){
        define(['jquery'],factory);
    }else if(typeof window !=='undefined' && window.jQuery){
        factory(jQuery,window)
    }



}(Window,function($,win,undefined){

    win=win || window;

    var pluginName='tableView';

    var _default={
        tableID:'',
        Head:[],
        Data:[[]],
        rowsPerPage:5,
        isDataWritable:false, // 传进来的数据 Data[[]] 是否可被直接修改；
        hasOwnStyle:false,
        tableBordered:true,
        hasTickBox:true,

        rowSettings:{
            buttons:[],
            // buttons handler
            onRowButtonClick: undefined,
        },

        isShowingCheckBox:true,

        // Event handlers



    };
    // _default.rowSettings.buttons[0]={
    //  innerHtml:'删', 'id':'', action:'', data:''
    // }

    var hasOwnStyle=false;

    //需要自己定义
    var _style={
        trHead:pluginName+'-trHead',
        trData:pluginName+'-trData',
        paginationContainer:pluginName+'-paginationContainer',
        paginationChange:pluginName+'-paginationChange',
        paginationRowsPerPage: pluginName+'-paginationRowsPerPage',
        paginationDetail: pluginName+'-paginationDetail',
        trButtons: pluginName+'-trButtons',
        checkBox: pluginName+'-inputCheckBox',
        inputCheckAll:pluginName+'-inputCheckAll',
        inputCheckRow:pluginName+'-inputCheckRow',

    };

    var _bs={

            table_responsive:'table-responsive',
            table: 'table',
            table_striped:'table-striped',
            table_condensed:'table-condensed',
            table_bordered : 'table-bordered',
            table_hover:' table-hover',

            pagination:'pagination',
            pull_left:'pull-left',
            pull_right:'pull-right',


    };

    var _html={
        table:'<table></table>',
        thead:'<thead></thead>',
        tbody:'<tbody></tbody>',
        tr:'<tr></tr>',
        th:'<th></th>',
        td:'<td></td>',
        div:'<div></div>',
        ul:'<ul></ul>',
        li:'<li></li>',
        a:'<a></a>',
        select:'<select></select>',
        option:'<option></option>',
        button:'<button></button>',
        checkBox:'<input type="checkbox" />'
    };

    var css=function(){
       var args=[].slice.call(arguments);
        var result='';
        if(!hasOwnStyle){
            $.each(args,function(index){
                result=result+ args[index] + ' ';
            });
        }
        return result;
    };

    var some=function(arr, fn){
        var hasItem=false;
        if(!arr.length){return hasItem;}

        for(var i= 0, l=arr.length; i<l; i++){
            hasItem= fn.call(null,arr[i],i,arr); // this=null, item=arr[i], i=index, arr=array
            if(hasItem){
                break;
            }
        }
        return (!hasItem)? false: hasItem;
    };


    var cut=function(arr,startIndex,endIndex){
        if(!$.isArray(arr)){
            return arr;
        }

        (endIndex===undefined) && (endIndex=arr.length-1);

        if( ! ( startIndex>=0 && endIndex>=0 && startIndex<=endIndex && endIndex<arr.length ) ){
           return  arr;
        }

        var result=[];
        for(var i=0,l=arr.length; i<l;i++){
            ( i<startIndex || i>endIndex) && result.push(arr[i]);

        }
        return result;
    };

    var TableView=function(element ,options){
        this.settings= $.extend({},_default,options);

        if(this.settings.isDataWritable){
            this.settings.Data=options.Data;
        }

        this.$element=$(element);
        hasOwnStyle=this.settings.hasOwnStyle;
        this.init(this.settings)

    };



    TableView.prototype.init=function(){

            this.$table=undefined;
            this.$tHead=undefined;
            this.$tBody=undefined;
            this.$div_PageContainer= undefined;

            this.dataRowNow=0;

            this.dataSplit=[]; //经过 rowsPerPage 计算出来的每一页有多少数据
            this.checkedRow=[]; //存放 勾选中的 row


            this.$element.addClass(css(_bs.table_responsive));

            this.initTable();
           // this.buildPagination();
            // initTable 之后，才能 subscribe events
            this.subEvents();



    };

    TableView.prototype.destory=function(){
        $.removeData(this.$element,pluginName);
    };

    TableView.prototype.subEvents=function(){
       this.unsubEvnts();
        var _this=this;
        //内部事件
                //row 操作 Button
        if($.isArray(this.settings.rowSettings.buttons) &&  this.settings.rowSettings.buttons.length>0 ){
            this.$element.on('click', 'tr button.'+_style.trButtons ,function(){
             var buttonData=  $(this).data('buttonData');
             var rowData=   $(this).data('rowData');
                _this.$element.trigger('onRowButtonClick',[rowData.rowIndex ,rowData.$row,rowData.oData,buttonData])
            });
        }
                //checkBox
        this.$element.on('click','input.'+_style.checkBox,function(){
            var $checkBox=$(this);
            //checkAll
            if($checkBox.hasClass(_style.inputCheckAll)){
                //_this.checkedRow=[];
                _this.$element.find('.'+_style.inputCheckRow).each(function(i, checkbox){
                    var rowData= $(checkbox).data('rowData');
                    var index=-1;
                    var hasStored=some(_this.checkedRow,function(item,j){
                        index=j;
                        return  item.rowIndex == rowData.rowIndex;
                    });


                    if($checkBox.is(':checked') && !hasStored){
                        [].push.call(_this.checkedRow,rowData);
                        checkbox.checked=true;
                    }
                    else if(!$checkBox.is(':checked') && hasStored){
                        checkbox.checked=false;
                        _this.checkedRow= cut( _this.checkedRow,index,index);
                    }

                });

            //check Row
            }
            else if( $checkBox.hasClass(_style.inputCheckRow) ){
                var rowData= $(this).data('rowData');
                var index=-1;
                var hasStored=some(_this.checkedRow,function(item,i){
                    index=i;
                    return  item.rowIndex == rowData.rowIndex;
                });

                if(this.checked && !hasStored){
                        [].push.call(_this.checkedRow,rowData);
                }else if (!this.checked && hasStored){
                    _this.checkedRow= _this.checkedRow= cut( _this.checkedRow,index,index);;
                }

            }

        });
        this.$element.on('scroll', function(){
            _this.floatPagination();
        });

        //外部事件
        if(typeof this.settings.rowSettings.onRowButtonClick==='function'){
            this.$element.on('onRowButtonClick', this.settings.rowSettings.onRowButtonClick);
        }


    };

    TableView.prototype.unsubEvnts=function(){
        this.$element.off('click');
        this.$element.off('onRowCURD', this.settings.onRowButtonClick);
    };

    //初始化表
    TableView.prototype.initTable=function(){


        this.$table=$(_html.table)
            .addClass(css(_bs.table,_bs.table_bordered,_bs.table_striped,_bs.table_condensed,_bs.table_hover))
            .attr('id', this.settings.tableID);


        //把 thead, 系上 table //把 tbody  系上 table
        this.$tHead=$(_html.thead);
        this.$tBody=$(_html.tbody);



        this.updateDataRows('init');// buildDataRows 画出 所有dataCell
        this.$element.append(this.$table);
        this.buildPagination();

    };


    //初始化，数据更新，全部由 updateDataRows来控制
    TableView.prototype.updateDataRows=function(key,value,data){
         // data [[]] 参数是当外部调用 tableView, 传入的数新表格内容。配合 key=newData

        var totalPages=0, pageNow=0;

        switch (key){
            case 'init':

                totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
                this.dataSplit=this.divideData(this.settings.Data,this.settings.rowsPerPage,totalPages);
                pageNow=1;
                break;

            case 'rowsPerPage':

                this.settings.rowsPerPage=parseInt(value);
                 totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
                this.dataSplit=this.divideData(this.settings.Data,this.settings.rowsPerPage,totalPages);
                pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);

                break;
            case 'prePage':

                pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
                if(pageNow>1){
                    this.dataRowNow-=this.settings.rowsPerPage;
                    pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
                }else if(pageNow<=1){
                    pageNow=0;
                }

                break;
            case 'nextPage':
                pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
                totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
                if(pageNow<totalPages){
                    this.dataRowNow+=this.settings.rowsPerPage;
                    pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
                }else{
                    pageNow<0
                }

                break;
            case 'page':

                alert('need to implement')

                break;
            case 'newData':
                if($.isArray(data)){
                    this.settings.Data=data;
                    if(data.length>0){

                        //如果老数据的 dataRowNow 是 最后一条数据，返回的新数据有可能小于老数据（删除返回时）
                        this.dataRowNow= this.dataRowNow < data.length?this.dataRowNow : data.length-1



                        totalPages=this.getTotalPages(this.settings.Data,this.settings.rowsPerPage);
                        this.dataSplit=this.divideData(this.settings.Data,this.settings.rowsPerPage,totalPages);
                        pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
                    }else{
                        this.$tBody.empty();
                        pageNow=0;
                    }

                }else{
                    logError('新传的表格数据不是array唷');

                    pageNow=0;
                }
                break;

        }

        if(pageNow>0){
            this.buildTableHead(this.settings.Head);
            this.buildDataRows(this.dataSplit,pageNow);


        }else if(pageNow=0){

            logError('pageNow=0');

        }else{

            logError('something wrong with updateDataRows, or not data');
        }

    };

    TableView.prototype.buildTableHead=function(dataTHead){

        if (!$.isArray(dataTHead)){
            logError('dataTHead is not array, can\'t build table head' );
            this.$tHead.empty();
        }

        this.$tHead.detach();
        this.$tHead.empty();


        var _this=this;
        //画出表头

        var $trHead=$(_html.tr)
            .addClass(_style.trHead);

        //画出全选勾选
        if(this.settings.isShowingCheckBox){
            var input_selectAll=$(_html.checkBox).addClass(_style.checkBox +' '+_style.inputCheckAll);
            $trHead.append( $(_html.th).append(input_selectAll));
        }


        $.each(dataTHead,function(index,item){
            if(!(index==0 && item.toLowerCase()=='uid')){
                $(_html.th).append(item).appendTo($trHead);
            }

        });

        //设置操作
        if($.isArray(_this.settings.rowSettings.buttons) &&  _this.settings.rowSettings.buttons.length>0 ){
            $trHead.append( $(_html.th).append('操作'));
        }

        this.$tHead.append($trHead);
        this.$tHead.appendTo(this.$table);
    };



    TableView.prototype.buildDataRows=function(dataSplit,pageNow){

        if (!$.isArray(dataSplit) || pageNow>dataSplit.length){
            logError('buildDataRows either this.dataSplit is not array, or thisPage>dataSplit.length ');
            this.$tBody.empty();
        }

        var _this=this;
        //先清空以前的东东
        //this.$table.find('.'+_style.trData).remove();
        this.$tBody.detach();
        this.$tBody.empty();

        if ($.isArray( dataSplit[pageNow-1] ) ){
            $.each(dataSplit[pageNow-1],function(i,row){
                var rowIndex=_this.settings.rowsPerPage *(pageNow-1)+i

                var $trData=$(_html.tr).addClass(_style.trData);

                //设置勾选
                if(_this.settings.isShowingCheckBox){

                    var input_selectRow=$(_html.checkBox).addClass(_style.checkBox +' '+_style.inputCheckRow);

                    input_selectRow.data('rowData', {rowIndex:rowIndex,$row: $trData, oData:row });

                    var hasStored=false;
                    for(var i= 0,l=_this.checkedRow.length; i<l; i++){
                        (_this.checkedRow[i].rowIndex==rowIndex)&&(hasStored=true);
                        if(hasStored){break};
                    }
                    if(hasStored){
                        input_selectRow.attr('checked',true);
                    }

                    $trData.append( $(_html.th).append(input_selectRow));
                }


                $.each(row,function(j,item){
                    if(j==0){
                        $trData.attr('id',('datarow'+'-'+item ));
                    }else{
                        $(_html.td).append(item).appendTo($trData);
                    }

                });

                // 画出操作按钮
                if($.isArray(_this.settings.rowSettings.buttons) &&  _this.settings.rowSettings.buttons.length>0 )
                {

                    $trData.append(
                        $(_html.th).append( _this.buildDataRowButtons(_this.settings.rowSettings.buttons,rowIndex,$trData,row))
                    );

                }



                _this.$tBody.append($trData);

            });
        }



        this.$tBody.appendTo(this.$table);
    };


    TableView.prototype.buildDataRowButtons=function(buttons,rowIndex,$tr,rowOData){
        var buttonsContainer=$(_html.div);

        $.each(buttons,function(index,item){

            var $button=$(_html.button)
                 .append(( !!item.innerHTML && item.innerHTML.jquery)? item.innerHTML.clone(true): item.innerHTML)
                .addClass('btn btn-default')
                .addClass(_style.trButtons) //用来 绑定事件，也可以在外部定义按钮的 样式 css
                .css('margin-right','5px');
            //存放数据，等待触发器调用
            $button.data('buttonData', item.data);
            $button.data('rowData', {rowIndex:rowIndex,$row: $tr, oData:rowOData });
            buttonsContainer.append($button);
        });


        return buttonsContainer;
    }


    TableView.prototype.divideData=function(oData,rowsPerPage,totalPages){
        //var oData=this.settings.Data;
        //var rowsPerPage= this.settings.rowsPerPage;
        //var pages=this.getNumberOfPages();

        var dataSplit=[];
        for(var i=1; i<=totalPages; i++){
            var tempArr= [].slice.call(oData,(i-1)*rowsPerPage,i*rowsPerPage);
            [].push.call(dataSplit,tempArr);
        }
        return dataSplit;
    };

    TableView.prototype.getTotalPages=function(arrData,rowsPerPage){

        if($.isArray(arrData) && arrData.length>0 ){
          return  Math.ceil(arrData.length/rowsPerPage);
        }
        else
        {
            return 0;
        }

    };


    //根据现有的 dataRowNow，来计算 PageNow
    TableView.prototype.getPageNow=function(dataSplit,dataRowNow){

        var number=0;
        var page=1;

        number=number+ dataSplit[page-1].length;

        while(number<=dataRowNow){
            number=number+ dataSplit[page-1].length;
            page++;
        }
        return page;
    };

    TableView.prototype.css=function(bsClass){
        return hasOwnStyle? bsClass: '';
    };

    TableView.prototype.buildPagination=function(){
        var _this=this;
        if(! this.$div_PageContainer) {this.$div_PageContainer= $(_html.div).addClass(_style.paginationContainer);}
        this.$div_PageContainer.detach().empty();

        var $div_RowsPerPage=$(_html.div);
        var $div_ChangePage=$(_html.div);
        var $div_PageDetial=$(_html.div);
        var $ul_pages=$(_html.ul)


        if(!this.hasOwnStyle){
            this.$div_PageContainer.css({'display':'block', });//  {'':'', '':'', '':''}
            //$div_RowsPerPage.css({'margin-top':'10px', 'margin-bottom':'10px','display':'inline-block'});
            //$div_ChangePage.css( { 'margin-top':'10px', 'margin-bottom':'10px','display':'inline-block'});
            //$div_PageDetial.css( { 'margin-top':'10px', 'margin-bottom':'10px','display':'inline-block'});
            //$div_RowsPerPage.addClass(css(_bs.pull_left,''));
            //$div_ChangePage.addClass(css(_bs.pull_right));

            $div_RowsPerPage.addClass(pluginName+'-paginationRowsPerPage');
            $div_ChangePage.addClass(pluginName+'-paginationChange');
            $div_PageDetial.addClass(pluginName+'-paginationDetail');


            //$ul_pages.addClass(css(_bs.pagination));
        }



        //显示多少项
        var $select=$(_html.select)
            .on('change', function(evt){
                _this.updateDataRows('rowsPerPage',this.value);
                _this.buildPagination();
            });


        var rowsPerPageOptions=[10,25,50,100];
         [].unshift.call(rowsPerPageOptions,parseInt(_this.settings.rowsPerPage));
        $.each(rowsPerPageOptions, $.proxy(function(index,item){
            var $option=$(_html.option)
                .attr({'value':item})
                .append(item+'条/页');
            (_this.rowsPerPage==item)&& $option.attr('selected','selected');
            $select.append($option);
        },this));
        $div_RowsPerPage.append($select);

        //用多少页，现在在第几页
        var pageNow= 0, totolPage=0
        if($.isArray(this.dataSplit) && this.dataSplit.length>0){
            pageNow=this.getPageNow(this.dataSplit,this.dataRowNow);
            totolPage= this.dataSplit.length;
        }



        $div_PageDetial.append('<span>目前：第'+pageNow +'页 / 共'+totolPage+'页</span>');


        //翻页 div

        var $a=$(_html.a).attr('href','javascript:void(0)');
        var $li_pre=$(_html.li).append($a.clone(true).append('<<'));
        var $li_nex=$(_html.li).append($a.clone(true).append('>>'));
        var $li_more=$(_html.li).append($a.clone().append('...'));





        $li_pre.on('click',function(evt){
            _this.updateDataRows('prePage');
            _this.buildPagination();
            evt.stopPropagation();
        });

        $li_nex.on('click',function(evt){
            _this.updateDataRows('nextPage');
            _this.buildPagination();
            evt.stopPropagation();
        });


        $ul_pages.append($li_pre).append($li_more).append($li_nex);

        this.$div_PageContainer
            .append($div_RowsPerPage)
            .append($div_PageDetial)
            .append($div_ChangePage.append($ul_pages));

        this.$element.append(this.$div_PageContainer);

        this.floatPagination();
    };

    TableView.prototype.floatPagination=function(){
        //var eleHeight=this.$element.height(),
        //    totalChildrenHeight=0;
        //this.$element.children().each(function(){
        //    totalChildrenHeight+=this.offsetHeight;
        //
        //});

        var scrollTop=this.$element.scrollTop(),
         clientHeight=this.$element.innerHeight(),
            scrollHeight = this.$element[0].scrollHeight;
        if(scrollTop+clientHeight<scrollHeight){
            this.$div_PageContainer.addClass('tableView-paginationContainer-floatNav');
        }else{
            this.$div_PageContainer.removeClass('tableView-paginationContainer-floatNav');
        }

    };



    TableView.prototype.getCheckedRow=function(){
        return this.checkedRow;
    };


    var logError = function (message) {
        if (win.console) {
            win.console.error(message);
        }
    };


    $.fn[pluginName]=function(options){
        var method,
            args=[].slice.call(arguments,1);

        $.each(this,function(){

            var $this=$(this),
                old= $this.data(pluginName);

            if(typeof options==='string'){
                if(!old){
                    logError('this'+ pluginName +'has\'s been initialised, can not call method:'+ options)
                }
                else if( !$.isFunction(old[options]) ){
                    logError('in'+ pluginName +',No such method:' + options)
                }
                else{
                    old[options].apply(old,args);
                }

            }else if(typeof options==='object' ){
                $this.data(pluginName, new TableView( this, options) )
            }
        });

        return method || this;

    };


});