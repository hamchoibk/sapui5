/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package LoginManagement;

import com.opensymphony.xwork2.ActionSupport;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

/**
 *
 * @author Administrator
 */
public class LogoutAction extends ActionSupport {
    @Override
    public String execute() throws Exception {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        HttpSession session = request.getSession();
        session.setAttribute("username", null);
        session.setAttribute("teacherID", null);
        session.setAttribute("account_type", null);
        return "logout";
    }
}
