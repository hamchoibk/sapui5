/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import InfoManagement.Classes;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class ClassDAO 
{
    public ClassDAO(){
        
    }

    public ArrayList<Classes> getListClass() throws SQLException, Exception 
    {
        Connection con = DBConnector.getConnection();
        ArrayList<Classes> list = new ArrayList<Classes>();
        String cmdSQL = "SELECT MaLop, Khoi FROM LopHoc";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        ResultSet rs = stm.executeQuery();
        while(rs.next())
        {
            Classes cls = new Classes();
            cls.setClassID(rs.getString("MaLop").trim());
            cls.setGrade(rs.getString("Khoi"));
            
            list.add(cls);
        }
        
        return list;
    }
}
