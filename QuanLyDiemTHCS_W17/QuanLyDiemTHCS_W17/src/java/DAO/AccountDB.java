package DAO;

import InfoManagement.Account;

import java.sql.SQLException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class AccountDB {

    private static String tblAccount = "GiaoVien";
    private static String HoDem = "HoDem";
    private static String Ten = "Ten";
    private static String Email = "Email";
    private static String ThongTin = "ThongTin";
    private static String DefPassword = "DefPassword";
    private static String IsAdmin = "isAdmin";
    public static String Username = "username";
    public static String Password = "password";
    public static String MaGiaoVien = "magiaovien";
    public static String Type = "type";

    private Connection conn = null;
    private PreparedStatement prst = null;

    public Account getAccountByUserName(String username) {
        username = username.replace(" ", "");
        username = username.replace("<", "");
        Account account = null;
        try {
            conn = DBconnect.getConn();
            prst = conn.prepareStatement("Select *from " + tblAccount + " where username=?");

            prst.setString(1, username);
            ResultSet rs = prst.executeQuery();
            System.out.println(prst.toString());
            if (rs.next()) {
                account = new Account();
                account.setUsername(username);
                account.setPassword(rs.getString(Password));

                account.setDefPassword(rs.getString(DefPassword));
                account.setMaGiaoVien((rs.getString(MaGiaoVien)));
                account.setHoDem(rs.getString(HoDem));
                account.setTen(rs.getString(Ten));
                account.setEmail(rs.getString(Email));

                account.setThongTin(rs.getString(ThongTin));
                account.setIsAdmin(rs.getBoolean(IsAdmin));

                //  taikhoan.setType(rs.getBoolean(Type));
            }
        } catch (SQLException ex) {

        }

        return account;
    }

    public boolean delelteAccount(int mgv) {

        conn = DBconnect.getConn();
        try {
            prst = conn.prepareStatement("DELETE FROM GiaoVien WHERE magiaovien = ?");

            prst.setInt(1, mgv);

            if (prst.executeUpdate() > 0) {
                return true;
            }
        } catch (SQLException ex) {
            // Loi SQL
        }
        return false;
    }

    public boolean insertAccount(String hodem, String ten, String email, String thongtin, String username, String password, String defpassword, boolean isadim) {
        conn = DBconnect.getConn();

        try {

            prst = conn.prepareStatement("INSERT INTO GiaoVien(HoDem,Ten,Email,ThongTin,Username,Password,Defpassword,IsAdmin) Values(?,?,?,?,?,?,?,?)");

            prst.setString(1, hodem);
            prst.setString(2, ten);
            prst.setString(3, email);
            prst.setString(4, thongtin);
            prst.setString(5, username);
            prst.setString(6, password);
            prst.setString(7, defpassword);
            prst.setBoolean(8, isadim);
            // System.out.println("SQL : "+ prst.toString());
            if (prst.executeUpdate() > 0) {
                return true;
            }

        } catch (SQLException ex) {

            System.out.println("EX :" + ex);
            //System.out.print(ex);
        }

        return false;
    }

    public boolean UpdatePassWordByUsername(String _username, String _password) {
        conn = DBconnect.getConn();
        try {

            prst = conn.prepareStatement("Update GiaoVien set password=? where username=?");
            prst.setString(1, _password);
            prst.setString(2, _username);
            if (prst.executeUpdate() > 0) {
                return true;

            }
        } catch (SQLException ex) {

        }
        return false;
    }
    
    public boolean updatePassWordfromAdmin(String _username, String _password,String defpassword) {
        conn = DBconnect.getConn();
        try {

            prst = conn.prepareStatement("Update GiaoVien set password=?,defpassword=? where username=?");
            prst.setString(1, _password);
            prst.setString(2, defpassword);
            prst.setString(3,_username);
            if (prst.executeUpdate() > 0) {
                return true;

            }
        } catch (SQLException ex) {

        }
        return false;
    }

    //hodem=+&ten=++&email=&thongtin=null&username=
    public boolean UpdateAccount(String username, String hodem, String ten, String email, String thongtin) {
        conn = DBconnect.getConn();
        try {

            prst = conn.prepareStatement("Update GiaoVien set hodem=?,ten =?, email=?, thongtin=? where username=?");
            prst.setString(1, hodem);
            prst.setString(2, ten);
            prst.setString(3, email);
            prst.setString(4, thongtin);

            prst.setString(5, username);
            if (prst.executeUpdate() > 0) {
                return true;

            }
        } catch (SQLException ex) {

        }
        return false;
    }

    public List<Account> getAllAccount() {
        List<Account> list = new ArrayList<Account>();
        conn = DBconnect.getConn();
        try {

            prst = conn.prepareStatement("Select *from " + tblAccount + " where isAdmin=0  ORDER BY Ten  ASC");
            ResultSet rs = prst.executeQuery();
            while (rs.next()) {

                Account account = new Account();

                account.setUsername(rs.getString(Username));
                account.setPassword(rs.getString(Password));

                account.setDefPassword(rs.getString(DefPassword));
                account.setMaGiaoVien((rs.getString(MaGiaoVien)));
                account.setHoDem(rs.getString(HoDem));
                account.setTen(rs.getString(Ten));
                account.setEmail(rs.getString(Email));

                account.setThongTin(rs.getString(ThongTin));
                account.setIsAdmin(rs.getBoolean(IsAdmin));

                list.add(account);

            }

        } catch (SQLException ex) {
            // ex.printStackTrace();
        }

        return list;
    }

}
