/**
 * Created by Administrator on 2016/6/14.
 */

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
        isfixingHead:true,
        rowSettings:{
            buttons:[],
            // buttons handler
            onRowButtonClick: undefined,
        },

        isShowingCheckBox:true,

        paginationSetting:{
            pageCount:undefined,
            pageIndex:undefined,
            rowEnd:undefined,
            rowStart:undefined,
            rows:undefined,
            totalPages:undefined,
            totalRows:undefined,
            url:undefined,
            funModName:undefined,
            onGoToPageClick:undefined
        }

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
        activePage:pluginName+'-activePage',
        buttonContainer:pluginName+'-buttonContainer'

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
        checkBox:'<input type="checkbox" />',
        span:'<span></span>'
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
            this.$temptHead = undefined;
            this.$tempPageContainer=undefined;
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
        //内部事件 --> row 操作 Button
        if($.isArray(this.settings.rowSettings.buttons) &&  this.settings.rowSettings.buttons.length>0 ){
            this.$element.on('click', 'tr button.'+_style.trButtons ,function(){
             var buttonData=  $(this).data('buttonData');
             var rowData=   $(this).data('rowData');
                _this.$element.trigger('onRowButtonClick',[rowData.rowIndex ,rowData.$row,rowData.oData,buttonData])
            });
        }

        //内部事件 --> 翻页操作事件
        this.$div_PageContainer.on('click','ul li',function(event){
            _this.$element.trigger('onGoToPageClick',[ this.value,_this.settings.paginationSetting]);
        });

        //内部事件 --> checkBox
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

        //内部事件 --> 有滚动条的祖先: 1. 翻页悬浮 2.表头固定（未实现）

        this.getScrollableParent();






        //外部事件
        if(typeof this.settings.rowSettings.onRowButtonClick==='function'){
            this.$element.on('onRowButtonClick', this.settings.rowSettings.onRowButtonClick);
        }

        if(typeof this.settings.paginationSetting.onGoToPageClick==='function'){
            this.$element.on('onGoToPageClick', this.settings.paginationSetting.onGoToPageClick);
        }


    };

    TableView.prototype.getScrollableParent=function(){
        var _this=this, scrollableParent=undefined;

        //寻找出现滚动条的祖先: 采用间歇调用，原因是有可能会 tableView还没有被系上 html
        var intervalID=setInterval(function(){
            if(_this.$element.parents().length>0){
                clearInterval(intervalID);
                _this.$element.parents().each(function(index,item){
                    //寻找祖先里出现滚动条,而且是要第一个出现滚动条
                    if(item.scrollHeight>this.clientHeight && !scrollableParent ){
                        scrollableParent=item;
                    }
                });
                //如果找到 有滚动条的祖先
                if(scrollableParent){
                    $(scrollableParent).on('scroll', function(){
                        /*
                        //表头固定
                        if(_this.settings.isfixingHead){_this.floatHead(scrollableParent);}
                        */


                /*        $('#monitor').html(
                            'pageTop: ' + _this.$div_PageContainer[0].getBoundingClientRect().top + '<br>'+
                            'parentTop: ' +scrollableParent.getBoundingClientRect().top + '<br>'+
                                'ScrollTop: ' + scrollableParent.scrollTop + '<br>'+
                                'parentHeight:' +  scrollableParent.clientHeight+ '<br>'+
                                'parentTop +parentHeight:' +  (scrollableParent.getBoundingClientRect().top+scrollableParent.clientHeight)
                        )*/

                    });


                    $(scrollableParent).on('mousemove',function(event){

                           // 检测 在底部 到  底部+翻页器高度的范围内，激发 floatPagination


                        if(  !_this.isPaginationAppears(scrollableParent,_this.$div_PageContainer[0])  )
                        {
                            if(  _this.isAtEleBottom(scrollableParent,_this.$div_PageContainer[0],event) ){
                                _this.floatPagination(scrollableParent,'onTarget');
                            }else{
                                _this.floatPagination(scrollableParent,'offTarget');
                            }
                        }else{
                            _this.floatPagination(scrollableParent,'offTarget');
                        }


                    });




                }
            }

        },100);

        return scrollableParent

    };

    TableView.prototype.isAtEleBottom=function(parentElement,childElement ,event){
        //如果鼠标出现在有滚动条的祖先的范围内，检测鼠标移动，一般 childelement 出现在底部。
        // true: 在 parentElement 底部 和 childElement顶部
        // false： 在 childElement 顶部 到 parentElement 顶部
        var dist2Top =  parentElement.getBoundingClientRect().top,
            dist2Left = parentElement.getBoundingClientRect().left,
            eleHeight= parentElement.offsetHeight,
            eleWidth= parentElement.offsetWidth,
            paginationHeight= childElement.offsetHeight,
            result=false;

        if(  (dist2Top + eleHeight - paginationHeight)<event.clientY  &&
            event.clientY< (dist2Top + eleHeight) &&
            dist2Left < event.clientX &&
            event.clientX< (dist2Left+eleWidth)
        ){
          result =  true;
        }
        else{
            result= false;
        }

/*        $('#monitor').html(
         'Top:'+(dist2Top + eleHeight - paginationHeight) + '<br>'+
         'bottom: '+(dist2Top + eleHeight) + '<br>'+
         //'p-offSetHeight:' + scrollableParent.offsetHeight + '<br>'+
         'clientY: ' + event.clientY +'<br>'+
         'left: ' + dist2Left +'<br>'+
         'right: ' + (dist2Left+eleWidth) +'<br>'+
         'clientX: ' + event.clientX +'<br>'+
         '------------------==== '+ result +' =====------------------'+'<br>'+ '');*/

        return result;
    };

    TableView.prototype.isPaginationAppears=function(scrollableParent,paginationDiv){
        if (paginationDiv.getBoundingClientRect().top <  (scrollableParent.getBoundingClientRect().top+scrollableParent.clientHeight))
        {
          return true;
        }else
        {
            return false;
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
        if (this.settings.paginationSetting.pageCount !=undefined && this.settings.paginationSetting.pageIndex !=undefined){
            this.buildPaginationServ(this.settings.paginationSetting);
        }else{
            this.buildPagination();
        }


    };


    //初始化，数据更新，全部由 updateDataRows来控制
    TableView.prototype.updateDataRows=function(key,value,data){
        //如果 数据里带 paginationSetting  所有属性，就是服务器分页
        var pSetting=this.settings.paginationSetting;
        if( pSetting.pageCount !=undefined &&  pSetting.pageIndex !=undefined){
            this.buildTableHead(this.settings.Head);
            this.buildDataRowsServ(this.settings.Data,pSetting);
        }
        else{
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
        var buttonsContainer=$(_html.div).addClass(_style.buttonContainer);

        $.each(buttons,function(index,item){
            var htmlForButton='';
            if(item.data.icon && item.data.icon.length>0){
                htmlForButton=$(_html.span).addClass(item.data.icon).attr('title',item.innerHTML);
            }else{
                htmlForButton=  ( !!item.innerHTML && item.innerHTML.jquery)? item.innerHTML.clone(true): item.innerHTML
            }


            var $button=$(_html.button)
                 .append(htmlForButton)
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

        //this.floatPagination();
    };

    TableView.prototype.floatPagination=function(scrollableParent,event){
        var  _this=this;


       if(   ! this.$tempPageContainer ){
           //初始化 悬浮翻页
           this.$tempPageContainer=this.$div_PageContainer.clone(true);

           $(scrollableParent).append(this.$tempPageContainer );
           this.$tempPageContainer.addClass('paginationFixBottomMid');
            setTimeout(function(){
                _this.$tempPageContainer.addClass('hidePagination');
            },1000);

       }else if( this.$tempPageContainer instanceof jQuery){



           if(event=='scroll'){

               this.$tempPageContainer.removeClass('hidePagination');
               this.$tempPageContainer.addClass('showPagination');

               setTimeout(function(){
                   _this.$tempPageContainer.removeClass('showPagination');
                   _this.$tempPageContainer.addClass('hidePagination');
               },1000);
           }else if(event == 'onTarget'){
               this.$tempPageContainer.removeClass('hidePagination');
               this.$tempPageContainer.addClass('showPagination');
           }
           else if(event=='offTarget' ){
               this.$tempPageContainer.removeClass('showPagination');
               this.$tempPageContainer.addClass('hidePagination');
           }


       }


    };


    TableView.prototype.floatHead=function(scrollableParent){
        //表头绝对定位小于父元素绝对定位，就让表头悬浮。
     //console.log('scroll-Top:'+scrollableParent.scrollTop);
        console.log('-->Parent:'+ $(scrollableParent).offset().top);
        console.log('-->Head:' + this.$tHead.offset().top);
        console.log('-->Table:' + this.$table.offset().top);


        if( $(scrollableParent).offset().top >=this.$tHead.offset().top )
        {
            //this.$tHead.addClass('tableView-trHeadFloat');
            //this.$tHead.css({'position':'fixed','top':$(scrollableParent).offset().top });



            if( this.$temptHead ==undefined){
                this.$temptHead=this.$tHead.clone(true);
                $(scrollableParent).append(this.$temptHead);
                var style=cssCopy(this.$tHead);
                this.$temptHead.addClass('tableView-trHeadFloat');
               // this.$temptHead.css({'position':'fixed','top':$(scrollableParent).offset().top,'visibility': 'visible','z-index':'100000' });
                this.$tHead.css({'visibility': 'hidden'});
            }

            console.log('浮动');

        }
        else if( $(scrollableParent).offset().top < this.$table.offset().top)
        {
            //this.$tHead.css({'visibility':'visible'});

            if(this.$temptHead instanceof jQuery){
                console.log('不浮动');
                this.$tHead.css({'visibility':'visible'})
                this.$temptHead.remove();
                this.$temptHead=undefined;
            }
        }
        console.log(this.$tHead.css('visibility'));
        console.log('---------------------------------------------------------------');
    };



/*    function cssCopy(a) {
        var sheets = document.styleSheets, o = {};
        for (var i in sheets) {
            var rules = sheets[i].rules || sheets[i].cssRules;
            for (var r in rules) {
                if (a.is(rules[r].selectorText)) {
                    o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
                }
            }
        }
        return o;
    }

    function css2json(css) {
        var s = {};
        if (!css) return s;
        if (css instanceof CSSStyleDeclaration) {
            for (var i in css) {
                if ((css[i]).toLowerCase) {
                    s[(css[i]).toLowerCase()] = (css[css[i]]);
                }
            }
        } else if (typeof css == "string") {
            css = css.split("; ");
            for (var i in css) {
                var l = css[i].split(": ");
                s[l[0].toLowerCase()] = (l[1]);
            }
        }
        return s;
    }*/


    TableView.prototype.getCheckedRow=function(){
        return this.checkedRow;
    };


    /*
    *  pagination from server :start
    *
    *
    */
    TableView.prototype.buildDataRowsServ=function(data,pageSettings){

        var _this=this;
        //先清空以前的东东
        //this.$table.find('.'+_style.trData).remove();
        this.$tBody.detach();
        this.$tBody.empty();

        if ($.isArray( data ) ){
            $.each(data,function(i,row){
                var rowIndex=pageSettings.pageIndex * pageSettings.pageCount + i;

                var $trData=$(_html.tr).addClass(_style.trData);

                //设置勾选
                if(_this.settings.isShowingCheckBox){

                    var input_selectRow=$(_html.checkBox).addClass(_style.checkBox +' '+_style.inputCheckRow);

                    input_selectRow.data('rowData', {rowIndex:rowIndex,$row: $trData, oData:row });

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



    TableView.prototype.buildPaginationServ=function(pageSettings){
        var _this=this,arrayGoToPage=[];
        if(! this.$div_PageContainer) {this.$div_PageContainer= $(_html.div).addClass(_style.paginationContainer);}
        this.$div_PageContainer.detach().empty();

        //var $div_RowsPerPage=$(_html.div);
        var $div_ChangePage=$(_html.div);
        var $div_PageDetial=$(_html.div);
        var $ul_pages=$(_html.ul);


        if(!this.hasOwnStyle){
            this.$div_PageContainer.css({'display':'block', });//  {'':'', '':'', '':''}
            $div_ChangePage.addClass(pluginName+'-paginationChange');
            $div_PageDetial.addClass(pluginName+'-paginationDetail');
        }









        $div_PageDetial.append('<span> 共'+pageSettings.totalPages+'页</span>');


        //翻页 div
        //--->首页
         arrayGoToPage.push({caption:'首页',page:0});
        //-->上一页 （要判断，现在页码是否是<1）
        var _pagePre=parseInt(pageSettings.pageIndex)<1 ? pageSettings.pageIndex : (parseInt(pageSettings.pageIndex) -1)
        arrayGoToPage.push({caption:'上一页',page:_pagePre});
        //-->数字(现在所在页码)
        arrayGoToPage.push({caption:pageSettings.pageIndex+1,page:parseInt(pageSettings.pageIndex)});
        //-->下一页 （要判断，现在页码是否是 最后一页）
        var _pageNex=parseInt(pageSettings.pageIndex)>=(pageSettings.totalPages-1) ? pageSettings.pageIndex: (parseInt(pageSettings.pageIndex) +1);
        arrayGoToPage.push({caption:'下一页',page:_pageNex});
        //--->尾页
        arrayGoToPage.push({caption:'尾页',page:(pageSettings.totalPages-1)});



        $.each(arrayGoToPage,function(index,item){
            var _cssClass= parseInt(item.caption)==parseInt(pageSettings.pageIndex+1)? _style.activePage:'';
            $ul_pages.append(
                $(_html.li)
                    .attr('value',item.page)
                    .append(
                        $(_html.a)
                            .attr('href','javascript:void(0)')
                            .append(item.caption)
                            .addClass(_cssClass)
                    )
            );
        });



        this.$div_PageContainer
            .append($div_ChangePage.append($ul_pages))
            .append($div_PageDetial);


        this.$element.append(this.$div_PageContainer);

        //this.floatPagination();
    };



    /*
     *  pagination from server: end
     *
     */


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