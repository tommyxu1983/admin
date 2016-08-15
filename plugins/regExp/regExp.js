/**
 * Created by Administrator on 2016/8/15.
 */

+function(){

      if(typeof define==='function' && define.amd){

            define( 'regExp',[],function(){
                return RegExp;
            });

      }else if(typeof module === "object" && module.exports) {
            module.exports = RegExp;
      }else if(typeof window !== 'undefined' ){
          window.RegExp=RegExp;
      }


    function RegExp(){

    }

    RegExp.prototype={

    }

    RegExp.url=function(global,caseInSensitive){

        var regString='';

        var giString='';
        !! global && (giString=+'g' );
        !! caseInSensitive && (giString=+'i');

        return new RegExp(regString,giString) ;
    }

}();
