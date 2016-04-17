/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


/**
 *
 * @author Administrator
 */
public class DBConnector {
    private static String port = "1433";
    private static String dbName = "QuanLyDiemTHCS";
    private static String dbUser = "sa";
    private static String dbPassword = "12345678";
    private static String URL = "jdbc:sqlserver://localhost:" + port
            + "; databaseName=" + dbName;
    
    public DBConnector(){}
       
    public static Connection getConnection() throws SQLException, Exception
    {  
       Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
       return DriverManager.getConnection(URL, dbUser, dbPassword);
        
    }

    /**
     * @return the portMSSQL$SQLEXPRESS
     */
    public String getPort() {
        return port;
    }

    /**
     * @param port the port to set
     */
    public void setPort(String port) {
        DBConnector.port = port;
    }

    /**
     * @return the dbName
     */
    public String getDbName() {
        return dbName;
    }

    /**
     * @param dbName the dbName to set
     */
    public void setDbName(String dbName) {
        DBConnector.dbName = dbName;
    }

    /**
     * @param dbUser the dbUser to set
     */
    public void setDbUser(String dbUser) {
        DBConnector.dbUser = dbUser;
    }

    /**
     * @param dbPassword the dbPassword to set
     */
    public void setDbPassword(String dbPassword) {
        DBConnector.dbPassword = dbPassword;
    }
}
