checkLogin()
$("div#router-div").load("home/home.html");
$(".router-link").click(function () {

    var url = $(this).attr("href");                 //获取路由路径

    $(".sidebar-menu li").removeClass("active");    //清除焦点样式
    if (!$(this).parent().hasClass("dropdown")) {
        $(this).parent().parent().parent().addClass("active");  //为外层加样式
    }
    $(this).parent().addClass("active");            //为外层加样式
    $("div#router-div").load(url);                  //加载路由页面
    return false;
})
$.ajax({
    url: host + "/back/adminUserServices/getAdminUserInfo",
    contentType: "application/json",
    type: "post",
    data: JSON.stringify({
        "token": sessionStorage.getItem('token')
    }),
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    error: function(xhr){
        errorLogin(xhr);
    },
    success: function (data) {
        AdminUserInfo = data.body;
        $(".adminName").text("你好, " + AdminUserInfo.name)
        $(".adminLastTime").text("上次登录时间->" + AdminUserInfo.lastLogTime)
        $(".adminLastIp").text("上次登录IP->" + AdminUserInfo.lastLogIp)
    }
})

function logOut(){
    sessionStorage.clear();
    AdminUserInfo = null;
}

function getAdminUserInfo(){
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.open({
            offset: "auto"
            , content: `
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding: 9px 12px;">用户ID</label>
                <div class="layui-input-inline">
                <input type="text" name="userId" placeholder="用户ID" autocomplete="off" class="layui-input" readonly="">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding: 9px 12px;">用户名称</label>
                <div class="layui-input-inline">
                <input type="text" name="username" placeholder="用户名称" autocomplete="off" class="layui-input" readonly="">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding: 9px 12px;">上次登录时间</label>
                <div class="layui-input-inline">
                <input type="text" name="lastLogTime" placeholder="上次登录时间" autocomplete="off" class="layui-input" readonly="">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding: 9px 12px;">上次登录IP</label>
                <div class="layui-input-inline">
                <input type="text" name="lastLogIp" placeholder="上次登录IP" autocomplete="off" class="layui-input" readonly="">
                </div>
            </div>
            <script>
                $("input[name='userId']").val(AdminUserInfo.loginId)
                $("input[name='username']").val(AdminUserInfo.name)
                $("input[name='lastLogTime']").val(AdminUserInfo.lastLogTime)
                $("input[name='lastLogIp']").val(AdminUserInfo.lastLogIp)
            </script>
            `
            , btn: '关闭'
            , btnAlign: 'c' //按钮居中
            , yes: function () {
                layer.closeAll();
            }
        });

    });
}

function changePassword(){
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.open({
            type: 1
            , content: `
            <div class="layui-form-item" style="margin-top:20px;">
                <label class="layui-form-label" style="padding: 9px 5px;">旧密码</label>
                <div class="layui-input-inline">
                <input type="text" name="oldPassword" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding: 9px 5px;">新密码</label>
                <div class="layui-input-inline">
                <input type="text" name="newPassword" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding: 9px 5px;">再输入一次</label>
                <div class="layui-input-inline">
                <input type="text" name="newPasswordAgain" autocomplete="off" class="layui-input">
                </div>
            </div>
            `
            , btn: ['确认','关闭']
            , btnAlign: 'c' //按钮居中
            , yes: function (index) {
                var oldPassword = $("input[name='oldPassword']").val();
                var newPassword = $("input[name='newPassword']").val();
                var newPasswordAgain = $("input[name='newPasswordAgain']").val();
                if(oldPassword == '' || newPassword == '' || newPasswordAgain == '' ){
                    alertmsgFtmIndex("请完整输入所有项");
                }
                else if(newPassword != newPasswordAgain){
                    alertmsgFtmIndex("两次密码不一致");
                }
                else{
                    $.ajax({
                        url: host + "/back/adminUserServices/updateAdminUserInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "loginId": AdminUserInfo.loginId,
                            "password": oldPassword,
                            "newPassword": newPassword
                        }),
                        beforeSend: function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                        },
                        error: function(xhr){
                            errorLogin(xhr);
                        },
                        success: function (data) {
                            if(data.head.code == "601"){
                                alertmsgFtmIndex("原密码输入错误");    
                            }else{
                                alertmsgFtm("操作成功");
                            }
                        }
                    })
                }
                
            }
            , btn2: function(){
                layer.closeAll();
            }
        });

    });
}