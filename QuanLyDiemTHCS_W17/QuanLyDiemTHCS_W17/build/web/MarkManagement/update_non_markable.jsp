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
        String listValue[] = new String[2];        
        listValue[0] = "Không";
        listValue[1] = "Đạt";
        
        for(int i=0; i<mc.getMaxM(); i++)
        {
            out.write("<td align='center' class='mark_record'>");
            if(md.M[i] != null){                
                int value = Integer.parseInt(md.M[i].value);
                out.write("<select id='" + count + "_M" + i + "' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
                
                out.write("<option value=''>---</option>");
                for(int j = 0; j<2; j++)
                {
                    if(j == value)
                        out.write("<option value='" + j + "' selected>" + listValue[j] + "</option>");
                    else
                        out.write("<option value='" + j + "'>" + listValue[j] + "</option>");
                }
                out.write("</select>");                        
            }
            else {
                out.write("<select id='" + count + "_M" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>"); 
                
                out.write("<option value='' selected>---</option>");
                out.write("<option value='0'>Không</option>");
                out.write("<option value='1'>Đạt</option>");
                out.write("</select>");
            }
            out.write("</td>");
        }
        
        for(int i=0; i<mc.getMax15P(); i++)
        {
            out.write("<td align='center' class='mark_record'>");
            if(md.P15[i] != null){
                int value = Integer.parseInt(md.P15[i].value);
                out.write("<select id='" + count + "_P" + i + "' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
                
                out.write("<option value=''>---</option>");
                for(int j = 0; j<2; j++)
                {
                    if(j == value)
                        out.write("<option value='" + j + "' selected>" + listValue[j] + "</option>");
                    else
                        out.write("<option value='" + j + "'>" + listValue[j] + "</option>");
                }
                out.write("</select>");
            }
            else {
                out.write("<select id='" + count + "_P" + i + "' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
                
                out.write("<option value='' selected>---</option>");
                out.write("<option value='0'>Không</option>");
                out.write("<option value='1'>Đạt</option>");  
                out.write("</select>");
            }
            out.write("</td>");
        }
        
        for(int i=0; i<mc.getMax45P(); i++)
        {
            out.write("<td align='center' class='mark_record'>");   
            if(md.P45[i] != null){
                int value = Integer.parseInt(md.P45[i].value);
                out.write("<select id='" + count + "_V" + i + "' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
                
                out.write("<option value=''>---</option>");
                for(int j = 0; j<2; j++)
                {
                    if(j == value)
                        out.write("<option value='" + j + "' selected>" + listValue[j] + "</option>");
                    else
                        out.write("<option value='" + j + "'>" + listValue[j] + "</option>");
                }
                out.write("</select>");
            }
            else {
                out.write("<select id='" + count + "_V" + i + "' type='textbox' size='1' "
                        + "onchange='updateMarkDetail(this.id)'>");
                
                out.write("<option value='' selected>---</option>");
                out.write("<option value='0'>Không</option>");
                out.write("<option value='1'>Đạt</option>");  
                out.write("</select>");
            }
            out.write("</td>");
        }
        
        out.write("<td align='center' class='mark_record'>");
        if (md.HK != null) {
            int value = Integer.parseInt(md.HK.value);
            out.write("<select id='" + count + "_H' size='1' "
                    + "onchange='updateMarkDetail(this.id)'>");
            
            out.write("<option value=''>---</option>");
            for (int j = 0; j<2; j++) {
                if (j == value) {
                    out.write("<option value='" + j + "' selected>" + listValue[j] + "</option>");
                } else {
                    out.write("<option value='" + j + "'>" + listValue[j] + "</option>");
                }
            }
            out.write("</select>");
        } else {
            out.write("<select id='" + count + "_H' size='1' "
                    + "onchange='updateMarkDetail(this.id)'>");
            
            out.write("<option value='' selected>---</option>");
            out.write("<option value='0'>Không</option>");
            out.write("<option value='1'>Đạt</option>");
            out.write("</select>");
        }
        
        out.write("</td>");
        if(md.AVG != null)
        {
            int value = Integer.parseInt(md.AVG);
            out.write("<td align='center'>" + listValue[value] + "</td>");
        }
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