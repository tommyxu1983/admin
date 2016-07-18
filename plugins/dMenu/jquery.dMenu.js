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
                isShowingInit:true
            },options||{});


        var $body= $(document.body);

        var $wrapper=$(options.wrapperID);
        var $toggleBtn=$(options.menuToggleBtnID);

        var isShowingInit=options.isShowingInit;
        var isPushOrSlide=options.type.split('-')[0];


        var _init=function($Menu){
            $Menu.addClass('c-menu c-menu--'+options.type);

            $wrapper.addClass('o-wrapper');
            //初始化菜单，一开始就显示菜单
            if(isShowingInit){
                $body.addClass('has-active-menu');
                $Menu.addClass('is-active');
                $wrapper.addClass('has-'+options.type);
               //var width = $wrapper[0].clientWidth -$Menu[0].clientWidth;
               // $wrapper[0].clientWidth=width;
               // $wrapper.width(  isShrinkWrap? ($wrapper.width()-$Menu.width()) : $wrapper.width() );
            }
            // 菜单按钮
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
          //  $wrapper.width(  isShrinkWrap? ($wrapper.width()-$Menu.width()) : $wrapper.width() );


        }
        var _menuClose=function($Menu){
            $body.removeClass('has-active-menu');
            $Menu.removeClass('is-active');

            $wrapper.removeClass('has-'+options.type);
        //    $wrapper.width(  isShrinkWrap? ($wrapper.width()+$Menu.width()) : $wrapper.width() );
        }
        return this.each(
            function(){
                _init($(this));
            }

        );
    }
})(jQuery, document)
