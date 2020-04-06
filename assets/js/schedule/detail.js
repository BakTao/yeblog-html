$(".detailTitle").html("标题:" + detailData.title)
$(".detailCreateTime").text("创建时间:" + detailData.createTime)
$(".detailUser").text("提出者:" + detailData.userId)
$(".detailContent").text(detailData.content)


$("#backToScheduleBtn").on("click",function(){
    $("div#router-div").load("schedule/schedule.html"); 
})
if(detailData.type == "1" || detailData.type == "0"){
    $(".typeText").addClass("layui-badge layui-bg-blue");
    $(".typeText").text("已读");
}else if(detailData.type == "2"){
    $(".typeText").addClass("layui-badge");
    $(".typeText").text("待办");
}else if(detailData.type == "3"){
    $(".typeText").addClass("layui-badge layui-bg-green");
    $(".typeText").text("已办");
    $(".detailFinishTime").text("完成时间:" + detailData.finishTime)
}