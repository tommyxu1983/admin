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

        onListItemSelected: function(input,itemData){
            if(itemData){
                input.value = itemData[this.settings.propName];
                this.removeList();
            }else{
                console.log('itemData:' +itemData )
            }


        }

    };

    var AutoComplete=function(options, input){
        this.$input = $(input);
        this.$ul= $('<ul></ul>').addClass(pluginName);
        this.settings= $.extend(true,{},_default,options);
        this.preventInputFocusoutEvt=false;
        this.intervalID;
        this.init();

    };

    $.extend(AutoComplete,{
        prototype: {
            constructor: AutoComplete,

            init: function () {
                this.$input.attr('AutoComplete','off')

                this.subEvents();

            },

            subEvents: function () {
                var me = this;
                this.offEvents();


                this.$input.on('focusin focusout  keyup keydown', eventHandler);



                function eventHandler(evt){

                    if(evt.type === 'focusin'){
                        // show list

                        me.createList.call(me,this.value? this.value: '');
                    }else if(evt.type ==='focusout'){
                        // destroy list
                       setTimeout(function(){
                           if(  me.preventInputFocusoutEvt){
                               me.preventInputFocusoutEvt=false;
                           }else{
                               me.removeList.call(me);
                           }
                       },100);


                    }
                    else if(evt.type==='keyup'){
                        // destroy list
                        // show list
                        me.handleInputKeyAction.call(me, this, evt);

                    }
                }



            },

            offEvents: function () {
                this.$input.off('focusin focusout keyup');
                this.$ul.on('mousedown');
            },

            destroy: function(){
                this.offEvents();
                this.$ul.remove();
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

            createList: function(searchWord){

              var me=this,
                  encodeWord = encodeURIComponent(searchWord),
                  dataList =  this.search(searchWord),

                  arrayCutting,
                  length,
                  htmlInLI;

                me.$ul.remove();
                me.$ul.empty();


                if(dataList.length>0 ){

                    $.each(dataList, function(index,item){

                        htmlInLI='';
                       var $LI=$('<li></li>');
                        if(searchWord.length>0){
                            arrayCutting = encodeURIComponent( item[me.settings.propName]).split(encodeWord);
                        }

                        if( $.isArray(arrayCutting) ){
                            length = arrayCutting.length;
                            $.each(arrayCutting,function(index,item){
                                // Highlight the matching word
                                if( index< length-1 ){
                                    htmlInLI= htmlInLI + decodeURIComponent(item)  + '<span class="highlight">'+ decodeURIComponent(encodeWord)+ '</span>'
                                }else{
                                    htmlInLI= htmlInLI  + decodeURIComponent(item);
                                }

                            });
                        }else{
                            htmlInLI = item[me.settings.propName];
                        }

                        $.data($LI[0],pluginName,item);

                        me.$ul.append(  $LI.append('<a href="javascript:void(0);">'+htmlInLI +'</a>') );

                    });

                    setListStyle.call(me);
                    setListEvents.call(me);

                    $('body').append(me.$ul);

                }


                function  setListStyle(){
                    var ulXY,
                        ulWidth,
                        me =this;

                    ulXY = findInputBottomLeft(me.$input[0]);
                    ulWidth = this.$input[0].offsetWidth;
                    me.$ul.css({'top':ulXY.bottom + 'px','left':ulXY.left +'px', 'width': ulWidth+'px'});
                    me.$ul.attr('size','10');

                    function findInputBottomLeft(element){
                        var dist2Bottom =  element.getBoundingClientRect().top + element.offsetHeight,
                            dist2Left = element.getBoundingClientRect().left;
                        return {bottom:dist2Bottom,left:dist2Left}
                    }
                }

                function setListEvents(){
                    var  me = this;
                    /*me.$ul.on('mousedown','option',function(evt){
                        me.settings.onListItemSelected.call( me, me.$input[0], $.data(this,pluginName) );
                    });


                    me.$ul.on('keyup',function(evt){
                        if(evt.keyCode == 13){
                            me.settings.onListItemSelected.call( me, me.$input[0], $.data(this,pluginName) );
                        }

                    });

                    me.$ul.on('focusin',function(evt){
                        me.preventInputFocusoutEvt = true;
                    });
                    me.$ul.on('focusout',function(evt){
                        me.removeList();
                    });*/

                    me.$ul.on('mousedown keydown keyup focusin ', 'a', function(event){

                        if(event.type == 'focusin'){
                            me.preventInputFocusoutEvt = true;
                        }else if(event.type =='keydown'){
                            me.handleListKeyAction.call(me,this,event);
                        }else if (event.type =='keyup'){

                            clearInterval(me.intervalID);
                            console.log('endID: ' + me.intervalID);
                        }



                    })


                }



            },




            handleInputKeyAction: function(input, event){

                var me = this
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
                //enter        => 13
                var excludedKeys = [
                   13, 16, 17, 18, 20, 35, 36, 37,
                    38, 39, 40, 45,144, 225
                ];

                /* speical key
                *  enter =13
                *  up arrow = 37
                *  down arrow = 40
                * */
               if(  $.inArray( event.keyCode, excludedKeys )>=0 ){


                  var $activeA= me.$ul.find('a.active'),
                      $allA = me.$ul.find('a'),
                      activeIndex;


                   if(event.keyCode == 38) // up arrow key
                   {

                       if( $allA.length>0 &&  $activeA.length==1 ){
                           activeIndex =  $allA.index($activeA);

                           if(activeIndex>0 && activeIndex<$allA.length){
                               $activeA.removeClass('active');
                               $( $allA[activeIndex-1] ).addClass('active');
                           }

                       }
                   }
                   else if (event.keyCode == 40) // down arrow key
                   {


                        //first time arrow down
                       if( $allA.length>0 && $activeA.length==0 ){

                           $allA.first().addClass('active');
                           $allA.first().focus();

                       }
                       else if( $allA.length>0 &&  $activeA.length==1 ){
                            activeIndex =  $allA.index($activeA);

                           if(activeIndex>=0 && activeIndex<$allA.length-1){
                               $activeA.removeClass('active');
                               $( $allA[activeIndex+1] ).addClass('active');
                               $( $allA[activeIndex+1] ).focus();

                           }

                       }

                   }
                   else if (event.keyCode == 13) //enter key
                   {
                       if($allA.length>0 &&  $activeA.length==1){

                           me.settings.onListItemSelected.call( me, input, $.data($activeA[0],pluginName) );
                           event.preventDefault();
                       }
                   }

               }
               else{
                   me.removeList.call(me);
                   me.createList.call(me,input.value? input.value: '');
               }


            },

            handleListKeyAction: function(anchor,event){
                /*
                * 13 => enter key
                * 38 => up arrow key
                * 40 => down arrow key
                * */

               var includedKeys = [
                    38,40,13
                ];



                if ( $.inArray( event.keyCode, includedKeys )>=0){

                    var me =this,
                        $allA = me.$ul.find('a'),
                        $activeA= me.$ul.find(document.activeElement),
                        activeIndex = $allA.index($activeA);

                    if($allA.length>0 &&  $activeA.length==1){


                        if(event.keyCode == 38 ) // up arrow key
                        {


                                activeIndex =  $allA.index($activeA);

                                if(activeIndex>0 && activeIndex<$allA.length){
                                    $activeA.removeClass('active');
                                    $( $allA[activeIndex-1] ).addClass('active');
                                    $( $allA[activeIndex-1]).focus();
                                }


                        }
                        else if (event.keyCode == 40) // down arrow key
                        {


                            //first time arrow down
                            /*if( $allA.length>0 && $activeA.length==0 ){

                             $allA.first().addClass('active');
                             $allA.first().focus();

                             }
                             else*/

                            $activeA.removeClass('active');
                            $( $allA[activeIndex+1] ).addClass('active');
                            $( $allA[activeIndex+1] ).focus();

                            console.log('lala')
                            me.intervalID=setInterval(function(){
                                console.log('start id: '+ me.intervalID)
                                if(activeIndex< 50){
                                    $activeA.removeClass('active');
                                    $activeA = $( $allA[activeIndex+1] );
                                    $activeA.addClass('active');
                                    $activeA.focus();
                                    activeIndex++;
                                }else{
                                    clearInterval(me.intervalID);
                                }
                            },500);


                        }
                        else if (event.keyCode == 13) //enter key
                        {
                            if($allA.length>0 &&  $activeA.length==1){

                                me.settings.onListItemSelected.call( me, input, $.data($activeA[0],pluginName) );
                                event.preventDefault();
                            }
                        }
                    }


                    me.preventInputFocusoutEvt=false;
                }

            }

        } //prototype end

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