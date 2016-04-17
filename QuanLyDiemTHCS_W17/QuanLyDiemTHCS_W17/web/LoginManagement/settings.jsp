<%@page import="DAO.AccountBusiness"%>
<%@page import="InfoManagement.Account"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <title> Thiết lập tài khoản </title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="<s:url value="/CSS/style.css"/>"  type="text/css">

        <script language="JavaScript" src="<s:url value="/JavaScript/checkInput.js" />"></script>
    </head>


    <body>
        <%   Account taikhoan = null;
            if (session.getAttribute("username") == null) {
                response.sendRedirect("home");
                // Return Home Page
            } else {

                String uname = session.getAttribute("username").toString();
                taikhoan = AccountBusiness.getAccountByUsername(uname);
                String section = request.getParameter("section");

                if (section == "" || section == null) {%>
        <s:set var="section">thongtin</s:set>
        <%} else {%>
        <s:set var="section"><%=section%></s:set>
        <%}
      }%>

        <div id="wrap">
            <div id="header">
                <jsp:include page="/Common/header.jsp"/>
            </div> <!---End Div Header  -->

            <div id="Main1">
                <div id="formtitle">
                    Thiết lập tài khoản  
                </div>

                <a  class="runbtn" href="settings?section=thongtin"> Thông tin</a> 

                <a class="runbtn" href="settings?section=matkhau"> Đổi mật khẩu </a> 
               

                <s:if test="#section.equals('thongtin')">  <!---Begin Section= thongtin -->

                    <div id="formcontent">

                        <table style="padding-top:20px;">


                            <tr>
                                <td class="infolbl">Mã Giáo Viên </td>
                                <td>:</td>
                                <td class="login"> GV<%=taikhoan.getMaGiaoVien()%> </td>
                            </tr>
                            <tr>
                                <td class="infolbl"> Tài khoản</td>
                                <td>:</td>
                                <td class="login"> <%=taikhoan.getUsername()%> </td>
                            </tr>
                            <tr>

                                <td class="infolbl"> Họ và Tên</td>  <td>:</td>
                                <td class="login"> <%=taikhoan.toStringFullName()%> </td>
                            </tr>
                            <tr>

                                <td class="infolbl"> Email</td>  <td>:</td>
                                <td class="login"> <%=taikhoan.getEmail()%> </td>
                            </tr>
                            <tr> 

                                <td class="infolbl">Thông tin</td>
                                <td>:</td>
                                <td class="login"> <%=taikhoan.getThongTin()%> </td>
                            </tr>


                        </table>



                    </div>
                </s:if>
                <!-- End section Thongtin -->
                <s:elseif test="#section.equals('matkhau')">   <!-- Begin section  Matkhau -->

                    <div id="formcontent"> 
                        <s:if test="hide==null || hide == false">   

                            <div id="notify">
                                <span id="lblError" style="color:#FF0000; font-size:15px; font-family:Arial, Helvetica, sans-serif">
                                    <s:property  value="notifi"></s:property>  </span>

                                </div>

                                <form  action="doimatkhau" method="POST" name ="frm" onsubmit = "return validateFormChangePass()">

                                    Mật khẩu cũ  <input class="login" type="password" name="oldpass"/>
                                    Mật khẩu Mới<input class="login" type="password" name="newpass"/>
                                    Nhập lại mật khẩu <input class="login" type="password" name="renewpass"/>
                                    <input type="submit" class="login" value="Đổi Mật khẩu" id="changebtn"/>

                                </form>
                        </s:if>
                        <s:else>
                            <div id="notifysuccess">

                                <s:property  value="notifi"></s:property> 
                                </div>
                        </s:else>



                    </div>
                </s:elseif> <!-- End section  Matkhau -->

                <s:else> <!--  other Section -->
                    <div id="formcontent">

                    </div>
                </s:else>

            </div>   <!--End Div Main -->
            <div id="footer">
                <jsp:include page="/Common/footer.jsp"/>
            </div>  <!-- End Div Footer-->

        </div> <!-- End Div Wrapper -->

    </body>
</html>

