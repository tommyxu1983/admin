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





