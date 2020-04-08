var host="http://localhost:8888/api"
var uploadUrl = "http://169.254.211.25:9000"
var AdminUserInfo;

//透明弹框
function alertmsgTm(msg) {
    layui.use('layer', function () {
        layer = layui.layer;

        layer.msg(msg, {
            area: ['300px', '110px'],
            time: 5000, //5s后自动关闭
            btn: ['关闭']
        });

    });
}

//非透明弹框(关闭全部)
function alertmsgFtm(msg) {
    layui.use('layer', function () {
        layer = layui.layer;

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
//非透明弹框(关闭当前)
function alertmsgFtmIndex(msg) {
    layui.use('layer', function () {
        layer = layui.layer;

        layer.open({
            offset: "auto"
            ,content: '<p>'+ msg +'</p>'
            ,btn: '关闭'
            ,btnAlign: 'c' //按钮居中
            //,shade: 0 //不显示遮罩
            ,yes: function(index){
              layer.close(index);
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
    }else{
        
    }
}

function unloginmsg(msg) {
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.open({
            offset: "auto"
            , content: '<div style="padding: 20px 100px;">' + msg + '</div>'
            , btn: '关闭'
            , btnAlign: 'c' //按钮居中
            //, shade: 0 //不显示遮罩
            , yes: function () {
                $(window).attr('location', 'login/login.html')
            }
        });

    });
}


function errorLogin(xhr) {
    if(xhr.status == 602){
        layui.use('layer', function () {
            var $ = layui.jquery, layer = layui.layer;
    
            layer.open({
                offset: "auto"
                , content: '<div style="padding: 20px 85px;">用户未登录,请重新登录</div>'
                , btn: '关闭'
                , btnAlign: 'c' //按钮居中
                //, shade: 0 //不显示遮罩
                , yes: function () {
                    $(window).attr('location', 'login/login.html')
                }
            });
    
        });
    }else if(xhr.status == 603){
        layui.use('layer', function () {
            var $ = layui.jquery, layer = layui.layer;
    
            layer.open({
                offset: "auto"
                , content: '<div style="padding: 20px 75px;">登录信息过期，请重新登录</div>'
                , btn: '关闭'
                , btnAlign: 'c' //按钮居中
                //, shade: 0 //不显示遮罩
                , yes: function () {
                    $(window).attr('location', 'login/login.html')
                }
            });
    
        });
    }
}