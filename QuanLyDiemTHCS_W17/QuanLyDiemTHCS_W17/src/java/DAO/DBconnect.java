package DAO;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBconnect {

    private static Connection conn = null;

    public static boolean connect() {

        try {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            conn = DriverManager.getConnection(
                    "jdbc:sqlserver://localhost:1433;"
                    + "databaseName=QuanLyDiemTHCS", "sa", "12345678");

            return true;
        } catch (SQLException ex) {
           // System.out.println("out :  " + ex.toString());
            return false;
        } catch (ClassNotFoundException ex) {
           
        }

        return false;
    }

    public static void closeConnect() {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ex) {
              
            }
        }
    }

    public static Connection getConn() {
        return conn;
    }

    public static void setConn(Connection conn) {
        DBconnect.conn = conn;
    }

}


