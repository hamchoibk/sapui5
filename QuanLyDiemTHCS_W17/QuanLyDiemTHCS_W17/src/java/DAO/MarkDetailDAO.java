/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import MarkManagement.Mark;
import MarkManagement.MarkConfig;
import MarkManagement.MarkDetail;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class MarkDetailDAO 
{
    
    public MarkDetailDAO()
    {
        
    }
    
    public void fillMarkDetailList(ArrayList<MarkDetail> list, String semesterID, 
            String subjectID, String classID, MarkConfig markConfig, String type) 
            throws SQLException, Exception
    {
        Connection con = DBConnector.getConnection();
        
        String cmdSQL;
        if(type.equals(MarkConfig.MARKABLE))
            cmdSQL = "EXEC getMarkDetail_markable @semester = ?, @subject=?, @class=?";
        else
            cmdSQL = "EXEC getMarkDetail_nonmarkable @semester = ?, @subject=?, @class=?";
        
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, semesterID);        
        stm.setString(2, subjectID);
        stm.setString(3, classID);

        ResultSet rs = stm.executeQuery();
        
        ArrayList<String> listID = new ArrayList<String>();
        for(MarkDetail md:list)
        {
            listID.add(md.getStudentID());
        }
        
        boolean next = rs.next();
        while (next) 
        {
            String ID = rs.getString("MaHocSinh").trim();
            int index = listID.indexOf(ID);
            MarkDetail md = list.get(index);

            // get 15P mark
            int i = 0;
            while (next && rs.getString("LoaiDiem").equals("15P") && rs.getString("MaHocSinh").trim().equals(ID)) {
                md.P15[i] = new Mark();
                md.P15[i].value = rs.getString("GiaTri");
                md.P15[i].ID = rs.getString("STT");
                i++;
                next = rs.next();
            }

            // get 45P mark
            i = 0;
            while (next && rs.getString("LoaiDiem").equals("45P") && rs.getString("MaHocSinh").trim().equals(ID)) {
                md.P45[i] = new Mark();
                md.P45[i].value = rs.getString("GiaTri");
                md.P45[i].ID = rs.getString("STT");
                i++;
                next = rs.next();
            }

            if(!next) // exit if result set has no more rows
                break;
            // get semester mark (HK)
            if(rs.getString("LoaiDiem").equals("HK") && rs.getString("MaHocSinh").trim().equals(ID))
            {
                md.HK = new Mark();
                md.HK.value = rs.getString("GiaTri");
                md.HK.ID = rs.getString("STT");
                next = rs.next();
            }

            // get M mark
            i = 0;
            while (next && rs.getString("LoaiDiem").equals("M") && rs.getString("MaHocSinh").trim().equals(ID)) {
                md.M[i] = new Mark();
                md.M[i].value = rs.getString("GiaTri");
                md.M[i].ID = rs.getString("STT");
                i++;
                next = rs.next();
            }

            list.set(index, md);
        }
    }
    
    public boolean updateMark(Mark m, String subjectType) throws SQLException, Exception
    {   
        Connection con = DBConnector.getConnection();
        if (con == null) {
            return false;
        }

        String cmdSQL;
        if (subjectType.equals(MarkConfig.MARKABLE)) {
            cmdSQL = "EXEC updateMark_markable @STT = ?, @value=?";
        } else {
            cmdSQL = "EXEC updateMark_nonmarkable @STT = ?, @value=?";
        }
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, m.ID);
        stm.setString(2, m.value);

        stm.execute();

        return true;
    }

    public boolean insertMark(Mark mark, String markType, String subjectID,
            String semesterID, String studentID, String subjectType) 
            throws SQLException, Exception 
    {
        Connection con = DBConnector.getConnection();
        String cmdSQL;
        if(subjectType.equals(MarkConfig.MARKABLE))
            cmdSQL = "{? = CALL insertMark_markable(?, ?, ?, ?, ?)}";
        else
            cmdSQL = "{? = CALL insertMark_nonmarkable(?, ?, ?, ?, ?)}";
        
        // convert mark type
        if(markType.equals("P"))
            markType = "15P";
        else if(markType.equals("V"))
            markType = "45P";
        else if(markType.equals("H"))
            markType = "HK";
        
        CallableStatement stm = con.prepareCall(cmdSQL);
        stm.registerOutParameter(1, Types.INTEGER);
        stm.setString(2, studentID);
        stm.setString(3, semesterID);
        stm.setString(4, subjectID);
        stm.setString(5, markType);
        stm.setString(6, mark.value);
        
        stm.execute();
        
        int newID = stm.getInt(1);
        if(newID != 0)
        {
            mark.ID = "" + newID;
            return true;
        }
        // else
        return false;
    }

    public boolean removeMark(Mark mark, String subjectType) throws SQLException, Exception 
    {
        Connection con = DBConnector.getConnection();
        
        String cmdSQL;
        if(subjectType.equals(MarkConfig.MARKABLE))            
            cmdSQL = "EXEC removeMark_markable @ID = ?";
        else                        
            cmdSQL = "EXEC removeMark_nonmarkable @ID = ?";
        
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, mark.ID);
        stm.execute();
        
        return true;
    }
}
