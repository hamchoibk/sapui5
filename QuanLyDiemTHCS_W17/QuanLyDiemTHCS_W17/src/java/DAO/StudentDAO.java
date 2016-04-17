/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import InfoManagement.Student;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;

/**
 *
 * @author Administrator
 */
public class StudentDAO {
    
    private ArrayList<Student> extractResultSet(ResultSet rs) throws SQLException
    {
        ArrayList<Student> result = new ArrayList<Student>();
        
        while(rs.next())
        {
            Student std = new Student();
            
            std.setID(rs.getString("MaHocSinh").trim());
            std.setLastname(rs.getString("HoDem"));
            std.setFirstname(rs.getString("Ten"));
            std.setGrade(rs.getString("KhoiHoc").trim());
            std.setBirthdate(rs.getString("NgaySinh").trim());
            std.setSex(rs.getString("GioiTinh").trim());
            std.setStatus(rs.getString("TrangThai").trim());
            
            result.add(std);
        }       
        
        return result;
    }
    
    public StudentDAO(){
        
    }
    
    public ArrayList<Student> getStudentByGrade(String grade)
            throws SQLException, Exception
    {
        Connection con = DBConnector.getConnection();
        String cmdSQL = "SELECT * FROM HocSinh WHERE KhoiHoc = ?";
                
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, grade);
        
        ResultSet rs = stm.executeQuery();        
        ArrayList<Student> result = this.extractResultSet(rs);
                        
        return result;
    }
    
    public ArrayList<Student> getStudentByClass(String classID, String semesterID) 
            throws SQLException, Exception
    {
        Connection con = DBConnector.getConnection();
        
        String cmdSQL = "EXEC getStudentByClass @class=?, @semester = ?";
                
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, classID);
        stm.setString(2, semesterID);
        
        ResultSet rs = stm.executeQuery();
        ArrayList<Student> result = this.extractResultSet(rs);
                        
        return result;
    }
    
    public boolean removeStudentByID(String ID) 
            throws SQLException, Exception
    {
        Connection con = DBConnector.getConnection();
        String cmdSQL = "DELETE FROM HocSinh WHERE MaHocSinh = ?";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, ID);

        stm.execute();
        return true;
    }    
    
    public boolean updateStudentByID(Student std) 
            throws SQLException, Exception
    {
        Connection con = DBConnector.getConnection();
        String cmdSQL = "UPDATE HocSinh "
                + "SET HoDem = ?, Ten = ?, NgaySinh = ?, GioiTinh = ?, KhoiHoc = ?, TrangThai = ? "
                + "WHERE MaHocSinh = ?";

        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, std.getLastname());
        stm.setString(2, std.getFirstname());
        stm.setString(3, std.getBirthdate());
        stm.setString(4, std.getSex());
        stm.setString(5, std.getGrade());
        stm.setString(6, std.getStatus());
        stm.setString(7, std.getID());

        stm.execute();

        return true;
    }
    
    public String getNewStudentID() throws Exception
    {
        Connection con = DBConnector.getConnection();
        
        String cmdSQL = "SELECT MAX(MaHocSinh) AS MaxID FROM HocSinh";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        ResultSet rs = stm.executeQuery();
        if(rs.next())
        {
            String maxID = rs.getString("MaxID").trim();
            int ID = Integer.parseInt(maxID);
            int year = (Calendar.getInstance().get(Calendar.YEAR)) * 10000;
            
            if(ID < year)
                ID = year + 1;
            else ID++;
            
            return "" + ID;
        }        
        else // Chưa có hồ sơ học sinh nào trong CSDL (do rs = null)
        {
            // Tạo mã hoc sinh đầu tiên của năm hiện tại
            return "";
        }
    }
    
    public boolean insertStudent(Student std) throws Exception
    {
        Connection con = DBConnector.getConnection();
        
        String cmdSQL = "INSERT INTO HocSinh (MaHocSinh, HoDem, Ten, NgaySinh, GioiTinh, KhoiHoc, TrangThai) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?)";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, std.getID());
        stm.setString(2, std.getLastname());
        stm.setString(3, std.getFirstname());
        stm.setString(4, std.getBirthdate());
        stm.setString(5, std.getSex());
        stm.setString(6, std.getGrade());
        stm.setString(7, std.getStatus());
        
        return stm.execute();
    }
}
