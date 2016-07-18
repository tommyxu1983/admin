/**
 * Created by Administrator on 2016/6/1.
 */
if (typeof jQuery === 'undefined') {
    throw new Error('listView\'s JavaScript requires jQuery')
}

(function($,window){
    var _default={
        data:[],
        isInsert:false,
        ulClass:'',
        ulID:'',


    }
    var pluginName='listview';

    var _html={
        ul:'<ul></ul>',
        li:'<li></li>'
    }
    var ListView=function(element,options){
        this.$element=$(element);
        this.init(options);
    }

    ListView.prototype.init=function(options){

        this.settings= $.extend({},_default,options);
        //把元素 <ul> 插入被选元素 $element
        this.$list=$(_html.ul).addClass(this.settings.ulClass);
        ( typeof this.settings.ulID==='string' && this.settings.ulID.length>0 )&& this.$list.attr('id',this.settings.ulID);
        this.$element.append(this.$list);
        this.render();

    }

    //构建 Listview
    ListView.prototype.render=function(){

        if($.isArray(this.settings.data)){
            $.each(this.settings.data, $.proxy(function(index,itemContent){
                var $item=$(_html.li);
                if(typeof itemContent==='string'){

                    this.$list.append($item.append(itemContent));

                } else if (typeof itemContent==='object'){

                    (itemContent.title)&& $item.append(itemContent.title);
                    (itemContent.id)&& $item.attr('id',itemContent.id);
                    (itemContent.cssClass)&& $item.addClass(itemContent.cssClass);

                    this.$list.append($item);

                }
            },this));
        }else if(typeof this.settings.data=='string'){

            this.$list.append($(_html.li).append(this.settings.data));


        }else if( typeof this.settings.data=='object'){
            var $singleItem= $(_html.li);
            (this.settings.data.title) && $singleItem.append(this.settings.data.title);
            (this.settings.data.id) && $singleItem.attr('id',this.settings.data.id);
            (this.settings.data.cssClass) && $singleItem.addClass(this.settings.data.cssClass);
            this.$list.append($singleItem);
        }
    }

    //插入 新的 item(<li></li>)
    ListView.prototype.insert=function(InsertData){
        if($.isArray(InsertData)){
            this.settings.data=[].concat.call(this.settings.data,InsertData);
        }else if(typeof InsertData==='object'){
            [].push.call(this.settings.data,InsertData);
        }
        this.removeAllItems();
        this.render();
    }
    ListView.prototype.removeAllItems=function(){
        this.$list.empty();
    }


    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };
    // listView PLUGIN DEFINITION ListView 插件定义 写入Jquery prototype
    // ==========================
    $.fn[pluginName]=function(options,args){
        window.console &&(this.length<1)&& console.log('没有元素被选中');
         return this.each(function(){
            var oldListView= $.data(this,pluginName);
            if(!oldListView){

               // new ListView(this,options);
                var newListView= new ListView(this,options);
                $.data(this,pluginName,newListView);
            }else{
                if(typeof options==='string'){
                    if(!oldListView){

                        logError("the ListView hasn't been initialised, "+ options+"方法不能被调用");

                    } else if(!$.isFunction(oldListView[options])){

                        logError(options + '这个方法不存在');
                    }else{
                        if (!(args instanceof Array)) {
                            args = [ args ];
                        }
                        oldListView[options].apply(oldListView,args);
                    }

                }
            }


        });
    };



    // DROPDOWN NO CONFLICT 没有冲突检查（是否有其他插件叫 listView）
    // ====================
    //var old= $.fn[pluginName];
    //$.fn[pluginName].noConflict=function(){
    //    $.fn[pluginName] = old;
    //    return this;
    //}

})(jQuery, window,document);




