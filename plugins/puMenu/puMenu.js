/**
 * Created by Administrator on 2016/8/6.
 */

+function(factory){


    if(typeof define ==='function' && define.amd ){
        define(['jquery'], factory);
    }
    else if (typeof module==='object' && module.exports){
        module.exports=factory(require('jquery'));
    }
    else{

        if (typeof jQuery !== 'function') {
            throw new Error('\'puMenu\' JavaScript requires jQuery')
        }else{
            factory(jQuery);
        }

    }

}(function($,undefined){

    var pluginName='PUMenu';
    var _default={
        data:undefined,
        direction:undefined, // 'down','up', 'left','right' 'left'
        activeEvent:'click', // to active the menu 'click' or 'hover'
        orientation:'down',
        calibration: '2', // 离 所选的，element多远
        onMenuItemClick:undefined
    };

    var html={
        div:'<div></div>',
        span:'<span></span>',
        ul:'<ul></ul>',
        li:'<li></li>',
        a:'<a></a>',
        span:'<span></span>'
    };

    var _orientation={
        left: 'left',
        right:'right',
        up:'up',
        down:'down'
    };

    var cssClass={
        menuContainer: pluginName + '-menuContainer',
        ul:  pluginName + '-ul',
        allMenuContainer:pluginName + '-allMenuContainer',
        menuActive: pluginName + '-active',
        overLay:pluginName + '-overLay'
    }

    var PUMenu=function (options,element ){
        this.settings= $.extend(true,{},_default,options);
        this.$element=$(element);
        this.flatMenuCache=[];
        this.$allMenuContainer=$(html.div).addClass(cssClass.allMenuContainer);
        this.$overLay=$(html.div).addClass(cssClass.overLay);
        this.init();
    }


    $.extend( PUMenu,{
        prototype:{
            init:function(){
                //把 多层 this.rootData展开，并且把array 层数打上记号
                this.flatMenuData(this.settings.data,0,-1);

                $('body').append(this.$allMenuContainer);
                this.$allMenuContainer.append(this.$overLay);
                this.subEvents();
            },

            subEvents: function(){
                var me=this;
                this.offEvents();

                if(this.settings.activeEvent=='click'){
                    this.$element.on(this.settings.activeEvent,'',me,me.rootMenuOnOffHandler);
                }else if(this.settings.activeEvent=='hover'){
                    this.$element.on('mouseenter','',me,me.rootMenuOnOffHandler);
                    this.$element.on('mouseleave','',me,me.rootMenuOnOffHandler);
                }

                this.$overLay.on('click',function(){
                    me.rootMenuHide.call(me);
                });

                if(typeof this.settings.onMenuItemClick==='function'){
                    this.$element.on('onMenuItemClick', this.settings.onMenuItemClick)
                }

              /*  this.$element.on('mouseover', 'li a.arrow', function(event){
                    var jj = this;
                    var kk=event;
                    var ll
                });*/
            },

            offEvents:function(){
                this.$element.off(this.settings.activeEvent);
                this.$element.off('onMenuItemClick');
            },

            rootMenuOnOffHandler:function(event){
                var me=event.data; //通过 $.on 第三个函数传递进来；

                if(event.type=='click'){
                    if(me.$allMenuContainer.hasClass(cssClass.menuActive)){
                        me.rootMenuHide.call(me);
                    }else{
                        me.rootMenuShow.call(me);
                    }
                }
                else if(event.type=='mouseenter'){
                    me.rootMenuShow.call(me);
                }
            },

            rootMenuShow:function(){
                this.$allMenuContainer.addClass(cssClass.menuActive);

                //如果已经创建了root menu(第一个menu),  那就show, 如果没有就用
                if(this.$allMenuContainer.find('div[data-menulevel=0].'+cssClass.menuContainer).length>0){
                    this.$allMenuContainer.find('div[data-menulevel=0].'+cssClass.menuContainer).show();
                }else{
                    var level0Menu = this.prepareMenuData(this.flatMenuCache,0,-1);
                    this.buildMenuHtml(level0Menu,this.$element,this.settings.orientation,this.settings.calibration);
                }

                this.$overLay.show();



            },
            rootMenuHide:function(){
                this.$allMenuContainer.find('div.'+cssClass.menuContainer).hide();
                this.$allMenuContainer.removeClass(cssClass.menuActive);
                this.$overLay.hide();
            },

            flatMenuData:function(array , level, upMenuIndex){
               // var upMenuIndex=index-1;

                for(var i= 0, l=array.length; i<l; i++){
                    if( array[i].menu && $.isArray(array[i].menu)  ){
                        /*upMenuIndex = upMenuIndex>=0 ?  upMenuIndex : 0;*/
                        var uid= PUMenu.uuid();

                        PUMenu.menuItemIndex++;
                        this.flatMenuCache.push({index:PUMenu.menuItemIndex,level:level,upMenuIndex:upMenuIndex,boundGUID:uid ,data:array[i]});
                        this.flatMenuData.call(this,array[i].menu, level+1, PUMenu.menuItemIndex);

                    }
                    else{
                        PUMenu.menuItemIndex++;
                        this.flatMenuCache.push({index:PUMenu.menuItemIndex,level:level,upMenuIndex:upMenuIndex ,data:array[i]});

                    }

                }
            },

            //准备 nth-层 数据
            prepareMenuData:function(menuArray,level,upMenuIndex,GUID){

                var thisLevelMenu= $.grep(this.flatMenuCache,function(item){
                    return item.level==level && item.upMenuIndex==upMenuIndex;
                });

                return {
                    upMenuIndex: upMenuIndex,
                    GUID: GUID,
                    menu:thisLevelMenu,
                    level:level
                };

            },

            buildMenuHtml:function(menuData,$toElement,orientation,calibration){

               /* var GUID=PUMenu.uuid();*/
                var me=this,
                    $menuContainer=$(html.div).addClass(cssClass.menuContainer);
                if(menuData.upMenuIndex>0 && menuData.GUID){
                    $menuContainer.attr({
                        'id':menuData.GUID,
                    });

                }

                $menuContainer.attr({
                    'data-menulevel':menuData.level,
                    'data-upMenuIndex':menuData.upMenuIndex
                });

               /* this.flatMenuCache.push({uid:GUID,});*/

                //画出html内容
                var  $menuUL=$(html.ul).add(cssClass.ul);
                $menuContainer.append($menuUL);

                if( $.isArray(menuData.menu) ) {
                    $.each(menuData.menu,function(index,item){
                        var data=item.data,
                         $li = $(html.li),
                            $a_text = $(html.a).addClass('text'),
                            $a_arrow=$(html.a).addClass('arrow');
                        $li.append($a_text);
                        $.data($li[0],'upInfo',item);

                        $a_text.attr('name', data.name);
                        $a_text.append(data.title);


                        //是有下级菜单的目录
                        if(data.menu && $.isArray(data.menu)){
                            $a_arrow.html('>');
                            $li.append($a_arrow);
                            $li.on('mouseover',function(event){
                                var upMenu = $.data(this,'upInfo'),
                                    thisMenuContainer= $(this).parents('.'+cssClass.menuContainer),
                                    currentLevel=thisMenuContainer.attr('data-menulevel'),
                                    allMenuContainers=me.$allMenuContainer.find('div.'+cssClass.menuContainer);

                                allMenuContainers.each(function(index,item){
                                   if( parseInt( $(item).attr('data-menulevel') ) > parseInt( currentLevel ) ){
                                       $(item).hide();
                                   }
                                });

                                if( $('#'+upMenu.boundGUID).length>0 ){

                                    $('#'+upMenu.boundGUID).show();
                                }
                                else{
                                    var menuArray=  me.prepareMenuData.call(me,me.flatMenuCache,parseInt(upMenu.level)+1,upMenu.index,upMenu.boundGUID);

                                    me.buildMenuHtml(menuArray, $(this),'right',1);
                                }
                            });
                        }



                        $li.on('click',function(event){
                            var menuItem = $.data(this,'upInfo')
                            me.$element.trigger('onMenuItemClick',[menuItem]);
                            me.$allMenuContainer.find('div').hide();
                        });


                        $menuUL.append($li);
                    });


                    switch(orientation){
                        case _orientation.left:
                            break;
                        case _orientation.right:
                            this.$allMenuContainer.append($menuContainer);
                            var menuTop= parseInt(PUMenu.eleToEdge($toElement[0]).top2Top),
                                menuLeft= parseInt(PUMenu.eleToEdge($toElement[0]).right2Left) +parseInt(calibration);

                            break;
                        case _orientation.down:

                            this.$allMenuContainer.append($menuContainer);
                            var menuTop= parseInt(PUMenu.eleToEdge($toElement[0]).bottom2Top) +parseInt(calibration),
                                menuLeft=PUMenu.eleToEdge($toElement[0]).left2Left;


                            break;
                    }

                    $menuContainer.css({'top': menuTop+'px',
                        'left':menuLeft+'px'

                    });

                    $menuContainer.show();



                }else{
                    throw new Error('menu data is not a array, can not build Menu');
                }

            },
        },

        //elemetn left edge to left of browser, right to left of browser, top to top, bottom to top of broswer
        eleToEdge:function(element){
            return  {
                left2Left: element.getBoundingClientRect().left,
                right2Left: element.getBoundingClientRect().left+element.offsetWidth,
                top2Top:element.getBoundingClientRect().top,
                bottom2Top: element.getBoundingClientRect().top + element.offsetHeight


            }
        },
        // orientation menu 朝什么方向跳出


        uuid:function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },

        menuItemIndex:-1,



    });


    $.fn[pluginName]=function(options){
        return $.each(this,function(index,domEle){

            var old=$.data(domEle, pluginName);

            if(!old){
                var newPUmenu = new PUMenu(options,this );
                $.data(domEle, pluginName, newPUmenu);
            }

        });
    };





});