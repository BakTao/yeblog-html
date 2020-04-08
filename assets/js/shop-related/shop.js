layui.use(['table', 'form', 'layedit', 'laydate', 'upload'], function () {
    var table = layui.table;
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate
        , upload = layui.upload;

    form.render();

    //为查询类别赋值
    var searchShopSelect = xmSelect.render({
        el: '#searchShopCategory',
        filterable: true,
        paging: true,
        pageSize: 4,
        name: 'categoryId',
        data: []
    })

    var editShopSelect = xmSelect.render({
        el: '#editShopCategory',
        filterable: true,
        paging: true,
        pageSize: 4,
        name: 'categoryId',
        radio: true,
        data: []
    })

    var createShopSelect = xmSelect.render({
        el: '#createShopCategory',
        filterable: true,
        paging: true,
        pageSize: 4,
        name: 'categoryId',
        radio: true,
        data: []
    })
    $.ajax({
        url: host + "/back/shopServices/listCategoryInfo",
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
            searchShopSelect.update({ "data": data.body })
            editShopSelect.update({ "data": data.body })
            createShopSelect.update({ "data": data.body })
        }
    })

    //新增窗口，不是实物弹出上传电子物品按钮
    form.on('radio(type)', function (data) {
        if (data.value == "0") {
            $(".bookFileClass").css("display", "none")
            var file = document.getElementById('bookFile');
            file.outerHTML = file.outerHTML; //重新初始化了file的html 
        } else {
            $(".bookFileClass").css("display", "block")

        }
    })

    //查询表格
    var shopFormTable = table.render({
        elem: '#shopForm'
        , url: host + "/back/shopServices/pageShopInfo"
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
        , toolbar: '#shopToolbar'                 //显示过滤列
        , defaultToolbar: ['filter']    //显示过滤列
        , title: '商品数据表'
        , headers:{
            Authorization: "ym:" + sessionStorage.getItem('token')
        }
        , error: function(xhr){
            errorLogin(xhr);
        }
        , cols: [
            [
                { field: 'goodsId', title: '商品ID', width: 200, align: 'center', sort: true }
                , { field: 'goodsName', title: '商品名称', width: 120, align: 'center', sort: true }
                , { field: 'nums', title: '商品数量', width: 120, align: 'center', sort: true }
                , { field: 'buyNums', title: '商品被购买数量', width: 150, align: 'center', sort: true }
                , { field: 'price', title: '商品价格', width: 120, align: 'center', sort: true }
                , {
                    field: 'type', title: '是否是实物', width: 150, align: 'center', sort: true, templet: function (res) {
                        if (res.type == "0") {
                            return ' <a class="btn btn-default" href="#" role="button" style="line-height:19px;">是</a>'
                        } else {
                            if(res.bookFile != null){
                                return ' <a class="btn btn-default" href="' + uploadUrl + res.bookFile + '" role="button" style="line-height:19px;">否</a>'
                            }else{
                                return ' <a class="btn btn-default" href="#" role="button" style="line-height:19px;">否</a>'
                            }
                        }
                    }
                }
                , { field: 'categoryName', title: '类别', width: 120, align: 'center', sort: true }
                , {
                    field: 'enable', title: '生效', width: 120, align: 'center', sort: true, templet: function (res) {
                        if (res.enable == "0") {
                            return ' <span style="color:red;">下架</span>'
                        } else {
                            return ' <span style="color:blue;">上架</span>'
                        }
                    }
                }
                , {
                    title: '操作', fixed: 'right', align: 'center', width: 180, templet: function (res) {
                        if (res.enable == "0") {
                            return ' <a class="layui-btn layui-btn-xs" lay-event="edit" style="color:white;">编辑</a> <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="delete" style="color:white;">上架</a>'
                        } else {
                            return ' <a class="layui-btn layui-btn-xs" lay-event="edit" style="color:white;">编辑</a> <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="delete" style="color:white;">下架</a>'
                        }
                    }

                }
            ]

        ]
        , page: true
    });

    //左上角按钮
    table.on('toolbar(shopForm)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);

        switch (obj.event) {
            //新增
            case 'createShop':
                var bookFile = "";
                var file = "";
                $("#shopCreateForm form")[0].reset();   //重置
                layui.form.render();
                $(".bookFileClass").css("display", "none")
                $('#showPhoto').attr('src', '');
                $('#showPhoto').removeClass("newPhotoStyle");   //限制大小
                createShopSelect.setValue([ ]);

                upload.render({
                    elem: '#photo'
                    , url: host + '/back/uploadServices/fileUpload'
                    , before: function (obj) {
                        layer.msg('上传中');
                        //预读本地文件示例，不支持ie8
                        obj.preview(function (index, file, result) {
                            $('#showPhoto').attr('src', result); //图片链接（base64）
                            $('#showPhoto').addClass("newPhotoStyle");   //限制大小

                        });
            
                    }
                    , headers:{
                        Authorization: "ym:" + sessionStorage.getItem('token')
                    }
                    , error: function(xhr){
                        errorLogin(xhr);
                    }
                    , done: function (res) {
                        if (res.head.code != "0") {
                            alertmsgFtmIndex(res.head.msg);
                            return false;
                        }
                        //上传成功
                        file = res.body.fileId;
                        layer.msg('上传成功');
                    }
                });

                upload.render({
                    elem: '#bookFile'
                    , accept: 'file' //普通文件
                    , url: host + '/back/uploadServices/fileUpload'
                    , before: function (obj) {
                        layer.msg('上传中');
                    }
                    , headers:{
                        Authorization: "ym:" + sessionStorage.getItem('token')
                    }
                    , error: function(xhr){
                        errorLogin(xhr);
                    }
                    , done: function (res) {
                        if (res.head.code != "0") {
                            alertmsgFtmIndex(res.head.msg);
                            return false;
                        }
                        //上传成功
                        bookFile = res.body.fileId;
                        layer.msg('上传成功');
                    }
                });

                layer.open({
                    title: "新增商品"
                    , type: 1
                    , area: ['70%', '85%']
                    , offset: ['10%', '25%']
                    , content: $("div #shopCreateForm")
                    , btn: ['确定', '关闭']
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , yes: function () {
                        if($("div#shopCreateForm input[name=goodsName]").val() == "" 
                        || $("div#shopCreateForm input[name=nums]").val() == "" 
                        || $("div#shopCreateForm input[name=price]").val() == ""
                        || $("div#shopCreateForm textarea[name=content]").val() == ""
                        || createShopSelect.getValue("valueStr") == ""
                        ){
                            alertmsgFtmIndex("有空白项,请完整填写")
                            return false;
                        }

                        if(file == ""){
                            alertmsgFtmIndex("请上传商品图片")
                            return false;
                        }
                        if($("input[name=type]:checked").val() == "1" ){
                            if(bookFile == ""){
                                alertmsgFtmIndex("如果是电子商品,请上传相应的文件")
                                return false;
                            }
                        }

                        $.ajax({
                            url: host + "/back/shopServices/createShop",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "goodsName": $("div#shopCreateForm input[name=goodsName]").val(),
                                "nums": $("div#shopCreateForm input[name=nums]").val(),
                                "price": $("div#shopCreateForm input[name=price]").val(),
                                "photo": file,
                                "type": $("div#shopCreateForm input[name=type]:checked").val(),
                                "bookFile": bookFile,
                                "content": $("div#shopCreateForm textarea[name=content]").val(),
                                "categoryId": createShopSelect.getValue("valueStr")
                            }),
                            beforeSend: function (XMLHttpRequest) {
                                XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                            },
                            error: function(xhr){
                                errorLogin(xhr);
                            },
                            success: function (data) {
                                if (data.body == "success") {
                                    shopFormTable.reload();
                                    alertmsgFtm("操作成功")
                                }
                                else {
                                    alertmsgFtm("操作失败,请稍后再试")
                                }
                            },
                        })
                        
                    }
                });
                break;
            case 'deleteCategory':
                layer.open({
                    type: 1,
                    formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                    title: '删除类别',
                    area: ['300px', '300px'],
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    closeBtn: 0,                    //不显示关闭按钮
                    content: `<div id="deleteShopCategory"></div>
                    <script>var ShopSelect = xmSelect.render({
                        el: '#deleteShopCategory',
                        filterable: true,
                        paging: true,
                        pageSize: 4,
                        name: 'categoryId',
                        data: []
                    })
                    $.ajax({
                        url: host + "/back/shopServices/listCategoryInfo",
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
                            ShopSelect.update({ "data": data.body })
                        }
                    })</script>`,
                    yes: function (index) {
                        var categoryId = ShopSelect.getValue('valueStr');
                        if (categoryId == '') {
                            layer.open({
                                title: "提示"
                                , content: `类别不能为空`
                                , btn: ['关闭']
                                , btnAlign: 'c' //按钮居中
                                , yes: function (index) {   //加index,只关闭当前的
                                    layer.close(index);
                                }
                            });
                        } else {
                            $.ajax({
                                url: host + "/back/shopServices/deleteCategory",
                                contentType: "application/json",
                                type: "post",
                                data: JSON.stringify({
                                    "categoryId": categoryId
                                }),
                                beforeSend: function (XMLHttpRequest) {
                                    XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                                },
                                error: function(xhr){
                                    errorLogin(xhr);
                                },
                                success: function (data) {
                                    if (data.body == "success") {
                                        $.ajax({
                                            url: host + "/back/shopServices/listCategoryInfo",
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
                                                searchShopSelect.update({ "data": data.body })
                                                editShopSelect.update({ "data": data.body })
                                                createShopSelect.update({ "data": data.body })
                                            }
                                        })
                                        alertmsgFtm("操作成功")

                                    }
                                    else {
                                        alertmsgFtm("操作失败,请稍后再试")
                                    }
                                },
                            })
                        }
                    }

                });
                break;
            case 'createCategory':
                layer.prompt({
                    type: 1,
                    formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                    title: '新增类别',
                    area: ['300px', '120px'],
                    btnAlign: 'c',
                    btn: ['确定', '取消'],
                    closeBtn: 0,                    //不显示关闭按钮
                    content: `<input type="text" name="categoryName" id="categoryName" autocomplete="off" placeholder="类别名称" class="layui-input">`,
                    yes: function (index) {
                        var categoryName = $('#categoryName').val();
                        if (categoryName == '') {
                            layer.open({
                                title: "提示"
                                , content: `类别名称不能为空`
                                , btn: ['关闭']
                                , btnAlign: 'c' //按钮居中
                                , yes: function (index) {   //加index,只关闭当前的
                                    layer.close(index);
                                }
                            });
                        } else {
                            $.ajax({
                                url: host + "/back/shopServices/createCategory",
                                contentType: "application/json",
                                type: "post",
                                data: JSON.stringify({
                                    "categoryName": categoryName
                                }),
                                beforeSend: function (XMLHttpRequest) {
                                    XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                                },
                                error: function(xhr){
                                    errorLogin(xhr);
                                },
                                success: function (data) {
                                    if (data.body == "success") {
                                        $.ajax({
                                            url: host + "/back/shopServices/listCategoryInfo",
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
                                                searchShopSelect.update({ "data": data.body })
                                                editShopSelect.update({ "data": data.body })
                                                createShopSelect.update({ "data": data.body })
                                            }
                                        })
                                        alertmsgFtm("操作成功")
                                    }
                                    else {
                                        alertmsgFtm("操作失败,请稍后再试")
                                    }
                                },
                            })
                        }
                    },
                    btn2: function (index) {
                        var categoryName = $('#categoryName').val();
                        if (categoryName != '') {
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
    table.on('tool(shopForm)', function (obj) {
        var rowData = obj.data;
        //编辑
        if (obj.event === 'edit') {
            var bookFile = "";
            var file = "";
            $("#shopEditForm form")[0].reset();   //重置
            $(".bookFileClass").css("display", "none")
            $('#nowPhoto').attr('src', '');
            $('#newPhoto').attr('src', '');
            $('#newPhoto').removeClass("newPhotoStyle");   //限制大小
            $("#shopEditForm a[name=bookFile]").text("")
            $("#shopEditForm a[name=bookFile]").attr("href","#")
            editShopSelect.setValue([ ]);
            form.render();
            layer.open({
                title: "编辑商品信息"
                , type: 1
                , area: ['70%', '85%']
                , offset: ['10%', '25%']
                , content: $("div #shopEditForm")
                , btn: ['保存', '关闭']
                , btnAlign: 'c' //按钮居中
                , shade: 0 //不显示遮罩
                , yes: function () {
                    if($("div#shopEditForm input[name=goodsName]").val() == "" 
                    || $("div#shopEditForm input[name=nums]").val() == "" 
                    || $("div#shopEditForm input[name=buyNums]").val() == "" 
                    || $("div#shopEditForm input[name=price]").val() == ""
                    || $("div#shopEditForm textarea[name=content]").val() == ""
                    || editShopSelect.getValue("valueStr") == ""){
                        alertmsgFtmIndex("有空白项,请完整填写")
                        return false;
                    }
                    //将电子转为实物
                    if($("div#shopEditForm input[name=type]:checked").val() == "0"){
                        $.ajax({
                            url: host + "/back/shopServices/updateShopInfo",
                            contentType: "application/json",
                            type: "post",
                            data: JSON.stringify({
                                "goodsId": rowData.goodsId,
                                "goodsName": $("div#shopEditForm input[name=goodsName]").val(),
                                "nums": $("div#shopEditForm input[name=nums]").val(),
                                "price": $("div#shopEditForm input[name=price]").val(),
                                "buyNums": $("div#shopEditForm input[name=buyNums]").val(),
                                "photo": file,
                                "type": $("div#shopEditForm input[name=type]:checked").val(),
                                "bookFile": "",
                                "content": $("div#shopEditForm textarea[name=content]").val(),
                                "categoryId": editShopSelect.getValue("valueStr")
                            }),
                            beforeSend: function (XMLHttpRequest) {
                                XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                            },
                            error: function(xhr){
                                errorLogin(xhr);
                            },
                            success: function (data) {
                                if (data.body == "success") {
                                    shopFormTable.reload();
                                    alertmsgFtm("操作成功")
                                }
                                else {
                                    alertmsgFtm("操作失败,请稍后再试")
                                }
                            },
                        })
                    }else{
                        //不修改电子物品
                        if(bookFile == ""){
                            $.ajax({
                                url: host + "/back/shopServices/updateShopInfo",
                                contentType: "application/json",
                                type: "post",
                                data: JSON.stringify({
                                    "goodsId": rowData.goodsId,
                                    "goodsName": $("div#shopEditForm input[name=goodsName]").val(),
                                    "nums": $("div#shopEditForm input[name=nums]").val(),
                                    "price": $("div#shopEditForm input[name=price]").val(),
                                    "buyNums": $("div#shopEditForm input[name=buyNums]").val(),
                                    "photo": file,
                                    "type": $("div#shopEditForm input[name=type]:checked").val(),
                                    "content": $("div#shopEditForm textarea[name=content]").val(),
                                    "categoryId": editShopSelect.getValue("valueStr")
                                }),
                                beforeSend: function (XMLHttpRequest) {
                                    XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                                },
                                error: function(xhr){
                                    errorLogin(xhr);
                                },
                                success: function (data) {
                                    if (data.body == "success") {
                                        shopFormTable.reload();
                                        alertmsgFtm("操作成功")
                                    }
                                    else {
                                        alertmsgFtm("操作失败,请稍后再试")
                                    }
                                },
                            })
                        }else{
                            $.ajax({
                                url: host + "/back/shopServices/updateShopInfo",
                                contentType: "application/json",
                                type: "post",
                                data: JSON.stringify({
                                    "goodsId": rowData.goodsId,
                                    "goodsName": $("div#shopEditForm input[name=goodsName]").val(),
                                    "nums": $("div#shopEditForm input[name=nums]").val(),
                                    "price": $("div#shopEditForm input[name=price]").val(),
                                    "buyNums": $("div#shopEditForm input[name=buyNums]").val(),
                                    "photo": file,
                                    "type": $("div#shopEditForm input[name=type]:checked").val(),
                                    "bookFile": bookFile,
                                    "content": $("div#shopEditForm textarea[name=content]").val(),
                                    "categoryId": editShopSelect.getValue("valueStr")
                                }),
                                beforeSend: function (XMLHttpRequest) {
                                    XMLHttpRequest.setRequestHeader("Authorization", "ym:" + sessionStorage.getItem('token'));
                                },
                                error: function(xhr){
                                    errorLogin(xhr);
                                },
                                success: function (data) {
                                    if (data.body == "success") {
                                        shopFormTable.reload();
                                        alertmsgFtm("操作成功")
                                    }
                                    else {
                                        alertmsgFtm("操作失败,请稍后再试")
                                    }
                                },
                            })
                        }
                    }
                    
                }
            });

            //赋值
            editShopSelect.setValue([ rowData.categoryId ])
            if(rowData.type == "1"){
                $(".bookFileClass").css("display", "block")
                $("#shopEditForm a[name=bookFile]").text(rowData.bookFileName)
                $("#shopEditForm a[name=bookFile]").attr("href",uploadUrl + rowData.bookFile)
            }
            $("#nowPhoto").attr("src",uploadUrl + rowData.photo)
            form.val('shopEditForm', {
                "goodsName": rowData.goodsName // "name": "value"
                , "nums": rowData.nums
                , "price": rowData.price
                , "content": rowData.content
                , "type": rowData.type
                , "buyNums": rowData.buyNums
            });


            upload.render({
                elem: '#newPhotoBtn'
                , url: host + '/back/uploadServices/fileUpload'
                , before: function (obj) {
                    layer.msg('上传中');
                    //预读本地文件示例，不支持ie8
                    obj.preview(function (index, file, result) {
                        $('#newPhoto').attr('src', result); //图片链接（base64）
                        $('#newPhoto').addClass("newPhotoStyle");   //限制大小
                    });
                    
        
                }
                , headers:{
                    Authorization: "ym:" + sessionStorage.getItem('token')
                }
                , error: function(xhr){
                    errorLogin(xhr);
                }
                , done: function (res) {
                    if (res.head.code != "0") {
                        alertmsgFtmIndex(res.head.msg);
                        return false;
                    }
                    //上传成功
                    file = res.body.fileId;
                    layer.msg('上传成功');
                }
            });

            upload.render({
                elem: '#editBookFile'
                , accept: 'file' //普通文件
                , url: host + '/back/uploadServices/fileUpload'
                , before: function (obj) {
                    layer.msg('上传中');
                }
                , headers:{
                    Authorization: "ym:" + sessionStorage.getItem('token')
                }
                , error: function(xhr){
                    errorLogin(xhr);
                }
                , done: function (res) {
                    if (res.head.code != "0") {
                        alertmsgFtmIndex(res.head.msg);
                        return false;
                    }
                    //上传成功
                    bookFile = res.body.fileId;
                    layer.msg('上传成功');
                }
            });
        } else if (obj.event === 'delete') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '提示',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>是否下架此商品?</p>`,
                yes: function (index) {

                    $.ajax({
                        url: host + "/back/shopServices/updateShopInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "goodsId": data.goodsId,
                            "enable": "0"
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
                                shopFormTable.reload();
                            }
                            else {
                                alertmsgFtm("操作失败,请稍后再试")
                            }
                        }
                    })

                }


            });
        } else if (obj.event === 'recover') {
            layer.prompt({
                type: 1,
                formType: 2,                    //这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
                title: '提示',
                area: ['300px', '120px'],
                btnAlign: 'c',
                btn: ['确定', '取消'],
                closeBtn: 0,                    //不显示关闭按钮
                content: `<p>是否上架此商品?</p>`,
                yes: function (index) {

                    $.ajax({
                        url: host + "/back/shopServices/updateShopInfo",
                        contentType: "application/json",
                        type: "post",
                        data: JSON.stringify({
                            "goodsId": data.goodsId,
                            "enable": "1"
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
                                shopFormTable.reload();
                            }
                            else {
                                alertmsgFtm("操作失败,请稍后再试")
                            }
                        }
                    })

                }


            });
        }
    });
    //查询
    layui.$('#shopSearchFormBtn').on('click', function () {
        var data = form.val('shopSearchForm');

        table.reload('shopForm', {
            where: data,
            url: host + "/back/shopServices/pageShopInfo",
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