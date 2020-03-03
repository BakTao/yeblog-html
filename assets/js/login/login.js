
jQuery(document).ready(function () {

    $('#loginbtn').click(function () {
        var username = $('#loginform .username').val();
        var password = $('#loginform .password').val();
        if (username == '') {
            $('#loginform .error').fadeOut('fast', function () {
                $(this).css('top', '27px');
            });
            $('#loginform .error').fadeIn('fast', function () {
                $('#loginform .username').focus();
            });
            alertmsg('用户名不能为空')
            return false;
        }
        if (password == '') {
            $('#loginform .error').fadeOut('fast', function () {
                $(this).css('top', '96px');
            });
            $('#loginform .error').fadeIn('fast', function () {
                $('#loginform .password').focus();
            });
            alertmsg('密码不能为空')
            return false;
        }
        if (username != '' && password != '') {
            var data = {
                "loginId":"username",
                "password":"password"
            };
            $.ajax({
                type:"post",
                url:host+"/back/loginServices/adminLogin",
                contentType:"application/json",
                data:JSON.stringify(data),
                success: function(data){
                    console.log(data)
                },
                error: function(msg){
                    console.log(msg)
                }
            })
            $(window).attr('location', '../index.html');
        }
    });

    $('.username, .password').keyup(function () {
        $(this).parent().find('.error').fadeOut('fast');
    });



});

function alertmsg(msg) {
    layui.use('layer', function () {
        var $ = layui.jquery, layer = layui.layer;

        layer.msg(msg, {
            area: ['300px', '110px'],
            time: 5000, //5s后自动关闭
            btn: ['关闭']
        });

    });
}


