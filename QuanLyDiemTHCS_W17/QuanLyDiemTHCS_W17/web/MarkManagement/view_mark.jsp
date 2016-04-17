<%@page import="InfoManagement.Classes"%>
<%@page import="java.util.ArrayList"%>
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
        <title>Xem điểm môn học</title>
        
        <script>
            function submitSelectedSubject(value)
            {
                if(value != "0")
                {                    
                    document.viewMarkForm.action = "processSelectedSubject";
                    document.viewMarkForm.submit();
                }
            }
            
            function submitSelectedClass(value)
            {
                document.getElementById("selectedClass").value = value;
                document.viewMarkForm.action = "processSelectedClass";
                document.viewMarkForm.submit();
            }
            
            function submitSelectedSemester(value)
            {                
                if(value != "0")
                {
                    document.viewMarkForm.action = "processSelectedSemester";
                    document.viewMarkForm.submit();
                }
            }            
        </script>
    </head>
    <body>
        <div id="wrap">
            <div id="header">
                <jsp:include page="/Common/header.jsp"/>
            </div>

            <div id="main" style="display: block; float: left;">
                <div style="width:91px; min-height: 400px; border: 1px solid #333;
                     margin-top: 5px; float: left; display: block">
                    <%
                    if(session.getAttribute("listClass") != null)
                    {
                        ArrayList<Classes> listClass = (ArrayList<Classes>)
                                session.getAttribute("listClass");
                        String grade = listClass.get(0).getGrade();
                        out.write("<div style='width: 90px; padding-left:5px; margin-top: 10px;'>Khối " + grade + "</div>");
                        for(Classes cls:listClass)
                        {
                            if (!grade.equals(cls.getGrade())) {
                                grade = cls.getGrade();
                                out.write("<div style='width: 90px; padding-left:5px; margin-top: 10px;'>Khối " 
                                        + grade + "</div>");
                            }
                            
                            out.write("<div style='width:90px; padding-left: 30px;'>"
                                    + "<a id='" + cls.getClassID() + "' onclick='submitSelectedClass(this.id)'>"
                                    + cls.getClassID() + "</a></div>");
                        }
                    }
                    %>
                </div>
                <div style="width: 1000px; margin-left: 5px; margin-top: 5px;
                     border: 1px solid #333; float: left; display: block;">
                <s:form name="viewMarkForm" action="view_mark" method="post">
                    <s:hidden name="selectedClass" id="selectedClass"/>
                    <div style="width:1000px; float: left; display: block;">
                        <div style="margin-left: 10px; float: left;">
                            Học kỳ:
                            <s:if test="listSemester.size() != 0">
                                <s:select list="listSemester" name="selectedSemester"
                                          headerValue="- chọn -" headerKey="0"
                                          value="%{selectedSemester}" onchange="submitSelectedSemester(this.value)"/>
                            </s:if>
                            <s:else>
                                <s:select list="listSemester" headerKey="0" headerValue="- chọn -" disabled="true"/>
                            </s:else>
                        </div>
                        <div style="margin-left: 20px; float: left;">
                            Môn học:
                            <s:if test="listSubjectName.size() != 0">
                                <s:select list="listSubjectName" name="selectedSubject"
                                          headerKey="0" headerValue="- chọn -"  
                                          value="%{selectedSubject}" onchange="submitSelectedSubject(this.value)"/>
                            </s:if>
                            <s:else>
                                <s:select list="listSubjectName" headerKey="0" headerValue="- chọn -" disabled="true"/>
                            </s:else>                                
                        </div>
                    </div>
                        <br>
                    <div style="width:1000px; float: left; padding-top: 5px; padding-left: 5px;
                         height: 20px; display: block;">
                        <s:property value="status" />
                    </div>                    
                    
                    <div style="width:1000px; min-height: 350px; float: left; display: block; overflow-x: auto;">                        
                        <s:if test="%{selectedSubject != null && selectedSemester != null && selectedClass != null}">
                        <%
                            String sbjType = session.getAttribute("subject_type").toString();
                            if(sbjType.equals(MarkConfig.MARKABLE))
                            {
                        %>
                            <jsp:include page="/MarkManagement/view_markable_subject.jsp"/>                    
                        <%
                            } else {%>
                            <jsp:include page="/MarkManagement/view_non_markable.jsp"/>
                        <%
                            }
                        %>
                        </s:if>
                    </div>
                </s:form>
                </div>
            </div>

            <div id="footer" style="display: block; float: left;">
                <jsp:include page="/Common/footer.jsp"/>        
            </div>
        </div>
    </body>
</html>