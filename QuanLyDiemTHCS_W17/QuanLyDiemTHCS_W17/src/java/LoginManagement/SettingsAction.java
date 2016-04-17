package LoginManagement;

import DAO.AccountBusiness;
import InfoManagement.Account;
import com.opensymphony.xwork2.ActionSupport;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

public class SettingsAction extends ActionSupport {

    private String oldpass;
    private String newpass;
    public String notifi;
    public boolean hide;

    public String doimatkhau() {

        HttpServletRequest request = ServletActionContext.getRequest();
        HttpSession session = request.getSession();
        String username = session.getAttribute("username").toString();
        Account account = AccountBusiness.getAccountByUsername(username);
        if (account.getPassword().equals(oldpass)) {
            if (AccountBusiness.updatePasswordByUser(account.getUsername(), newpass)) {
                notifi = "Cập nhật mật khẩu thành công";
                hide = true;
                return SUCCESS;

            } else {
                notifi = "Lỗi không thể cập nhật mật khẩu";
                hide = false;
                return ERROR;
            }

        } else {

            notifi = "Mật khẩu cũ không đúng!!";
            hide = false;
            return ERROR;
        }

    }

    
    public void validatex() {
        if (oldpass == null || oldpass.equals("")) {
            addFieldError("name", "The name is required");
        }

    }

    /**
     * @return the oldpass
     */
    public String getOldpass() {
        return oldpass;
    }

    /**
     * @param oldpass the oldpass to set
     */
    public void setOldpass(String oldpass) {
        this.oldpass = oldpass;
    }

    /**
     * @return the newpass
     */
    public String getNewpass() {
        return newpass;
    }

    /**
     * @param newpass the newpass to set
     */
    public void setNewpass(String newpass) {
        this.newpass = newpass;
    }

}
