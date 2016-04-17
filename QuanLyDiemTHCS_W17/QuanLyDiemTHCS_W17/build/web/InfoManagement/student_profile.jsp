<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="s" uri="/struts-tags" %>

<%
    if (session.getAttribute("username") == null) {%> 
<jsp:forward page="/LoginManagement/login.jsp"/>
<%}
%>

<%
    // Kiem tra co phai tai khoan Manager hay khong
    if (!session.getAttribute("account_type").toString().equals("MANAGER")) {%>
<jsp:forward page="/Common/home.jsp" />
<%}
%>

<html>    
    <head>      
        <link rel="stylesheet" type="text/css" href="<s:url value="/CSS/StyleSheet.css"/>">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Quản lý hồ sơ học sinh</title>

        <style type="text/css">            
            .table_header {
                border: solid 1px #333;            
                background-color: #B5E2FE;
                padding-top: 2px;
                padding-bottom: 2px;
            }

            .student-list {
                background: #e9f5d3;
                border-bottom: 1px solid #cce2b7;
                border-left: 1px solid #cce2b7;
                border-right: 1px solid #cce2b7;
                overflow: auto;                
            }

            .record
            {
                border-left: solid 1px #BBB;
                padding-top: 1px;
                padding-bottom: 1px;
            }

            .record:hover
            {
                background-color: cornflowerblue;
                color: white;
                cursor: pointer;
            }
        </style>

        <script type="text/javascript">
            function showProfileDetail(index)
            {
                document.listProfile.action = "showProfileDetail";
                document.getElementById("clickedProfile").value = index;
                document.listProfile.submit();
            }
        </script>
    </head>
    <body>      
        <div id="wrap">
            <div id="header">
                <jsp:include page="/Common/header.jsp"/>
            </div>

            <div id="main">
                <table cellpadding="0" cellspacing="0" style="width: 1100px">
                    <tr>
                        <td colspan="2" style="height: 30px">
                            <div><s:property value="status" /></div>
                            <div><s:property value="array" /></div>
                        </td>
                    </tr>

                    <tr>
                        <s:form onkeypress="return event.keyCode != 13;"
                                action="student_profile" method="post" name="listProfile">    
                            <td style="width: 600px">
                                <div class ="student-list" style="height:600px; width: 600px">                        
                                    <table style="width:580px">
                                        <tr valign="top">
                                            <td>
                                                Chọn khối:
                                                <s:select onchange="this.form.submit()"
                                                          name="selectedGrade"
                                                          list="{'6', '7', '8', '9'}"
                                                          headerKey="0"
                                                          headerValue="- Khối -" />

                                                <s:if test="selectedGrade!=null && selectedGrade!=0">
                                                    <s:submit value="Tải lại" method="refreshList"/>
                                                </s:if>
                                            </td>                                        
                                            <td align="right">
                                                <s:if test="selectedGrade == null || selectedGrade == 0">
                                                    <s:submit value="Thêm mới" method="createProfile" disabled="true"/>
                                                </s:if>
                                                <s:else>
                                                    <s:submit value="Thêm mới" method="createProfile"/>    
                                                </s:else>

                                                <s:if test="studentList.size() !=0">
                                                    <s:submit method="removeStudent" value="Xóa hồ sơ"/>
                                                </s:if>
                                                <s:else>
                                                    <s:submit method="removeStudent" value="Xóa hồ sơ" disabled="true"/>
                                                </s:else>
                                            </td>
                                        </tr>
                                    </table>     

                                    <table cellpadding="0" cellspacing="0" style="width: 570px;">
                                        <tbody>
                                            <tr>
                                                <td class="table_header" style="width:40px; text-align: center">STT</td>
                                                <td class="table_header" style="width: 120px; text-align: center">Mã học sinh</td>
                                                <td class="table_header" style="width:260px; text-align: center">Họ và tên</td>
                                                <td class="table_header" style="width:100px; text-align: center">Ngày Sinh</td>
                                                <td class="table_header" style="width:40px; text-align: center">Chọn</td>
                                                <td></td>
                                            </tr>
                                    </table> 
                                    <table cellpadding="0" cellspacing="0"  style="width: 570px;">        
                                        <s:hidden name="clickedProfile" id="clickedProfile" />
                                        <s:if test="studentList.size() != 0">
                                            <s:iterator value="studentList" var="student" status="stat">                                            
                                                <tr>
                                                    <td>
                                                        <table cellpadding="0" cellspacing="0">
                                                            <s:if test="#stat.index == clickedProfile">
                                                                <tr id="<s:property value="#stat.index.toString()"/>"
                                                                    onclick="showProfileDetail(this.id);"
                                                                    class="record"
                                                                    style="background-color: deepskyblue;">
                                                                </s:if>
                                                                <s:else>
                                                                <tr id="<s:property value="#stat.index.toString()"/>"
                                                                    onclick="showProfileDetail(this.id);"
                                                                    class="record">
                                                                </s:else>
                                                                <td style="width:40px;"><s:property value="#stat.index+1"/></td>
                                                                <td style="width:125px; text-align: left"><s:property value="#student.ID"/></td>
                                                                <td style="width:260px;"><s:property value="#student.lastname + ' ' + #student.firstname"/></td>
                                                                <td style="width:102px; text-align: center"><s:property value="#student.birthdate"/></td>                                                           
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td style="text-align: center; width: 40px">
                                                        <s:checkbox name="selectedProfile" fieldValue = "%{#stat.index}" value="false"/>
                                                    </td>
                                                    <td></td>
                                                </tr>                                    
                                            </s:iterator>

                                        </s:if>
                                        </tbody>        
                                    </table> 

                                </div>   
                            </td>
                            <td>
                                <s:if test="%{showNewProfile == null || showNewProfile == false}">
                                    <div style="width:490px; height: 290px; margin-left: 5px; border:2px solid activecaption;">
                                        <div style="width:490px; height:30px; text-align: center; padding-top: 10px;
                                             background-color: deepskyblue; color: #FFFFFF;">
                                            Chi tiết hồ sơ
                                        </div>
                                        <div style="width:490px; height:250px; text-align: center; background-color: whitesmoke;">
                                            <s:if test="profileDetail != null">
                                                <table style="padding-left: 10px;">
                                                    <tr>
                                                        <td>Họ đệm</td>
                                                        <td><s:textfield name="profileDetail.lastname" onkeypress="return event.keyCode != 13;"
                                                                     value="%{profileDetail.lastname}"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tên</td>
                                                        <td><s:textfield name="profileDetail.firstname" onkeypress="return event.keyCode != 13;"
                                                                     value="%{profileDetail.firstname}"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mã số </td>
                                                        <td><s:textfield name="profileDetail.ID" disabled="true"
                                                                     value="%{profileDetail.ID}"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Khối </td>
                                                        <td><s:textfield name="profileDetail.grade" disabled="true"
                                                                     value="%{profileDetail.grade}"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Ngày sinh</td>
                                                        <td><s:textfield name="profileDetail.birthdate" onkeypress="return event.keyCode != 13;"
                                                                     value="%{profileDetail.birthdate}"/> (yyyy-mm-dd)</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giới Tính</td>
                                                        <td><s:select list="{'Nam', 'Nữ'}" name="profileDetail.sex" style="width:80px" onkeypress="return event.keyCode != 13;"
                                                                  value="profileDetail.sex"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Trạng thái</td>
                                                        <td>
                                                            <s:select name="profileDetail.status" list="{'học', 'thôi học', 'tốt nghiệp'}" onkeypress="return event.keyCode != 13;"
                                                                      value="profileDetail.status" style="width:80px"/>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <s:submit value="Cập nhật" method="updateProfile"/>
                                            </s:if>
                                        </div>
                                    </div>
                                </s:if>
                                <s:else>
                                    <div style="width:490px; height: 290px; margin-left: 5px;
                                         border:2px solid activecaption;">
                                        <div style="width:490px; height:30px; text-align: center; padding-top: 10px;
                                             background-color: deepskyblue; color: #FFFFFF;">
                                            Thêm học sinh mới
                                        </div>
                                        <div style="width:490px; height:250px; text-align: center; background-color: whitesmoke;">
                                            <s:if test="showNewProfile == true">
                                                <table style="padding-left: 10px;">
                                                    <tr>
                                                        <td>Mã số </td>
                                                        <td>
                                                            <s:textfield disabled="true" value="%{newProfile.ID}" />
                                                            <s:hidden name="newProfile.ID" value="%{newProfile.ID}" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Khối </td>
                                                        <td>
                                                            <s:textfield disabled="true" value="%{newProfile.grade}"/>                                                    
                                                            <s:hidden name="newProfile.grade" value="%{newProfile.grade}" />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Họ đệm</td>
                                                        <td><s:textfield name="newProfile.lastname" value=""
                                                                     onkeypress="return event.keyCode != 13;"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tên</td>
                                                        <td><s:textfield name="newProfile.firstname" value=""
                                                                     onkeypress="return event.keyCode != 13;"/></td>
                                                    </tr>                                            
                                                    <tr>
                                                        <td>Ngày sinh</td>
                                                        <td><s:textfield name="newProfile.birthdate" value=""
                                                                     onkeypress="return event.keyCode != 13;"/> (yyyy-mm-dd)</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giới Tính</td>
                                                        <td><s:select name="newProfile.sex" list="{'Nam', 'Nữ'}" style="width:80px"
                                                                  headerKey="0" headerValue="- chọn -"
                                                                  onkeypress="return event.keyCode != 13;"/></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Trạng thái</td>
                                                        <td>
                                                            <s:select name="newProfile.status" list="{'học', 'thôi học', 'tốt nghiệp'}"
                                                                      headerKey="0" headerValue="- chọn -" style="width:80px"
                                                                      onkeypress="return event.keyCode != 13;"/>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <s:submit style="margin-top:10px;" value="Xác nhận" method="addProfile"/>
                                            </s:if>
                                        </div>
                                    </div>
                                </s:else>
                                <div style="width:490px; height: 290px; margin-left: 5px; margin-top: 10px;
                                     border:2px solid activecaption;">
                                    <div style="width:490px; height:30px; text-align: center; padding-top: 10px;
                                         background-color: deepskyblue; color: #FFFFFF;">
                                        Hướng dẫn
                                    </div>
                                    <div style="width: 485px; padding-top: 10px; padding-left: 5px;
                                         background-color: azure;">
                                        - Họ đệm và tên không được để trống <br>
                                        - Ngày sinh nhập theo cú pháp: năm - tháng - ngày. Ví dụ: 1992-08-19
                                    </div>
                                </div>
                            </td>
                            <s:token />
                        </s:form>
                    </tr>   
                </table>
            </div>

            <div id="footer" style="margin-top: 5px;">
                <jsp:include page="/Common/footer.jsp"/>
            </div>
        </div>
    </body>
</html>