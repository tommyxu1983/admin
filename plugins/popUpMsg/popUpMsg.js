/**
 * Created by Administrator on 2016/8/1.
 */




+function(factory){
    if(typeof define==='function' && define.amd ){
        define(['jquery'],factory);
    }else if(typeof module==='object' && module.exports){
        module.exports=factory(require('jquery'));
    }
    else{
        factory(jQuery, undefined);
    }



}(function($,undefined ){

    //define your jquery plugin here
    var pluginName='PUMsg';
    var _default={
        /*overLay:true,*/
        successMsg:'',
        errorMsg:'',
        overLayMsg:'',
        overLayUltimateTime:undefined, // miliSeconds
        onOverLayUltimate:undefined, // function
        container:undefined, //在某个元素内显示  successMsg errorMsg overLayMsg， 没定义的话，在body里显示
        popUpTarget: undefined,
        tooTipMsg:'',

    };
    var PUMsg=function(options){

        this.settings= $.extend(true,{},_default,options);
        this.init();

    }

    $.extend(PUMsg,{
        prototype:{
            constructor: PUMsg,

            init:function(){

                this.$container=$(this.settings.container);
                this.popUpTarget=$(this.settings.popUpTarget);
                this.$msgDiv=$('<div>'+ this.settings.successMsg +'</div>').addClass('popUpMsg-msgTip');
                this.$overLay=$('<div><div class="overLayMsg" >加载中</div></div>').addClass('popUpMsg-overlay');
                this.$toolTipMsg=$('<div>'+ this.settings.tooTipMsg +'</div>').addClass('popUpMsg-toolTip');

                this.$msgDivWClose=$(
                    '<div>'+
                    '<div class="errorMsg"></div>'+
                    '<span class="errorTipClose">x</span>'+
                    '</div>'
                ).addClass('popUpMsg-errorTip');


                this.subEvents();

            },

            subEvents:function(){
                var me=this;
                this.offEvents();

                this.$msgDivWClose.find('.errorTipClose').on('click',function(){
                    me.removeErrorMsg();
                });

                //popUpTarget event
                if(this.popUpTarget && this.popUpTarget){
                    this.popUpTarget.on('mouseover mouseout',function(event){
                        if(event.type=='mouseover'){
                            me.showToolTip();
                        }else if(event.type == 'mouseout'){
                            me.removeToolTip();
                        }


                    });
                }


                // onOverLayUltimate
                if(typeof this.settings.onOverLayUltimate==='function'){
                    this.$overLay.on('onOverLayUltimate',this.settings.onOverLayUltimate);
                }
            },

            offEvents:function(){
                this.$msgDivWClose.find('.errorTipClose').off('click');
                this.popUpTarget.off('mouseover');
                this.popUpTarget.off('mouseout');
                this.$overLay.off('onOverLayUltimate');
            },

            hasContainer:function(){
               return this.settings.container != undefined? true: false;
            },

            showOverLay:function(){
                var me=this;
                if(this.hasContainer()){
                    this.$container.append(this.$overLay);
                }else{
                    $('body').append(this.$overLay);
                }
                this.$overLay.show();

                if(this.settings.overLayUltimateTime){
                    setTimeout(function(){

                        me.$overLay.trigger('onOverLayUltimate',[me]);
                        me.$overLay.remove();

                    },me.settings.overLayUltimateTime);
                }

            },

            removeOverLay:function(){
                this.$overLay.remove();
            },

            showSuccMsg:function(milliSecond){
                var me=this;
                if(this.hasContainer()){
                    this.$container.append(this.$msgDiv);
                }else{
                    $('body').append(this.$msgDiv);
                }

                this.$msgDiv.show();

                if(milliSecond){
                    setTimeout(function(){me.$msgDiv.remove()},milliSecond);
                }else{
                    setTimeout(function(){me.$msgDiv.remove()},2000);
                }

            },

            removeSuccMsg:function(){
                this.$msgDiv.remove();
            },

            setSuccMsg:function(msg){
                this.$msgDiv.empty();
                this.$msgDiv.append(msg);
            },

            setOverLayMsg:function(msg){
                this.$overLay.empty();
                this.$overLay.append(msg);
            },

            setErrorMsg:function(msg){
                this.$msgDivWClose.find('.errorMsg').empty();
                this.$msgDivWClose.find('.errorMsg').append(msg);
            },

            showErrorMsg:function(milliSecond){
                var me=this;
                this.$msgDivWClose.remove();

                if(this.hasContainer()){
                    this.$container.append(this.$msgDivWClose);
                }else{
                    $('body').append(this.$msgDivWClose);
                }
                this.$msgDivWClose.show();
                this.subEvents();

                if(milliSecond){
                    setTimeout(function(){me.$msgDivWClose.remove()},milliSecond);
                }
            },

            removeErrorMsg:function(){
                this.$msgDivWClose.remove();
            },

            setToolTipMsg:function(msg){
                this.$toolTipMsg.append(msg)
            },

            showToolTip:function(){
                $('body').append(this.$toolTipMsg);
                this.updateToolTipPosition();

                this.$toolTipMsg.show();

            },

            removeToolTip:function(){
                this.$toolTipMsg.remove();
            },

            updateToolTipPosition:function(){
                var ElementXY=  PUMsg.getElePosition(this.popUpTarget[0]),
                    elementWidth= this.popUpTarget[0].offsetWidth,
                    elementHeight=this.popUpTarget[0].offsetHeight,
                    msgHeight=this.$toolTipMsg[0].offsetHeight,
                    msgWidth=this.$toolTipMsg[0].offsetWidth,
                    bodyWidth=$('body')[0].clientWidth,
                    msgTop,msgLeft;


                //if 按钮 element.top > msg.Height + 25px, 则 msgTop=element.top +10px,  else 显示在底部 msgTop=element.top+ elemnt.height + 10px.
                if(ElementXY.top > msgHeight+25){
                    msgTop= ElementXY.top-msgHeight - 10;
                }else{
                    msgTop=ElementXY.top+ elementHeight + 10;
                }


                //if  element.left + element.width/2 < 提示消息框宽度/2, msgLeft=element.left;
                //if element.right(body.width- element.left- element.width) < 提示消息框宽度/2, msgLeft= element.left + element.width-msg.Width
                //else  则 msgLeft= element.left + elementWidth/2（显示在 button中部)
                if(ElementXY.left + elementWidth/2 < msgWidth/2 ){
                    msgLeft=ElementXY.left;
                }else if(bodyWidth- ElementXY.left -elementWidth < msgWidth/2 ){
                    msgLeft= ElementXY.left + elementWidth-msgWidth;
                }else{
                    msgLeft= ElementXY.left + elementWidth/2 - msgWidth/2;
                }

                this.$toolTipMsg.css({'position':'fixed','top':msgTop + 'px','left':msgLeft +'px'});

            }



        },


        getElePosition:function(element){
            var dist2Top =  element.getBoundingClientRect().top,
                dist2Left = element.getBoundingClientRect().left;
            return {top:dist2Top,left:dist2Left}
        }



    });



   /* $.fn[pluginName]= function(options){

        var old, newPlugin, result;

        $.each(this, function(index, eachDom){
            if(! $(eachDom).length){
                if ( options && options.debug && window.console ) {
                    console.warn( "Nothing selected, can't validate, returning nothing." );
                }
                return;
            }

            old= $.data(eachDom,'toolTip');
            if(! old){
                newPlugin= new PUMsg(options,eachDom);
                $.data(eachDom,'toolTip',newPlugin);
                result=newPlugin;
            }else{
                result=old;
            }



        });


        //如果
        return result || this;
    }*/

    if( window != undefined){

        window[pluginName]= PUMsg;
    }





});