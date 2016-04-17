<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags" %>

<%
    // Vo hieu hoa cache    
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    response.setDateHeader("Expires", 0); // Proxies.

    if (session.getAttribute("username") != null) 
    {%> 
        <jsp:forward page="/Common/home.jsp"/>
    <%}
%>

<html>   
    <head>
        <link rel="stylesheet" type="text/css" href="<s:url value="/CSS/StyleSheet.css"/>">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">        
        <title>Login Page</title>        
    </head>
    <body>        
        <div id="wrap">            
            <div id="header">
                <img src="<s:url value="/CSS/header.jpg"/>" alt="Header Image" style="width: 1100px; height: 161px;"/>
            </div>
            
            <div id="main" style="padding-top: 100px; padding-bottom: 100px;">
                <div style="
                     width: 400px;
                     background-color: whitesmoke;
                     padding-left: 50px;   
                     margin: auto;     
                     border : 1px solid blue;
                     border: 2px solid activecaption;
                     border-radius: 10px;
                     box-shadow: 5px -5px 2px activecaption;">
                    <s:form action="login" method="post">
                        <div style="color: red; margin-top: 10px; height: 30px">
                            <s:property value="loginStatus"/>&nbsp;
                        </div>
                        <table>
                            <tbody>
                                <tr>
                                    <td style="width:150px">Tên đăng nhập:</td>
                                    <td><s:textfield name="username"/></td>
                                </tr>
                                <tr>                        
                                    <td>Mật khẩu:</td>
                                    <td><s:password name="password"/></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td align="right"><s:submit value="Đăng nhập" /></td>
                                </tr>
                            </tbody>
                        </table>
                        <s:token />
                    </s:form>           
                </div>
            </div>
            
            <div id="footer">
                <jsp:include page="/Common/footer.jsp"/>
            </div>
        </div>        
    </body>
</html>
