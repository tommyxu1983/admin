/**
 * Created by Administrator on 2016/5/15.
 */


$(document).ready(function(){


    //原始状态是 leftPush menu
    $('#menu-LeftPush').dMenu({menuToggleBtnID:'#menuToggleBtn-LeftPush'});

    $('#menu-rightPush').dMenu({
        type:'slide-right',      // the Menu type
        wrapperID:'#o-wrapper2', // the wrapper id
        menuToggleBtnID:'#menuToggleBtn-RightPush', // the menu toggle button
        isShrinkWrap:false

    });

});