package DAO;

import InfoManagement.Account;

import java.util.List;

public class AccountBusiness {

// public static void main(String args[])
// {
//     
//   
//     
//     boolean ck= updatePassWordfromAdmin("hanv", "ngotngao", "vanha");
//     System.out.println("CK : "+ ck );
// }
    public static boolean deleteAccount(int MaGV) {
        AccountDB accountdb = new AccountDB();
        if (DBconnect.connect()) {
            if (accountdb.delelteAccount(MaGV)) {
                DBconnect.closeConnect();
                return true;
            }
            DBconnect.closeConnect();
        }
        return false;

    }

    public static boolean insertAccount(String hodem, String ten, String email, String thongtin, String username, String password, String defpassword, boolean isadim) {
        AccountDB accountdb = new AccountDB();
        if (DBconnect.connect()) {
            System.out.println(" ket noni thanh cong");
            if (accountdb.insertAccount(hodem, ten, email, thongtin, username, password, defpassword, isadim)) {
                DBconnect.closeConnect();
                return true;
            }

            DBconnect.closeConnect();
            System.out.println("Dong ket noi");
        }

        return false;
    }

    public static List<Account> getAllAccount() {

        List<Account> listaccount = null;

        AccountDB adb = new AccountDB();
        if (DBconnect.connect()) {
            listaccount = adb.getAllAccount();
        }
        DBconnect.closeConnect();
        return listaccount;

    }

    public static Account getAccountByUsername(String uname) {
        Account account = null;
        AccountDB accDB = new AccountDB();

        if (DBconnect.connect()) {
            // System.out.println("SUCCESS;");
            account = accDB.getAccountByUserName(uname);
            DBconnect.closeConnect();

        }
        return account;

    }

    public static boolean updatePasswordByUser(String _username, String _password) {

        AccountDB adb = new AccountDB();
        if (DBconnect.connect()) {

            if (adb.UpdatePassWordByUsername(_username, _password)) {
                DBconnect.closeConnect();
                return true;
            }
            DBconnect.closeConnect();
        }
        return false;
    }

    public static boolean updatePassWordfromAdmin(String _username, String _password, String defpassword) {
        AccountDB adb = new AccountDB();
        if (DBconnect.connect()) {

            if (adb.updatePassWordfromAdmin(_username, _password,defpassword)) {
                DBconnect.closeConnect();
                return true;

            }
            DBconnect.closeConnect();
        }
        return false;
    }

    public static boolean updateAccount(String username, String hodem, String ten, String email, String thongtin) {

        AccountDB adb = new AccountDB();
        if (DBconnect.connect()) {

            if (adb.UpdateAccount(username, hodem, ten, email, thongtin)) {

                return true;
            }
            DBconnect.closeConnect();
        }
        return false;
    }

}
