layui.use(['layer', 'jquery', 'form'], function () {
    var layer = layui.layer,
        form = layui.form;
        form.render();

    changeBlogChart();
    changeBlogChart2();
    //为专栏名称下拉框赋值
    var columnId = xmSelect.render({
        el: '#columnNameSelect',
        filterable: true,
        paging: true,
        pageSize: 4,
        name: 'columnId',
        toolbar: {show: true},
        data: []
    })

    $.ajax({
        url: host + "/back/columnServices/listColumnInfo",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({}),
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
        },
        error: function(xhr){
            errorLogin(xhr);
        },
        success: function (data) {
            columnId.update({ "data": data.body })
        }
    })

    // 时间维度选择框
    form.on('select(sjwd)', function(data){
        sjwd = data.value;
        changeBlogChart();
    });
    // 类型选择框
    form.on('select(type)', function(data){
        type = data.value;
        if(type == "0"){
            $(".blogTypeDiv").css("display","none");
        }else{
            $(".blogTypeDiv").css("display","block");
        }
        changeBlogChart();
    });
    // 博客类型选择框
    form.on('select(blogType)', function(){
        changeBlogChart();
    });
});

//第一个chart
var blogChart = echarts.init(document.getElementById('blog-chart'));
var sjwd = "1";
var type = "0";
$('.blogChart-div').resize(function () {
    blogChart.resize();
});

//第二个chart
var blogChart2 = echarts.init(document.getElementById('blog-chart2'));
$("#columnNameSelectBtn").on("click",function(){
    changeBlogChart2();
})

$('.blogChart-div2').resize(function () {
    blogChart2.resize();
});

function changeBlogChart(){
    var formDataArr = $(".blogChart-form").serializeArray();
    var formData = {};
    var x;
    for(x in formDataArr){
        formData[formDataArr[x].name] = formDataArr[x].value;
    }

    //按是否有效
    var sjwd = formData.sjwd;
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

    //按博客类型
    var type = formData.type;
    if(type == "0"){
        $.ajax({
            url: host+"/back/dataTotal/getBlogCountBylx",
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
                initBlogChart(data.body);
            }
        })
    }else if(type == "1"){
        var blogType = formData.blogType;
        $.ajax({
            url: host+"/back/dataTotal/getBlogCountByyx",
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify({"blogType":blogType, "sjwd":sjwd, "tjnyq": tjnyq, "tjnyz": tjnyz}),
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
            },
            error: function(xhr){
                errorLogin(xhr);
            },
            success: function(data){
                initBlogChart(data.body);
            }
        })
    }
}

function changeBlogChart2(){
    var formDataArr = $(".blogChart-form2").serializeArray();
    var formData = {};
    var x;
    for(x in formDataArr){
        formData[formDataArr[x].name] = formDataArr[x].value;
    }
    $.ajax({
        url: host+"/back/dataTotal/getBlogCountByColumn",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(formData),
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
        },
        error: function(xhr){
            errorLogin(xhr);
        },
        success: function(data){
            initBlogChart2(data.body);
        }
    })
}

function initBlogChart(data){
    var title = "";
    if(type == "0"){
        title = "按博客类型";
    }else if(type == "1"){
        title = "按是否有效";
    }
    if(sjwd == "1"){
        title += "——近5年的博客量统计";
    }else if(sjwd == "2"){
        title += "——近6月的博客量统计";
    }else if(sjwd == "3"){
        title += "——近15天的博客量统计";
    }
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

function initBlogChart2(data){
    var title = "按专栏统计博客量";
    var legend = [];
    for(var i = 0; i < data.length; i++){
        legend.push(data[i].name);
    }
    option = {
        title: {
            text: title,
            x:'center',
            y:'top'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: legend
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        series: [
            {   
                name: '',
                type: "pie",
                center: ['50%', '50%'],
                data: data
            }
        ]
    };
    blogChart2.setOption(option);
}