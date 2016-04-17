/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package InfoManagement;

import DAO.DBConnector;
import DAO.StudentDAO;
import static com.opensymphony.xwork2.Action.SUCCESS;
import com.opensymphony.xwork2.ActionSupport;
import java.sql.Connection;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;

/**
 *
 * @author Administrator
 */
public class StudentProfileAction extends ActionSupport {

    /* forward name="success" path="" */
    private static final String HOME = "home";
    private static final String FAILURE = "failure";
    
    private String status;
    private String selectedGrade;
    private ArrayList<Student> studentList;
    private ArrayList<String> selectedProfile = new ArrayList<String>();
    private String test;
    private int clickedProfile = -1;
    private Student profileDetail = null;
    private Student newProfile = null;
    private boolean showNewProfile = false;
    
    public StudentProfileAction()
    {
    }
    
    @Override
    public String execute() throws Exception {

        HttpServletRequest request = ServletActionContext.getRequest();

        if (request.getMethod().toString().equals("POST")) 
        {   
            try 
            {
                if (selectedGrade.equals("0")) {
                    status = "Vui lòng chọn khối";
                    return FAILURE;
                }
                
                studentList = Student.getStudentByGrade(selectedGrade);
                request.getSession().setAttribute("studentList", studentList);
                resetClickedProfile();
                                                
                return SUCCESS;
            }
            catch (Exception ex) {
                status = "Lỗi: " + ex.getMessage();
                return FAILURE;
            }
        } else 
        {
            return HOME;
        }
    }
    
    public String refreshList()
    {
        HttpServletRequest request = ServletActionContext.getRequest();

        if (request.getMethod().toString().equals("POST")) 
        {   
            try 
            {
                if (selectedGrade.equals("0")) {
                    status = "Vui lòng chọn khối";
                    return FAILURE;
                }

                studentList = Student.getStudentByGrade(selectedGrade);
                request.getSession().setAttribute("studentList", studentList);
                resetClickedProfile();
                                                
                return SUCCESS;
            }
            catch (Exception ex) {
                status = "Lỗi: " + ex.getMessage();
                return FAILURE;
            }
        } else 
        {
            return HOME;
        }
    }
    
    public String removeStudent()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        if (request.getMethod().toString().equals("POST")) 
        {
            try 
            {                                   
                studentList = (ArrayList<Student>) request.getSession().getAttribute("studentList");
                StudentDAO stdDAO = new StudentDAO();
                
                int count = 0; // biến đếm số hồ sơ được xóa                
                for (String s : selectedProfile) 
                {
                    int i = Integer.parseInt(s);
                    Student std = studentList.get(i);
                    boolean result = stdDAO.removeStudentByID(std.getID());
                    
                    if (result == true) 
                    {
                        studentList.remove(i);
                        count++;
                        if(clickedProfile == i)
                            resetClickedProfile();
                    }
                }
                // save student list
                request.getSession().setAttribute("studentList", studentList);
                status = "Đã xóa " + count + " hồ sơ";
            } 
            catch (Exception ex) 
            {
                status = "Lỗi: " + ex.getMessage();
            }

            return SUCCESS;
        }

