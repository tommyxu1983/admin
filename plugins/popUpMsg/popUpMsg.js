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
    var pluginName='popUpMsg';
    var _default={
        /*overLay:true,*/
        successMsg:'',
        overLayMsg:'',
        container:undefined,

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
                this.$msgDiv=$('<div>'+ this.settings.successMsg +'</div>').addClass('popUpMsg-msgTip');
                this.$overLay=$('<div><div style="margin-top:49%; margin-left:48%;">加载中</div></div>').addClass('popUpMsg-overlay');
            },



            hasContainer:function(){
               return this.settings.container != undefined? true: false;
            },

            showLoading:function(){
                if(this.hasContainer()){
                    this.$container.append(this.$overLay);
                }else{
                    $('body').append(this.$overLay);
                }

                this.$overLay.show('slow');
            },

            removeLoading:function(){
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
            }

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