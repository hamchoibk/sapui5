package LoginManagement;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

import DAO.TeacherDAO;
import com.opensymphony.xwork2.ActionSupport;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

/**
 *
 * @author Administrator
 */
public class LoginAction extends ActionSupport {

    /* forward name="success" path="" */
    private static final String FAILURE = "failure";
    private static final String HOME = "home";
    
    // Login status
    public static int SuccessLogin = 1;
    public static int FailureLogin = 0;
    
    private String username;
    private String password;
    private String loginStatus;
    private TeacherDAO loginManager;
       
 
    @Override
    public String execute() throws Exception 
    {           
        HttpServletRequest request = ServletActionContext.getRequest();
        String method = request.getMethod();
        
        if (method.toUpperCase().equals("POST"))
        {   
            // get the session
            HttpSession session = request.getSession();

            // perform validation
            if ((username == null) || // name parameter does not exist
                    (password == null) || // email parameter does not exist
                    username.equals("") || // name parameter is empty
                    password.equals("")) {
                setLoginStatus("Vui long nhap ca username va password");
                return FAILURE;
            }
            
            loginManager = new TeacherDAO();
            Teacher account = loginManager.getAccountByUsername(username);            
            
            if (account == null) {
                setLoginStatus("Tài khoản không tồn tại");
                return FAILURE;
            }
            
            if(!checkPassword(password, account.getPassword()))
            {
                setLoginStatus("Tên đăng nhập hoặc mật khẩu không đúng");
                return FAILURE;
            }

            // login successfully, forward to the corresponding user home page
            session.setAttribute("username", username);
            session.setAttribute("teacherID", account.getID());
            session.setAttribute("account_type", account.getType());
            session.setAttribute("account_fullname", account.getFullName());
            return HOME;             
        }
        else
        {   
            return HOME;
        }
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param username the username to set
     */
    public void setUsername(String username) {
        this.username = username;
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
     * @return the status
     */
    public String getStatus() {
        return getLoginStatus();
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.setLoginStatus(status);
    }

    private boolean checkPassword(String a, String b) 
    {
        return true;
    }

    /**
     * @return the loginStatus
     */
    public String getLoginStatus() {
        return loginStatus;
    }

    /**
     * @param loginStatus the loginStatus to set
     */
    public void setLoginStatus(String loginStatus) {
        this.loginStatus = loginStatus;
    }
}
