layui.use(['table', 'form', 'layedit', 'laydate'], function () {
    var table = layui.table;
    var form = layui.form
    ,layer = layui.layer
    ,layedit = layui.layedit
    ,laydate = layui.laydate;
    table.render({
        elem: '#userForm'
        , url: host + "/back/userServices/pageUserInfo"
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
        , title: '用户数据表'
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , { field: 'name', title: '名称', width: 80, align: 'center', sort: true }
            , { field: 'sex', title: '性别', width: 60, align: 'center' }
            , {
                field: 'loginId', title: '登录名', width: 130, align: 'center', templet: function (res) {
                    return '<em>' + res.loginId + '</em>'
                }
            }, { field: 'phone', title: '手机号', width: 120, align: 'center' }
            , { field: 'email', title: '邮箱', width: 200, align: 'center' }
            , { field: 'regTime', title: '注册时间', width: 180, align: 'center', sort: true }

            , { field: 'lastLogIp', title: '上次登录IP', width: 160, align: 'center' }
            , { field: 'lastLogTime', title: '上次登录时间', width: 180, align: 'center', sort: true }
            , {
                field: 'enable', title: '状态', width: 80, align: 'center', sort: true, templet: function (res) {
                    if (res.enable == "1") {
                        return '<button type="button" class="btn btn-warning" style="height: 100%;width: 100%;padding:0;">有效</button>'
                    } else {
                        return '<button type="button" class="btn btn-danger" style="height: 100%;width: 100%;padding:0;">无效</button>'
                    }

                }
            }
            , {
                fixed: 'oper', title: '操作', fixed: 'right', align: 'center', width: 150, templet: function (res) {
                    if (res.enable == "1") {
                        return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a> <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">作废</a>'

                    } else {
                        return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a> <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="recover" style="color:white;">恢复</a>'

                    }

                }

            }
        ]]
        , page: true
    });
    //监听行工具事件
    table.on('tool(userForm)', function (obj) {
        var data = obj.data;
        console.log(data)
        if (obj.event === 'delete') {
            layer.confirm('确定作废此人的账户?', function (index) {
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'recover') {
            layer.confirm('确定恢复此人的账户?', function (index) {
                obj.del();
                layer.close(index);
            });
        } else if (obj.event === 'view') {
            layer.open({
                title: "编辑用户信息"
                , type: 1
                , area: ['70%', '85%']
                , offset: ['10%','25%']
                , content: $("div #editForm")
                , btn: ['关闭']
                , btnAlign: 'c' //按钮居中
                , shade: 0 //不显示遮罩
                , yes: function () {
                    layer.closeAll();
                }
            });
            form.val('editForm', {
                "name": data.name // "name": "value"
                ,"sex": data.sex
                ,"loginId": data.loginId
                ,"password": data.password
                ,"phone": data.phone
                ,"email": data.email
                ,"regTime": data.regTime
                ,"blogCount": data.blogCount
                ,"ownBlogCount": data.ownBlogCount
                ,"noOwnBlogCount": data.noOwnBlogCount
                ,"testBlogCount": data.testBlogCount
                ,"lastLogIp": data.lastLogIp
                ,"lastLogTime": data.lastLogTime
                ,"enable": data.enable == "1"
                ,"reason": data.reason
              });
              //$("#userPhoto").attr("src",data.userPhoto)
        }
    });



});