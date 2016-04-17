/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import MarkManagement.Subject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class SubjectDAO 
{
    public SubjectDAO(){
        
    }
    
    public ArrayList<Subject> getListSubject() throws SQLException, Exception
    {
        ArrayList<Subject> result = new ArrayList<Subject>();
        Connection con = DBConnector.getConnection();
        String cmdSQL = "SELECT * FROM MonHoc";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        ResultSet rs = stm.executeQuery();
        
        while(rs.next())
        {
            Subject sbj = new Subject();
            sbj.setID(rs.getString("MaMonHoc").trim());
            sbj.setName(rs.getString("TenMonHoc"));
            sbj.setType(rs.getString("LoaiMon"));
            
            result.add(sbj);
        }
        
        return result;
    }            
}
