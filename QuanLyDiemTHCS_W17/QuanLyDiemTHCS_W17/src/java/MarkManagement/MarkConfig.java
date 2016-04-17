/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package MarkManagement;

import InfoManagement.Semester;

/**
 *
 * @author Administrator
 */
public class MarkConfig 
{
    public static final String MARKABLE = "TinhDiem";
    public static final String NON_MARKABLE = "DanhGia";
    
    private String subjectType;
    private String semesterID;
    private int maxM;
    private int max15P;
    private int max45P;    
    
    public MarkConfig()
    {
        
    }
    
    public MarkConfig(String subject)
    {
        this.subjectType = subject;
    } 
    

    void loadConfig() 
    {
        Semester s = new Semester();
        s.setID(semesterID);
    }

    /**
     * @return the subject
     */
    public String getSubject() {
        return getSubjectType();
    }

    /**
     * @param subject the subject to set
     */
    public void setSubject(String subject) {
        this.setSubjectType(subject);
    }

    /**
     * @return the maxM
     */
    public int getMaxM() {
        return maxM;
    }

    /**
     * @param maxM the maxM to set
     */
    public void setMaxM(int maxM) {
        this.maxM = maxM;
    }

    /**
     * @return the max15P
     */
    public int getMax15P() {
        return max15P;
    }

    /**
     * @param max15P the max15P to set
     */
    public void setMax15P(int max15P) {
        this.max15P = max15P;
    }

    /**
     * @return the max45P
     */
    public int getMax45P() {
        return max45P;
    }

    /**
     * @param max45P the max45P to set
     */
    public void setMax45P(int max45P) {
        this.max45P = max45P;
    }

    /**
     * @return the semester
     */
    public String getSemester() {
        return semesterID;
    }

    /**
     * @param semester the semester to set
     */
    public void setSemester(String semester) {
        this.semesterID = semester;
    }

    /**
     * @return the subjectType
     */
    public String getSubjectType() {
        return subjectType;
    }

    /**
     * @param subjectType the subjectType to set
     */
    public void setSubjectType(String subjectType) {
        this.subjectType = subjectType;
    }
}
