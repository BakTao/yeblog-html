layui.use(['table', 'layer', 'jquery', 'form'], function () {
    var layer = layui.layer,
        form = layui.form,
        table = layui.table;
    form.render();

    changeOrderChart1(sjwd1);
    changeOrderChart2(sjwd2);

    // 时间维度选择框
    form.on('select(sjwd1)', function (data) {
        sjwd1 = data.value;
        changeOrderChart1(sjwd1);
    });

    form.on('select(sjwd2)', function (data) {
        sjwd2 = data.value;
        changeOrderChart2(sjwd2);
    });

    //查询表格
    table.render({
        elem: '#orderTable'
        , url: host + "/back/orderServices/pageOrderMoney"
        , method: 'post'
        , contentType: 'application/json'
        , parseData: function (res) {
            return {
                "code": res.head.code,
                "msg": res.head.msg,
                "count": res.body.pager.recordCount,
                "data": res.body.data
            };
        }
        , request: {
            pageName: 'pageIndex',
            limitName: 'pageSize'
        }
        , title: '订单商品金额表'
        , cols: [
            [
                { field: 'goodsId', title: '商品ID', align: 'center', sort: true}
                , { field: 'goodsName', title: '商品名称', align: 'center', sort: true }
                , { field: 'nums', title: '商品被购买数',align: 'center', sort: true }
                , { field: 'price', title: '商品单价', align: 'center', sort: true }
                , { field: 'priceCount', title: '商品总价', align: 'center', sort: true}
            ]

        ]
        , page: true
    });

    $("#orderTableExport").on("click", function(){
        $.ajax({
            url: host + "/back/orderServices/listOrderMoney",
            type: "post",
            contentType: 'application/json',
            data: JSON.stringify({}),
            success: function (data) {
                // 1. 数组头部新增表头
                data.body.unshift({
                    goodsId: '商品ID',
                    goodsName: '商品名称', 
                    nums: '商品被购买数',
                    price: '商品单价',
                    priceCount: '商品总价'
                });
                // 2. 如果需要调整顺序，请执行梳理函数
                var data = LAY_EXCEL.filterExportData(data.body, [
                    'goodsId',
                    'goodsName',
                    'nums',
                    'price',
                    'priceCount'
                ]);
                //设置列宽
                var colConf = LAY_EXCEL.makeColConfig({
                    'A': 120,
                    'B': 80,
                    'C': 80,
                    'D': 80,
                    'E': 100
                }, 80);
                // 3. 执行导出函数，系统会弹出弹框
                LAY_EXCEL.exportExcel({
                    sheet1: data
                }, '已完成订单商品金额表.xlsx', 'xlsx', {
                    extend: {
                        '!cols': colConf
                    }
                });
            }
        })
    })
});

//第一个chart
var orderChart1 = echarts.init(document.getElementById('order-chart1'));
var sjwd1 = "1";
$('.orderChart-div1').resize(function () {
    orderChart1.resize();
});

//第二个chart
var orderChart2 = echarts.init(document.getElementById('order-chart2'));
var sjwd2 = "1";
$('.orderChart-div2').resize(function () {
    orderChart2.resize();
});

function changeOrderChart1(sjwd) {
    $.ajax({
        url: host + "/back/dataTotal/getOrderCount",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({ "sjwd": sjwd}),
        success: function (data) {
            initOrderChart1(data.body);
        }
    })

}

function changeOrderChart2(sjwd) {
    $.ajax({
        url: host + "/back/dataTotal/getOrderMoney",
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify({ "sjwd": sjwd}),
        success: function (data) {
            initOrderChart2(data.body);
        }
    })
}

function initOrderChart1(data) {
    var title = "";
    if (sjwd1 == "1") {
        title += "近5年的订单量统计";
    } else if (sjwd1 == "2") {
        title += "近6月的订单量统计";
    } else if (sjwd1 == "3") {
        title += "近15天的订单量统计";
    }
    var xData = data[0].tjny.split(",");
    var seriesData = [];
    var legend = [];
    for (var i = 0; i < data.length; i++) {
        var yData = {};
        yData.type = "bar";
        yData.areaStyle = {};
        yData.name = data[i].type;
        yData.data = data[i].value.split(",");

        seriesData.push(yData);
        legend.push(data[i].type);
    }
    option = {
        title: {
            text: title,
            x: 'center',
            y: 'top'
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
            axisLabel: {
                interval: 0,    //间隔,显示因长度过长自动隐藏的x点
                rotate: 20      //倾斜数,防止长度过长的x点重叠在一起
            },
            name: '统计年月',
            data: xData
        },
        yAxis: {
            type: 'value',
            name: '订单量'
        },
        series: seriesData
    };
    orderChart1.setOption(option);
}

function initOrderChart2(data) {
    var title = "";
    if (sjwd2 == "1") {
        title += "近5年的订单金额统计";
    } else if (sjwd2 == "2") {
        title += "近6月的订单金额统计";
    } else if (sjwd2 == "3") {
        title += "近15天的订单金额统计";
    }
    var xData = [];
    var yData = [];
    for(var i = 0; i < data.length; i++){
        xData.push(data[i].tjny);
        yData.push(data[i].value);
    }
    option = {
        title: {
            text: title,
            x: 'center',
            y: 'top'
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
            axisLabel: {
                interval: 0,    //间隔,显示因长度过长自动隐藏的x点
                rotate: 20      //倾斜数,防止长度过长的x点重叠在一起
            },
            name: '统计年月',
            data: xData
        },
        yAxis: {
            type: 'value',
            name: '订单金额/元'

        },
        series: [{
            data: yData,
            type: 'bar',
            smooth: true
        }]
    };
    orderChart2.setOption(option);
}