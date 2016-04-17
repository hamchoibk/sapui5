package DAO;


import LoginManagement.Teacher;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Administrator
 */

public class TeacherDAO {    
    // data and fields        
    public TeacherDAO(){}
    
   public Teacher getAccountByUsername(String username)
    {
        try
        {
            // Ket noi CSDL    
            Connection con = DBConnector.getConnection();

            // Lay thong tin tai khoan
            String SQLCmd = "SELECT * FROM GiaoVien WHERE Username = ?";
            PreparedStatement stm = con.prepareStatement(SQLCmd);
            stm.setString(1, username);
            ResultSet rs = stm.executeQuery();
            
            Teacher account = new Teacher();

            boolean result = rs.next();          
            if (result) {
                account.setUsername(username);
                account.setPassword(rs.getString("Password"));                
                account.setID(rs.getString("MaGiaoVien").trim());
                account.setFullName(rs.getString("HoDem") + " " + rs.getString("Ten"));
                
                if(rs.getBoolean("IsAdmin"))
                    account.setType("MANAGER");
                else
                    account.setType("TEACHER");
                
                return account;
            } else {
                return null;
            }
           
        }
        catch(Exception ex)
        {
            return null;
        }
    }
}
