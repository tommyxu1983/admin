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
                var _this=this;
                //需要被验证的元素，里面储存的是 {element: jquery 元素 ,ClassName4Rules:'', rules:object,valid:false}
                this.validateCache=[];
                this.invalidElements={};
                this.ClassNameOfRules=this.settings.rules;

                //为 服务器 检验而建
                this.hasItemValidateOnServer=false;
                this.intervalID;


                this.initValidateEleCache(); //初始化  this.validateCache=[];



                this.subEvent();

                //为 服务器 检验而建
                if(this.hasItemValidateOnServer){
                    //第一次检查
                    setTimeout(function(){
                        _this.validateCache.forEach(function(each, index){
                            if(each.isValidateOnServer){
                                each.isValid=false;
                                _this.check(each);
                                each.value = each.element.value;
                            }
                        });
                    },500);


                    //第二次检查至n次（因为，用了 datapicker插件，任何原始事件不能被激发，只能靠扫描来检查）
                    _this.intervalID = setInterval(function(){
                        _this.validateCache.forEach(function(each, index){
                            if(each.isValidateOnServer && each.element.value != each.value){
                                each.isValid=false;
                                _this.check(each);
                                each.value= each.element.value;
                            }

                        });
                    },100);

                }


            },


            //初始化  this.validateCache=[];
            initValidateEleCache:function(){
                for(var key in this.ClassNameOfRules ){
                    if(this.$form.find('input[name='+ key+']').length && this.$form.find('input[name='+ key+']').length>0){

                       var  singleItem={
                                element: this.$form.find('input[name='+ key+']')[0],
                                ClassName4Rules:key,
                                rules: this.ClassNameOfRules[key],
                                isValid:false,
                                errorMsg:[],
                        };

                        if(this.ClassNameOfRules[key]['validateOnServer']){
                            singleItem.value=this.$form.find('input[name='+ key+']')[0].value;
                            singleItem.isValidateOnServer=true;
                            this.hasItemValidateOnServer=true;
                        }

                        this.validateCache.push(singleItem);


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

                //外部事件定义
                //用来定义 ajax 回服务器验证的规则
                if(typeof this.settings.onValidateAtServer === 'function'){
                    this.$form.on('onValidateAtServer',this.settings.onValidateAtServer);
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

            destroy:function(){
                this.unSubevent();
                clearInterval(this.intervalID);
            },

            check:function(elementFromCache){
                var element= elementFromCache.element,
                    value = this.elementValue(elementFromCache.element),
                    validFlag=true;
               // 如果去server 验证，但已经验证正确
                if(! (elementFromCache.isValidateOnServer && elementFromCache.isValid) ){
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
                }

                // 经过上面的循环，检查 validFlag 有没有变成 false
                elementFromCache.isValid=validFlag;
            },

            checkAll:function(){
                var _this=this;
                $.each(_this.validateCache,function(index,each){
                    _this.check(each);
                });

            },

            showOremoveErrorOnPage:function(elementFromCache){
                // 如果没有通过

                if(! elementFromCache.isValid){

                    if (elementFromCache.errorMsg[0]){
                        $(elementFromCache.element).parent().find('.errorPlacement').remove();

                        $(elementFromCache.element).parent().append('<div class="errorPlacement">'+elementFromCache.errorMsg[0]+'</div>');
                        $(elementFromCache.element).addClass('errorInput');
                    }else{
                        console.log('没有errorMsg?');
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
                    this.checkAll();
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

            onchange:function(element, event){

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
                        //去 这里面检验是否通过 验证9
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

            dateTime: function( value, element , param ){
               /* var isValidDateTime = /[0-3]\//.test(value);*/
                var YMD,
                    time,
                    //空格隔开 日期 和 时间
                    YYYYMMDD_Time= $.isArray(value.split(/\s/g) )? value.split(/\s/g) : [],
                    isFinalCorrect=true;

                if( YYYYMMDD_Time.length >= 2 ) {
                    //验证日期是否是正确
                        // 是否是 8888/88/88 格式
                    if(  /\d{4}\/\d{2}\/\d{2}/.test(YYYYMMDD_Time[0])  ){
                        YMD=YYYYMMDD_Time[0].split(/\//g);
                        var year = parseInt( YMD[0] ),
                            month =parseInt( YMD[1] ),
                            day = parseInt(YMD[2]);

                        //判断 年份 0001 - 9999
                        if(! (year>=1 && year<=9999) ){
                            isFinalCorrect=false;
                        }
                        //判断 月份 01-12
                        if(! (month>=1 && month<=12) ){
                            isFinalCorrect=false;
                        }

                        var normalYear4MaxDay={'01':31,'02':28,'03':31,'04':30,'05':31,'06':30,'07':31,'08':31,'09':30,'10':31,'11':30,'12':31}[YMD[1]];
                        var leapYear4MaxDay = {'01':31,'02':29,'03':31,'04':30,'05':31,'06':30,'07':31,'08':31,'09':30,'10':31,'11':30,'12':31}[YMD[1]];

                        //闰年
                        if( ( year % 4 == 0) && ( year % 100 != 0 ||  year % 400 == 0) )
                        {
                            if( ! (day>=1 && day <= leapYear4MaxDay) ){
                                isFinalCorrect=false;
                            }
                        }
                        //非闰年
                        else{
                            if( !  (day>=1 && day <= normalYear4MaxDay) ){
                                isFinalCorrect=false;
                            }

                        }

                    }
                    else{
                        isFinalCorrect=false;
                    }

                    //验证时间是否正确
                    if(! /([0-1][0-9]:[0-5][0-9])|([2][0-3]:[0-5][0-9])/.test(YYYYMMDD_Time[1]) ){
                        isFinalCorrect=false;
                    }

                }else{
                    isFinalCorrect=false;
                }
                return isFinalCorrect;
            },

            time: function( value, element , param ){
                //按照时间格式： 23：34
                var isTime = /([0-1][0-9]:[0-5][0-9])|([2][0-3]:[0-5][0-9])/.test(value);
                return isTime;
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
                    return (  isNumber && parseFloat(value)>parseFloat(param[0]) && parseFloat(value)<parseFloat(param[1]) );
                }
            },

            validateOnServer:function(value, element, param){
                this.$form.trigger('onValidateAtServer',[{element:element,validator:this, url: param}]);
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
            time:function(){
                return "请按照正确的 时间格式 填写。 如：下午2点12分  \"14:12\"";
            },
            dateTime:function(){
                return "请按照正确的 日期时间格式 填写。 如：2011年11月11日 下午2点12分 \"2011/11/11 14:12\"";
            },
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
            numberInRange: function(p1,p2){
                return "请输入 "+p1+' 和 '+p2+' 之间的数字'
            }
            ,


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