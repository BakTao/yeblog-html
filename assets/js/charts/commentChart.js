layui.use(['layer', 'jquery', 'form'], function () {
    var form = layui.form;
        form.render();
    //监听select改变事件
    changeComChart(sjwd);
    form.on('select(sjwd)', function(data){
        sjwd = data.value;
        changeComChart(sjwd);
    });
});

var commentChart = echarts.init(document.getElementById('comment-chart'));
var sjwd = "1";
$('.comChart-div').resize(function () {
    commentChart.resize();
});

function changeComChart(data){
    var sjwd = data;
    var tjnyq,tjnyz;
    var date = new Date();
    var nowYear = date.getFullYear();
    var nowMonth = date.getMonth()+1;
    var nowDay = date.getDate();
    if(sjwd == "1"){
        tjnyz = nowYear;
        tjnyq = nowYear-4;
    }else if(sjwd == "2"){
        var year = nowYear;
        var month = nowMonth-5;
        if(nowMonth < 10){
            nowMonth = '0' + nowMonth;
        }
        tjnyz = ''+nowYear+nowMonth;
        if(month <= 0){
            year -= 1;
            month = 12 + month;
        }
        if(month < 10){
            month = '0' + month;
        }
        tjnyq = ''+year+month;
    }else{
        if(nowMonth < 10){
            nowMonth = '0' + nowMonth;
        }
        if(nowDay < 10){
            nowDay = '0' + nowDay;
        }
        tjnyz = ''+nowYear+nowMonth+nowDay; 
        var date1 = new Date(date.getTime() - 3600 * 1000 * 24 * 15);
        var year = date1.getFullYear()
        var month = date1.getMonth()+1;
        var day = date1.getDate();
        if(month < 10){
            month = '0' + month;
        }
        if(day < 10){
            day = '0' + day;
        }
        tjnyq = ''+year+month+day; 

    }

    $.ajax({
        url: host+"/back/dataTotal/getCommentCount",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({"sjwd":sjwd, "tjnyq": tjnyq, "tjnyz": tjnyz}),
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
        },
        error: function(xhr){
            errorLogin(xhr);
        },
        success: function(data){
            initComChart(data.body);
        }
    })
}

function initComChart(data){
    var xData = [];
    var yData = [];
    var title = "";
    if(sjwd == "1"){
        title = "近5年的评论量统计";
    }else if(sjwd == "2"){
        title = "近6月的评论量统计";
    }else if(sjwd == "3"){
        title = "近15天的评论量统计";
    }
    for(var i = 0; i < data.length; i++){
        xData.push(data[i].tjny);
        yData.push(data[i].value);
    }
    option = {
        title: {
            text: title,
            x:'center',
            y:'top'
        },
        tooltip: {
            trigger: 'axis'     //提示
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category', 
            axisLabel:{
                interval: 0,    //间隔,显示因长度过长自动隐藏的x点
                rotate: 20      //倾斜数,防止长度过长的x点重叠在一起
            },
            name: '统计年月',
            data: xData
        },
        yAxis: {
            type: 'value',
            name: '评论量'
        },
        series: [{
            data: yData,
            type: 'line',
            smooth: true
        }]
    };
    commentChart.setOption(option);
}