/**
 * Created by Administrator on 2016/6/28.
 */
(function($,w,undefined){
    var pluginName='uploader';

    var _default={
        url: document.URL,
        method: 'POST',
        maxFileSize: 1000*1024*1024, // 8mb
        allowedTypes: '*',
        maxFiles:20,
        fileCategory:'uploadedfile',
        extraData: undefined,
        dataType:null,

        onInit:undefined,
        onError:undefined,
        onBeforeUploading:undefined,
        onUploadingProgress: undefined,
        onUploadingSuccess:undefined,
        onUploadingComplete:undefined,
        onUploadingError:undefined,
    }


    var Uploader=function(element,options){
        this.$element=$(element);
        this.settings=$.extend({},_default,options);

        this.checkBrowser()? this.init() : alert('游览器不支持上传功能,请跟换现代游览器：IE10+, FiireFox, Chrome');


    };

    Uploader.prototype.checkBrowser=function(){

        if(w.FormData===undefined){
            console.log && console.log('window.FormData api  is not supported');
            return false;
        }else{
            return true;
        }

    };




    Uploader.prototype.init=function(){
        this.$input= this.$element.is('input[type=file]')? this.$element : this.$element.find('input[type=file]')

        if( this.$input.length <=0 ){
            console.log && console.log('need input element to uploadfile');
            return false;
        }


        this.queue= new Array();
        this.queuePosition=-1;
        this.queueRunning=false;
        this.fileUID=0;

        //---Drog and Drop event

        this.subEvent();

        this.$element.trigger('onInit',[this.$element,this.input]);

    };



    Uploader.prototype.subEvent=function(){
        var _this=this;

        this.unSubEvent();

        //外部事件
        typeof this.settings.onInit==='function' && this.$element.on('onInit', this.settings.onInit);
        typeof this.settings.onError==='function' && this.$element.on('onError',this.settings.onError);
        typeof this.settings.onBeforeUploading==='function' && this.$element.on('onBeforeUploading',this.settings.onBeforeUploading);

        typeof this.settings.onUploadingProgress==='function' && this.$element.on('onUploadingProgress',this.settings.onUploadingProgress);
        typeof this.settings.onUploadingSuccess==='function' && this.$element.on('onUploadingSuccess', this.settings.onUploadingSuccess);
        typeof this.settings.onUploadingComplete==='function' && this.$element.on('onUploadingComplete', this.settings.onUploadingComplete);
        typeof this.settings.onUploadingError==='function' && this.$element.on('onUploadingError', this.settings.onUploadingError);





        //内部事件
        //--->Drag and Drop event

        //--->input[type=file] change
        this.$input.on('change',function(evt){
            var files=evt.target.files;
            _this.queueFiles(files);
        });
    };

    Uploader.prototype.unSubEvent=function(){
        this.$input.off('change');
        this.$element.off('onInit');
        this.$element.off('onError');
        this.$element.off('onBeforeUploading');
    };



    Uploader.prototype.queueFiles=function(files){
        var qLength=this.queue.length;


        for(var i= 0, l=files.length; i<l; i++){
            var file=files[i];
            //check fileSize
            if ( file.size> this.settings.maxFileSize){
                this.$element.trigger('onError',[{errorType:'fileSizeExceeds',file:file}]);
                continue;
            }

            if( this.settings.allowedTypes !='*' && ! file.type.match(this.settings.allowedTypes)){
                this.$element.trigger('onError',[{errorType:'fileTypeNoMatch',file:file}]);
                continue;
            }


            // Check max files
            if(this.settings.maxFiles > 0) {
                if(this.queue.length >= this.settings.maxFiles) {
                    this.$element.trigger('onError',[{errorType:'fileMaxNoReach',file:file}]);
                    continue;
                }
            }
            this.queue.push(file);
        }


        // if is uploading, stop queueFiles.
        if(this.queueRunning){
            this.$element.trigger('onError',[{errorType:'fileUploading'}]);
            return false;
        }

        // and only if new Files were successfully added
        if(this.queue.length == qLength){
            //  this.$element.trigger('onError',[{errorType:'fileUploading'}]);
            return false;
        }
        this.processQueue();
        return true;
    };


    Uploader.prototype.processQueue=function(){
        var _this=this;
        this.queuePosition++;




        if(this.queuePosition< this.queue.length){
            this.$element.trigger('onBeforeUploading',[{$element:this.$element,fileUID:_this.fileUID,file:_this.queue[this.queuePosition]}]);
        }else{

            //CleanUp
            //wait until new files are dropped
            this.queuePosition= this.queue.length-1;
            this.queueRunning=false;
            return;
        }

        var file=this.queue[this.queuePosition];

        //FormData
        var formData= new FormData();
        formData.append(this.settings.fileCategory,file);
        // formData.append(this.settings.fileCategory,)


        // Append extra Form Data
        if(_this.settings.extraData){
            $.each(_this.settings.extraData, function(exKey, exVal){
                formData.append(exKey, exVal);
            });
        }



        //上传开始
        this.queueRunning = true;


        $.ajax({
            url: _this.settings.url,
            type: _this.settings.method,
            dataType: _this.settings.dataType,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            forceSync: false,
            xhr: function(){
                var xhrobj = $.ajaxSettings.xhr();
                if(xhrobj.upload){
                    xhrobj.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total || e.totalSize;
                        if(event.lengthComputable){
                            percent = Math.ceil(position / total * 100);
                        }

                        _this.$element.trigger('onUploadingProgress',[{$element:_this.$element,queuePosition: _this.queuePosition, percent: percent,file:file}]);

                    }, false);
                }

                return xhrobj;
            },
            success: function (data, message, xhr){

                _this.$element.trigger('onUploadingSuccess',[{$element:_this.$element,queuePosition: _this.queuePosition, data: data}]);
                //文件列队里的文件如果全部处理完成,归零。
                if( (_this.queue.length-1)==_this.queuePosition){
                    _this.queue=[];
                    _this.queuePosition=-1;
                }

            },
            error: function (xhr, status, errMsg){
                _this.$element.trigger('onUploadingError',[{$element:_this.$element,xhr:xhr,status:status,errMsg:errMsg}]);

            },
            complete: function(xhr, textStatus){
                this.fileUID++;
                _this.processQueue();
            }
        });


    };



    $.fn[pluginName]=function(options){
        return $.each(this,function(index,domEle){

            var old=$.data(domEle, pluginName);

            if(!old){
                $.data(domEle, pluginName, new Uploader(this, options));
            }



        });
    };

}(jQuery,window));