<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags" %>

<%
    if(session.getAttribute("username") == null)
    {%> 
        <jsp:forward page="/LoginManagement/login.jsp"/>
    <%}
%>

<%    
    if(session.getAttribute("account_type").toString().equals("TEACHER"))
    {%>
        <jsp:forward page="teacher_home.jsp"/>
    <%}
    else
    {%>
        <jsp:forward page="manager_home.jsp"/>
    <%}
%>

