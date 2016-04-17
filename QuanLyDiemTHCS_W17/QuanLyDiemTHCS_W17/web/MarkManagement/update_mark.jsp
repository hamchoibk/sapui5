<%@page import="MarkManagement.MarkConfig"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib prefix="s" uri="/struts-tags" %>

<%
    // Vo hieu hoa cache    
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    response.setDateHeader("Expires", 0); // Proxies.
    
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
        <link rel="stylesheet" type="text/css" href="<s:url value="/CSS/StyleSheet.css"/>">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Cập nhật điểm môn học</title>
        
        <script>
            function submitSelectedSubject()
            {
                document.updateMarkForm.action = "loadClassList";
                document.updateMarkForm.submit();
            }
            
            function submitSelectedClass()
            {
                document.updateMarkForm.action = "loadClassList";
                document.updateMarkForm.submit();
            }
            
            function showMarkDetail()
            {
                document.updateMarkForm.action = "showMarkDetail";
                document.updateMarkForm.submit();                
            }
            
            function updateMarkDetail(id)
            {
                document.updateMarkForm.action = "update_mark";
                document.getElementById("updatedPosition").value = id;
                document.getElementById("updatedValue").value = document.getElementById(id).value;
                document.updateMarkForm.submit();
            }
        </script>
    </head>
    <body>
        <div id="wrap">
            <div id="header">
                <jsp:include page="/Common/header.jsp"/>
            </div>

            <div id="main">
                <s:form name="updateMarkForm" action="update_mark" method="post">
                    <s:hidden name="updatedPosition" id="updatedPosition"/>
                    <s:hidden name="updatedValue" id="updatedValue"/>
                    <div style="width:1100px;">
                        <div style="margin-left: 10px; float: left;">
                            Môn học: 
                            <s:if test="listSubject.size() != 0">
                                <s:select name="selectedSubject" headerKey="0" headerValue="- chọn -"
                                      list="listSubjectName" value="%{selectedSubject}"
                                      onchange="submitSelectedSubject()"/>
                            </s:if>
                            <s:else>
                                <s:select list="listSubjectName" name="selectedSubject"
                                          headerKey="0" headerValue="- chọn -" disabled="true"/>
                            </s:else>
                        </div>
                        <div style="margin-left: 10px; float: left;">
                            Lớp: 
                            <s:if test="listClass.size() != 0">
                                <s:select name="selectedClass" list="listClass" headerKey="0" headerValue="- chọn -"
                                          onchange="showMarkDetail()" value="%{selectedClass}"/>
                            </s:if>
                            <s:else>
                                <s:select list="listClass" headerKey="0" headerValue="- chọn -" disabled="true"/>
                            </s:else>
                        </div>
                        <div style="margin-left: 10px; float: left;">
                            <s:submit method="reloadMarkDetail" value="Tải lại"/>
                        </div>
                    </div>
                        <br>
                    <div style="width:1100px; float: left; padding-top: 5px; height: 20px;">
                        <s:property value="status" />
                    </div>
                    
                    <div style="width:1100px; min-height: 350px;">
                        <s:if test="selectedSubject != null">
                        <%
                            String sbjType = session.getAttribute("subject_type").toString();
                            if(sbjType.equals(MarkConfig.MARKABLE))
                            {
                        %>
                            <jsp:include page="/MarkManagement/update_markable_subject.jsp"/>                    
                        <%
                            } else {%>
                            <jsp:include page="/MarkManagement/update_non_markable.jsp"/>
                        <%
                            }                        
                        %>
                        </s:if>
                    </div>
                    <s:token />
                </s:form>
            </div>

            <div id="footer">
                <jsp:include page="/Common/footer.jsp"/>        
            </div>
        </div>
    </body>
</html>