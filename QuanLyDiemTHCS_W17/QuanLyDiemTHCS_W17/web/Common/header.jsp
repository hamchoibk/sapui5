<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib prefix="s" uri="/struts-tags" %>
<div style="width: 1100px; margin: 0px auto;">
    <img src="<s:url value="/CSS/header.jpg"/>" alt="Header Image" style="width: 1100px; height: 140px;"/>
    <table style="width: 1100px; border: 0;" cellpadding="0" cellspacing="0">
        <tr style="height: 30px; background-color: ghostwhite; font: normal 12px Verdana;">
            <td style="text-align: left; padding-left: 10px">
                <script language="javascript" type="text/javascript">  
                    dayName = new Array ("Chủ nhật","Thứ hai","Thứ ba","Thứ tư","Thứ năm","Thứ sáu","Thứ bảy");  
                    monName = new Array ("1","2","3","4","5","6","7","8","9","10","11","12");
                    now = new Date;
                    document.write(dayName[now.getDay()]+ ", " 
                            +now.getDate()+ "-" 
                            +monName[now.getMonth()]+ "-" 
                            +now.getFullYear());
                </script>
            </td>
            <td valign="middle" style="text-align: right; padding-right: 10px;">
                
                <div style="float: right; padding-top: 8px">
             
                <s:property value="%{#session['account_fullname']}"/>
                <s:a action="settings"> Tài khoản </s:a>
                <s:a action="logout">Đăng xuất</s:a>
                </div>
                <div style="float: right">
                    <img src="<s:url value="/Common/Image/mem_avatar.png"/>">
                </div>
            </td>
        </tr>
    </table>        

<%
    String type = session.getAttribute("account_type").toString();
    if (type.equals("MANAGER")) 
    {
%>      <jsp:include page="manager_menu.jsp"/>
<%  } 
    else 
    if (type.equals("TEACHER")) 
    {
%>      <jsp:include page="teacher_menu.jsp"/>
<%  }
%>
</div>