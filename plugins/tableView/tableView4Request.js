/**
 * Created by Administrator on 2016/7/8.
 */





require.config({

    path:{
        jquery:'../../jsLib/jquery-1.12.3.js',
        'tableView':'tableView'
    }


});




require(['jquery','tableView'],function($){


    $('.tableView').tableView({
        tableID:'ms-table',
        Head:tableHeader,
        Data:tableData,
        isShowingCheckBox:false,
        rowSettings:{
            buttons:[{ innerHTML:$('<a></a>').append('<span>jiao</span>'),  data:{'id':'',ctrlid:3001}}

            ],
            onRowButtonClick: function (evt,rowIndex ,$row,rowData,buttonData) {
                alert(buttonData);
            }
        }
    });



});



var data={
    "code": 1,
    "msg": "ok",
    "token": "",
    "uurl": "192.168.10.201:86/lngyes/bin/gemsfunmod.php",
    "DataGUID": "",
    "uid": "cda4296a-4cc6-46d1-96223ae314261a",
    "caption": "查找液场",
    "name": "MSUP_List",
    "windows": [
        {
            "uid": "0224b944-99f8-4124-86ccbd39187d93",
            "caption": "液场列表",
            "name": "MSUP_List",
            "winmodules": [
                {
                    "uid": "35717ee3-137b-400d-93ad3cde0b256c",
                    "caption": "客户信息",
                    "mtype": "4",
                    "DetailWinID": "",
                    "DataGUID": "",
                    "UpIDValX": "",
                    "FlagValX": "",
                    "ctrlid": "3004",
                    "winmodfields": {
                        "uid": "35717ee3-137b-400d-93ad3cde0b256c",
                        "count": 1,
                        "Body": {
                            "Rows": 47,
                            "Cols": 5,
                            "Head": [
                                "uID",
                                "MID",
                                "Caption",
                                "SProduct",
                                "区域"
                            ],
                            "Data": [
                                [
                                    "575e4c592f9a0",
                                    0,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4c722f9a0",
                                    1,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4c7c8d89e",
                                    2,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4c7c8d89e",
                                    3,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4c8d15602",
                                    4,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4d04d6049",
                                    5,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4d1515231",
                                    "6 三代富贵",
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4d799e775",
                                    7,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4dbe928b9",
                                    8 ,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4dc76baee",
                                    9,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4e30a190d",
                                    10,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4e6aad7c9",
                                    11,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4eac467d6",
                                    12,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4ed1a153c",
                                    13,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4ed933e4a",
                                    14,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4f040f2d3",
                                    15,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4f1dd00ea",
                                    16,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4f4d1a9ee",
                                    17,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4f7f09b16",
                                    18,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4f86a8f4e",
                                    19,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4f934ed5a",
                                    20,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4fad400d7",
                                    21,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e4fb6f1329",
                                    22,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e501ec961b",
                                    23,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e503f0435a",
                                    24,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e504933a79",
                                    25,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e506952a63",
                                    26,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e508fa9ac0",
                                    27,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e5118b5d4d",
                                    28,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e512e9bd7f",
                                    29,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e51396a40a",
                                    30,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e5149251c7",
                                    31,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e515fbcfbd",
                                    32,
                                    "asdff ",
                                    "asdf ",
                                    "asdff "
                                ],
                                [
                                    "575e517be509c",
                                    33,
                                    "asdff ",
                                    "asdf ",
                                    "asdff "
                                ],
                                [
                                    "575e5182a6558",
                                    34,
                                    "asdff ",
                                    "asdf ",
                                    "asdff "
                                ],
                                [
                                    "575e5250d7ecd",
                                    35,
                                    "asdf",
                                    "asdf",
                                    "asdf"
                                ],
                                [
                                    "575e53c7937fc",
                                    36,
                                    "asdsafasf",
                                    "asdfasf",
                                    "asdfa"
                                ],
                                [
                                    "575e555246f77",
                                    37,
                                    "asdsafasf",
                                    "asdfasf",
                                    "asdfa"
                                ],
                                [
                                    "575e57947814b",
                                    38,
                                    "sdfdddddd",
                                    "223asdf",
                                    "asdf"
                                ],
                                [
                                    "575e5899eaffa",
                                    39,
                                    "sdfdddddd",
                                    "223asdf",
                                    "asdf"
                                ],
                                [
                                    "575e61f9d17ce",
                                    40,
                                    "阿斯顿飞",
                                    null,
                                    null
                                ],
                                [
                                    "575e6290c7f37",
                                    41,
                                    "阿斯顿飞",
                                    "阿斯顿飞",
                                    "阿斯顿飞"
                                ],
                                [
                                    "575e63277b6b3",
                                    42,
                                    "阿斯顿飞",
                                    "阿斯顿飞",
                                    null
                                ],
                                [
                                    "575e63e7e89d4",
                                    43,
                                    "三代富贵",
                                    "三代富贵",
                                    "三代富贵"
                                ],
                                [
                                    "575e6412928b9",
                                    44,
                                    "三代富贵 ",
                                    null,
                                    null
                                ],
                                [
                                    "575e647ca87ad",
                                    45,
                                    "三代富贵 ",
                                    null,
                                    null
                                ],
                                [
                                    "575e648d39da8",
                                    46,
                                    null,
                                    null,
                                    null
                                ],
                                [
                                    "575e68969fe59",
                                    47,
                                    null,
                                    null,
                                    null
                                ]
                            ],
                            "RowStart": 0,
                            "RowEnd": 200,
                            "PageCount": 200,
                            "TotalRows": 47,
                            "PageIndex": 0,
                            "TotalPages": 1,
                            "DetailWinID": ""
                        }
                    }
                }
            ]
        }
    ]
};
var tableHeader=data.windows[0].winmodules[0].winmodfields.Body.Head;
var tableData=data.windows[0].winmodules[0].winmodfields.Body.Data;


