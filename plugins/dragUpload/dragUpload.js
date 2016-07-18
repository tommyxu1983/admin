/**
 * Created by Administrator on 2016/5/15.
 */

(function($,document){
    $.fn.dMenu=function(options){
        options= $.extend(
            {
                type:'push-left',      // the Menu type
                wrapperID:'#o-wrapper', // the wrapper id
                menuToggleBtnID:'#menuToggleBtn-LeftPush', // the menu toggle button
            },options||{});


        var $body= $(document.body);
        var $wrapper=$(options.wrapperID);
        var $toggleBtn=$(options.menuToggleBtnID);
        var isShrinkWrap=true;

        var isPushOrSlide=options.type.split('-')[0];
        if(isPushOrSlide==='slide'){
            isShrinkWrap=false;
        }

        var _init=function($Menu){
            $Menu.addClass('c-menu c-menu--'+options.type);
            $wrapper.addClass('o-wrapper')
            $toggleBtn.on('click',function(){
                if($Menu.hasClass('is-active')){
                    _menuClose($Menu);
                }else{
                    _menuOpen($Menu) ;
                }
            });

        }

        var _menuOpen=function($Menu){
            $body.addClass('has-active-menu');
            $Menu.addClass('is-active');
            $wrapper.addClass('has-'+options.type);
            $wrapper.width(  isShrinkWrap? ($wrapper.width()-$Menu.width()) : $wrapper.width() );


        }
        var _menuClose=function($Menu){
            $body.removeClass('has-active-menu');
            $Menu.removeClass('is-active');

            $wrapper.removeClass('has-'+options.type);
            $wrapper.width(  isShrinkWrap? ($wrapper.width()+$Menu.width()) : $wrapper.width() );

        }

        return this.each(
            function(){
                _init($(this));
            }

        );
    }
})(jQuery, document)
