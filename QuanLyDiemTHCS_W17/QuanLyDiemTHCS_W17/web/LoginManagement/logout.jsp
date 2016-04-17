<%-- 
    Document   : logout
    Created on : 26-11-2013, 08:48:07
    Author     : Administrator
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%
    if(session != null)
        session.invalidate();
        
    response.sendRedirect("login.jsp");
%>