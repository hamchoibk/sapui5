/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import InfoManagement.Semester;
import MarkManagement.MarkConfig;
import MarkManagement.Subject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

/**
 *
 * @author Administrator
 */
public class SemesterDAO {
    
    private Connection con;
    
    public SemesterDAO()
    {
        
    }
    
    public Semester getCurrentSemester() throws SQLException, Exception
    {
        con = DBConnector.getConnection();
        
        String cmdSQL = "EXEC getCurrentSemester @current = ?";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
                
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String currentDate = dateFormat.format(Calendar.getInstance().getTime());
        
        stm.setString(1, currentDate);
        
        ResultSet rs = stm.executeQuery();
        
        if(rs.next()) 
        {
            Semester semester = new Semester();
            semester.setID(rs.getString("MaHocKy"));
            semester.setYear(rs.getString("NamHoc"));
            semester.setTerm(rs.getString("HocKy"));
            semester.setStart(rs.getString("NgayBatDau"));
            semester.setEnd(rs.getString("NgayKetThuc"));
            semester.setMarkConfig(rs.getString("CauHinhDiem"));

            return semester;
        }
        // else
        return null;
    }
    
    public ArrayList<Subject> getSubjectAssignment(String teacherID, String semesterID) 
            throws SQLException, Exception
    {
        con = DBConnector.getConnection();
        if(con == null)
            return null;
        
        String cmdSQL = "EXEC getSubjectAssignment @teacher=?, @semester=?";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, teacherID);
        stm.setString(2, semesterID);

        ResultSet rs = stm.executeQuery();
        ArrayList<Subject> list = new ArrayList<Subject>();

        while (rs.next()) {
            Subject sbj = new Subject();
            sbj.setID(rs.getString("MaMonHoc"));
            sbj.setName(rs.getString("TenMonHoc"));
            sbj.setType(rs.getString("LoaiMon"));
            
            list.add(sbj);
        }

        return list;
    }

    public ArrayList<String> getClassAssignment(String teacherID, String subjectID, String semesterID) 
            throws SQLException, Exception 
    {
        con = DBConnector.getConnection();
        if(con == null)
            return null;
        
        String cmdSQL = "EXEC getClassAssignment" 
                + " @teacher = ?, @subject = ?, @semester = ?";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, teacherID);
        stm.setString(2, subjectID);
        stm.setString(3, semesterID);
        
        ResultSet rs = stm.executeQuery();
        
        ArrayList<String> list = new ArrayList<String>();
        while(rs.next())
        {
            list.add(rs.getString("MaLop").trim());
        }
        return list;
    }

    public MarkConfig getMarkConfig(String subjectType, String semesterID) 
            throws SQLException, Exception {
        
        con = DBConnector.getConnection();
        if(con == null)
            return null;
        
        String cmdSQL = "EXEC getMarkConfig " 
                + "@type = ?, @semester = ?";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        stm.setString(1, subjectType);
        stm.setString(2, semesterID);
        
        ResultSet rs = stm.executeQuery();
        
        MarkConfig mcf = new MarkConfig();
        mcf.setSemester(semesterID);
        mcf.setSubject(subjectType);
        
        if (rs.next()) {
            mcf.setMax15P(Integer.parseInt(rs.getString("MaxCount")));
            rs.next(); // point to 45P
            mcf.setMax45P(Integer.parseInt(rs.getString("MaxCount")));
            rs.next(); // point to HK
            rs.next(); // point to M
            mcf.setMaxM(Integer.parseInt(rs.getString("MaxCount")));
        }
        
        return mcf;
    }

    public ArrayList<Semester> getPassedSemester() throws SQLException, Exception 
    {
        ArrayList<Semester> result = new ArrayList<Semester>();
        Connection con = DBConnector.getConnection();        
        String cmdSQL = "EXEC getPassedSemester";
        PreparedStatement stm = con.prepareStatement(cmdSQL);
        ResultSet rs = stm.executeQuery();
        
        while(rs.next())
        {
            Semester sem = new Semester();
            sem.setID(rs.getString("MaHocKy"));
            sem.setYear(rs.getString("NamHoc"));
            sem.setTerm(rs.getString("HocKy"));
            sem.setStart(rs.getString("NgayBatDau"));
            sem.setEnd(rs.getString("NgayKetThuc"));
            sem.setMarkConfig(rs.getString("CauHinhDiem"));
            
            result.add(sem);
        }
        
        return result;
    }
}
