layui.use(['table', 'form'], function () {
    var table = layui.table;
    var form = layui.form;
    form.render();
    var oldColumnId = $("#oldColumnId").val();

    var editColumnFormTable = table.render({
        elem: '#editArticleTable'

        , url: host + "/back/blogServices/pageBlogInfo"
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
        , width: 400
        , where: {columnId: oldColumnId}
        , title: '专栏文章表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , error: function(xhr){
            errorLogin(xhr);
        }
        , cols: [
            [
                { type: 'checkbox', fixed: 'left'}
                , { field: 'title', title: '标题', align: 'center'}
            ]
        ]
        , page: true
    });


    //为专栏名称下拉框赋值
    var editColumnSelect = xmSelect.render({
        el: '#editColumnSelect',
        filterable: true,
        paging: true,
        pageSize: 4,
        name: 'columnId',
        radio: true,
        data: []
    })

    $.ajax({
        url: host + "/back/columnServices/listColumnInfo",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({"columnId": oldColumnId}),
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
        },
        error: function(xhr){
            errorLogin(xhr);
        },
        success: function (data) {
            editColumnSelect.update({ "data": data.body })
        }
    })
});