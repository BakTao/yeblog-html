layui.use(['table', 'form', 'layedit', 'laydate'], function () {
    var table = layui.table;
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;
    form.render();
    laydate.render({
        elem: '#createTimeQ'
    });
    laydate.render({
        elem: '#createTimeZ'
    });

    //为专栏名称下拉框赋值
    var columnId = xmSelect.render({
        el: '#columnName', 
        filterable: true,
        paging: true,
        pageSize: 4,
        name: 'columnId',
        data: []
    })

    $.ajax({
        url: host + "/back/columnServices/listColumnInfo",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(data){
            columnId.update({"data": data.body})
        }
    })

    //为表格赋值
    var articleFormTable = table.render({
        elem: '#articleForm'
        , url: host + "/back/blogServices/pageBlogInfo"
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
        , request: {
            pageName: 'pageIndex',
            limitName: 'pageSize'
        }
        , toolbar: '#articleToolbar'                 //显示过滤列
        , defaultToolbar: ['filter']    //显示过滤列
        , title: '博客数据表'
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , {
                field: 'enable', title: '状态', width: 80, align: 'center', sort: true, templet: function (res) {
                    if (res.enable == "0") {
                        return '<button type="button" class="btn btn-danger" style="height: 100%;width: 100%;padding:0;">已作废</button>'
                    } else if(res.enable == "1"){
                        return '<button type="button" class="btn btn-success" style="height: 100%;width: 100%;padding:0;">已审核</button>'
                    } else if(res.enable == "2"){
                        return '<button type="button" class="btn btn-dark" style="height: 100%;width: 100%;padding:0;">未审核</button>'
                    }

                }
            }
            , { field: 'blogId', title: '博客ID', width: 170, align: 'center', sort: true }
            , { field: 'title', title: '标题', width: 250, align: 'center', sort: true }
            , { field: 'userId', title: '作者ID', width: 130, align: 'center' }
            , {
                field: 'type', title: '类型', width: 90, align: 'center', templet: function (res) {
                    if (res.type == "0") {
                        return '<p style="background-color:rgb(179,92,51);color: white;">原创</p>'

                    } else if (res.type == "1") {
                        return '<p style="background-color:rgb(131,175,155);color: white;">转载</p>'

                    } else if (res.type == "2") {
                        return '<p style="background-color:rgb(205,179,128);color: white;">草稿</p>'

                    }
                    return res.type
                }
            }
            , { field: 'columnName', title: '专栏名称', width: 120, align: 'center' }
            , { field: 'createTime', title: '创建时间', width: 180, align: 'center', sort: true }
            , {
                fixed: 'oper', title: '操作', fixed: 'right', align: 'center', width: 180, templet: function (res) {
                    if (res.enable == "0") {
                        return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a> <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="recover" style="color:white;">恢复</a>'

                    } else if (res.enable == "1"){
                        return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a> <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">作废</a>'

                    } else if (res.enable == "2"){
                        return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a> <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="check" style="color:white;">审核</a><a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">作废</a>'

                    }

                }

            }
        ]]
        , page: true
    });

    //左上角按钮
    table.on('toolbar(articleForm)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);

        switch (obj.event) {
            //批量作废
            case 'deleteAll':
                var data = checkStatus.data;
                if (data.length == 0) {
                    alertmsgtmftm("请选择至少一行再操作");
                    return false;
                }

                var blogId = '';
                for (var i = 0; i < data.length - 1; i++) {
                    if (data[i].enable == "0") {
                        alertmsgtmftm("所选行有已被作废的文章,请去除");
                        return false;
                    } else {
                        blogId = blogId + data[i].blogId + ",";
                    }
                }
                if (data[data.length - 1].enable == "0") {
                    alertmsgtmftm("所选行有已被作废的文章,请去除");
                    return false;
                } else {
                    blogId = blogId + data[i].blogId;
                }

                layer.prompt({
                    type: 1,
                    formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                    title: '是否作废所选文章?',
                    area: ['300px', '120px'],
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    closeBtn: 0,                    //不显示关闭按钮
                    content: `<textarea name="zfWzReasons" id="zfWzReasons" placeholder="作废理由" style="width:300px;height:120px;"></textarea>`,
                    yes: function (index) {
                        var reason = $('#zfWzReasons').val();
                        if (reason == '') {
                            layer.open({
                                title: "提示"
                                , content: `作废理由不能为空`
                                , btn: ['关闭']
                                , btnAlign: 'c' //按钮居中
                                , yes: function (index) {   //加index,只关闭当前的
                                    layer.close(index);
                                }
                            });
                        } else {
                            $.ajax({
                                url: host + "/back/blogServices/updateBlogInfo",
                                contentType: "application/json",
                                type: "post",
                                data: JSON.stringify({
                                    "blogId": blogId,
                                    "enable": "0",
                                    "reason": reason
                                }),
                                success: function (data) {
                                    if (data.body == "success") {
                                        alertmsgtmftm("操作成功")
                                        articleFormTable.reload();
                                    }
                                    else {
                                        alertmsgtmftm("操作失败,请稍后再试")
                                    }
                                },
                            })
                        }
                    },
                    btn2: function (index) {
                        var reason = $('#zfWzReasons').val();
                        if (reason != '') {
                            layer.open({
                                title: "提示"
                                , content: `是否关闭?`
                                , btn: ['返回', '关闭']
                                , btnAlign: 'c' //按钮居中
                                , yes: function (index) {   //加index,只关闭当前的
                                    layer.close(index);
                                }, btn2: function () {
                                    layer.closeAll();
                                }
                            });
                            return false;               //不关闭父窗口
                        }
                    }
                });
                break;
            //批量恢复
            case 'recoverAll':
                var data = checkStatus.data;
                if (data.length == 0) {
                    alertmsgtmftm("请选择至少一行再操作");
                    return false;
                }

                var blogId = '';
                for (var i = 0; i < data.length - 1; i++) {
                    if (data[i].enable != "0") {
                        alertmsgtmftm("只能选择已作废的文章,请重新选择");
                        return false;
                    } else {
                        blogId = blogId + data[i].blogId + ",";
                    }
                }
                if (data[data.length - 1].enable != "0") {
                    alertmsgtmftm("只能选择已作废的文章,请重新选择");
                    return false;
                } else {
                    blogId = blogId + data[i].blogId;
                }
                layer.prompt({
                    type: 1,
                    formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                    title: '是否恢复所选文章?',
                    area: ['300px', '120px'],
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    closeBtn: 0,                    //不显示关闭按钮
                    content: `<p>注意:恢复会把之前的作废理由清空</p>`,
                    yes: function (index) {

                        $.ajax({
                            url: host + "/back/blogServices/updateBlogInfo",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "blogId": blogId,
                                "enable": "1",
                                "reason": ""
                            }),
                            success: function (data) {
                                if (data.body == "success") {
                                    alertmsgtmftm("操作成功")
                                    articleFormTable.reload();
                                }
                                else {
                                    alertmsgtmftm("操作失败,请稍后再试")
                                }
                            },
                        })
                    }
                });
                break;
                //批量审核
                case 'checkAll':
                var data = checkStatus.data;
                if (data.length == 0) {
                    alertmsgtmftm("请选择至少一行再操作");
                    return false;
                }

                var blogId = '';
                for (var i = 0; i < data.length - 1; i++) {
                    if (data[i].enable != "2") {
                        alertmsgtmftm("只能选择未审核的文章,请重新选择");
                        return false;
                    } else {
                        blogId = blogId + data[i].blogId + ",";
                    }
                }
                if (data[data.length - 1].enable != "2") {
                    alertmsgtmftm("只能选择未审核的文章,请重新选择");
                    return false;
                } else {
                    blogId = blogId + data[i].blogId;
                }
                layer.prompt({
                    type: 1,
                    formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                    title: '提示?',
                    area: ['300px', '120px'],
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    closeBtn: 0,                    //不显示关闭按钮
                    content: `<p>是否通过所选文章?</p>`,
                    yes: function (index) {

                        $.ajax({
                            url: host + "/back/blogServices/updateBlogInfo",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "blogId": blogId,
                                "enable": "1",
                                "reason": ""
                            }),
                            success: function (data) {
                                if (data.body == "success") {
                                    alertmsgtmftm("操作成功")
                                    articleFormTable.reload();
                                }
                                else {
                                    alertmsgtmftm("操作失败,请稍后再试")
                                }
                            },
                        })
                    }
                });
                break;
        };
    });

    //操作
    table.on('tool(articleForm)', function (obj) {
        var data = obj.data;
        if (obj.event === 'delete') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '是否作废此文章?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<textarea name="zfWzReason" id="zfWzReason" placeholder="作废理由" style="width:300px;height:120px;"></textarea>`,
                yes: function (index) {
                    var reason = $('#zfWzReason').val();
                    if (reason == '') {
                        layer.open({
                            title: "提示"
                            , content: `作废理由不能为空`
                            , btn: ['关闭']
                            , btnAlign: 'c' //按钮居中
                            , yes: function (index) {   //加index,只关闭当前的
                                layer.close(index);
                            }
                        });
                    } else {
                        $.ajax({
                            url: host + "/back/blogServices/updateBlogInfo",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "blogId": data.blogId,
                                "enable": "0",
                                "reason": reason
                            }),
                            success: function (data) {
                                if (data.body == "success") {
                                    alertmsgtmftm("操作成功")
                                    articleFormTable.reload();
                                }
                                else {
                                    alertmsgtmftm("操作失败,请稍后再试")
                                }
                            },
                        })
                    }
                },
                btn2: function (index) {
                    var reason = $('#zfWzReason').val();
                    if (reason != '') {
                        layer.open({
                            title: "提示"
                            , content: `是否关闭?`
                            , btn: ['返回', '关闭']
                            , btnAlign: 'c' //按钮居中
                            , yes: function (index) {   //加index,只关闭当前的
                                layer.close(index);
                            }, btn2: function () {
                                layer.closeAll();
                            }
                        });
                        return false;               //不关闭父窗口
                    }
                }
            });

        } else if (obj.event === 'recover') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '是否恢复此文章?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>注意:恢复会把之前的作废理由清空</p>`,
                yes: function (index) {

                    $.ajax({
                        url: host + "/back/blogServices/updateBlogInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "blogId": data.blogId,
                            "enable": "1",
                            "reason": ""
                        }),
                        success: function (data) {
                            if (data.body == "success") {
                                alertmsgtmftm("操作成功")
                                articleFormTable.reload();
                            }
                            else {
                                alertmsgtmftm("操作失败,请稍后再试")
                            }
                        },
                    })
                }
            });
        } else if (obj.event === 'check') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '提示',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>是否通过此文章?</p>`,
                yes: function (index) {

                    $.ajax({
                        url: host + "/back/blogServices/updateBlogInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "blogId": data.blogId,
                            "enable": "1",
                            "reason": ""
                        }),
                        success: function (data) {
                            if (data.body == "success") {
                                alertmsgtmftm("操作成功")
                                articleFormTable.reload();
                            }
                            else {
                                alertmsgtmftm("操作失败,请稍后再试")
                            }
                        },
                    })
                }
            });
        }else if (obj.event === 'view') {
            // layer.open({
            //     title: "编辑用户信息"
            //     , type: 1
            //     , area: ['70%', '85%']
            //     , offset: ['10%', '25%']
            //     , content: $("div #editForm")
            //     , btn: ['关闭']
            //     , btnAlign: 'c' //按钮居中
            //     , shade: 0 //不显示遮罩
            //     , yes: function () {
            //         layer.closeAll();
            //     }
            // });
            // form.val('editForm', {
            //     "name": data.name // "name": "value"
            //     , "sex": data.sex
            //     , "loginId": data.loginId
            //     , "password": data.password
            //     , "phone": data.phone
            //     , "email": data.email
            //     , "regTime": data.regTime
            //     , "blogCount": data.blogCount
            //     , "ownBlogCount": data.ownBlogCount
            //     , "noOwnBlogCount": data.noOwnBlogCount
            //     , "testBlogCount": data.testBlogCount
            //     , "lastLogIp": data.lastLogIp
            //     , "lastLogTime": data.lastLogTime
            //     , "enable": data.enable == "1"
            //     , "reason": data.reason
            // });
            //$("#userPhoto").attr("src",data.userPhoto)
        }
    });

    //查询
    layui.$('#articleSearchFormBtn').on('click', function () {
        var data = form.val('articleSearchForm');
        table.reload('articleForm', {
            where: data,
            url: host + "/back/blogServices/pageBlogInfo",
            method: "post",
            contentType: 'application/json'
        })
        return false;
    });
});