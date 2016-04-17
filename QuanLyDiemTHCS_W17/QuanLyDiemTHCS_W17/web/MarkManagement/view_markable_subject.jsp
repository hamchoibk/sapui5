<%@page import="MarkManagement.MarkDetail"%>
<%@page import="java.util.ArrayList"%>
<%@page import="MarkManagement.MarkConfig"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script>

</script>

<style>
    .mark_table_header
    {
        border: solid 1px #333; 
        background-color: lightskyblue;
    }
    
    .mark_record
    {
        border-left: 1px solid #BBB;
        padding: 0px;        
        height: 25px;
    }
    
    .odd_row
    {
        background-color: #d0e4fe;    
    }
    
    .even_row
    {
        background-color: aliceblue;
    }
</style>

<%
if(session.getAttribute("markConfig")!=null)
{
    MarkConfig mc = (MarkConfig) session.getAttribute("markConfig"); 
    ArrayList<MarkDetail> listMarkDetail = (ArrayList<MarkDetail>) session.getAttribute("listMarkDetail");
%>
<table cellspacing="0" style="border:1px solid #333; margin-left: 5px;">
    <tr>
        <td rowspan="2" align="center" style="width: 40px;" class="mark_table_header">STT</td>
        <td rowspan="2" align="center" style="width: 100px;" class="mark_table_header">Mã học sinh</td>
        <td rowspan="2" align="center" style="width: 200px;" class="mark_table_header">Họ và tên</td>
        <%        
        out.write("<td colspan = " + mc.getMaxM() + " align='center'"
                + " class='mark_table_header'>Điểm miệng</td>");
        out.write("<td colspan = " + mc.getMax15P() + " align='center'"
                + " class='mark_table_header'>Điểm 15 phút</td>");
        out.write("<td colspan = " + mc.getMax45P() + " align='center'"
                + " class='mark_table_header'>Điểm 45 phút</td>");        
        %>
        <td rowspan="2" align="center" style="width: 60px;" class="mark_table_header">Điểm học kỳ</td>
        <td rowspan="2" align="center" style="width: 50px;" class="mark_table_header">Trung bình</td>
    </tr>
    <tr>        
        <%        
        for(int i=1; i<=mc.getMaxM(); i++)
        {
            out.write("<td align='center' class='mark_table_header' style='width: 35px'>M" + i + "</td>");
        }
        
        for(int i=1; i<=mc.getMax15P(); i++)
        {
            out.write("<td align='center' class='mark_table_header' style='width: 35px'>P" + i + "</td>");
        }
        
        for(int i=1; i<=mc.getMax45P(); i++)
        {
            out.write("<td align='center' class='mark_table_header' style='width: 35px'>V" + i + "</td>");
        }
        %>
    </tr>
<%    
if(listMarkDetail != null && !listMarkDetail.isEmpty()) //if#1
{
    int count = 0;
    for(MarkDetail md : listMarkDetail)
    {
        if(count % 2 == 0){
            out.write("<tr class='even_row'>");
        } else
            out.write("<tr class='odd_row'>");
%>
        <td style="text-align: left;"><%= count+1%></td>
        <td style="text-align: left;"><%= md.getStudentID() %></td>
        <td style="text-align: left;"><%= md.getStudentFullName() %></td>        
<%      
        for(int i=0; i<mc.getMaxM(); i++)
        {
            out.write("<td align='center' class='mark_record'>");    
            if(md.M[i] != null){                
                int value = (int) Float.parseFloat(md.M[i].value);
                out.write("" + value);
            }
            out.write("</td>");
        }
        
        for(int i=0; i<mc.getMax15P(); i++)
        {
            out.write("<td align='center' class='mark_record'>");
            if(md.P15[i] != null){
                int value = (int) Float.parseFloat(md.P15[i].value);
                out.write("" + value);
            }
            out.write("</td>");
        }
        
        for(int i=0; i<mc.getMax45P(); i++)
        {
            out.write("<td align='center' class='mark_record'>");    
            if(md.P45[i] != null){
                int value = (int) Float.parseFloat(md.P45[i].value);
                out.write("" + value);
            }
            out.write("</td>");
        }
        
        // điểm học kỳ
        out.write("<td align='center' class='mark_record'>");        
        if(md.HK != null)
            out.write(md.HK.value);        
        out.write("</td>");
                
        // điểm tổng kết
        out.write("<td align='center' class='mark_record'>");        
        if(md.AVG != null)
            out.write(md.AVG);        
        out.write("</td>");
        
        out.write("<tr>");
        
        count++; // point to next record in the mark list
    }
}// endif #1
else
{
    out.write("</table><div style='width: 980px; align: center; display: block; float: left; margin-left: 10px;"
            + " margin-top: 5px; color: red;'>"
            + "Không có dữ liệu</div>");
}
%>
</table>
<%  
}
%>