        return HOME;
    }
    
    public String showProfileDetail()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        if(request.getMethod().toString().equals("POST"))
        {
            try 
            {
                studentList = (ArrayList<Student>) request.getSession().getAttribute("studentList");                                                
                profileDetail = studentList.get(clickedProfile);
            }
            catch (Exception ex)                 
            {
                status = "Lỗi: " + ex.getMessage();
            }
            return SUCCESS;
        }
        
        return HOME;
    }
    
    public String updateProfile()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        if(request.getMethod().toString().equals("POST"))
        {
            try
            {
                Connection con = DBConnector.getConnection();
                StudentDAO stdDAO = new StudentDAO();

                studentList = (ArrayList<Student>) request.getSession().getAttribute("studentList");
                                
                Student std = studentList.get(clickedProfile);

                profileDetail.setID(std.getID());
                profileDetail.setGrade(selectedGrade);
                
                if (std == profileDetail) {
                    status = "Không có thay đổi nào";
                    return SUCCESS;
                }
                
                if(!validateProfile(profileDetail))
                {
                    status = "Dữ liệu nhập vào không hợp lệ";
                    return SUCCESS;
                }
                
                        
                boolean result = stdDAO.updateStudentByID(profileDetail);                
                if (result) 
                {
                    studentList.set(clickedProfile, profileDetail);
                    request.getSession().setAttribute("studentList", studentList);
                    status = "Đã cập nhật thành công ";
                } 
                else 
                {
                    status = "Lỗi dữ liệu đầu vào, hồ sơ chưa được cập nhật";
                }
                
                con.close();
            } 
            catch (Exception ex) 
            {
                status = "Lỗi: " + ex.getMessage();
            }

            return SUCCESS;
        }
        
        return HOME;
    }
    
    public String createProfile()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        if(request.getMethod().toString().equals("POST"))
        {
            if (selectedGrade.equals("0"))
            {
                status = "Vui lòng chọn khối";
                return FAILURE;
            }
            
            try 
            {
                Connection con = DBConnector.getConnection();
                StudentDAO stdDAO = new StudentDAO();
                studentList = (ArrayList<Student>) request.getSession().getAttribute("studentList");
                
                newProfile = new Student();
                newProfile.setID(stdDAO.getNewStudentID());
                newProfile.setGrade(selectedGrade);
                showNewProfile = true;
                
                con.close();                
            }
            catch (Exception ex)                 
            {
                status = "Lỗi: " + ex.getMessage();
            }
            return SUCCESS;
        }
        
        return HOME;
    }
    
    public String addProfile()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        if(request.getMethod().toString().equals("POST"))
        {
            if(newProfile.getStatus() == null || newProfile.getStatus().equals("0"))
            {
                status = "Vui lòng chọn trạng thái";
                return FAILURE;
            }
            
            try 
            {
                Connection con = DBConnector.getConnection();
                StudentDAO stdDAO = new StudentDAO();

                studentList = (ArrayList<Student>) request.getSession().getAttribute("studentList");
                
                if(validateProfile(newProfile))
                {
                    stdDAO.insertStudent(newProfile);
                    studentList.add(newProfile);
                    
                    // create new blank profile
                    newProfile = new Student();                    
                    newProfile.setID(stdDAO.getNewStudentID());
                    newProfile.setGrade(selectedGrade);
                    showNewProfile = true;
                    
                    // focus on new profile and show its detail
                    clickedProfile = studentList.size() - 1;
                    // save student list
                    request.getSession().setAttribute("studentList", studentList);
                }
                else
                {
                    status = "Dữ liệu đầu vào không hợp lệ. Xin kiểm tra lại";
                }
                
                con.close();                 
            }
            catch (Exception ex)                 
            {
                status = "Lỗi: " + ex.getMessage();
            }
            return SUCCESS;
        }
        
        return HOME;
    }
    
    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the selectedGrade
     */
    public String getSelectedGrade() {
        return selectedGrade;
    }

    /**
     * @param selectedGrade the selectedGrade to set
     */
    public void setSelectedGrade(String selectedGrade) {
        this.selectedGrade = selectedGrade;
    }

    /**
     * @return the studentList
     */
    public ArrayList<Student> getStudentList() {
        return studentList;
    }

    /**
     * @param studentList the studentList to set
     */
    public void setStudentList(ArrayList<Student> studentList) {
        this.studentList = studentList;
    }

    /**
     * @return the selectedProfile
     */
    public ArrayList<String> getSelectedProfile() {
        return selectedProfile;
    }

    /**
     * @param selectedProfile the selectedProfile to set
     */
    public void setSelectedProfile(ArrayList<String> selectedProfile) {
        this.selectedProfile = selectedProfile;
    }

    /**
     * @return the test
     */
    public String getTest() {
        return test;
    }

    /**
     * @param test the test to set
     */
    public void setTest(String test) {
        this.test = test;
    }

    /**
     * @return the clickedProfile
     */
    public int getClickedProfile() {
        return clickedProfile;
    }

    /**
     * @param clickedProfile the clickedProfile to set
     */
    public void setClickedProfile(int clickedProfile) {
        this.clickedProfile = clickedProfile;
    }

    /**
     * @return the profileDetail
     */
    public Student getProfileDetail() {
        return profileDetail;
    }

    /**
     * @param profileDetail the profileDetail to set
     */
    public void setProfileDetail(Student profileDetail)
    {
        this.profileDetail = profileDetail;
    }

    /**
     * @return the newProfile
     */
    public Student getNewProfile() {
        return newProfile;
    }

    /**
     * @param newProfile the newProfile to set
     */
    public void setNewProfile(Student newProfile) {
        this.newProfile = newProfile;
    }

    /**
     * @return the showNewProfile
     */
    public boolean isShowNewProfile() {
        return showNewProfile;
    }

    /**
     * @param showNewProfile the showNewProfile to set
     */
    public void setShowNewProfile(boolean showNewProfile) {
        this.showNewProfile = showNewProfile;
    }

    private boolean validateProfile(Student profile) 
    {        
        if(profile.getLastname() == null || profile.getLastname().equals("") ||
           profile.getFirstname() == null || profile.getFirstname().equals("") ||
           profile.getSex() == null || profile.getStatus() == null)
        {
            return false;
        }
        
        try
        {
            int bornYear = Date.valueOf(profile.getBirthdate()).getYear() + 1900;
            int currentYear = Calendar.getInstance().get(Calendar.YEAR);
            
            if(bornYear > 1992 && (currentYear-bornYear)>10)
                return true;
            else 
                return false;
        }
        catch(Exception ex)
        {
            return false;
        }
    }
    
    private void resetClickedProfile()
    {
        clickedProfile = -1;
        profileDetail = null;
    }
}
