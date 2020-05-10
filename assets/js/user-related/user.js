layui.use(['table', 'form', 'layedit', 'laydate'], function () {
    var table = layui.table;
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;

    form.render();
    laydate.render({
        elem: '#regTimeQ'
    });
    laydate.render({
        elem: '#regTimeZ'
    });
    var userFormTable = table.render({
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
        , toolbar: true                 //显示过滤列
        , defaultToolbar: ['filter']    //显示过滤列
        , title: '用户数据表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , error: function(xhr){
            errorLogin(xhr);
        }
        , cols: [[
            {
                field: 'enable', title: '状态', width: 80, align: 'center', sort: true, templet: function (res) {
                    if (res.enable == "1") {
                        return '<button type="button" class="btn btn-warning" style="height: 100%;width: 100%;padding:0;">正常</button>'
                    } else {
                        return '<button type="button" class="btn btn-danger" style="height: 100%;width: 100%;padding:0;">封禁</button>'
                    }

                }
            }
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
            , { field: 'blogCountHj', title: '博客数', width: 100, align: 'center', sort: true }
            , {
                fixed: 'oper', title: '操作', fixed: 'right', align: 'center', width: 150, templet: function (res) {
                    if (res.enable == "1") {
                        return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a> <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">封禁</a>'

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
        if (obj.event === 'delete') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '是否封禁此账号?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<form class="layui-form" lay-filter="unableForm">
                <div class="layui-form-item">
                <textarea name="zfYhReason" id="zfYhReason" placeholder="封禁理由" style="width:300px;height:120px;"></textarea>
                </div>
                <div class="layui-form-item">
                <div class="layui-input-inline" style="width: 290px;">
                <input type="radio" name="unableDay" value="7" title="7天" checked="" lay-filter="unableDay">
                <input type="radio" name="unableDay" value="30" title="30天" lay-filter="unableDay">
                <input type="radio" name="unableDay" value="180" title="180天" lay-filter="unableDay">
                <input type="radio" name="unableDay" value="0" title="其他" lay-filter="unableDay">
                <input
                type="text"
                name="unableDayText"
                autocomplete="off"
                placeholder="天数"
                class="layui-input"
                readonly=""
                style="display:inline;width:200px;"/>
                </div>
                </div>
                </form>
                <script>
                layui.use(['form'], function () {
                    var form = layui.form;
                    form.render();

                    form.on('radio(unableDay)', function (data) {
                        var unableDay = data.value;
                        if(unableDay == "0"){
                            $("input[name=unableDayText]").removeAttr("readonly")
                        }else{
                            $("input[name=unableDayText]").attr("readonly","")
                        }
                    });
                })
                </script>`,
                yes: function (index) {
                    var formData = form.val("unableForm");
                    var reason = formData.zfYhReason;
                    var unableDay = formData.unableDay;
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
                    if (unableDay == "0" && formData.unableDayText == "") {
                        layer.open({
                            title: "提示"
                            , content: `封禁天数不能为空`
                            , btn: ['关闭']
                            , btnAlign: 'c' //按钮居中
                            , yes: function (index) {   //加index,只关闭当前的
                                layer.close(index);
                            }
                        });
                        return false;
                    } else if (unableDay == "0" && formData.unableDayText != "") {
                        unableDay = formData.unableDayText;
                    }
                    $.ajax({
                        url: host + "/back/userServices/updateUserInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "loginId": data.loginId,
                            "unableDay": unableDay,
                            "enable": "0",
                            "reason": reason
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
                                userFormTable.reload();
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
                title: '是否恢复此账号?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>注意:恢复会把之前的封禁理由清空</p>`,
                yes: function (index) {

                    $.ajax({
                        url: host + "/back/userServices/updateUserInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "loginId": data.loginId,
                            "enable": "1",
                            "reason": ""
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
                                userFormTable.reload();
                            }
                            else {
                                alertmsgFtm("操作失败,请稍后再试")
                            }
                        },
                    })
                }
            });
        } else if (obj.event === 'view') {
            layer.open({
                title: "查看用户信息"
                , type: 1
                , area: ['70%', '85%']
                , offset: ['10%', '25%']
                , content: $("div #userViewForm")
                , btn: ['关闭']
                , btnAlign: 'c' //按钮居中
                , shade: 0 //不显示遮罩
                , yes: function () {
                    layer.closeAll();
                }
            });
            form.val('userViewForm', {
                "name": data.name // "name": "value"
                , "sex": data.sex
                , "loginId": data.loginId
                , "password": data.password
                , "phone": data.phone
                , "email": data.email
                , "regTime": data.regTime
                , "blogCount": data.blogCount
                , "ownBlogCount": data.ownBlogCount
                , "noOwnBlogCount": data.noOwnBlogCount
                , "testBlogCount": data.testBlogCount
                , "collectionNums": data.collectionNums
                , "commentNumsHj": data.commentNumsHj
                , "commentPraiseNums": data.commentPraiseNums
                , "lastLogIp": data.lastLogIp
                , "lastLogTime": data.lastLogTime
                , "enable": data.enable == "1"
                , "reason": data.reason
                , "unableTime": data.unableTime
            });
            $("#userPhoto").attr("src", uploadUrl + data.userPhoto)
        }
    });

    //查询
    layui.$('#userSearchFormBtn').on('click', function () {
        var data = form.val('userSearchForm');
        table.reload('userForm', {
            where: data,
            url: host + "/back/userServices/pageUserInfo",
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