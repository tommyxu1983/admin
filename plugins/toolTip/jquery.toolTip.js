/**
 * Created by Administrator on 2016/7/30.
 */

+function(factory){
    if(typeof define==='function' && define.amd ){define(['jquery'],factory);}
    else if(typeof module==='object' && module.exports){module.exports=factory(require('jquery'));}
    else{factory(jQuery);}

}(function($,undefined){



    function ToolTip(options, element){
        this.settings= $.extend(true,{},ToolTip.defaults,options);
        this.$element=$(element);
        this.$tt=$('<div style="display: none"></div>'); // toolTip container

        this.init();
    }

    $.extend(ToolTip,{
        prototype:{
            constructor: ToolTip,

            init:function(){
                this.subEvents();

                this.$tt.append(this.settings.tpTemplate);
                this.$tt.appendTo('body');
            },

            unSubEvents:function(){
                this.$element.off('hover');

            },
            subEvents:function(){
                var _this=this;
                this.unSubEvents();

                this.$element.on('onmouseover',function(){
                    $.proxy(_this.show(),_this);
                });

                this.$element.on('onmouseout',function(){
                    $.proxy(_this.hide(),_this);
                });
            },

            show:function(){
                this.$tt.show();
            },

            hide:function(){
                this.$tt.hide();
            },

            getElePosition:function(){
                var dist2Top =  this.$element[0].getBoundingClientRect().top,
                    dist2Left = this.$element[0].getBoundingClientRect().left;

                return {top:dist2Top,left:dist2Left}
            },

            updateToolTipPostion:function(){
                var ElementXY= this.getElePosition(),
                 elementWidth= this.$element[0].offsetWidth,
                    elementHeight=this.$element[0].offsetHeight,
                    ttHeight=this.$tt[0].offsetWidth,
                    ttWidth=this.$tt[0].offsetWidth,
                    ttTop,ttLeft;



                if(  ( ElementXY.left + elementWidth/2)< ttWidth  ){
                    // 在元素的 左边 中部
                    ttLeft=ElementXY.left+ elementWidth+ 25;
                    ttTop=ElementXY.top + elementHeight/2

                }else if( (window.document.getBoundingClientRect().left-ElementXY.left - elementWidth)< ttWidth ){
                    //在元素的 右边 中部
                    ttLeft=ElementXY.left - 25;
                    ttTop=ElementXY.top + elementHeight/2
                }else {

                    //如果 Tooltip height + 50px > elment 到 视窗顶部的距离， toolTip放在element 下面
                    ttLeft= ElementXY.left + elementWidth/2 - ttWidth/2;
                    ttTop=  ttHeight+50>ElementXY.top? (ElementXY.top+25) : ( ElementXY.top + elementHeight +25 );

                }


              this.$tt.css({'position':'fixed','top':ttTop,'left':ttLeft});






            }

        },


        defaults:{
            tpTemplate:'<div class="toolTipX"  >TOOLTIP</div>'
        }






    });





    $.extend($.fn, {
        toolTip: function(options){

            var old, newToolTip, result;

            $.each(this, function(index, eachDom){
                if(! $(eachDom).length){
                    if ( options && options.debug && window.console ) {
                        console.warn( "Nothing selected, can't validate, returning nothing." );
                    }
                    return;
                }

                old= $.data(eachDom,'toolTip');
                if(! old){
                    newToolTip= new ToolTip(options,eachDom);
                    $.data(eachDom,'toolTip',newToolTip);
                    result=newToolTip;
                }else{
                    result=old;
                }



            });


            //如果
            return result || this;



        }
    });






});