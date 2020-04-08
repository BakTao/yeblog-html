layui.use(['table', 'form', 'layedit', 'laydate', 'upload'], function () {
    var table = layui.table;
    var form = layui.form
        , layer = layui.layer
        , laydate = layui.laydate;

    form.render();
    laydate.render({
        elem: '#createTimeQ'
    });
    laydate.render({
        elem: '#createTimeZ'
    });

    //查询表格
    var orderFormTable = table.render({
        elem: '#orderForm'
        , url: host + "/back/orderServices/pageOrderInfo"
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
        , toolbar: true               //显示过滤列
        , defaultToolbar: ['filter']    //显示过滤列
        , title: '订单数据表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , error: function(xhr){
            errorLogin(xhr);
        }
        , cols: [
            [
                { field: 'orderId', title: '订单ID', width: 200, align: 'center', sort: true }
                , { field: 'userId', title: '订单人名称', width: 120, align: 'center', sort: true }
                , { field: 'price', title: '订单总价', width: 120, align: 'center', sort: true }
                , { field: 'createTime', title: '创建时间', width: 180, align: 'center', sort: true }
                , { field: 'enable', title: '状态', width: 120, align: 'center', sort: true , templet: function (res) {
                    if (res.enable == "0") {
                        return ' <span style="color:red;">已关闭</span>'
                    } else if(res.enable == "1"){
                        return ' <span style="color:blue;">未完成</span>'
                    } else if(res.enable == "2"){
                        return ' <span style="color:green;">已完成</span>'
                    }
                }}
                , { field: 'expressId', title: '物流信息', width: 150, align: 'center', edit: 'text', sort: true }
                , {
                    title: '操作', fixed: 'right', align: 'center', width: 120, templet: function (res) {
                            return ' <a class="layui-btn layui-btn-xs" lay-event="view" style="color:white;">查看</a>'

                    }

                }
            ]

        ]
        , page: true
    });

    //监听单元格编辑
    table.on('edit(orderForm)', function(obj){
        var value = obj.value //得到修改后的值
        ,data = obj.data //得到所在行所有键值
        $.ajax({
            url: host + "/back/orderServices/updateOrderInfo",
            contentType: "application/json",
            type: "post",
            data: JSON.stringify({
                "expressId": value,
                "orderId": data.orderId
            }),
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
            },
            error: function(xhr){
                errorLogin(xhr);
            },
            success: function (data) {
                if (data.body == "success") {
                    alertmsgFtm("操作成功")
                }
                else {
                    alertmsgFtm("操作失败,请稍后再试")
                }
            },
        })

    });

    //操作
    table.on('tool(orderForm)', function (obj) {
        var rowData = obj.data;
        //查看
        if (obj.event === 'view') {
            $("#orderViewForm form")[0].reset();   //重置
            form.render();
            layer.open({
                title: "查看订单信息"
                , type: 1
                , area: ['70%', '85%']
                , offset: ['10%', '25%']
                , content: $("div #orderViewForm")
                , btn: ['关闭']
                , btnAlign: 'c' //按钮居中
                , shade: 0 //不显示遮罩
                , yes: function () {
                    layer.closeAll();
                }
            });
            if(rowData.enable == "0"){
                $("div#orderViewForm input[name=enable]").attr("title","已关闭")
            }else if(rowData.enable == "1"){
                $("div#orderViewForm input[name=enable]").attr("title","未完成")
            }else if(rowData.enable == "2"){
                $("div#orderViewForm input[name=enable]").attr("title","已完成")
            }
            form.val('orderViewForm', {
                "orderId": rowData.orderId // "name": "value"
                , "userId": rowData.userId
                , "userPhone": rowData.userPhone
                , "address": rowData.address
                , "remark": rowData.remark
                , "createTime": rowData.createTime
                , "price": rowData.price
            });

            table.render({
                elem: '#orderShopForm'
                , url: host + "/back/orderServices/listOrderShopInfo"
                , method: 'post'
                , contentType: 'application/json'
                , totalRow: true
                , parseData: function (res) {
                    return {
                        "code": res.head.code,
                        "msg": res.head.msg,
                        "data": res.body
                    };
                }
                , where: {orderId: rowData.orderId}
                , title: '订单商品数据表'
                , headers:{
                    Authorization: "ym:" + sessionStorage.getItem('token')
                }
                , error: function(xhr){
                    errorLogin(xhr);
                }
                , cols: [
                    [
                        { field: 'goodsId', title: '商品ID', align: 'center', sort: true, totalRowText: "合计" }
                        , { field: 'goodsName', title: '商品名称', align: 'center', sort: true }
                        , { field: 'nums', title: '商品数量',align: 'center', sort: true }
                        , { field: 'price', title: '商品单价', align: 'center', sort: true }
                        , { field: 'priceCount', title: '商品总价', align: 'center', sort: true, totalRow: true}
                    ]
        
                ]
            });
        }
    });
    //查询
    layui.$('#orderSearchFormBtn').on('click', function () {
        var data = form.val('orderSearchForm');

        table.reload('orderForm', {
            where: data,
            url: host + "/back/orderServices/pageOrderInfo",
            method: "post",
            contentType: 'application/json'
            , headers:{
                Authorization: "ym:" + sessionStorage.getItem('token')
            }
            , error: function(xhr){
                errorLogin(xhr);
            }
        })
        return false;
    });

});