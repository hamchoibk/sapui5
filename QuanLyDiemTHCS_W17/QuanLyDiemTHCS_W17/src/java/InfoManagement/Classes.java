/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package InfoManagement;

import DAO.ClassDAO;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class Classes 
{
    public Classes()
    {
        
    }
    
    private String classID;
    private String grade;
    
    public static ArrayList<String> getListClassID(ArrayList<Classes> list)
    {
        ArrayList<String> result = new ArrayList<String>();
        for(Classes cls:list)
        {
            result.add(cls.getClassID());            
        }
        
        return result;
    }
    
    public static ArrayList<Classes> getListClass() throws SQLException, Exception
    {
        return new ClassDAO().getListClass();
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
}
