<%-- 
    Document   : PrintListAccount
    Created on : Dec 12, 2013, 12:43:33 PM
    Author     : Sony
--%>

<%@page import="DAO.AccountBusiness"%>
<%@page import="InfoManagement.Account"%>
<%@page import="java.util.List"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%  List<Account> listAccount = null;
    if (session.getAttribute("username") == null) {%>
<jsp:forward page="/Common/home.jsp"/>
<%
        // String x=%{status};
    } else {
        String accType = session.getAttribute("account_type").toString();

        if (!accType.equals("MANAGER")) {
            response.sendRedirect("home");
        } else {

            listAccount = AccountBusiness.getAllAccount();
        }
    }%>
<!DOCTYPE html


    <html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Danh sách giáo viên</title>
    <style>
        table.listGV
        {
            border-collapse:collapse;
            padding:0px;
            // border:1px solid green;
            // border:1px solid #d4d4d4;
        }

        table.listGV th
        {
            color:#000000;
            background-color:white;
            font: bold 14px/20px Verdana, Arial, Tahoma, Sans-serif;
            border:1px solid green;

            padding:5px;
            padding-right:5px;
        }

        table.listGV td
        {

            max-width: 250px;
            font: 14px/20px Verdana, Arial, Tahoma, Sans-serif;
            padding:5px;
            padding-right:5px;
            border:1px solid green;

        }

        table.listGV tr:hover {
            background-color: #d0e4fe;

        }
    </style>
</head>

<body>
    
    
    <h1> Danh sách tài khoản trường thcs Phượng Mao </h1>
    <table class="listGV">
        <tr> 
            <th></th>
            <th>Mã</th>
            <th>Họ Tên</th>
            <th>Tài khoản</th>
            <th>Mật khẩu ban đầu</th>
            <th>Email</th>
            <th>Thông tin </th>
           

        </tr>

        <%if (listAccount
                    != null) {
                int i = 1;
                for (Account gv : listAccount) {%>
        <tr>
            <td> <%=i%></td>
            <td>GV<%=gv.getMaGiaoVien()%></td>
            <td><%=gv.getHoDem()%> <%=gv.getTen()%></td>
            <td><%=gv.getUsername()%></td>
            <td><%=gv.getDefPassword()%></td>
            <td><%=gv.getEmail()%></td>
            <td><%=gv.getThongTin()%> </td>
          
        </tr>
        <% i++;
                }  //end For
            } //end If%>  
    </table> 
</body>
</html>
