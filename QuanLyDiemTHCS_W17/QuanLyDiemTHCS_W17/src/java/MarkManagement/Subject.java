/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package MarkManagement;

import DAO.SubjectDAO;
import java.sql.SQLException;
import java.util.ArrayList;

public class Subject {

    public static ArrayList<Subject> getSubjectList() throws SQLException, Exception 
    {
        return new SubjectDAO().getListSubject();
    }
    
    public static ArrayList<String> getListSubjectName(ArrayList<Subject> list)
    {
        ArrayList<String> result = new ArrayList<String>();
        for(Subject sbj : list)
        {
            result.add(sbj.getName());
        }
        
        return result;
    }
    
    
    private String name;
    private String type;
    private String ID;
    
    public Subject(){    
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
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
}
