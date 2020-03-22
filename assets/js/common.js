var host="http://localhost:8888/api"



//透明弹框
function alertmsgtm(msg) {
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.msg(msg, {
            area: ['300px', '110px'],
            time: 5000, //5s后自动关闭
            btn: ['关闭']
        });

    });
}

//非透明弹框
function alertmsgtmftm(msg) {
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.open({
            offset: "auto"
            ,content: '<p>'+ msg +'</p>'
            ,btn: '关闭'
            ,btnAlign: 'c' //按钮居中
            //,shade: 0 //不显示遮罩
            ,yes: function(){
              layer.closeAll();
            }
        });

    });
}

//检查是否登录
function checkLogin(){
    if(!sessionStorage.getItem('token')){
        unloginmsg("您未登录,请登录!")
        setTimeout(function(){ 
           $(window).attr('location', 'login/login.html') 
        }, 5000);
    }
}