layui.use(['table', 'element'], function () {
    var $ = layui.jquery
        , layer = layui.layer
        , element = layui.element
        , table = layui.table; //Tab的切换功能，切换事件监听等，需要依赖element模块


    $.ajax({
        url: host + "/back/scheduleServices/pageScheduleInfo",
        contentType: "application/json",
        type: "post",
        data: JSON.stringify({
            "type": "0"
        }),
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
        },
        error: function(xhr){
            errorLogin(xhr);
        },
        success: function (data) {
            $(".xxText").text(data.body.pager.recordCount)
        },
    })
    //查询表格1
    var scheduleXxTable = table.render({
        elem: '#scheduleXxTable'
        , url: host + "/back/scheduleServices/pageScheduleInfo"
        , method: 'post'
        , contentType: 'application/json'
        , parseData: function (res) {
            return {
                "code": res.head.code,
                "msg": res.head.msg,
                "count": res.body.pager.recordCount,
                "data": res.body.data
            };
        }
        , where: {
            type: "0,1"
        }
        , request: {
            pageName: 'pageIndex',
            limitName: 'pageSize'
        }
        , title: '消息表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , cols: [
            [
                { type: 'checkbox' }
                , { field: 'title', title: '标题', sort: true, event: 'detail', style: 'cursor: pointer;' }
                , { field: 'userId', title: '提出者', align: 'center', width: '15%', sort: true }
                , {
                    field: 'type', title: '状态', align: 'center', width: '10%', sort: true, templet: function (res) {
                        if (res.type == "0") {
                            return ' <span style="color:red;">未阅</span>'
                        } else if (res.type == "1") {
                            return ' <span style="color:blue;">已读</span>'
                        }
                    }
                }
                , { field: 'createTime', title: '创建时间', align: 'center', width: '20%', sort: true }
            ]

        ]
        , page: true
        , error: function(xhr){
            errorLogin(xhr);
        }
    
    });

    //查询表格2
    var scheduleDbTable = table.render({
        elem: '#scheduleDbTable'
        , url: host + "/back/scheduleServices/pageScheduleInfo"
        , method: 'post'
        , contentType: 'application/json'
        , parseData: function (res) {
            return {
                "code": res.head.code,
                "msg": res.head.msg,
                "count": res.body.pager.recordCount,
                "data": res.body.data
            };
        }
        , where: {
            type: "2"
        }
        , request: {
            pageName: 'pageIndex',
            limitName: 'pageSize'
        }
        , title: '消息表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , cols: [
            [
                { type: 'checkbox' }
                , { field: 'title', title: '标题', sort: true, event: 'detail', style: 'cursor: pointer;' }
                , { field: 'userId', title: '提出者', align: 'center', width: '15%', sort: true }
                , {
                    field: 'type', title: '状态', align: 'center', sort: true, width: '10%', templet: function (res) {
                        if (res.type == "2") {
                            return ' <span style="color:red;">待办</span>'
                        }
                    }
                }
                , { field: 'createTime', title: '创建时间', align: 'center', width: '20%', sort: true }
            ]

        ]
        , done: function (res, curr, count) {
            if (count != 0) {
                $(".dbClass").addClass("layui-badge-dot")
            } else {
                $(".dbClass").removeClass("layui-badge-dot")
            }
        }
        , error: function(xhr){
            errorLogin(xhr);
        }    
        , page: true
    });

    //查询表格3
    var scheduleYbTable = table.render({
        elem: '#scheduleYbTable'
        , url: host + "/back/scheduleServices/pageScheduleInfo"
        , method: 'post'
        , contentType: 'application/json'
        , parseData: function (res) {
            return {
                "code": res.head.code,
                "msg": res.head.msg,
                "count": res.body.pager.recordCount,
                "data": res.body.data
            };
        }
        , where: {
            type: "3"
        }
        , request: {
            pageName: 'pageIndex',
            limitName: 'pageSize'
        }
        , title: '消息表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , error: function(xhr){
            errorLogin(xhr);
        }
        , cols: [
            [
                { type: 'checkbox' }
                , { field: 'title', title: '标题', sort: true, event: 'detail', style: 'cursor: pointer;' }
                , { field: 'userId', title: '提出者', align: 'center', width: '15%', sort: true }
                , {
                    field: 'type', title: '状态', align: 'center', sort: true, width: '10%', templet: function (res) {
                        if (res.type == "3") {
                            return ' <span style="color:green;">已办</span>'
                        }
                    }
                }
                , { field: 'createTime', title: '创建时间', align: 'center', width: '20%', sort: true }
                , { field: 'finishTime', title: '完成时间', align: 'center', width: '20%', sort: true }
            ]

        ]
        , page: true
    });

    $('.layui-tab-content').resize(function () {
        table.resize('scheduleXxTable')
        table.resize('scheduleDbTable')
        table.resize('scheduleYbTable')
    });

    $("#deleteBtn1").on("click", function () {
        var tableData = table.checkStatus("scheduleXxTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId;
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否删除</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/deleteSchedule",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            $("div#router-div").load("schedule/schedule.html"); 

                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    $("#tjydBtn1").on("click", function () {
        var tableData = table.checkStatus("scheduleXxTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否标为已读</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/updateScheduleInfo",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId,
                        "type": "1"
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            $("div#router-div").load("schedule/schedule.html"); 
                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    $("#zwdbBtn1").on("click", function () {
        var tableData = table.checkStatus("scheduleXxTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否转为待办</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/updateScheduleInfo",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId,
                        "type": "2"
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            $("div#router-div").load("schedule/schedule.html"); 
                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    $("#deleteBtn2").on("click", function () {
        var tableData = table.checkStatus("scheduleDbTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否删除</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/deleteSchedule",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            scheduleDbTable.reload();
                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    $("#zwybBtn2").on("click", function () {
        var tableData = table.checkStatus("scheduleDbTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否转为已办</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/updateScheduleInfo",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId,
                        "type": "3"
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            scheduleDbTable.reload();
                            scheduleYbTable.reload();
                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    $("#deleteBtn3").on("click", function () {
        var tableData = table.checkStatus("scheduleYbTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否删除</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/deleteSchedule",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            scheduleYbTable.reload();
                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    $("#zwdbBtn3").on("click", function () {
        var tableData = table.checkStatus("scheduleYbTable").data;
        if (tableData.length == 0) {
            alertmsgFtm("请选择至少一条操作");
            return false;
        }
        var scheduleId = "";
        for (var i = 0; i < tableData.length - 1; i++) {
            scheduleId = scheduleId + tableData[i].scheduleId + ",";
        }
        scheduleId = scheduleId + tableData[tableData.length - 1].scheduleId
        layer.prompt({
            type: 1,
            formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
            title: '提示',
            area: ['300px', '120px'],
            btnAlign: 'c',
            btn: ['确定', '取消'],
            closeBtn: 0,                    //不显示关闭按钮
            content: `<p>是否转为待办</p>`,
            yes: function (index) {
                $.ajax({
                    url: host + "/back/scheduleServices/updateScheduleInfo",
                    contentType: "application/json",
                    type: "post",
                    data: JSON.stringify({
                        "scheduleId": scheduleId,
                        "type": "2"
                    }),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                    },
                    error: function(xhr){
                        errorLogin(xhr);
                    },
                    success: function (data) {
                        if (data.body == "success") {
                            alertmsgFtm("操作成功")
                            scheduleDbTable.reload();
                            scheduleYbTable.reload();
                        }
                        else {
                            alertmsgFtm("操作失败,请稍后再试")
                        }
                    },
                })
            }
        });
    })

    table.on('tool(scheduleXxTable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            detailData = data;
            $.ajax({
                url: host + "/back/scheduleServices/updateScheduleInfo",
                contentType: "application/json",
                type: "post",
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                },
                error: function(xhr){
                    errorLogin(xhr);
                },
                data: JSON.stringify({
                    "scheduleId": data.scheduleId,
                    "type": "1"
                })
            })
            $(".card").load("schedule/detail.html");
        }
    });
    table.on('tool(scheduleDbTable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            detailData = data;
            $(".card").load("schedule/detail.html");
        }
    });
    table.on('tool(scheduleYbTable)', function (obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            detailData = data;
            $(".card").load("schedule/detail.html");
        }
    });
});
var detailData;