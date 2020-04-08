//注册量图
var regChart = echarts.init(document.getElementById('regChart'));

$.ajax({
    url: host+"/back/dataTotal/getRegisterCount",
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({"sjwd":"4"}),
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    success: function(data){
        $(".todayReg").text(data.body[6].value)
        initRegChart(data.body);
    },
    error: function(xhr){
        errorLogin(xhr);
    }
})

function initRegChart(data){
    var xData = [];
    var yData = [];
    for(var i = 0; i < data.length; i++){
        xData.push(data[i].tjny);
        yData.push(data[i].value);
    }
    option = {
        title: {
            text: "近7天的注册量",
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
            name: '注册量'
        },
        series: [{
            data: yData,
            type: 'line',
            smooth: true
        }]
    };
    regChart.setOption(option);
}


$('.card-body').resize(function () {
    regChart.resize();
});

//博客量图
var blogChart = echarts.init(document.getElementById('blogChart'));

$.ajax({
    url: host+"/back/dataTotal/getBlogCountBylx",
    type: "post",
    contentType: 'application/json',
    data: JSON.stringify({"sjwd":"4"}),
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    success: function(data){
        initRegChart2(data.body);
    },    
    error: function(xhr){
        errorLogin(xhr);
    }
})

function initRegChart2(data){
    var title = "近7天的博客量";


    var xData = data[0].tjny.split(",");
    var seriesData = [];
    var legend = [];
    for(var i = 0; i < data.length; i++){
        var yData = {};
        yData.type = "line";
        yData.areaStyle = {};
        yData.name = data[i].type;
        yData.data = data[i].value.split(",");

        seriesData.push(yData);
        legend.push(data[i].type);
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
        legend: {
            x: 'center',
            y: 'bottom',
            data: legend
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false, //贴紧 
            axisLabel:{
                interval: 0,    //间隔,显示因长度过长自动隐藏的x点
                rotate: 20      //倾斜数,防止长度过长的x点重叠在一起
            },
            name: '统计年月',
            data: xData
        },
        yAxis: {
            type: 'value',
            name: '博客量'
        },
        series: seriesData
    };
    blogChart.setOption(option);
}


$('.card-body').resize(function () {
    blogChart.resize();
});


//未阅
$.ajax({
    url: host + "/back/scheduleServices/pageScheduleInfo",
    contentType: "application/json",
    type: "post",
    data: JSON.stringify({
        "type": "0",
        "pageSize": 5
    }),
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    error: function(xhr){
        errorLogin(xhr);
    },
    success: function (data) {
        $(".wdCount").text(data.body.pager.recordCount)
        var wdData = data.body.data;
        for(var i=0; i<wdData.length; i++){
            $("ul#wdUl").append('<li class="media">'
            +'<div class="media-body">'
            +'<div class="float-right"><div class="font-weight-600 text-muted text-small">'
            +wdData[i].userId
            +'</div></div><div class="media-title"><a href="" onclick="scheduleLink();return false;">'
            +wdData[i].title
            +'</a></div><div class="mt-1"><div class="font-weight-600 text-muted text-small">'
            +wdData[i].createTime
            +'</div></div></div></li>')
        }
    },
})

//待办
$.ajax({
    url: host + "/back/scheduleServices/pageScheduleInfo",
    contentType: "application/json",
    type: "post",
    data: JSON.stringify({
        "type": "2",
        "pageSize": 5
    }),
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    error: function(xhr){
        errorLogin(xhr);
    },
    success: function (data) {
        $(".dbCount").text(data.body.pager.recordCount)
        var wdData = data.body.data;
        for(var i=0; i<wdData.length; i++){
            $("ul#dbUl").append('<li class="media">'
            +'<div class="media-body">'
            +'<div class="float-right"><div class="font-weight-600 text-muted text-small">'
            +wdData[i].userId
            +'</div></div><div class="media-title"><a href="" onclick="scheduleLink();return false;">'
            +wdData[i].title
            +'</a></div><div class="mt-1"><div class="font-weight-600 text-muted text-small">'
            +wdData[i].createTime
            +'</div></div></div></li>')
        }
    },
})

//只显示2条，增加滚动条
if ($(".top-scroll").length) {
    $(".top-scroll").css({
        height: 150
    }).niceScroll();
}

//跳转
function scheduleLink(){
    $("div#router-div").load("schedule/schedule.html");                  //加载路由页面
}

//获取博客(非草稿有效)
$.ajax({
    url: host+"/back/dataTotal/getBlogCountByOne",
    type: "post",
    contentType: 'application/json',
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    error: function(xhr){
        errorLogin(xhr);
    },
    success: function(data){
        $(".todayBlog").text(data.body[0].value)
        
    }
})

//获取订单
$.ajax({
    url: host+"/back/dataTotal/getOrderMoneyCountByOne",
    type: "post",
    contentType: 'application/json',
    beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
    },
    error: function(xhr){
        errorLogin(xhr);
    },
    success: function(data){
        $(".todayOrder").text(data.body[0].value + "/ ￥" + data.body[0].price)
        
    }
})