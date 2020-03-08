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
$("div#router-div").load("home/home.html");
$(".router-link").click(function(){
    
    var url = $(this).attr("href");                 //获取路由路径
    
    $(".sidebar-menu li").removeClass("active");    //清除焦点样式
    if(!$(this).parent().hasClass("dropdown")){
        $(this).parent().parent().parent().addClass("active");  //为外层加样式
    }
    $(this).parent().addClass("active");            //为外层加样式
    $("div#router-div").load(url);                  //加载路由页面
    return false;
})
