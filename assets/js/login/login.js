
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
            alertmsgtm('用户名不能为空')
            return false;
        }
        if (password == '') {
            $('#loginform .error').fadeOut('fast', function () {
                $(this).css('top', '96px');
            });
            $('#loginform .error').fadeIn('fast', function () {
                $('#loginform .password').focus();
            });
            alertmsgtm('密码不能为空')
            return false;
        }
        if (username != '' && password != '') {
            var data = {
                "loginId":username,
                "password":password
            };
            $.ajax({
                type:"post",
                url:host+"/back/loginServices/adminLogin",
                contentType:"application/json",
                data:JSON.stringify(data),
                success: function(data){
                    if(data.head.code == "601"){
                        alertmsgtm(data.head.msg)
                    }
                    else{
                        sessionStorage.setItem('token', data.body.token)
                        $(window).attr('location', '../index.html')
                    }
                },
                error: function(msg){
                    alertmsgtmftm("操作失败,请稍后再试")
                }
            })
        }
    });

    $('.username, .password').keyup(function () {
        $(this).parent().find('.error').fadeOut('fast');
    });



});


