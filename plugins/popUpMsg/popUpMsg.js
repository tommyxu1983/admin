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
        message:'',
        container:undefined,

    };
    var PUMsg=function(options){
        this.$element=$(element);
        this.settings= $.extend(true,{},_default,options);
    }



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

    if(typeof window != undefined){
        window[pluginName]= PUMsg;
    }





});