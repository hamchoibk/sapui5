<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>

<link rel="stylesheet"  href="<s:url value="/CSS/menu_style2.css"/>" type="text/css">

<script type="text/javascript" src="<s:url value="/JavaScript/menu.js"/>" ></script>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<div class="chromestyle" id="main_menu">
    <ul>
        <li><s:a action="view_mark">Trang chủ</s:a></li>
        <li><a href="#" rel="dropmenu1">Sổ điểm</a></li>
        <li><a href="#" rel="dropmenu2">Hạnh kiểm</a></li>
        <li><a href="#" rel="dropmenu3">Báo cáo</a></li>
        <li><a href="#">Xét lên lớp</a></li>
       
    </ul>
</div>

<!--1st drop down menu -->                                                
<div id="dropmenu1" class="dropmenudiv">
    <s:a action="view_mark">Xem điểm môn học</s:a>
    <s:a action="loadMarkUpdate">Cập nhật điểm môn học</s:a>
</div>

<!--2nd drop down menu -->                                                   
<div id="dropmenu2" class="dropmenudiv">
    <a href="#">Xem điểm hạnh kiểm</a>
    <a href="#">Cập nhật điểm hạnh kiểm</a>
</div>

<!--2nd drop down menu -->                                                   
<div id="dropmenu3" class="dropmenudiv">
    <a href="#">Báo cáo điểm tổng kết</a>
    <a href="#">Vẽ biểu đồ</a>
</div>

<!--3rd drop down menu -->                                                   

<script type="text/javascript">
    cssdropdown.start_menu("main_menu");
</script>