layui.use(['form'], function () {
    changeRegChart()
});

var registerChart = echarts.init(document.getElementById('register-chart'));

function changeRegChart(){
    var swjd = $("#sjwd").val();
    if(swjd = "1"){
        $(".card-header h4").text("近5年的注册量统计")
    }else if(swjd = "2"){
        $(".card-header h4").text("近6月的注册量统计")
    }else{
        $(".card-header h4").text("近15天的注册量统计")
    }

    $.ajax({
        url: "",
        type: "post",
        data: JSON.stringify({"swjd":swjd}),
        success: function(data){
            initRegChart(data.body);
        }
    })
}

function initRegChart(data){
    var xData = [];
    var yData = [];

    for(var i = 0; i < data.length; i++){
        xData.push(data.tjny);
        yData.push(data.value);
    }

    option = {
        tooltip: {
            trigger: 'item'     //提示
        },
        xAxis: {
            type: 'category',
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