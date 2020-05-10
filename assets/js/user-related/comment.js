layui.use(['table', 'form', 'layedit', 'laydate'], function () {
    var table = layui.table;
    var form = layui.form
        , layer = layui.layer
        , laydate = layui.laydate;

    form.render();
    laydate.render({
        elem: '#createTimeQ'
    });
    laydate.render({
        elem: '#createTimeZ'
    });
    var commentFormTable = table.render({
        elem: '#commentForm'
        , url: host + "/back/commentServices/pageUserCommentInfo"
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
        , toolbar: true                 //显示过滤列
        , defaultToolbar: ['filter']    //显示过滤列
        , title: '评论数据表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , error: function(xhr){
            errorLogin(xhr);
        }
        , cols: [[
            { field: 'userId', title: '评论人', width: 120, align: 'center', sort: true }
            , { field: 'content', title: '内容', width: 220, align: 'center' }
            , { field: 'replyUserId', title: '被评论人', width: 120, align: 'center'}
            , { field: 'title', title: '博客名', width: 200, align: 'center' }
            , { field: 'time', title: '创建时间', width: 180, align: 'center' }
            , { field: 'praiseNums', title: '点赞数', width: 100, align: 'center', sort: true }
            , {
                field: 'enable', title: '状态', width: 80, align: 'center', sort: true, templet: function (res) {
                    if (res.enable == "1") {
                        return '<button type="button" class="btn btn-warning" style="height: 100%;width: 100%;padding:0;">正常</button>'
                    } else {
                        return '<button type="button" class="btn btn-danger" style="height: 100%;width: 100%;padding:0;">封禁</button>'
                    }

                }
            }
            , { field: 'reason', title: '原因', width: 150, align: 'center', sort: true }
            , {
                fixed: 'oper', title: '操作', fixed: 'right', align: 'center', width: 150, templet: function (res) {
                    if (res.enable == "1") {
                        return ' <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">封禁</a>'

                    } else {
                        return ' <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="recover" style="color:white;">恢复</a>'

                    }

                }

            }
        ]]
        , page: true
    });

    //监听行工具事件
    table.on('tool(commentForm)', function (obj) {
        var data = obj.data;
        if (obj.event === 'delete') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '是否封禁此评论?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<form class="layui-form" lay-filter="unableForm">
                <div class="layui-form-item">
                <textarea name="zfYhReason" id="zfYhReason" placeholder="封禁理由" style="width:300px;height:120px;"></textarea>
                </div>
                </form>
                <script>
                layui.use(['form'], function () {
                    var form = layui.form;
                    form.render();
                })
                </script>`,
                yes: function (index) {
                    var formData = form.val("unableForm");
                    var reason = formData.zfYhReason;
                    if (reason == '') {
                        layer.open({
                            title: "提示"
                            , content: `封禁理由不能为空`
                            , btn: ['关闭']
                            , btnAlign: 'c' //按钮居中
                            , yes: function (index) {   //加index,只关闭当前的
                                layer.close(index);
                            }
                        });
                        return false;
                    }
                    
                    $.ajax({
                        url: host + "/back/commentServices/updateCommentInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "id": data.id,
                            "enable": "0",
                            "reason": reason,
                            "praiseNums": data.praiseNums
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
                                commentFormTable.reload();
                            }
                            else {
                                alertmsgFtm("操作失败,请稍后再试")
                            }
                        },
                    })

                },
                btn2: function (index) {
                    var reason = $('#zfYhReason').val();
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
                title: '是否恢复此评论?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>注意:恢复会把之前的封禁理由清空</p>`,
                yes: function (index) {

                    $.ajax({
                        url: host + "/back/commentServices/updateCommentInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "id": data.id,
                            "enable": "1",
                            "reason": "",
                            "praiseNums": data.praiseNums
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
                                commentFormTable.reload();
                            }
                            else {
                                alertmsgFtm("操作失败,请稍后再试")
                            }
                        },
                    })
                }
            });
        }
    });

    //查询
    layui.$('#commentSearchFormBtn').on('click', function () {
        var data = form.val('commentSearchForm');
        table.reload('commentForm', {
            where: data,
            url: host + "/back/commentServices/pageUserCommentInfo",
            method: "post",
            contentType: 'application/json'
            , headers:{
                Authorization: "ym:" + sessionStorage.getItem('token')
            }
            , error: function(xhr){
                errorLogin(xhr);
            }
        })
        return false;
    });

});