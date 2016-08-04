/**
 * Created by Administrator on 2016/6/30.
 */

(function($,w,undefined){

    var pluginName='richeditor',
        _default={

        },
        div='<div></div>';
        //textarea='<textarea></textarea>';


    _default.toolBarTemplate='';

   var toolBarCss= {
        'position':'relative',
        'margin-top': '5px',
        'height':'300px',
        'width':'100%',
        'border-radius': '5px',
        'background-color': '#e8e8e8',
        'border': 'solid #a9a9a9 1px',
        'padding':'5px'
    };



    var RichEditor=function(ele,opts){


        this.settings=$({},_default,opts);
        this.$element=$(ele);
        this.$editDiv=$(div);

        this.$toolBarDiv=$('div[data-role="editor-toolbar"]').length>0 ?  $('div[data-role="editor-toolbar"]')
            : $(this.settings.toolBarTemplate) ;

        this.selection=null;

        this.init();

    }

    RichEditor.prototype.init=function(){
        var self= this;



        self.$toolBarDiv.detach();


        self.subEvents();





        //让 工具栏 可视
        self.$editDiv.css(toolBarCss).attr('contenteditable','true');
        this.$element.append(self.$toolBarDiv).append(self.$editDiv);
        this.$toolBarDiv.show();


    };

    RichEditor.prototype.subEvents=function(){
        var self=this;

        self.unSubEvents();

        //内部事件
        self.$toolBarDiv.find('[data-edit]').on('click',function(evt){
           var commArgs= $(this).attr('data-edit').split(/\s+/);
            self.restoreSelection();
            (!! commArgs.length>0) ? w.document.execCommand(  commArgs[0] , false, ((!!commArgs[1])? commArgs[1]:null)  )    :    console.log('can\'t get [data-edit=\'xxx\']');

        });

        self.$editDiv.on('mouseup keyup',function(){
            self.updateSelection();
        });



    };


    RichEditor.prototype.unSubEvents=function(){};

    RichEditor.prototype.updateSelection=function(){
        var sel = window.getSelection();
        this.selection =(sel.getRangeAt && sel.rangeCount) ? sel.getRangeAt(0): null;
    };


    RichEditor.prototype.restoreSelection = function () {
        var sel = window.getSelection();
        if (this.selection) {
            try {
                sel.removeAllRanges();
            } catch (ex) {
                document.body.createTextRange().select();
                document.selection.empty();
            }

            sel.addRange(this.selection);
        }
    }



    $.fn[pluginName]=function(options){
        window.console &&(this.length<1)&& console.log('没有元素被选中');
        return $.each(this, function(index,domEle){
           // 在这里 domEle===this

            var old = $.data(domEle, pluginName);
            if(!old){
                return new RichEditor(domEle,options);
            }

        });
    }
}(jQuery,window));
