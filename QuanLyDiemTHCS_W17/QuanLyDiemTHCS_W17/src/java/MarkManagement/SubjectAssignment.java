/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package MarkManagement;

/**
 *
 * @author Administrator
 */
public class SubjectAssignment {

    public SubjectAssignment() {
    }
    
    private String teacherID;
    private String classID;
    private String semesterID;
    private String subjectID;
    private String subjectName;

    /**
     * @return the teacherID
     */
    public String getTeacherID() {
        return teacherID;
    }

    /**
     * @param teacherID the teacherID to set
     */
    public void setTeacherID(String teacherID) {
        this.teacherID = teacherID;
    }

    /**
     * @return the classID
     */
    public String getClassID() {
        return classID;
    }

    /**
     * @param classID the classID to set
     */
    public void setClassID(String classID) {
        this.classID = classID;
    }

    /**
     * @return the semesterID
     */
    public String getSemesterID() {
        return semesterID;
    }

    /**
     * @param semesterID the semesterID to set
     */
    public void setSemesterID(String semesterID) {
        this.semesterID = semesterID;
    }

    /**
     * @return the subjectID
     */
    public String getSubjectID() {
        return subjectID;
    }

    /**
     * @param subjectID the subjectID to set
     */
    public void setSubjectID(String subjectID) {
        this.subjectID = subjectID;
    }

    /**
     * @return the subjectName
     */
    public String getSubjectName() {
        return subjectName;
    }

    /**
     * @param subjectName the subjectName to set
     */
    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }
}
