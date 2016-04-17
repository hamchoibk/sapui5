package InfoManagement;

import DAO.AccountBusiness;
import LoginManagement.Security;
import com.opensymphony.xwork2.ActionSupport;
import java.security.NoSuchAlgorithmException;

import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

public class AccountManagerAction extends ActionSupport {

    private String hodem;
    private String ten;
    private String username;
    private String email;
    private String info;
    private String password;
    public String[] deleteID;  // Page

    public String lblNotify;
    public String lbldelNotify;

    private String captcha;
    private String recaptcha;
    // public String del ="";
    public ArrayList<String> lblthongbao;
    private List<Account> listnewAcc;
    private List<Account> listAccount;

//    public String danhsachgiaovien() {
//        listAccount = AccountBusiness.getAllAccount();
//
//        return SUCCESS;
//
//    }
    public String themgiaovien() throws NoSuchAlgorithmException {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpSession session = request.getSession();

        ListNewAccount list = (ListNewAccount) session.getAttribute("newlist");
        if (list == null) {
            list = new ListNewAccount();
        }

        xssdel();
        
         Account ac = new Account(hodem, ten, username, password);
        String md5pass = Security.getHashCodeMD5(password);
        if (AccountBusiness.insertAccount(hodem, ten, email, info, username, md5pass, password, false)) {

           
            list.addAccount(ac);
            session.setAttribute("newlist", list);
            
            lblNotify = " Thêm tài khoản thành công ";
            
            resetTextField();
            return SUCCESS;
        } else {

            lblNotify = "Tài khoản " + username + " đã tồn tại";
            return ERROR;

        }
    }

    public String capnhattaikhoan() {
        if (AccountBusiness.updateAccount(username, hodem, ten, email, info)) {
            lblNotify = " Cập nhật thành công tài khoản" +username;
            return SUCCESS;
        } else {
            lblNotify = " Không cập nhật được tài khoản";
            return ERROR;
        }
    }

    public String khoiphucmatkhau() throws NoSuchAlgorithmException {

        String md5pass = Security.getHashCodeMD5(password);
        if (AccountBusiness.updatePassWordfromAdmin(username, md5pass, password)) {
            
             lblNotify = " Cập nhật thành công tài khoản " + username;
            return SUCCESS;
        } else {
            lblNotify = " Không cập nhật được mật khẩu";
            return ERROR;
        }

    }

    public String xoataikhoan() {

        lblthongbao = new ArrayList<String>();
       HttpServletRequest request = ServletActionContext.getRequest();
        HttpSession session = request.getSession();
//        ListNewAccount list = (ListNewAccount) session.getAttribute("newlist");
         String se_captcha= session.getAttribute("dns_security_code").toString();
        if (recaptcha.equals(se_captcha)) {
            if (deleteID != null) {
                for (String d : deleteID) {
                    //    del += " " + d;
                    if (AccountBusiness.deleteAccount(Integer.parseInt(d))) {

                        getLblthongbao().add("Xóa thành công Giáo Viên GV" + d);

                    } else {
                        getLblthongbao().add(" Không thể xóa GV" + d + recaptcha);
                    }

                }

            }
            return SUCCESS;

        } else {
            lbldelNotify = "Mã xác nhận không đúng";
            return ERROR;
        }

    }

//    @Override
//    public void validate() {
//        if (getHodem().length() == 0) {
//            addFieldError("fistName", "First Name is required");
//        }
//        if (getPassword().length() == 0) {
//            addFieldError("password", ("password required"));
//        }
//        if (getEmail().length() == 0) {
//
//            addFieldError("email", ("Email required"));
//        }
//        if (getInfo().length() == 0) {
//
//            addFieldError("info", ("Email required"));
//        }
//        if (getTen().length() == 0) {
//
//            addFieldError("lname", ("Email required"));
//        }
//        
//    }
    
    
    
    public void resetTextField()
    {   
        hodem = null; ten = null; email= null; info = null; username = null; password = null;
    }
    public void xssdel() {
        if (hodem.length() != 0 && ten.length() != 0) {
           
            hodem = hodem.replace("<", "");
            ten = ten.replace("<", "");
            password = password.replace("<", "");

            info = info.replace("<", "");

            hodem = hodem.replace(">", "");
            ten = ten.replace(">", "");

            info = info.replace(">", "");
            password = password.replace(">", "");
        }

    }

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
     * @return the info
     */
    public String getInfo() {
        return info;
    }

    /**
     * @param info the info to set
     */
    public void setInfo(String info) {
        this.info = info;
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
     * @return the deleteID
     */
    public String[] getDeleteID() {
        return deleteID;
    }

    /**
     * @param deleteID the deleteID to set
     */
    public void setDeleteID(String[] deleteID) {
        this.deleteID = deleteID;
    }

    /**
     * @return the lblthongbao
     */
    public ArrayList<String> getLblthongbao() {
        return lblthongbao;
    }

    /**
     * @param lblthongbao the lblthongbao to set
     */
    public void setLblthongbao(ArrayList<String> lblthongbao) {
        this.lblthongbao = lblthongbao;
    }

    /**
     * @return the tcaptcha
     */
    public String getCaptcha() {
        return captcha;
    }

    /**
     * @param tcaptcha the tcaptcha to set
     */
    public void setCaptcha(String tcaptcha) {
        this.captcha = tcaptcha;
    }

    /**
     * @return the recaptcha
     */
    public String getRecaptcha() {
        return recaptcha;
    }

    /**
     * @param recaptcha the recaptcha to set
     */
    public void setRecaptcha(String recaptcha) {
        this.recaptcha = recaptcha;
    }

    /**
     * @return the hodem
     */
    public String getHodem() {
        return hodem;
    }

    /**
     * @param hodem the hodem to set
     */
    public void setHodem(String hodem) {
        this.hodem = hodem;
    }

    /**
     * @return the ten
     */
    public String getTen() {
        return ten;
    }

    /**
     * @param ten the ten to set
     */
    public void setTen(String ten) {
        this.ten = ten;
    }

    /**
     * @return the listnewAcc
     */
    public List<Account> getListnewAcc() {
        return listnewAcc;
    }

    /**
     * @param listnewAcc the listnewAcc to set
     */
    public void setListnewAcc(List<Account> listnewAcc) {
        this.listnewAcc = listnewAcc;
    }

}
