/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package InfoManagement;

import DAO.StudentDAO;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class Student {
    
    private String lastname;
    private String firstname;
    private String ID;
    private String birthdate;
    private String sex;
    private String grade;
    private String status;
    
    public Student()
    {
        
    }    

    public static ArrayList<Student> getStudentByClass(String classID, String semesterID) 
            throws SQLException, Exception
    {
        return new StudentDAO().getStudentByClass(classID, semesterID);
    }
    
    public static ArrayList<Student> getStudentByGrade(String grade) 
            throws SQLException, Exception
    {
        return new StudentDAO().getStudentByGrade(grade);
    }
    
    /**
     * @return the lastname
     */
    public String getLastname() {
        return lastname;
    }

    /**
     * @param lastname the lastname to set
     */
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    /**
     * @return the firstname
     */
    public String getFirstname() {
        return firstname;
    }

    /**
     * @param firstname the firstname to set
     */
    public void setFirstname(String firstname) {
        this.firstname = firstname;
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
     * @return the birthdate
     */
    public String getBirthdate() {
        return birthdate;
    }

    /**
     * @param birthdate the birthdate to set
     */
    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    /**
     * @return the sex
     */
    public String getSex() {
        return sex;
    }

    /**
     * @param sex the sex to set
     */
    public void setSex(String sex) {
        this.sex = sex;
    }

    /**
     * @return the grade
     */
    public String getGrade() {
        return grade;
    }

    /**
     * @param grade the grade to set
     */
    public void setGrade(String grade) {
        this.grade = grade;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }
}
