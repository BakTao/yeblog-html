layui.use(['layer', 'jquery', 'form'], function () {
    var layer = layui.layer,
        $ = layui.jquery,
        form = layui.form;
    //监听select改变事件
    changeRegChart('1');
    form.on('select(sjwd)', function(data){
        changeRegChart(data.value);
    });
});

var registerChart = echarts.init(document.getElementById('register-chart'));

$('.regChart-div').resize(function () {
    registerChart.resize();
});

function changeRegChart(data){
    var sjwd = data;
    var tjnyq,tjnyz;
    var date = new Date();
    var nowYear = date.getFullYear();
    var nowMonth = date.getMonth()+1;
    var nowDay = date.getDate();
    if(sjwd == "1"){
        $(".card-header h4").text("近5年的注册量统计")
        tjnyz = nowYear;
        tjnyq = nowYear-4;
    }else if(sjwd == "2"){
        $(".card-header h4").text("近6月的注册量统计")
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
        $(".card-header h4").text("近15天的注册量统计")
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
        url: host+"/back/dataTotal/getRegisterCount",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({"sjwd":sjwd, "tjnyq": tjnyq, "tjnyz": tjnyz}),
        success: function(data){
            initRegChart(data.body);
        }
    })
}

function initRegChart(data){
    var xData = [];
    var yData = [];

    for(var i = 0; i < data.length; i++){
        xData.push(data[i].tjny);
        yData.push(data[i].value);
    }
    option = {
        tooltip: {
            trigger: 'axis'     //提示
        },
        xAxis: {
            type: 'category', 
            axisLabel:{
                interval: 0,    //间隔,显示因长度过长自动隐藏的x点
                rotate: 20      //倾斜数,防止长度过长的x点重叠在一起
            },
            data: xData
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: yData,
            type: 'line',
            smooth: true
        }]
    };
    registerChart.setOption(option);
}