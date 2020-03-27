layui.use(['table', 'form', 'layedit', 'laydate'], function () {
    var table = layui.table;
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate;

    form.render();

    var columnFormTable = table.render({
        elem: '#columnForm'
        , url: host + "/back/columnServices/pageColumnInfo"
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
        , toolbar: '#columnToolbar'                 //显示过滤列
        , defaultToolbar: ['filter']    //显示过滤列
        , title: '专栏数据表'
        , cols: [
            [
                { type: 'checkbox', fixed: 'left', rowspan: 2 }
                , {
                    title: '操作', fixed: 'left', align: 'center', width: 180, rowspan: 2, templet: function (res) {
                        return ' <a class="layui-btn layui-btn-xs" lay-event="edit" style="color:white;">编辑</a> <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">删除</a>'
                    }

                }
                , { field: 'columnId', title: '专栏ID', width: 200, align: 'center', sort: true, rowspan: 2 }
                , { field: 'columnName', title: '专栏名称', width: 120, align: 'center', sort: true, rowspan: 2 }
                , { field: 'blogCount', title: '博客数合计', width: 120, align: 'center', sort: true, rowspan: 2 }
                , { title: '原创', align: 'center', colspan: 4 }
                , { title: '转载', align: 'center', colspan: 4 }
            ],
            [
                { field: 'blogCount0', title: '合计', width: 100, align: 'center', sort: true }
                , { field: 'blogCount01', title: '有效', width: 100, align: 'center', sort: true }
                , { field: 'blogCount02', title: '未审核', width: 100, align: 'center', sort: true }
                , { field: 'blogCount00', title: '无效', width: 100, align: 'center', sort: true }
                , { field: 'blogCount1', title: '合计', width: 100, align: 'center', sort: true }
                , { field: 'blogCount11', title: '有效', width: 100, align: 'center', sort: true }
                , { field: 'blogCount12', title: '未审核', width: 100, align: 'center', sort: true }
                , { field: 'blogCount10', title: '无效', width: 100, align: 'center', sort: true }
            ]
        ]
        , page: true
    });

    //左上角按钮
    table.on('toolbar(columnForm)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);

        switch (obj.event) {
            //新增
            case 'create':
                layer.prompt({
                    type: 1,
                    formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                    title: '新增专栏',
                    area: ['300px', '120px'],
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    closeBtn: 0,                    //不显示关闭按钮
                    content: `<input type="text" name="columnName" id="columnName" autocomplete="off" placeholder="专栏名称" class="layui-input">`,
                    yes: function (index) {
                        var columnName = $('#columnName').val();
                        if (columnName == '') {
                            layer.open({
                                title: "提示"
                                , content: `专栏名称不能为空`
                                , btn: ['关闭']
                                , btnAlign: 'c' //按钮居中
                                , yes: function (index) {   //加index,只关闭当前的
                                    layer.close(index);
                                }
                            });
                        } else {
                            $.ajax({
                                url: host + "/back/columnServices/createColumn",
                                contentType: "application/json",
                                type: "post",
                                data: JSON.stringify({
                                    "columnName": columnName
                                }),
                                success: function (data) {
                                    if (data.body == "success") {
                                        alertmsgFtm("操作成功")
                                        columnFormTable.reload();
                                    }
                                    else {
                                        alertmsgFtm("操作失败,请稍后再试")
                                    }
                                },
                            })
                        }
                    },
                    btn2: function (index) {
                        var columnName = $('#columnName').val();
                        if (columnName != '') {
                            layer.open({
                                title: "提示"
                                , content: `是否关闭?`
                                , btn: ['返回', '关闭']
                                , btnAlign: 'c' //按钮居中
                                , yes: function (index) {   //加index,只关闭当前的
                                    layer.close(index);
                                }, btn2: function () {
                                    layer.closeAll();
                                }
                            });
                            return false;               //不关闭父窗口
                        }
                    }
                });
                break;
        };
    });

    //操作
    table.on('tool(columnForm)', function (obj) {
        var data = obj.data;
        //编辑
        if (obj.event === 'edit') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '编辑专栏信息',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<input type="text" name="columnName" id="editColumnName" autocomplete="off" placeholder="专栏名称" class="layui-input" value='` + data.columnName + `'>`,
                yes: function (index) {
                    var columnName = $('#editColumnName').val();
                    if (columnName == '') {
                        layer.open({
                            title: "提示"
                            , content: `专栏名称不能为空`
                            , btn: ['关闭']
                            , btnAlign: 'c' //按钮居中
                            , yes: function (index) {   //加index,只关闭当前的
                                layer.close(index);
                            }
                        });
                    } else {
                        $.ajax({
                            url: host + "/back/columnServices/updateColumnInfo",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "columnName": columnName,
                                "columnId": data.columnId
                            }),
                            success: function (data) {
                                if (data.body == "success") {
                                    alertmsgFtm("操作成功")
                                    columnFormTable.reload();
                                }
                                else {
                                    alertmsgFtm("操作失败,请稍后再试")
                                }
                            },
                        })
                    }
                },
                btn2: function (index) {
                    var columnName = $('#editColumnName').val();
                    if (columnName != '') {
                        layer.open({
                            title: "提示"
                            , content: `是否关闭?`
                            , btn: ['返回', '关闭']
                            , btnAlign: 'c' //按钮居中
                            , yes: function (index) {   //加index,只关闭当前的
                                layer.close(index);
                            }, btn2: function () {
                                layer.closeAll();
                            }
                        });
                        return false;               //不关闭父窗口
                    }
                }
            });
            //删除
        } else if (obj.event === 'delete') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '是否删除此专栏?',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>注意:如果专栏里存在博客,需要进一步处理它们.</p>`,
                yes: function (index) {
                    if (data.blogCount == 0) {
                        $.ajax({
                            url: host + "/back/columnServices/deleteColumn",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "columnId": data.columnId
                            }),
                            success: function (data) {
                                if (data.body == "success") {
                                    alertmsgFtm("操作成功")
                                    columnFormTable.reload();
                                }
                                else {
                                    alertmsgFtm("操作失败,请稍后再试")
                                }
                            }
                        })
                    } else {
                        layer.open({
                            type: 1,
                            title: '转移专栏里的文章',
                            area: ['90%', '90%'],
                            btnAlign: 'c',
                            btn: ['确定', '取消'],
                            closeBtn: 0,                    //不显示关闭按钮
                            content: 
                            `<input type="hidden" id="oldColumnId" value="`+ data.columnId + `">
                            <p style="
                            padding-left: 25%;
                            font-size: 20px;
                            padding-top: 10px;
                            ">请将专栏里的文章转移到其他专栏里,一次最多操作50篇文章.</p>
                            <p style="
                            padding-left: 37%;
                            color: red;
                            ">可选择下面的全选将全部博客一键转移!</p>
                            <form id="editArticleForm" class="layui-form" lay-filter="editArticleForm">
                                <div class="layui-row">
                                    <div class="layui-col-md4" style="padding-left:2%;">
                                        <table class="layui-table" id="editArticleTable"></table>
                                        <label class="layui-form-label">全选</label>
                                        <input type="checkbox" name="selectAll" lay-skin="switch" lay-text="是|否">
                                    </div>
                                    <div class="layui-col-md4" style="padding: 13% 0% 0% 15%;">
                                        <i class="fas fa-angle-double-right" style="font-size: 35px;"></i>
                                    </div>
                                    <div class="layui-col-md4" style="padding: 2% 10% 0 0;">
                                        <p>选择一个新专栏</p>
                                        <div id="editColumnSelect"></div>
                                    </div>
                                </div>
                            </form>
                            <script src="../../../assets/js/user-related/article-column/editColumn.js"></script>`,
                            yes: function (index) {
                                var formdata = form.val('editArticleForm');
                                if(formdata.columnId == ''){
                                    alertmsgFtmIndex("请选择一个专栏")
                                    return false;
                                }
                                if(!formdata.hasOwnProperty("layTableCheckbox") && !formdata.hasOwnProperty("selectAll")){
                                    alertmsgFtmIndex("请至少选择一个文章")
                                    return false;
                                }
                                if(formdata.hasOwnProperty("selectAll")){
                                    $.ajax({
                                        url: host + "/back/blogServices/updateBlogInfo",
                                        contentType: "application/json",
                                        type: "post",
                                        data: JSON.stringify({
                                            "columnId": $("#oldColumnId").val(),
                                            "newColumnId": formdata.columnId
                                        }),
                                        success: function (data) {
                                            if (data.body == "success") {
                                                alertmsgFtm("操作成功")
                                                columnFormTable.reload();
                                            }
                                            else {
                                                alertmsgFtmIndex("操作失败,请稍后再试")
                                            }
                                        }
                                    })
                                    return false;
                                }else{
                                    var articleArr = table.checkStatus('editArticleTable').data;
                                    if(articleArr.length > 50){
                                        alertmsgFtmIndex("一次至多只能选择50篇文章")
                                    }else{
                                        var article = '';
                                        for(var i=0; i<articleArr.length - 1; i++){
                                            article = article + articleArr[i].blogId + ',';
                                        }
                                        article = article + articleArr[articleArr.length - 1].blogId;
                                        $.ajax({
                                            url: host + "/back/blogServices/updateBlogInfo",
                                            contentType: "application/json",
                                            type: "post",
                                            data: JSON.stringify({
                                                "blogId": article,
                                                "newColumnId": formdata.columnId
                                            }),
                                            success: function (data) {
                                                if (data.body == "success") {
                                                    table.render({
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
                                                        , where: {columnId: $("#oldColumnId").val()}
                                                        , title: '专栏文章表'
                                                        , cols: [
                                                            [
                                                                { type: 'checkbox', fixed: 'left'}
                                                                , { field: 'title', title: '标题', align: 'center'}
                                                            ]
                                                        ]
                                                        , page: true
                                                    });
                                                    columnFormTable.reload();
                                                    alertmsgFtmIndex("操作成功")
                                                }
                                                else {
                                                    alertmsgFtmIndex("操作失败,请稍后再试")
                                                }
                                            }
                                        })
                                    }
                                }
                            },
                            btn2: function(){
                                layer.closeAll();
                            }
                        });
                    }

                }
            });
        }
    });
    //查询
    layui.$('#columnSearchFormBtn').on('click', function () {
        var data = form.val('columnSearchForm');
        table.reload('columnForm', {
            where: data,
            url: host + "/back/columnServices/pageColumnInfo",
            method: "post",
            contentType: 'application/json'
        })
        return false;
    });

});