(function($,window){
    var _default={
        data:[],
        hasOwnCss:false,
        isDataWritable:false, //true,  直接 把 this.settings.data 指向  options.data,  任何数据改动，直接改动传入的数据（options.data）
        hasClose:false,   //有没有关闭功能
        closeIcon:undefined, //  tab关闭按钮 icon
        allowDuplicateId:false

    }
    var pluginName='tabview';

    var _html={
        div:'<div></div>',
        ul:'<ul></ul>',
        li:'<li></li>',
        a:'<a></a>',
        span:'<span></span>'

    }
    var _cssClass={
        panelsHolder:'tabView-panelsHolder', //div
        panel:'tabView-panel', //div
        tabsHolder:'tabView-tabsHolder', //ul
        tab:'tabView-tab',//li
    };

    //消除 重复的数据

    var eleminateDupli=function(arr,checkIndex){

        if($.isArray(arr) && arr.length>0 ){
            checkIndex=arguments[1];
            checkIndex= (checkIndex) ? checkIndex : 0;
            var a=[].slice.call(arr,0,checkIndex+1), b=[].slice.call(arr,checkIndex+1,arr.length);
            var checkItem=arr[checkIndex];
            var i= 0, j=b.length-1;
            var first=[], second=[];

            while(i<=j){

                (i!=j)&&(checkItem.id) && (b[i].id) && (checkItem.id != b[i].id) && ( [].push.call(first,b[i]) );
                (i!=j)&& (checkItem.id) && (b[j].id) && (checkItem.id != b[j].id) && ( [].unshift.call(second,b[j]) );
                (i==j)&&(checkItem.id) && (b[i].id) && (checkItem.id != b[i].id) && ( [].push.call(first,b[i]) );
                i++;
                j--;
            }

            var resultArr= [].concat.call(a,first,second);
            checkIndex++;

            if (checkIndex<resultArr.length){
                return eleminateDupli(resultArr,checkIndex);
            }
            else{
                return resultArr;
            }
        }else{
            logError('checkDuplicatedID passed argument InsertData  is not array')}
    };

    var TabView=function(element,options){
        this.init(element,options);
    }

    TabView.prototype.init=function(element,options){
        this.settings= $.extend({},_default,options);

        if(options.isDataWritable){
            (this.settings.data)?  this.settings.data=options.data : logError('please passing the option with \'data\' property')
        }

        if(!this.settings.allowDuplicateId){
            this.settings.data=eleminateDupli(this.settings.data);
        }
        //当 多条数据 里设置 active=true 的话，设置最后一条数据为 active=true
        var hasActiveTab=false;
        for(var i=this.settings.data.length-1; i>=0;i--){
            if(hasActiveTab){
                this.settings.data[i].isActive=false;
            }else{

                if(!!this.settings.data[i].isActive){
                    hasActiveTab=true;
                    continue;
                }
            }
        }

        this.$element=$(element);

        //初始化 tab(=ListView= ul li li li)
        this.$tabs_UL=$(_html.ul);
        var _ulClass= this.settings.hasOwnCss? _cssClass.tabsHolder : (_cssClass.tabsHolder+' '+'nav nav-tabs');
        this.$tabs_UL.addClass(_ulClass);

        //初始化 panels
        this.$panels_DIV=$(_html.div);
        this.$panels_DIV.addClass(_cssClass.panelsHolder);
        (!this.settings.hasOwnCss) && this.$panels_DIV.addClass('tab-content'); //style

        this.$element.append(this.$tabs_UL).append(this.$panels_DIV);
        this.render(this.settings.data);
    }

    //构建 tabview
    TabView.prototype.render=function(data){


        //根据数据源来判断，到底着呢麽来处理数据
        if($.isArray(data)){

            var _this=this;

            $.each(data, $.proxy(function(index,itemContent){

                //加载 数据  tab(=ListView= ul li li li)
                var $a=$(_html.a).append(itemContent.tab)

                var $span_icon=$(_html.span).append('X');

                var isActive=itemContent.isActive? 'active':'';

                var $li=$(_html.li)
                    .addClass(isActive)
                    .addClass(_cssClass.tab)
                    .attr('id','tab-'+itemContent.id)
                    .append($a)
                    .append($span_icon);

                this.$tabs_UL.append($li);



                //加载 数据 pannel=div
                var $panel=$(_html.div)
                    .addClass(_cssClass.panel)
                    .attr('id',('panel-'+itemContent.id))
                    .append(itemContent.panel);
                (!this.settings.hasOwnCss) && $panel.addClass('tab-pane');
                (itemContent.isActive) && $panel.addClass('active');
               // (!this.settings.hasOwnCss) && $panel.addClass('tab-pane');
                this.$panels_DIV.append($panel);

                //点击关闭按钮

                $span_icon.on('click',function(evt){
                    _this.deleteItem(itemContent.id);

                });


            },this));


            //点击 tab, show .$panels_DIV's 里的element
            this.$element.on('click','li.'+_cssClass.tab, $.proxy(function(evt){
                this.$element.find('li').removeClass('active');
                this.$panels_DIV.find('.'+_cssClass.panel).removeClass('active');

                if(evt.target.tagName==="A"){
                    $(evt.target).parent().addClass('active');
                    var id='panel-' + $(evt.target).parent().attr('id').split('-')[1];
                    this.$panels_DIV.find('.'+_cssClass.panel).removeClass('active');
                    this.$panels_DIV.find('#'+id).addClass('active');
                }
            },this));

            this.setTabsPanelHeight();
            $(window).resize(function(){
                _this.setTabsPanelHeight();
            });

        }else(logError('please passing a array for render of tabView'))
    };


    //插入 新的 item
    TabView.prototype.insert=function(InsertData){

        var oLength;
        var _this=this;
        if($.isArray(InsertData.data)){

            if(!this.settings.allowDuplicateId){
                //如果不允许重复的ID插入，则 先过滤插入的数组，有没有重复的id的项。
                InsertData.data = eleminateDupli(InsertData.data);
            }
            //记住 原有  tabview里数据长度
            oLength=this.settings.data.length;

            //如果是新插入的数据: 只有一条，并tabview id 已经存在
            if(InsertData.data.length=1){
                for(var i= 0, l=this.settings.data.length; i<l;i++)
                    if(this.settings.data[i].id==InsertData.data[0].id){


                        _this.$element.find('li').removeClass('active');
                        _this.$element.find('#tab-'+this.settings.data[i].id).addClass('active');


                        _this.$panels_DIV.find('.'+_cssClass.panel).removeClass('active');
                        _this.$panels_DIV.find('#panel-'+this.settings.data[i].id).addClass('active');
                        return;
                    }

            }


            // 拼接 原有  tabview里数据 和 新插入的数据
            var tempArr=[].concat.call(this.settings.data,InsertData.data);

            if(!this.settings.allowDuplicateId){
                // 过滤相同的 id 的项
                tempArr=eleminateDupli(tempArr);
            }

            this.render( [].slice.call(tempArr,oLength,tempArr.length));
            this.settings.data=tempArr;

        }else if(typeof InsertData==='object'){

            [].push.call(this.settings.data,InsertData);
            oLength=this.settings.data.length;

            if(!this.settings.allowDuplicateId){

                this.settings.data=  eleminateDupli(this.settings.data);
                (oLength==this.settings.data.length) && this.render([InsertData])
            }else
            {
                this.render([InsertData]);
            }



        }


        this.initActive();
    };




    TabView.prototype.deleteItem=function(ID){
        var _this=this, activeID;
        //在移除前设置 focus
        var $currentTab= this.$tabs_UL.find( '#tab-'+ID),
            $currentPanel=this.$panels_DIV.find('#panel-'+ID),
            $focusTab=undefined;

        //check the if the closing tab is on active , 如果是active在关闭前设置 前面一个为active, 如果关闭的tab是第一个，那就设置下一个。
        if($currentTab.hasClass('active')){
            $focusTab=($currentTab.prev('.tabView-tab').length>0)?
                $currentTab.prev('.tabView-tab') : ($currentTab.next('.tabView-tab').length>0 ?$currentTab.next('.tabView-tab'): undefined );
        }

        if($focusTab !=undefined && $focusTab.length>0){
            activeID= $focusTab.attr('id').split('-')[1];
            this.setActive(activeID);
        }


        //if( $currentTab.prev('.tabView-Holder').length>0 && $currentPanel.prev('.tabView-panel').length>0){
        //
        //}else if($currentTab.next('.tabView-Holder') && $currentPanel.next('.tabView-panel').length>0){
        //
        //}



        //移除 element
        $currentTab.remove();
        $currentPanel.remove();
        //移除数据
        $.each(_this.settings.data,function(index,item){
            if(item.id==ID){

                var arr1= [].slice.call(_this.settings.data,0,index);
                var arr2= [].slice.call(_this.settings.data,index+1,_this.settings.data.length);
                _this.settings.data=[].concat.call(arr1,arr2);
            }
        });
        this.setTabsPanelHeight();
    };

    //Tabview.prototype.update()

    TabView.prototype.initActive=function(){
        var hasActiveTab=false;
        var activeID='';
        for(var i=this.settings.data.length-1; i>=0;i--){
            if(hasActiveTab){
                this.settings.data[i].isActive=false;
            }else{

                if(!!this.settings.data[i].isActive){
                    hasActiveTab=true;
                    activeID=this.settings.data[i].id;
                    continue;
                }
            }
        }

        this.setActive(activeID);


    }

    TabView.prototype.setActive=function(activeID){
        this.$tabs_UL.find('li').removeClass('active');
        this.$panels_DIV.find('.'+_cssClass.panel).removeClass('active');


        this.$tabs_UL.find('#tab-' +activeID).addClass('active');
        this.$panels_DIV.find('#panel-'+activeID).addClass('active');
    };

    TabView.prototype.setTabsPanelHeight=function(){
        var eleHeight=this.$element.height();
        var ulHeight=this.$tabs_UL.height();
        this.$panels_DIV.height(eleHeight-ulHeight);
    }


    TabView.prototype.removeAllItem=function(){

        this.$element.empty();

        this.$element=null;
        this.$panels_DIV=null;
        this.$tabs_UL=null;

    }


    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };
    // listView PLUGIN DEFINITION ListView 插件定义 写入Jquery prototype
    // ==========================
    $.fn[pluginName]=function(options,args){
        window.console &&(this.length<1)&& console.log('没有元素被选中');
        return this.each(function(){
            var oldTabView= $.data(this,pluginName);
            if(!oldTabView){

                // new ListView(this,options);
                var newTabView= new TabView(this,options);
                $.data(this,pluginName,newTabView);
            }else{
                if(typeof options==='string'){
                    if(!oldTabView){

                        logError("the ListView hasn't been initialised, "+ options+"方法不能被调用");

                    } else if(!$.isFunction(oldTabView[options])){

                        logError(options + '这个方法不存在');
                    }else{
                        if (!(args instanceof Array)) {
                            args = [ args ];
                        }
                        oldTabView[options].apply(oldTabView,args);
                    }

                }
                else if(typeof options ==='object'){
                    if( $.isArray(options.data) ){
                        oldTabView.insert.call(oldTabView,options);
                    }

                }
            }


        });
    };



    // DROPDOWN NO CONFLICT 没有冲突检查（是否有其他插件叫 listView）
    // ====================
    //var old= $.fn[pluginName];
    //$.fn[pluginName].noConflict=function(){
    //    $.fn[pluginName] = old;
    //    return this;
    //}

})(jQuery, window,document);