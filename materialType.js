/**
 * Created by Administrator on 2016/5/23.
 */




avalon.ready(function(){

    //数据定义-------开始----------------
    var userPower={
        show:true,
        read:true,
        edit:true,
        delete:true
    };
    var nodeInfo={
        nodeID:'',
        nodeName:'',
        upNodeID:'',
        upNodeName:''
    };
    var getTreeData=function(){


        var tree =[
            {
                text: "土建材料",
                nodes: [
                    {
                        text: "钢筋",
                        nodes: [
                            {
                                text: "螺纹钢",
                                nodes:[
                                    {
                                        text: "5cm"
                                    },
                                    {
                                        text:"3cm"
                                    }

                                ]

                            },
                            {
                                text: "xx钢"
                            },
                            {
                                text: "yy钢"
                            }
                        ]
                    },
                    {
                        text: "水泥"
                    }
                ]
            },
            {
                text: "外墙材料"
            },
            {
                text: "水电材料"
            },
            {
                text: "防火材料"
            },
            {
                text: "其他材料"
            }
        ];




        var tree =[
            {
                text:"建筑材料",
                //tags: ['available'],
                nodes:[
                    {
                        text: "土建材料",
                        nodes: [
                            {
                                text: "钢筋",
                                nodes: [
                                    {
                                        text: "螺纹钢",
                                        nodes:[
                                            {
                                                text: "5cm"
                                            },
                                            {
                                                text:"3cm"
                                            }

                                        ]

                                    },
                                    {
                                        text: "xx钢"
                                    },
                                    {
                                        text: "yy钢"
                                    }
                                ]
                            },
                            {
                                text: "水泥"
                            }
                        ]
                    },
                    {
                        text: "外墙材料"
                    },
                    {
                        text: "水电材料"
                    },
                    {
                        text: "防火材料"
                    },
                    {
                        text: "其他材料"
                    }
                ]
            }
        ];
        return tree;
    };
    //------------数据定义-----结束----------

    //加载左边菜单板
    $('#menu-LeftPush').dMenu({
        type:'push-left',      // the Menu type
        wrapperID:'#l-middle-content', // the wrapper id
        menuToggleBtnID:'#menuToggleBtn-LeftPush', // the menu toggle button
    });

    var vm1_LoadNodeInfoPage=avalon.define({
        $id:'vm1_LoadNodeInfoPage',
        url:'modules/showEditNodeInfo.html'
    });

    var activeNode;
    //初始化 节点信息
    var model_node={};
    model_node.$id="vm2_NodeInfo";
    model_node.formAction="";
    model_node.formType="材料";
    model_node.data={};
    model_node.userPower={};
    model_node.getAllNodes=function(event){
        event.preventDefault();
        var $tree=$('<div></div>').treeview({data: getTreeData(),levels:4, color:'dodgerblue',multiSelect:false});
        BootstrapDialog.show({
            title:model_node.formType,
            message:$tree
                .on('nodeSelected' ,function(event,node){
                    activeNode=node;

                }).on('nodeUnselected',function(){
                    activeNode=null;
                })
            ,
            buttons: [
                {
                    label: '取消',
                    action: function(dialogItself){
                        dialogItself.close();
                    }

                },
                {
                    label: '确定',
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        if( !!activeNode){
                            //设定父节点属性
                            if(activeNode.parentId ||activeNode.parentId==0){
                                var parentNode=$tree.treeview('getNode',activeNode.parentId);
                                nodeInfo.upNodeID=''; //未定
                                nodeInfo.upNodeName=activeNode.text;//未定
                            }



                            if(userPower.read){
                                vm1_LoadNodeInfoPage.url='modules/showEditNodeInfo.html';
                                vm2_NodeInfo.formAction="";
                                vm2_NodeInfo.formType="材料";
                                vm2_NodeInfo.data={}
                                vm2_NodeInfo.userPower={};
                                avalon.mix(true,vm2_NodeInfo.data,nodeInfo);
                                avalon.mix(true,vm2_NodeInfo.userPower,userPower);
                                avalon.scan();
                            }

                            dialogItself.close();
                        }else{
                            //父节点为空
                        }
                    }
            }]
        });


    };
    model_node.enableEdit=function(event){
        event.preventDefault()
        alert(vm2_NodeInfo.userPower.edit);
        userPower.edit=!userPower.edit;
        vm2_NodeInfo.userPower.edit=!userPower.edit;
        avalon.mix(true,vm2_NodeInfo.userPower,userPower);
        alert(vm2_NodeInfo.userPower.edit);
        //vm2_NodeInfo.userPower.edit=!vm2_NodeInfo.userPower.edit;
    };
    model_node.deleteNode=function(event){
        event.preventDefault();
        alert('添加删除方法');
    }

    var  vm2_NodeInfo=avalon.define(model_node);
    avalon.scan();

    //加载 左边 菜单栏树


    $('#left-menu-tree').treeview({
        data: getTreeData(),
        color:'dodgerblue',
        showTags:true
    }).on('nodeSelected' ,function(event,node){
        activeNode=node;

        if( !!activeNode){
            //设定父节点属性
            if(activeNode.parentId ||activeNode.parentId==0){
                var parentNode=$(this).treeview('getNode',activeNode.parentId);
                nodeInfo.upNodeID=''; //未定
                nodeInfo.upNodeName=parentNode.text;//未定
            }
            nodeInfo.nodeID='';
            nodeInfo.nodeName=activeNode.text;
        }else{
            //父节点为空
        }

        if(userPower.read){
            vm1_LoadNodeInfoPage.url='modules/showEditNodeInfo.html';
            vm2_NodeInfo.formAction="";
            vm2_NodeInfo.formType="材料";
            vm2_NodeInfo.data={}
            vm2_NodeInfo.userPower={};
            avalon.mix(true,vm2_NodeInfo.data,nodeInfo);
            avalon.mix(true,vm2_NodeInfo.userPower,userPower);
        }


    }).on('nodeUnselected',function(){
        activeNode=null;
    });



    $('#btn-addNode').on('click',function(){

        if( !!activeNode){
            //设定父节点属性
            nodeInfo.upNodeID=''; //未定
            nodeInfo.upNodeName=activeNode.text;
            nodeInfo.nodeId='';
            nodeInfo.nodeName='';
        }else{
            nodeInfo.upNodeID=''; //未定
            nodeInfo.upNodeName='';
            nodeInfo.nodeId='';
            nodeInfo.nodeName='';
        }



        if(userPower.read){

            vm1_LoadNodeInfoPage.url='modules/showEditNodeInfo.html';
            vm2_NodeInfo.formAction="新增";
            vm2_NodeInfo.formType="材料";
            vm2_NodeInfo.data={}
            vm2_NodeInfo.userPower={};
            avalon.mix(true,vm2_NodeInfo.data,nodeInfo);
            avalon.mix(true,vm2_NodeInfo.userPower,userPower);

        }

    });





});

