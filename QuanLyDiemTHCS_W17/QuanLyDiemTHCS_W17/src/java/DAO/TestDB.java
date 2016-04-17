/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package DAO;

import InfoManagement.Semester;
import InfoManagement.Student;
import MarkManagement.Mark;
import MarkManagement.MarkConfig;
import MarkManagement.MarkDetail;
import MarkManagement.Subject;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

/**
 *
 * @author Administrator
 */
public class TestDB {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws SQLException, Exception {

        try {
            String type = MarkConfig.MARKABLE;
            String semesterID = "20131";
            String subjectID = "Van";
            String classID = "6A";
            
            ArrayList<MarkDetail> list = new ArrayList<MarkDetail>();
            ArrayList<Student> listStudent = Student.getStudentByClass(classID, semesterID);
            MarkConfig markConfig = new Semester(semesterID).getMarkConfig(type);
            
            for(Student std : listStudent)
            {
                MarkDetail md = new MarkDetail();
                md.setMarkConfig(markConfig);
                md.setStudentID(std.getID());
                md.setStudentFullName(std.getLastname() + " " + std.getFirstname());
                list.add(md);
            }
            
            System.out.println(list.size());
            
            Connection con = DBConnector.getConnection();

            String cmdSQL;
            if (type.equals(MarkConfig.MARKABLE)) {
                cmdSQL = "EXEC getMarkDetail_markable @semester = ?, @subject=?, @class=?";
            } else {
                cmdSQL = "EXEC getMarkDetail_nonmarkable @semester = ?, @subject=?, @class=?";
            }

            PreparedStatement stm = con.prepareStatement(cmdSQL);
            stm.setString(1, semesterID);
            stm.setString(2, subjectID);
            stm.setString(3, classID);

            ResultSet rs = stm.executeQuery();

            ArrayList<String> listID = new ArrayList<String>();
            for (MarkDetail md : list) {
                listID.add(md.getStudentID());
            }

            boolean next = rs.next();
            while (next) {
                String ID = rs.getString("MaHocSinh").trim();
                int index = listID.indexOf(ID);
                MarkDetail md = list.get(index);
                
                // get 15P mark
                int i = 0;
                while (next && rs.getString("LoaiDiem").equals("15P") && rs.getString("MaHocSinh").trim().equals(ID)) {
                    md.P15[i] = new Mark();
                    md.P15[i].value = rs.getString("GiaTri");
                    md.P15[i].ID = rs.getString("STT");
                    i++;
                    next = rs.next();
                }                
                
                // get 45P mark
                i = 0;
                while (next && rs.getString("LoaiDiem").equals("45P") && rs.getString("MaHocSinh").trim().equals(ID)) {
                    md.P45[i] = new Mark();
                    md.P45[i].value = rs.getString("GiaTri");
                    md.P45[i].ID = rs.getString("STT");
                    i++;
                    next = rs.next();
                }
                
                if(!next) // exit if result set has no more rows
                    break;

                // get semester mark (HK)
                if (rs.getString("LoaiDiem").equals("HK")) {
                    md.HK = new Mark();
                    md.HK.value = rs.getString("GiaTri");
                    md.HK.ID = rs.getString("STT");
                    next = rs.next();
                }

                // get M mark
                i = 0;
                while (next && rs.getString("LoaiDiem").equals("M") && rs.getString("MaHocSinh").trim().equals(ID)) {
                    md.M[i] = new Mark();
                    md.M[i].value = rs.getString("GiaTri");
                    md.M[i].ID = rs.getString("STT");
                    i++;
                    next = rs.next();
                }

                list.set(index, md);
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex.toString());
        }
    }
}
