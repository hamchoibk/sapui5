package InfoManagement;


/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Admin
 */
public class Account {

    private String MaGiaoVien;

    private String HoDem;
    private String Ten;
    private String Email;
    private String ThongTin;

    private String Username;
    private String Password;
    private String DefPassword;
    private boolean IsAdmin;

    public Account() {

    }

    public Account(String hodem, String ten, String username, String pass)
    {
        
        this.HoDem=hodem;
        this.Ten=ten;
        this.Username=username;
        this.DefPassword=pass;
    }
    
    public String toStringFullName()
    {
        
        return HoDem+ " " + Ten;
    }
    
    
    
    /**
     * @return the MaGiaoVien
     */
    public String getMaGiaoVien() {
        return MaGiaoVien;
    }

    /**
     * @param MaGiaoVien the MaGiaoVien to set
     */
    public void setMaGiaoVien(String MaGiaoVien) {
        this.MaGiaoVien = MaGiaoVien;
    }

    /**
     * @return the HoDem
     */
    public String getHoDem() {
        return HoDem;
    }

    /**
     * @param HoDem the HoDem to set
     */
    public void setHoDem(String HoDem) {
        this.HoDem = HoDem;
    }

    /**
     * @return the Ten
     */
    public String getTen() {
        return Ten;
    }

    /**
     * @param Ten the Ten to set
     */
    public void setTen(String Ten) {
        this.Ten = Ten;
    }

    /**
     * @return the Email
     */
    public String getEmail() {
        return Email;
    }

    /**
     * @param Email the Email to set
     */
    public void setEmail(String Email) {
        this.Email = Email;
    }

    /**
     * @return the ThongTin
     */
    public String getThongTin() {
        return ThongTin;
    }

    /**
     * @param ThongTin the ThongTin to set
     */
    public void setThongTin(String ThongTin) {
        this.ThongTin = ThongTin;
    }

    /**
     * @return the Username
     */
    public String getUsername() {
        return Username;
    }

    /**
     * @param Username the Username to set
     */
    public void setUsername(String Username) {
        this.Username = Username;
    }

    /**
     * @return the Password
     */
    public String getPassword() {
        return Password;
    }

    /**
     * @param Password the Password to set
     */
    public void setPassword(String Password) {
        this.Password = Password;
    }

    /**
     * @return the DefPassword
     */
    public String getDefPassword() {
        return DefPassword;
    }

    /**
     * @param DefPassword the DefPassword to set
     */
    public void setDefPassword(String DefPassword) {
        this.DefPassword = DefPassword;
    }

    /**
     * @return the IsAdmin
     */
    public boolean getIsAdmin() {
        return IsAdmin;
    }

    /**
     * @param IsAdmin the IsAdmin to set
     */
    public void setIsAdmin(boolean IsAdmin) {
        this.IsAdmin = IsAdmin;
    }

}
