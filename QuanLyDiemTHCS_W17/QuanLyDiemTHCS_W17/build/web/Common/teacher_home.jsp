<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>

<%
    if (session.getAttribute("username") == null) {%> 
<jsp:forward page="/LoginManagement/login.jsp"/>
<%}
%>

<%
    // Kiem tra co phai tai khoan Manager hay khong
    if (!session.getAttribute("account_type").toString().equals("TEACHER")) {%>
<jsp:forward page="/Common/home.jsp" />
<%}
%>

<html>    
    <head>     
        <link rel="stylesheet" type="text/css" href="<s:url value="/CSS/StyleSheet.css"/>" />

        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Trang chủ giáo viên</title>
    </head>
    <body>




        <div id="wrap">
            <div>
                <jsp:include page="/Common/header.jsp"/>
            </div>


            <div id="footer">
                <jsp:include page="/Common/footer.jsp"/>        
            </div>

        </div>
    </body>
</html>
