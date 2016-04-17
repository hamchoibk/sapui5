<%-- 
    Document   : test
    Created on : 15-11-2013, 21:19:40
    Author     : Administrator
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">


<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
           <%=session.getAttribute("dns_security_code")%>
        <img src="/vn/capcha.jpg"/>
        <form action="test.jsp">
        <input type="text" name="captcha"/>
        <input type="submit" Value="Run"/>
        
        
    
        
        </form>
        
     
                
        <h1>Hello World!</h1>
    </body>
</html>
