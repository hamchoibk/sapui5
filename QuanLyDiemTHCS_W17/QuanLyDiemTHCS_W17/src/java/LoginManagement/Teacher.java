package LoginManagement;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author Administrator
 */
public class Teacher {
    private String ID;
    private String type;
    private String username;
    private String password;
    private String fullname;
    private String email;
    private String info;
    
    public static String MANAGER = "MANAGER";
    public static String TEACHER = "TEACHER";
    public static String GRADUATOR = "GRADUATOR";
    
    public Teacher(){  
    }

    /**
     * @return the maGV
     */
    public String getID() {
        return ID;
    }

    /**
     * @param maGV the maGV to set
     */
    public void setID(String maGV) {
        this.ID = maGV;
    }

    /**
     * @return the Username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param Username the Username to set
     */
    public void setUsername(String Username) {
        this.username = Username;
    }

    /**
     * @return the ThongTin
     */
    public String getThongTin() {
        return info;
    }

    /**
     * @param ThongTin the ThongTin to set
     */
    public void setThongTin(String ThongTin) {
        this.info = ThongTin;
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
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the fullname
     */
    public String getFullName() {
        return fullname;
    }

    /**
     * @param fullname the fullname to set
     */
    public void setFullName(String fullname) {
        this.fullname = fullname;
    }
}
