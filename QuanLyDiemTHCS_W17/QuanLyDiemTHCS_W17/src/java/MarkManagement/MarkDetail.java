/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package MarkManagement;

import DAO.MarkDetailDAO;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class MarkDetail 
{
    public Mark[] M;
    public Mark[] P15;
    public Mark[] P45;
    public Mark HK;
    public String AVG;
    
    private String studentID;
    private String studentFullName;    
    
    public MarkDetail()
    {
        
    }
    
    public MarkDetail(MarkConfig mc)
    {
        M = new Mark[mc.getMaxM()];
        P15 = new Mark[mc.getMax15P()];
        P45 = new Mark[mc.getMax45P()];        
    }
    
    public static void fillMarkDetailList(ArrayList<MarkDetail> list, String semesterID,
            Subject subject, String classID, MarkConfig mc)
            throws SQLException, Exception
    {        
        new MarkDetailDAO().fillMarkDetailList(list, semesterID, subject.getID(), classID, mc, subject.getType());
    }
    
    public static boolean updateMark(Mark mark, String subjectType) throws SQLException, Exception
    {
        return new MarkDetailDAO().updateMark(mark, subjectType);
    }
    
    public static boolean insertMark(Mark mark, String markType, Subject subject, String semesterID, String studentID) 
            throws SQLException, Exception
    {        
        return new MarkDetailDAO().insertMark(mark, markType, subject.getID(), semesterID, studentID, subject.getType());
    }
    
    public static boolean removeMark(Mark mark, String subjectType)
            throws SQLException, Exception
    {
        return new MarkDetailDAO().removeMark(mark, subjectType);
    }
    
    public void setMarkConfig(MarkConfig mc)
    {
        M = new Mark[mc.getMaxM()];
        P15 = new Mark[mc.getMax15P()];
        P45 = new Mark[mc.getMax45P()];        
    }

    /**
     * @return the studentID
     */
    public String getStudentID() {
        return studentID;
    }

    /**
     * @param studentID the studentID to set
     */
    public void setStudentID(String studentID) {
        this.studentID = studentID;
    }

    /**
     * @return the studentFullName
     */
    public String getStudentFullName() {
        return studentFullName;
    }

    /**
     * @param studentFullName the studentFullName to set
     */
    public void setStudentFullName(String studentFullName) {
        this.studentFullName = studentFullName;
    }
}
