<%@page import="InfoManagement.ListNewAccount"%>
<%@page import="DAO.AccountBusiness"%>
<%@page import="java.util.List"%>
<%@page import="InfoManagement.Account"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%  List<Account> listAccount = null;
    int i;
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



<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <title> Quản lý giáo viên</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" href="<s:url value="/CSS/style.css"/>" type="text/css">
        <script language="JavaScript" src="<s:url value="/JavaScript/account.js"/>"></script>  
        <script language="JavaScript" src="<s:url value="/JavaScript/checkInput.js"/>"></script> 
        <script language="JavaScript" src="<s:url value="/JavaScript/d3.min.js"/>"></script> 
        <script>
            function reloadImage()
            {

                document.getElementById("img_captcha").src = "/vn/thcs/security/recaptcha/capcha.jpg?reload=true&value=" + new Date().getTime();
            }
        </script>
        <s:head/>
    </head>

    <%String section = request.getParameter("section");  // Tab section   section == null || section.equals('')
        if (section == "" || section == null) {%>
    <s:set var="section">danhsach</s:set>

    <%} else {%>
    <s:set var="section"><%=section%></s:set>
    <%}%>

    <body onload="onloadPass()">

        <div id="wrap">
            <div id="header">
                <jsp:include page="/Common/header.jsp"/>

            </div>

            <div id="menu">

            </div>

            <div id="Main1">
                <div id="formtitle">
                    Quản lý người dùng </div>
                <div>
                    <a class="runbtn" href="quanlynguoidung?section=danhsach&page=1"> Danh sách </a>
                    <a class="runbtn" href="quanlynguoidung?section=themgiaovien" > Thêm tài khoản </a>
                    <a class="runbtn" href="quanlynguoidung?section=chinhsua" > Chỉnh sửa  </a>
                    <a class="runbtn" href="quanlynguoidung?section=khoiphucmatkhau" > Khôi phục mật khẩu  </a>
                    <a class="runbtn delete"  href="quanlynguoidung?section=xoataikhoan" > Xóa tài khoản  </a>
                </div>

                <s:if test="#section.equals('danhsach')">  <!---Begin Section= danhsach -->

                    <s:property value="page"></s:property>
                        <table class="listGV">
                            <tr> 
                                <th></th>
                                <th>Mã</th>
                                <th>Họ Tên</th>
                                <th>Tài khoản</th>
                                <th>Mật khẩu</th>
                                <th>Email</th>
                                <th>Thông tin </th>


                            </tr>


                        <%if (listAccount != null) {
                                int leng = listAccount.size();

                                int ipage;
                                try {
                                    ipage = Integer.parseInt(request.getParameter("page")) - 1;

                                } catch (Exception ex) {
                                    ipage = 0;
                                }
                                for (int j = ipage * 15; j < leng && j < (ipage + 1) * 15; j++) {%>
                        <tr>
                            <td> <%=j + 1%></td>
                            <td>GV<%=listAccount.get(j).getMaGiaoVien()%></td>
                            <td><%=listAccount.get(j).getHoDem()%> <%=listAccount.get(j).getTen()%></td>
                            <td><%=listAccount.get(j).getUsername()%></td>
                            <td><%=listAccount.get(j).getDefPassword()%></td>
                            <td><%=listAccount.get(j).getEmail()%></td>
                            <td><%=listAccount.get(j).getThongTin()%> </td>

                        </tr>
                        <% }
                            }%>  
                    </table> 
                    <br> 
                    <%
                        int leng = listAccount.size() / 15 + 2;

                        for (int k = 1; k < leng; k++) {%>

                    <a  style="text-decoration: none;" href="quanlynguoidung?section=danhsach&page=<%=k%>"> &#8201; <%=k%> </a>
                    <%}
                    %>
                    <br>
                    <br>
                    <form action="printlistAccount">
                        <input type="submit" value="Xuất Danh Sách" size="30" />
                    </form>

                </s:if>


                <s:elseif test="#section.equals('themgiaovien')">  <!---Begin Section= themgiaovien -->

                    <table width=100%>

                        <tr>
                            <td width="400px"><div id="notify"> <br>
                                    <span id="lblError" style="color:#FF0000; font-size:15px; font-family:Arial, Helvetica, sans-serif">
                                        <s:property  value="lblNotify"></s:property>  </span>

                                    </div>
                                    <form method="POST" action="themgiaovien" name="frmadd"  onsubmit = "return validateFormAddnewAccount()">

                                        <table>
                                           
                                            <tr>
                                                <td> Họ đệm</td>
                                                <td>  <input id="lname" class="login"  type="text" name="hodem" onchange="createUname()" maxlength="30" value="<s:property value="hodem"/>"/>  </td>
                                        </tr>   
                                        <tr>
                                            <td> Tên</td>
                                            <td>  <input  id="fname"  class="login" type="text"  name="ten" onchange="createUname()" maxlength="20" value="<s:property value="ten"/>" /></td>

                                        </tr> <tr>
                                            <td> Email </td>
                                            <td>  <input id="rd_email"  class="login" type="email"  name="email" onchange="createPassword()" value="<s:property value="email"/>" maxlength="35" /></td>
                                        </tr>
                                        <tr>
                                            <td> Thông tin </td>
                                            <td>  <input id="info"  class="login" type="text"  name="info" value="<s:property value="info"/>" /></td>
                                        </tr>
                                        <tr>
                                            <td> Tài khoản </td>
                                            <td> <input id="uname" class="login"  type="text"  name="username" maxlength="35" value="<s:property value="username"/>"/> </td>
                                        </tr>

                                        <tr>
                                            <td>Mật khẩu </td>
                                            <td> <input id ="rd_password" class="login"  type="text"  name="password" maxlength="35" value="<s:property value="password"/>" />
                                        </tr>
                                        <tr>
                                            <td><input type="submit"  class="login" value="Thêm giáo viên" /></td>
                                            <td></td>
                                        </tr>
                                    </table>
                                </form>

                            </td>
                            <td valign="top">   
                                <% ListNewAccount list = (ListNewAccount) session.getAttribute("newlist");
                                    i = 1;
                                    if (list
                                            != null) {

                                %><h3> Danh sách tài khoản vừa thêm <h3>
                                        <table class="listGV">
                                            <tr> 
                                                <th>STT  </th>

                                                <th>Họ Tên</th>
                                                <th>Tài khoản</th>
                                                <th> Mật khẩu </th>


                                            </tr>




                                            <%    for (Account ac : list.getList()) {%>
                                            <tr>
                                                <td><%=i%></td>
                                                <td><%=ac.getHoDem()%> <%=ac.getTen()%></td>
                                                <td><%=ac.getUsername()%></td>
                                                <td><%=ac.getDefPassword()%></td>
                                            </tr>




                                            <% i++;
                                                    }
                                                }%>


                                        </table> 


                                        </td>
                                        </tr>
                                        </table>







                                    </s:elseif>
                                    <s:elseif test="#section.equals('chinhsua')">  <!---Begin Section= thongtin -->
                                        <div id="notify">
                                            <span id="lblError" style="color:#FF0000; font-size:15px; font-family:Arial, Helvetica, sans-serif">
                                                <s:property  value="lblNotify"></s:property>  </span>

                                            </div>
                                            <table>
                                                <tr> 
                                                    <th>STT</th>
                                                    <th>Mã GV</th>
                                                    <th>Tài khoản</th>
                                                    <th>Họ Đêm</th>
                                                    <th> Tên </th>


                                                    <th>Email</th>
                                                    <th>Thông tin </th>
                                                    <th> Cập nhật</th>

                                                </tr>

                                            <% if (listAccount
                                                        != null) {
                                                    i = 1;
                                                    for (Account gv : listAccount) {%>
                                            <tr>
                                            <form action="capnhattaikhoan" id="frm<%=i%>" method="POST" >
                                                <td><input type="text" disabled value="<%=i%>" size="2"></td>

                                                <td><input type="text"  disabled value="GV<%=gv.getMaGiaoVien()%>" size="3"></td>
                                                <td><input type="text" maxlength="4" name="user" disabled value="<%=gv.getUsername()%>"></td>
                                                <td><input type="text" name="hodem"  value="<%=gv.getHoDem()%>"></td>
                                                <td><input type="text" name="ten"  value="<%=gv.getTen()%>" size="5" ></td>


                                                <td><input type="text" name="email"  value="<%=gv.getEmail()%>"></td>
                                                <td><input type="text"  name="info" value="<%=gv.getThongTin()%>"> </td>
                                                <td><input type="hidden" name="username" value="<%=gv.getUsername()%>"/>
                                                    <input type="submit" id="btn<%=i%>" value="cập nhật"/> </td>
                                            </form>
                                            </tr>
                                            <% i++;
                                                    }
                                                }%>  
                                        </table> 


                                    </s:elseif>

                                    <s:elseif test="#section.equals('khoiphucmatkhau')">  <!---Begin Section= thongtin -->
                                        <div id="notify">
                                            <span id="lblError" style="color:#FF0000; font-size:15px; font-family:Arial, Helvetica, sans-serif">
                                                <s:property  value="lblNotify"></s:property>  </span>

                                            </div>

                                            <table>
                                                <tr> 
                                                    <th>STT</th>
                                                    <th>Mã GV</th>
                                                    <th>Tài khoản</th>
                                                    <th>Họ Tên</th>
                                                    <th>Thông tin </th>
                                                    <th> Mật khẩu</th>
                                                </tr>

                                            <% if (listAccount
                                                        != null) {
                                                    i = 1;
                                                    for (Account gv : listAccount) {%>
                                            <tr>
                                            <form action="khoiphucmatkhau" id="frmmk<%=i%>" method="POST" >
                                                <td><input type="text" disabled value="<%=i%>" size="2"></td>

                                                <td><input type="text"  disabled value="GV<%=gv.getMaGiaoVien()%>" size="3"></td>
                                                <td><input type="text"  name="user" disabled value="<%=gv.getUsername()%>"></td>
                                                <td><input type="text" disabled name="hodem"  value="<%=gv.getHoDem()%> <%=gv.getTen()%> "></td>

                                                <td><input type="text" disabled name="info" value="<%=gv.getThongTin()%>"> </td>
                                                <td> <input type="text" name="password" value='<%=gv.getDefPassword()%>'</td>
                                                <td><input type="hidden" name="username" value="<%=gv.getUsername()%>"/>
                                                    <input type="submit" id="btnmk<%=i%>" value="cập nhật"/> </td>
                                            </form>
                                            </tr>
                                            <% i++;
                                                    }
                                                }%>  
                                        </table> 
                                    </s:elseif>
                                    <s:elseif test="#section.equals('xoataikhoan')">  <!---Begin Section= thongtin -->


                                        <form action="xoataikhoan" method="POST">

                                            <br>



                                            <table class="listGV">
                                                <tr> 
                                                    <th>STT</th>
                                                    <th>Mã</th>
                                                    <th>Họ Tên</th>
                                                    <th>Tài khoản</th>
                                                    <th></th>

                                                </tr>

                                                <% if (listAccount
                                                            != null) {
                                                        i = 1;
                                                        for (Account ac : listAccount) {%>
                                                <tr id="view<%=i%>">
                                                    <td> <%=i%></td>
                                                    <td>GV<%=ac.getMaGiaoVien()%></td>
                                                    <td><%=ac.getHoDem()%> <%=ac.getTen()%></td>
                                                    <td><%=ac.getUsername()%></td>

                                                    <td> <input class="login" type="checkbox" name="deleteID" value="<%=ac.getMaGiaoVien()%>"> </td>
                                                </tr>
                                                <% i++;
                                                        }  //end For
                                                    } //end If%> 


                                            </table> 
                                            <br>
                                            <spam style="color:#FF0000; font-size:15px; font-family:Arial, Helvetica, sans-serif">
                                                <s:property value="lbldelNotify"/>
                                                <s:iterator value="lblthongbao" >
                                                    <br>
                                                    <s:property></s:property>
                                                </s:iterator>
                                            </spam>


                                            <table>

                                                <tr>
                                                    <td>  Mã an toàn     </td>

                                                    <td>
                                                        <img id="img_captcha" src="/vn/thcs/security/recaptcha/capcha.jpg">
                                                        <img src="/vn/Image/reload.png" onclick="reloadImage()"></td>
                                                    <!--    <div id="divcaptcha"  style="border: 1px solid #C0C0C0;"></div>
                                                        <input type="hidden"  id="tcaptcha" readonly="true" size="14" name="captcha"/> </td>  -->
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                </tr>

                                                <tr>
                                                    <td>  Xác nhận </td>
                                                    <td> <input type="text" name="recaptcha" size="8"/></td>
                                                </tr>

                                                <tr>
                                                    <td>  <input type="submit" value="Xóa Tài khoản" /></td>
                                                    <td> </td>
                                                </tr>
                                            </table>



                                        </form>
                                    </s:elseif>
                                    <s:else>

                                    </s:else>





                                    </div> <!--End Main -->
                                    <div id="footer">
                                        <jsp:include page="/Common/footer.jsp" />
                                    </div>

                                    </div>
                                    </body>
                                    </html>


