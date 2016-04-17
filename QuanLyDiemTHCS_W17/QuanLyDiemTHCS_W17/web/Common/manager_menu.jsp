<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>

<link rel="stylesheet"  href="<s:url value="/CSS/menu_style2.css"/>" type="text/css">

<script type="text/javascript" src="<s:url value="/JavaScript/menu.js"/>" ></script>

<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<div class="chromestyle" id="main_menu">
    <ul>
        <li><a href="<s:url value="/Common/home.jsp"/>">Trang chủ</a></li>
        <li><a href="#">Quản lý tin đăng</a></li>
        <li><a href="quanlynguoidung">Quản lý người dùng</a></li>
        <li><a href="#" rel="dropmenu1">Khai báo thông tin</a></li>
        <li><a href="#" rel="dropmenu2">Cấu hình điểm</a></li>
      
    </ul>
</div>

<!--1st drop down menu -->                                                
<div id="dropmenu1" class="dropmenudiv">
    <a href="<s:url value="/InfoManagement/student_profile.jsp"/>">Hồ sơ học sinh</a>
    <a href="#">Phân lớp học sinh</a>
    <a href="#">Giáo viên bộ môn</a>
    <a href="#">Giáo viên chủ nhiệm</a>
    <a href="#">Thông tin lớp</a>
    <a href="#">Thông tin môn học</a>
    <a href="#">Môn học theo khối</a>
    <a href="#">Học kỳ</a>
</div>

<!--2nd drop down menu -->                                                   
<div id="dropmenu2" class="dropmenudiv">
    <a href="#">Môn tính điểm</a>
    <a href="#">Môn đánh giá</a>
</div>

<!--3rd drop down menu -->                                                   

<script type="text/javascript">
    cssdropdown.start_menu("main_menu");
</script>