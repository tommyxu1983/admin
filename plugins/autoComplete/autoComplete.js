/**
 * Created by Administrator on 2016/9/7.
 */


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
    var pluginName='autoComplete';
    var _default={
        data:[],
        propName:'caption', // the property name of contain the caption of each element,e.g. [{id:'a1',caption:'teacher'},{id:'a2',caption:'worker'}

        compare:function(word,each){
            var target = encodeURIComponent(each.caption);
            word =encodeURIComponent(word) ;

            var reg = new RegExp(word);
            return target.match(reg)? true :false;
        },

    };

    var AutoComplete=function(options, input){
        this.$input = $(input);
        this.$ul= $('<ul></ul>').addClass(pluginName);
        this.settings= $.extend(true,{},_default,options);
        this.init();

    };

    $.extend(AutoComplete,{
        prototype: {
            constructor: AutoComplete,

            init: function () {


                this.subEvents();

            },

            subEvents: function () {
                var me = this;
                this.offEvents();


                this.$input.on('focusin focusout keyup', eventHandler);

                function eventHandler(evt){
                    if(evt.type === 'focusin'){
                        // show list
                        me.showList.call(me,this.value? this.value: '');
                    }else if(evt.type ==='focusout'){
                        // destroy list
                        me.removeList.call(me);

                    }else if(evt.type==='keyup'){
                        // destroy list
                        // show list
                        me.removeList.call(me);
                        me.showList.call(me,this.value|'');
                    }
                }

                // onOverLayUltimate
               /* if (typeof this.settings.onOverLayUltimate === 'function') {
                    this.$overLay.on('onOverLayUltimate', this.settings.onOverLayUltimate);
                }*/
            },

            offEvents: function () {
                this.$input.off();
            },

            destroy: function(){

            },

            search: function(word){
                var result = [], me = this;
                if($.isArray(this.settings.data)){
                    if(word.length && word.length==0){
                        result=this.settings.data;
                    }

                    $.each(this.settings.data, function(index, each){
                        if(typeof me.settings.compare==='function' ){
                           if( me.settings.compare.call(me, word, each)){
                               result.push(each);
                           }
                        }
                    })
                }
                return result;

            },

            removeList: function(){
                this.$ul.remove();
            },

            showList: function(searchWord){
              var dataList =  this.search(searchWord),
                  me=this,
                  $li=$('<li></li>');
                me.$ul.empty();
                if(dataList.length>0){
                    $.each(dataList, function(index,item){
                        $li.empty();

                        me.$ul.append( $li.clone().append(item[me.settings.propName]) );
                    });
                    $('body').append(me.$ul);
                }




            }
        }

    });



     $.fn[pluginName]= function(options){

     var old, newPlugin, result;

     $.each(this, function(index, eachDom){
         if(! $(eachDom).length){
             if ( options && options.debug && window.console ) {
             console.warn( "Nothing selected, can't validate, returning nothing." );
             }
             return;
         }

         old= $.data(eachDom,pluginName);
         if(! old){
            newPlugin= new AutoComplete(options,eachDom);
            $.data(eachDom,pluginName,newPlugin);
            result=newPlugin;
         }else{
            result=old;
         }



     });


     //如果
     return result || this;
     }

});