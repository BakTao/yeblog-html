function unloginmsg(msg) {
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.open({
            offset: "auto"
            ,content: '<div style="padding: 20px 100px;">'+ msg +'</div>'
            ,btn: '关闭'
            ,btnAlign: 'c' //按钮居中
            ,shade: 0 //不显示遮罩
            ,yes: function(){
                $(window).attr('location', 'login/login.html')
            }
        });

    });
}

//checkLogin()

