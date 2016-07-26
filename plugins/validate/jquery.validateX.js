/**
 * Created by Administrator on 2016/7/26.
 */

+function(factory){

    //模块化
    if(typeof define==='function' && define.amd){
        define(['jquery'],factory);
    }else if(typeof module === "object" && module.exports){
        module.exports = factory( require( "jquery" ) );
    }else{
        factory(jQuery);
    }


}(function($,undefined){
/*****************/
// 验证插件---->开始
/* ****************/


    var pluginName='validateX';


    //插件定义---->start

    //插件 构造函数  constructor(validator)
    $.validator =function(options,form){
        this.settings= $.extend(true,{}, $.validator.defaults,options);
        this.$currentForm=$(form);
        this.init();
    };

    //插件 主定义
    $.extend($.validator,{
       //插件 实例方法，属性
        prototype : {
           constructor: $.validator,
            init: function(){
                this.subEvent();
            },

            subEvent:function(){
                var validator=this;
                this.unSubevent();
                this.$currentForm.on("focusin focusout keyup",
                    ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox'], [contenteditable]",
                    eventHandler);
                function eventHandler(event){
                    var evetType=event.type;
                    if(typeof validator.settings['on'+evetType] ==='function'){
                        validator.settings['on'+evetType].call(this,event,validator);
                    }
                }
            },

            unSubevent:function(){
                var e=$._data(this.$currentForm[0],'events');
                for(var k in e){
                    this.$currentForm.off(k);
                }

            },

            elementValue:function( element ) {
                var $element = $( element ),
                    type = element.type,
                    val, idx;

                if ( type === "radio" || type === "checkbox" ) {
                    return this.findByName( element.name ).filter( ":checked" ).val();
                } else if ( type === "number" && typeof element.validity !== "undefined" ) {
                    return element.validity.badInput ? "NaN" : $element.val();
                }

                if ( element.hasAttribute( "contenteditable" ) ) {
                    val = $element.text();
                } else {
                    val = $element.val();
                }

                if ( type === "file" ) {

                    // Modern browser (chrome & safari)
                    if ( val.substr( 0, 12 ) === "C:\\fakepath\\" ) {
                        return val.substr( 12 );
                    }

                    // Legacy browsers
                    // Unix-based path
                    idx = val.lastIndexOf( "/" );
                    if ( idx >= 0 ) {
                        return val.substr( idx + 1 );
                    }

                    // Windows-based path
                    idx = val.lastIndexOf( "\\" );
                    if ( idx >= 0 ) {
                        return val.substr( idx + 1 );
                    }

                    // Just the file name
                    return val;
                }

                if ( typeof val === "string" ) {
                    return val.replace( /\r/g, "" );
                }
                return val;
            },
        },

        //插件 静态方法，属性
        defaults:{
            debug:false,
            onfocusin:undefined,
            onfocusout:undefined,
            onkeyup:function(event,validator){
                // Avoid revalidate the field when pressing one of the following keys
                // Shift       => 16
                // Ctrl        => 17
                // Alt         => 18
                // Caps lock   => 20
                // End         => 35
                // Home        => 36
                // Left arrow  => 37
                // Up arrow    => 38
                // Right arrow => 39
                // Down arrow  => 40
                // Insert      => 45
                // Num lock    => 144
                // AltGr key   => 225
                var excludedKeys = [
                    16, 17, 18, 20, 35, 36, 37,
                    38, 39, 40, 45, 144, 225
                ];


            }
        },
        setDefaults:function(settings){
            $.extend($.validator.defaults,settings);
        }





    });

    //插件定义---->End


    //插件外部接口
    $.extend($.fn,{
        validateX : function(options){
            var old, newValidator;
            $.each(this,function(index, eachDom){
                if(! $(eachDom).length){
                    if ( options && options.debug && window.console ) {
                        console.warn( "Nothing selected, can't validate, returning nothing." );
                    }
                    return;
                }


                // Add novalidate tag if HTML5.
                $(eachDom).attr( "novalidate", "novalidate" );

                old= $.data(eachDom,pluginName);
                if(! old){
                    newValidator= new $.validator(options,eachDom);
                    $.data(eachDom,pluginName,newValidator);
                }else{
                    return old;
                }


            });


        },
        valid:function(){},
        rules:function(){}
    });
/*****************/
// 验证插件---->结束
/* ****************/

});