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
        this.$form=$(form);
        this.init();
    };
    $.validator.format = function( source, params ) {
        if ( arguments.length === 1 ) {
            return function() {
                var args = $.makeArray( arguments );
                args.unshift( source );
                return $.validator.format.apply( this, args );
            };
        }
        if ( params === undefined ) {
            return source;
        }
        if ( arguments.length > 2 && params.constructor !== Array  ) {
            params = $.makeArray( arguments ).slice( 1 );
        }
        if ( params.constructor !== Array ) {
            params = [ params ];
        }
        $.each( params, function( i, n ) {
            source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
                return n;
            } );
        } );
        return source;
    };

    //插件 主定义
    $.extend($.validator,{
       //插件 实例方法，属性
        prototype : {
           constructor: $.validator,
            init: function(){

                //需要被验证的元素，里面储存的是 {element: jquery 元素 ,ClassName4Rules:'', rules:object,valid:false}
                this.validateCache=[];
                this.invalidElements={};
                this.ClassNameOfRules=this.settings.rules;




                this.initValidateEleCache(); //初始化  this.validateCache=[];
                this.subEvent();


            },
            //初始化  this.validateCache=[];
            initValidateEleCache:function(){
                for(var key in this.ClassNameOfRules ){
                    if(this.$form.find('input[name='+ key+']').length && this.$form.find('input[name='+ key+']').length>0){

                        this.validateCache.push({
                            element: this.$form.find('input[name='+ key+']')[0],
                            ClassName4Rules:key,
                            rules: this.ClassNameOfRules[key],
                            isValid:false,
                            errorMsg:[]
                        });
                    }



                }

            },

            isInValidateCache:function(element){

                for(var i= 0, l=this.validateCache.length; i<l; i++){
                   if( element.isSameNode(this.validateCache[i].element)){
                       return this.validateCache[i];
                   }
                }


            },

            subEvent:function(){
                var validator=this;
                this.unSubevent();
                this.$form.on("focusin focusout keyup",
                    ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox'], [contenteditable]",
                    eventHandler);
                function eventHandler(event){
                    var evetType=event.type;
                    if(typeof validator.settings['on'+evetType] ==='function'){
                        validator.settings['on'+evetType].call(validator,this,event);
                    }
                }
            },

            unSubevent:function(){
                var events=$._data(this.$form[0],'events');
                for(var key in events){
                    this.$form.off(key);
                }

            },
            // return value of  element(input)
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

            findElements:function(){
                // Select all valid inputs inside the form (no submit or reset buttons)
                return this.$form.find('input, textarea, select,[contenteditable]')
                    .not(":submit, :reset, :image, :disabled")
                    .not(this.settings.ignore);
            },

            check:function(elementFromCache){
                var element= elementFromCache.element,
                 value = this.elementValue(elementFromCache.element),
                    validFlag=true;
                //清空 errorMsg, 为新验证错误准备
                elementFromCache.errorMsg=[];

                for(var rule in elementFromCache.rules){

                    if(typeof $.validator.methods[rule]==='function'){
                        //如果 其中一个，验证出错，则改变 验证旗为false，同时推入错误信息
                      if( ! $.validator.methods[rule].call(this,value,element,elementFromCache.rules[rule]) ){

                          validFlag=false;
                          if( $.validator.messages[rule]  ){

                             if( typeof $.validator.messages[rule]==='string' ){
                                 ( elementFromCache.errorMsg.push($.validator.messages[rule]) );
                             }
                              if( typeof $.validator.messages[rule]==='function'){
                                var parameters= $.isArray(elementFromCache.rules[rule])? elementFromCache.rules[rule] : [elementFromCache.rules[rule]];
                                elementFromCache.errorMsg.push( $.validator.messages[rule].apply(this,parameters)  ) ;
                              }

                          }else{
                              console.log('input[name='+ elementFromCache.ClassName4Rules +'] :找不到对应的错误msg');
                          }

                      }
                    }else{
                        console.log('input[name='+ elementFromCache.ClassName4Rules +'] :没有'+ rule+'此验证方法');
                    }

                }
                // 经过上面的循环，检查 validFlag 有没有变成 false
                elementFromCache.isValid=validFlag;

            },

            checkAll:function(){
                var _this=this;
                $.each(this.validateCache,function(index,each){
                    _this.check(each.element);
                });

            },

            showOremoveErrorOnPage:function(elementFromCache){
                // 如果没有通过
                this.check(elementFromCache);
                if(! elementFromCache.isValid){

                    if (elementFromCache.errorMsg[0]){
                        $(elementFromCache.element).parent().find('.errorPlacement').remove();

                        $(elementFromCache.element).parent().append('<div class="errorPlacement">'+elementFromCache.errorMsg[0]+'</div>');
                        $(elementFromCache.element).addClass('errorInput');
                    }else{
                        console.log('啊，没有errorMsg?');
                    }


                }else{
                    //如果通过
                    $(elementFromCache.element).parent().find('.errorPlacement').remove();
                    $(elementFromCache.element).removeClass('errorInput');
                }
            },

            showOremoveAllErrorOnPage:function(){
                var _this=this;
                $.each(this.validateCache,function(index,item){
                    _this.showOremoveErrorOnPage(item);
                });
            },

            isAllValid:function(){

                if(this.validateCache.length<1){
                    return true;
                }else{
                    for(var i= 0, l=this.validateCache.length; i<l; i++){
                        if (this.validateCache[i].isValid==false){
                            return false;
                        }
                    }
                }
                return true;
            },






            // 来自 jquery.validate
            checkable: function( element ) {
                return ( /radio|checkbox/i ).test( element.type );
            },

            // 来自 jquery.validate
            getLength: function( value, element ) {
                switch ( element.nodeName.toLowerCase() ) {
                    case "select":
                        return $( "option:selected", element ).length;
                    case "input":
                        if ( this.checkable( element ) ) {
                            return this.findByName( element.name ).filter( ":checked" ).length;
                        }
                }
                return value.length;
            },


        },

        //插件 静态方法，属性
        defaults:{
            debug:false,
            rules:{},
            ignore: ":hidden",
            onfocusin:undefined,
            onfocusout:function(element,event){
                var elementFromCache=this.isInValidateCache(element);
                if ( elementFromCache  ){
                    //去这里面检验是否通过 验证
                    this.check(elementFromCache);
                    //验真完，在页面上画出来，或移走ErrorMsg
                  this.showOremoveErrorOnPage(elementFromCache);
                }

            },

            errorPlacement:function(){

            },
            onkeyup:function(element,event){
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

                if ( event.which === 9 && this.elementValue( element ) === "" || $.inArray( event.keyCode, excludedKeys ) !== -1 ) {
                    return;
                } else  {
                    // 这个 input是不是 有验证要求的。
                    var elementFromCache=this.isInValidateCache(element);
                    if ( elementFromCache  ){
                        //去 这里面检验是否通过 验证
                        this.check(elementFromCache);
                    }
                }

            },





        },

        methods:{
            required: function( value, element , param) {

                if ( element.nodeName.toLowerCase() === "select" ) {

                    // Could be an array for select-multiple or a string, both are fine this way
                    var val = $( element ).val();
                    return val && val.length > 0;
                }
                if ( this.checkable( element ) ) {
                    return this.getLength( value, element ) > 0;
                }
                return value.length > 0;
            },

            minlength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : this.getLength( value, element );
                return  length >= param;
            },

            // http://jqueryvalidation.org/maxlength-method/
            maxlength: function( value, element, param ) {
                var length = $.isArray( value ) ? value.length : this.getLength( value, element );
                return  length <= param;
            },

            largerthan: function(value, element, param){
               var isNumber= /^-?\d+\.?\d*$/.test(value);
                return (  isNumber && parseFloat(value)>parseFloat(param) );
            },

            lessthan: function(value, element, param){
                var isNumber= /^-?\d+\.?\d*$/.test(value);
                return (  isNumber && parseFloat(value)>parseFloat(param) );
            },
            numberInRange: function(value, element, param){
                var isNumber= /^-?\d+\.?\d*$/.test(value);
                {
                    return (  isNumber && parseFloat(value)>parseFloat(param[0]) && parseFloat(value)>parseFloat(param[1]) );
                }
            }



        },
        messages: {
            required: "必填项",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date ( ISO ).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: function(parameter){
                return "请不要超过"+parameter+"个字";
            },
            minlength: function(parameter){
                return "请不要少于"+parameter+"个字";
            },

            largerthan: function(parameter){
                return "请输入大于" +parameter + "数字";
            },

            lessthan: function(parameter){
                return "请输入小于" +parameter + "数字";
            },
            numberInRange: function(parameter){
                return "请输入 "+parameter[0]+' 和 '+parameter[1]+' 之间的数字'
            }

        },




        setDefaults:function(settings){
            $.extend($.validator.defaults,settings);
        },





    });

    //插件定义---->End


    //插件外部接口
    $.extend($.fn,{
        validateX : function(options){
            var old, newValidator,result;
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
                    result=old;
                }

            });

            return result|| this;

        },
        valid:function(){},
        rules:function(){




        }
    });
/*****************/
// 验证插件---->结束
/* ****************/

});