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
        border: 0px;
        padding: 0px;
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
<table cellspacing="0" style="border:1px solid #333">
    <tr>
        <td rowspan="2" align="center" style="width: 50px;" class="mark_table_header">STT</td>
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
        <td rowspan="2" align="center" style="width: 60px;" class="mark_table_header">Trung bình</td>
    </tr>
    <tr>
        
        <%        
        for(int i=1; i<=mc.getMaxM(); i++)
        {
            out.write("<td align='center' class='mark_table_header' style='width: 41px'>M" + i + "</td>");
        }
        
        for(int i=1; i<=mc.getMax15P(); i++)
        {
            out.write("<td align='center' class='mark_table_header' style='width: 41px'>P" + i + "</td>");
        }
        
        for(int i=1; i<=mc.getMax45P(); i++)
        {
            out.write("<td align='center' class='mark_table_header' style='width: 41px'>V" + i + "</td>");
        }
        %>
    </tr>
<%    
if(listMarkDetail != null && !listMarkDetail.isEmpty()) //if#1
{    
    int count = 0;
    for(MarkDetail md:listMarkDetail)
    {
        if(count % 2 == 0){
            out.write("<tr class='even_row'>");
        } else
            out.write("<tr class='odd_row'>");
%>
        <td style="text-align: left;"><%=count+1%></td>
        <td style="text-align: left;"><%= md.getStudentID() %></td>
        <td style="text-align: left;"><%= md.getStudentFullName() %></td>
        
<%      
        for(int i=0; i<mc.getMaxM(); i++)
        {
            out.write("<td align='center' class='mark_record'>");
            if(md.M[i] != null){                
                int value = (int) Float.parseFloat(md.M[i].value);
                out.write("<input id='" + count + "_M" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'"
                        + "value='" + value + "'>");
            }
            else {
                out.write("<input id='" + count + "_M" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
            }
            out.write("</td>");
        }
        
        for(int i=0; i<mc.getMax15P(); i++)
        {
            out.write("<td align='center' class='mark_record'>");
            if(md.P15[i] != null){
                int value = (int) Float.parseFloat(md.P15[i].value);
                out.write("<input id='" + count + "_P" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'"
                        + "value='" + value + "'>");
            }
            else {
                out.write("<input id='" + count + "_P" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
            }
            out.write("</td>");
        }
        
        for(int i=0; i<mc.getMax45P(); i++)
        {
            out.write("<td align='center' class='mark_record'>");   
            if(md.P45[i] != null){
                int value = (int) Float.parseFloat(md.P45[i].value);
                out.write("<input id='" + count + "_V" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'"
                        + "value='" + value + "'>");
            }
            else {
                out.write("<input id='" + count + "_V" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
            }
            out.write("</td>");
        }
        
        out.write("<td align='center' class='mark_record'>");
        if(md.HK != null){
            out.write("<input id='" + count + "_H' type='textbox' size='1' onchange='updateMarkDetail(this.id)'"
                    + "value='" + md.HK.value + "'>");
        } else {
            out.write("<input id='" + count + "_H' type='textbox' size='1' onchange='updateMarkDetail(this.id)'>");
        }
        out.write("</td>");
        if(md.AVG != null)
            out.write("<td align='center'>" + md.AVG + "</td>");
        else
            out.write("<td align='center'></td>");
        out.write("<tr>");
        
        count++; // point to next record in the mark list
    }
} // endif #1
%>
</table>
<%  
}
%>