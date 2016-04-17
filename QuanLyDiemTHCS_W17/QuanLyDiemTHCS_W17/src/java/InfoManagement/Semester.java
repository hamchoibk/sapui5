/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package InfoManagement;

import DAO.SemesterDAO;
import MarkManagement.MarkConfig;
import MarkManagement.Subject;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class Semester 
{
    private String start;
    private String end;
    private String ID;
    private String year;
    private String term;
    private String markConfig;

    public static ArrayList<Semester> getPassedSemester() throws SQLException, Exception 
    {
        return new SemesterDAO().getPassedSemester();
    }

    public static ArrayList<String> getPassedSemesterID() throws SQLException, Exception 
    {
        ArrayList<Semester> listSemester = Semester.getPassedSemester();
        ArrayList<String> listID = new ArrayList<String>();
        for(Semester sem : listSemester)
        {            
            listID.add(sem.ID);
        }
        return listID;
    }
    
    public Semester()
    {
    
    }
    
    public Semester(String semesterID)
    {
        ID = semesterID;
    }
    
    public static Semester getCurrentSemester() throws SQLException, Exception
    {
        return new SemesterDAO().getCurrentSemester();
    }
    
    public ArrayList<Subject> getSubjectAssignment(String teacherID)
            throws SQLException, Exception
    {
        return new SemesterDAO().getSubjectAssignment(teacherID, this.ID);
    }

    public ArrayList<String> getClassAssignment(String teacherID, String selectedSubject) 
            throws SQLException, Exception 
    {
        return new SemesterDAO().getClassAssignment(teacherID, selectedSubject, this.ID);        
    }
    
    public MarkConfig getMarkConfig(String subjectType) throws SQLException, Exception
    {
        return new SemesterDAO().getMarkConfig(subjectType, this.ID);
    }

    /**
     * @return the start
     */
    public String getStart() {
        return start;
    }

    /**
     * @param start the start to set
     */
    public void setStart(String start) {
        this.start = start;
    }

    /**
     * @return the end
     */
    public String getEnd() {
        return end;
    }

    /**
     * @param end the end to set
     */
    public void setEnd(String end) {
        this.end = end;
    }

    /**
     * @return the ID
     */
    public String getID() {
        return ID;
    }

    /**
     * @param ID the ID to set
     */
    public void setID(String ID) {
        this.ID = ID;
    }

    /**
     * @return the year
     */
    public String getYear() {
        return year;
    }

    /**
     * @param year the year to set
     */
    public void setYear(String year) {
        this.year = year;
    }

    /**
     * @return the term
     */
    public String getTerm() {
        return term;
    }

    /**
     * @param term the term to set
     */
    public void setTerm(String term) {
        this.term = term;
    }

    /**
     * @return the markConfig
     */
    public String getMarkConfig() {
        return markConfig;
    }

    /**
     * @param markConfig the markConfig to set
     */
    public void setMarkConfig(String markConfig) {
        this.markConfig = markConfig;
    }
}
