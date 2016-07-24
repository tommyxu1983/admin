/**
 * Created by Administrator on 2016/6/2.
 */
/**
 * Created by Administrator on 2016/6/1.
 */



if (typeof jQuery === 'undefined') {
    throw new Error('Form\'s JavaScript requires jQuery');
}

(function($,window,document,undefined){

    var _default={};

    var pluginName='formview';
    _default.options={
        data:{},
        noInputsInRow:2, //一行摆几个 input
        style:{},
        isDataWritable:false
    };

    var _defaultStyle={
        bs:{
            form_horizontal:'form-horizontal',
            form_Group:'form-group',
            inputGroup:'input-group',
            inputGroupAddon:'input-group-addon',
            row:'row',
            col_part:'col-sm-',

            col_first:'col-sm-3',
            col_second:'col-sm-8',
            offset_2col:'col-sm-offset-2',

            label:'control-label',
            form_control:'form-control',
            input_group:'input-group',
            input_group_btn:'input-group-btn',
            input_group_addon:'input-group-addon',
            icon_eyeOpen: 'glyphicon glyphicon-eye-open',
            icon_eyeClose:'glyphicon glyphicon-eye-close',
            btn_default:'btn btn-default',
            checkbox_inline:'checkbox-inline'

        }


    };
    var _dataType={
        text:'text',
        password:'psw',
        email:'email',
        boolean:'bool',
        option:'option',
        multi:'multi',
        date:'date',
        currency:'currency',
        integer: 'integer',
        float:'float',
        time:'time',
        file:'file'
    };

    var _currency={
        rmb:'元',
        usd:'$'
    }


    //定义所有 input type
    var _iType={
        button:'button',
        checkbox:'checkbox',
        file:'file',
        hidden:'hidden',
        image:'image',
        password:'password',
        radio:'radio',
        reset:'reset',
        submit:'submit',
        text:'text',

        //H5 new type for input
        color:'color',
        date :'date',
        datetime:'datetime',
        datetime_local:'datetime-local',
        month:'month',
        week:'week',
        time:'time',
        email:'email',
        number:'number',  //定义带有 spinner 控件的数字字段
        range:'range',  //定义带有 slider 控件的数字字段
        search:'search',
        tel:'tel',
        url:'url'
    };
    //定义权限
    //var inputStyle={
    //    visible:'0',
    //    readOnly:'1',
    //    editable:'2',
    //
    //};

    var _html={
        form:'<form></form>',
        div:'<div></div>',
        label:'<label></label>',
        input:'<input>',
        span:'<span></span>',
        select:'<select></select>',
        option:'<option></option>',
        button:'<button></button>',
        i:'<i></i>',
        textarea:'<textarea></textarea>',


    };
    var logError = function (message) {
        if (window.console) {
            window.console.error(message);
        }
    };

    //
    function togglePassword(ButtonDom,classHidePwd , classShowPwd) {
        var input = $(ButtonDom).closest('div').find("input");
        if (input.length > 0) {
            if ($(ButtonDom).hasClass(classHidePwd)) {
                input.attr('type', 'password');
                $(ButtonDom).removeClass(classHidePwd).addClass(classShowPwd);
            } else if ($(ButtonDom).hasClass(classShowPwd)) {
                input.attr('type', 'text');
                $(ButtonDom).removeClass(classShowPwd).addClass(classHidePwd);
            }
        }

    }


    var FormView=function(element,options){
        this.$element=$(element);

        this.init(options);

    };

    FormView.prototype.init=function(options){
       // options.isDataWritable==true 直接操作 传进来的数据，任何input里的值改变都会直接改动传进的 option.data
        this.settings=$.extend({},_default.options,options);
        if(options.isDataWritable){
            (this.settings.data)?  this.settings.data=options.data : logError('please passing the option with \'data\' property')
        }


        this.originalData=[];
        !$.isArray(this.settings.data.controlList) && logError('controlList is not array');
        $.each(this.settings.data.controlList, $.proxy(function(index,item){
            this.originalData.push(item.data);
        },this));
        this.render(this.settings);

    };

    FormView.prototype.render=function(settings){

        this.buildForm(settings);
    };
    FormView.prototype.resetData=function(){
        $.each(this.originalData, $.proxy(function(index,item){
            this.settings.data.controlList[index].data=item;
        },this));
    };

    FormView.prototype.restoreForm=function(){
        this.empty();
        this.resetData();
        this.buildForm(this.settings);
    };
    FormView.prototype.buildForm=function(settings){
        this.$element.css({'padding-right':'20px'});
        this.$form=$(_html.form);
        //创建 form title
        $(_html.div)
            //.addClass('') //style
            .css({'width':'100%','text-align':' center','font-size':'2em'})// style
            .html('<strong>'+settings.data.formTitle +'</strong>') // data
            .appendTo(this.$element);

        //创建 form
         this.$form.addClass(_defaultStyle.bs.form_horizontal) //style
                .attr('id',settings.data.formTitle) // id
                .appendTo(this.$element);

        //创建 row (label +input)
        var rowItemCount= 0, $row=$(_html.div).addClass(_defaultStyle.bs.row),row=0;

        $.each( settings.data.controlList, $.proxy(function(index,item){
            console.log('行: '+row + '  列：' + rowItemCount + '   index: ' +index + '   name:'+item.label );
            if(index>17){
                var jj=0;
            }

            // 12/settings.noInputsInRow 因为 boostrap 栅格系统分为12等分，请将 noInputsInRow设为12的公约数



            //如果是文件， 多选， textarea,直接占一行
            if(item.dataType==_dataType.file || item.dataType==_dataType.multi ||(item.dataType==_dataType.text && item.inputMultiLine && item.inputMultiLine>0)){
               //把上一行的 row 系上 form
                if(rowItemCount>0){this.$form.append($row.clone(true)); }
                $row=null;
                $row=$(_html.div).addClass(_defaultStyle.bs.form_Group);
                //var $part=$(_html.div).append();
                //$part.addClass(_defaultStyle.bs.col_part + (12).toString() );
                $row.append(this.buildControlItem(item,1));
                this.$form.append($row.clone(true));
                rowItemCount=0;
            }else{
                //var $part=$(_html.div).append(this.buildControlItem(item,itemsPerRow));
                //$part.addClass(_defaultStyle.bs.col_part + (12/settings.noInputsInRow).toString() );
                if(rowItemCount==0){
                    //创建新的 row
                    $row=null;
                    $row=$(_html.div).addClass(_defaultStyle.bs.form_Group);
                    $row.append(this.buildControlItem(item,settings.noInputsInRow));
                    rowItemCount++;
                }
                else if (0<rowItemCount && rowItemCount< settings.noInputsInRow-1){
                    //小于设置的列数
                    $row.append(this.buildControlItem(item,settings.noInputsInRow));
                    rowItemCount++;
                }
                else{

                    $row.append(this.buildControlItem(item,settings.noInputsInRow));
                    rowItemCount++;

                    this.$form.append($row.clone(true));
                    rowItemCount=0;

                }
            }



        },this) );

        //创建 button
        $.isArray(settings.buttons)&&
            this.$form.append(this.buildButton(settings.buttons));


        //show password 事件监听
        this.$form.on('click',function(evt){
           $(evt.target).hasClass('showPSW')&& togglePassword(evt.target, _defaultStyle.bs.icon_eyeOpen,_defaultStyle.bs.icon_eyeClose);
        });
    };


    FormView.prototype.empty=function(){
        this.$element.empty();
    };

    FormView.prototype.buildControlItem=function(ctlListItem,itemsPerRow){
        //创建 label
        var iCol= 1, jCol=1;

        //label占的 col-sm-iCol
        iCol={1:2,2:2,3:2,4:1}[itemsPerRow];
        // input 占的 col-sm-jCol
        jCol={1:10,2:4,3:2,4:2}[itemsPerRow];


        var $label=$(_html.label)
                .attr('for',this.settings.data.formID+'-'+ctlListItem.dataID)
                //.css('text-align','left')
                .addClass('col-sm-'+iCol +' ' +_defaultStyle.bs.label) //style
                .append((ctlListItem.isLabelDisplay)&& ctlListItem.label); // data

        //创建 temp div, 返回 label 和 input
        return $(_html.div)
                .append($label)                   // attach label
                .append(  $(_html.div).addClass('col-sm-'+ jCol).append(this.buildInput(ctlListItem)) )
                .children(); // attach input
    }

    FormView.prototype.buildControlItemSpec=function(ctlListItem){
        //创建 label
        var $label=$(_html.label)
            .attr('for',this.settings.data.formID+'-'+ctlListItem.dataID)
            .css('text-align','left')
            .addClass('col-sm-2'+ ' ' +_defaultStyle.bs.label) //style
            .append((ctlListItem.isLabelDisplay)&& ctlListItem.label); // data

        //创建 div, input
        return $(_html.div)
            .addClass(_defaultStyle.bs.form_Group)//style
            .append($label)                   // attach label
            .append(  $(_html.div).addClass('col-sm-10').append(this.buildInput(ctlListItem)) ); // attach input
    };



    FormView.prototype.buildInput=function(ctlListItem){
        (!ctlListItem.dataType)&&(window.console) &&console.log('请检查数据是否传输正确，data.data.dataType 不正确或不存在');

        //创建 input
        var $result,$input=$(_html.input)
            .addClass(_defaultStyle.bs.form_control)
            .attr('id',this.settings.data.formID+'-'+ctlListItem.dataID );


        //input placeholder
        (!!ctlListItem.placeholder)
        &&(typeof ctlListItem.placeholder=='string')
        &&(ctlListItem.placeholder.length>0)
        && $input.attr('placeholder',ctlListItem.placeholder);

        //data 数据 插入
        (!!ctlListItem.data)
        &&(typeof ctlListItem.data==='string')
        &&(ctlListItem.data.length>0)
        && $input.val(ctlListItem.data);

        //数据绑定  （给input 加个id, 做个form 局面的 on change 监听）！！！！！
        var inputHandler=function(evt){
            ctlListItem.data= $(evt.target).val();
        }

        $input.on('change',inputHandler);



        switch(ctlListItem.dataType){
            case _dataType.text:
                //如果  ctlListItem 有 inputMultiLine>0
                if(!!ctlListItem.inputMultiLine && ctlListItem.inputMultiLine>0){
                    $result=$(_html.textarea)
                        .addClass(_defaultStyle.bs.form_control)
                        .attr({'id':this.settings.data.formID+'-'+ctlListItem.dataID, 'rows':'4'  })
                        .val(ctlListItem.data)
                        .on('change',inputHandler);
                }else{
                    $result=$input.attr('type',_iType.text);
            }

                break;
            case _dataType.integer:
                $result=$input.attr('type',_iType.number);
                break;
            case   _dataType.float:
                $result=$input.attr('type',_iType.text);
                break;
            case _dataType.password:
                $input.attr('type',_iType.password);

                // button show password
                var $button=$(_html.button)
                    .addClass(_defaultStyle.bs.btn_default)
                    .attr('type','button')
                    .append($(_html.i).addClass(_defaultStyle.bs.icon_eyeClose + ' ' +'showPSW')),

                //创建 button group
                 $buttonGroup_SPAN=$(_html.span)
                    .addClass(_defaultStyle.bs.input_group_btn) //style
                    .append($button);
                $result=$(_html.div)
                    .addClass(_defaultStyle.bs.input_group)   //style
                    .append($input)
                    .append($buttonGroup_SPAN);
                break;

            case _dataType.email:
                $result=$input.attr('type',_iType.email);
                break;
            case _dataType.boolean:
                var $label0=$(_html.label)
                    .attr('for',this.settings.data.formID+'-'+ctlListItem.dataID+'-'+ctlListItem.dataOption[0].id),
                 $label1=$(_html.label)
                    .attr('for',this.settings.data.formID+'-'+ctlListItem.dataID+'-'+ctlListItem.dataOption[1].id),



                 $radio0=$(_html.input)
                    .attr({ 'type':_iType.radio,
                            'name':ctlListItem.dataID,
                            'value':ctlListItem.dataOption[0].id,
                            'id':this.settings.data.formID+'-'+ctlListItem.dataID+'-'+ctlListItem.dataOption[0].id,
                    })
                     .on('click',function(evt){
                         ctlListItem.data=ctlListItem.dataOption[0].id;
                         }),

                 $radio1=$(_html.input)
                    .attr({ 'type':_iType.radio,
                            'name':ctlListItem.dataID,
                            'value':ctlListItem.dataOption[1].id,
                            'id':this.settings.data.formID+'-'+ctlListItem.dataID+'-'+ctlListItem.dataOption[1].id,
                    })
                     .on('click',function(evt){
                         ctlListItem.data=ctlListItem.dataOption[1].id;
                     });
                // checked 选中
                (ctlListItem.dataOption[0].id==ctlListItem.data)&& $radio0.attr('checked','checked');
                (ctlListItem.dataOption[1].id==ctlListItem.data)&& $radio1.attr('checked','checked');

                $label0.append($radio0).append(ctlListItem.dataOption[0].caption);
                $label1.append($radio1).append(ctlListItem.dataOption[1].caption);
                var $tempDiv=$('<div>').append($label0).append($label1).children().clone(true);
                $result=$tempDiv;

                break;

            case _dataType.option:
                var $select=$(_html.select)
                    .addClass(_defaultStyle.bs.form_control)
                    .attr('id',this.settings.data.formID+'-'+ctlListItem.dataID)
                    .on('change', function(evt){
                       // var kk=$('option:selected',this);
                        ctlListItem.data= this.value;
                    });
                $.each(ctlListItem.dataOption, $.proxy(function(index,item){
                    var $option=$(_html.option)
                        .attr({'value':item.id, 'id':this.settings.data.formID+'-'+ctlListItem.dataID+'-'+item.id})
                        .html(item.caption);
                    (item.id==ctlListItem.data)&& $option.attr('selected','selected');
                    $select.append($option);
                },this));

                $result=$select;

                break;

            case _dataType.date:
                setTimeout(function(){
                    $input.datepicker({
                        format: "yyyy/mm/dd",
                        todayBtn: "linked",
                        language: "zh-CN"
                    });
                },500);


                $result=$input;
                break;
            case _dataType.currency:
                $input.attr('type',_iType.number);

                //创建 span group_addon
                var $groupAddon_SPAN=$(_html.span)
                    .addClass(_defaultStyle.bs.input_group_addon) //style
                    .append('万元');

                $result=$(_html.div)
                    .addClass(_defaultStyle.bs.input_group)   //style
                    .append($input)
                    .append($groupAddon_SPAN);
                break;
            case _dataType.multi:
                var $tempContainer=$(_html.div);
                $.each(ctlListItem.dataOption, $.proxy(function(index,item){

                    var $checkbox=$(_html.input)
                        .attr({
                            'type':_iType.checkbox,
                            'value':item.id,
                            'id':this.settings.data.formID+'-'+ctlListItem.dataID+'-'+item.id

                        });
                    var $labelChBx=$(_html.label).addClass(_defaultStyle.bs.checkbox_inline)
                        .append($checkbox)
                        .append(item.caption);
                    if( parseInt(item.checked)==1 ){
                        $checkbox[0].checked=true;
                    }
                    //(item.id==ctlListItem.data)&& $option.attr('selected','selected');
                    $checkbox.on('click',function(evt){
                        if(this.checked==true){
                            item.checked=1;
                        }else{
                            item.checked=0;
                        }

                    });
                    $tempContainer.append($labelChBx);
                },this));

                $result=$tempContainer.children();
                break;
        }

        //只读
        if (!!ctlListItem.inputReadOnly && ctlListItem.dataType!=_dataType.multi && ctlListItem.inputReadOnly>0  ){
            $result.attr( 'disabled','disabled');
        }

        return $result;
    };


    FormView.prototype.buildButton=function(buttons){
        !$.isArray(buttons)&& console.log('please make sure you buttons is passed in by array');
        var formView=this;
        var $result=$(_html.div)
            .addClass(_defaultStyle.bs.form_Group),
        $buttons_Div=$(_html.div)
            .addClass(_defaultStyle.bs.col_second +' '+ _defaultStyle.bs.offset_2col)
            .appendTo($result);

        $.each(buttons, $.proxy(function(index, item){
            var $button=$(_html.button)
                .attr('type','button')
                .addClass(_defaultStyle.bs.btn_default+ ' ' +item.cssClass)
                .html(item.label)
                .appendTo($buttons_Div);
            if(typeof item.action==='function'){
                $button.on('click',function(evt){
                    item.action.call(this,formView,evt);
                });
            }
        },this));

        return $result;
    };

    FormView.prototype.getData=function(){
        return this.settings.data.controlList;
    };






    // listView PLUGIN DEFINITION ListView 插件定义 写入Jquery prototype
    // ==========================
    $.fn[pluginName]=function(options,args){
        window.console &&(this.length<1)&& console.log('请排查一下，没有元素被选中');
        var existPlugin, result;
        if(typeof options==='string' && options==='getData' ){
            this.each(function(){
                existPlugin  = $.data(this,pluginName);
                if(existPlugin){
                    result=  existPlugin[options].call(existPlugin);

                }else{
                    logError(pluginName+'need to be initialised ');
                    return result;
                }
            });
        }else{
            return this.each(function(){

                 existPlugin= $.data(this,pluginName);

                if(existPlugin){
                    if(typeof options ==='string'){
                        if(!$.isFunction(existPlugin[options])){

                            logError(options + '这个方法不存在');
                        }
                        else {
                            if (!(args instanceof Array)) {
                                args = [args];
                            }

                            existPlugin[options].apply(existPlugin, args);
                        }
                    }
                }else{
                    var formView= new FormView(this,options);
                    $.data(this,pluginName,formView);
                }
            });
        }

        if(result) logError('FormView getData 有问题请检查' );
        return result;
    };

    // DROPDOWN NO CONFLICT 没有冲突检查（是否有其他插件叫 listView, tabView）
    // ====================
    //var old= $.fn[pluginName];
    //$.fn[pluginName].noConflict=function(){
    //    $.fn[pluginName] = old;
    //    return this;
    //}


})(jQuery, window,document);