/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package MarkManagement;

import InfoManagement.Classes;
import InfoManagement.Semester;
import InfoManagement.Student;
import static com.opensymphony.xwork2.Action.SUCCESS;
import com.opensymphony.xwork2.ActionSupport;
import java.sql.SQLException;
import java.util.ArrayList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.struts2.ServletActionContext;

/**
 *
 * @author Administrator
 */
public class ViewMarkAction extends ActionSupport {
    private static String FAILURE = "success";
    
    private ArrayList<String> listSubjectName = new ArrayList<String>();
    private ArrayList<String> listClassID = new ArrayList<String>();
    private ArrayList<String> listSemester = new ArrayList<String>();
    
    private ArrayList<Subject> listSubject;
    private ArrayList<Classes> listClass;
    private ArrayList<MarkDetail> listMarkDetail;
    private String selectedSubject;
    private String selectedClass;
    private String selectedSemester;
    private String status;
    
    public ViewMarkAction(){
    }
    
    @Override
    public String execute() throws Exception 
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        try
        {
            HttpSession session = request.getSession();
            listSemester = Semester.getPassedSemesterID();
            listSubject = Subject.getSubjectList();
            listSubjectName = Subject.getListSubjectName(listSubject);
            listClass = Classes.getListClass();
            listClassID = Classes.getListClassID(listClass);
            
            // reset attributes
            session.setAttribute("listClass", listClass);
            session.setAttribute("listSubject", listSubject);
            session.setAttribute("listSemester", listSemester);
            session.setAttribute("subject_type", null);
            session.setAttribute("selectedSubject", null);
            selectedSubject = null;
            session.setAttribute("selectedClass", null);
            selectedClass = null;
            session.setAttribute("selectedSemester", null);
            selectedSemester = null;
            session.setAttribute("listMarkDetail", null);            
            
            status = "";
            return SUCCESS;            
        }
        catch(Exception ex)
        {
            status = "Lỗi:" + ex.getMessage();
            return FAILURE;
        }
    }
    
    public String processSelectedClass()
    {   
        HttpServletRequest request = ServletActionContext.getRequest();
        try
        {
            HttpSession session = request.getSession();
            listClass = (ArrayList<Classes>) session.getAttribute("listClass");
            listClassID = Classes.getListClassID(listClass);
            listSemester = (ArrayList<String>) session.getAttribute("listSemester");
            listSubject = (ArrayList<Subject>) session.getAttribute("listSubject");
            listSubjectName = Subject.getListSubjectName(listSubject);
            
            session.setAttribute("selectedClass", selectedClass);
            retriveSelectedSubject(session);
            retriveSelectedSemester(session);
                        
            this.loadMarkDetail(session);
            return SUCCESS;            
        }
        catch(Exception ex)
        {
            status = "Lỗi:" + ex.getMessage();
            return FAILURE;
        }
    }
    
    public String processSelectedSemester()
    {   
        HttpServletRequest request = ServletActionContext.getRequest();
        try
        {
            HttpSession session = request.getSession();
            listClass = (ArrayList<Classes>) session.getAttribute("listClass");
            listClassID = Classes.getListClassID(listClass);
            listSemester = (ArrayList<String>) session.getAttribute("listSemester");
            listSubject = (ArrayList<Subject>) session.getAttribute("listSubject");
            listSubjectName = Subject.getListSubjectName(listSubject);
            
            session.setAttribute("selectedSemester", selectedSemester);
            retriveSelectedSubject(session);
            retriveSelectedClass(session);            
            
            this.loadMarkDetail(session);
            return SUCCESS;            
        }
        catch(Exception ex)
        {
            status = "Lỗi:" + ex.getMessage();
            return FAILURE;
        }
    }
    
    public String processSelectedSubject()
    {   
        HttpServletRequest request = ServletActionContext.getRequest();
        try
        {
            HttpSession session = request.getSession();
            listClass = (ArrayList<Classes>) session.getAttribute("listClass");
            listClassID = Classes.getListClassID(listClass);
            listSemester = (ArrayList<String>) session.getAttribute("listSemester");
            listSubject = (ArrayList<Subject>) session.getAttribute("listSubject");
            listSubjectName = Subject.getListSubjectName(listSubject);
            
            session.setAttribute("selectedSubject", selectedSubject);
            retriveSelectedClass(session);
            retriveSelectedSemester(session);
            
            // set subject type
            int i = listSubjectName.indexOf(selectedSubject);
            Subject sbj = listSubject.get(i);
            String subject_type = sbj.getType();
            String subject_id = sbj.getID();
            session.setAttribute("subject_type", subject_type);
            session.setAttribute("subject_id", subject_id);
            
            this.loadMarkDetail(session);
            return SUCCESS;            
        }
        catch(Exception ex)
        {
            status = "Lỗi:" + ex.getMessage();
            return FAILURE;
        }
    }
    
    private void loadMarkDetail(HttpSession session) throws SQLException, Exception
    {
        if(selectedClass == null || selectedSemester == null || selectedSubject == null)
            return;
        // else, show mark detail
        status = "Chi tiết điểm môn " + selectedSubject + " lớp " + selectedClass + " học kỳ " + selectedSemester;
        ArrayList<Student> stdList = Student.getStudentByClass(selectedClass, selectedSemester);
        listMarkDetail = new ArrayList<MarkDetail>();
        String subjectType = session.getAttribute("subject_type").toString();
        String subjectID = session.getAttribute("subject_id").toString();
        
        Semester sem = new Semester(selectedSemester);
        MarkConfig markConfig = sem.getMarkConfig(subjectType);
        session.setAttribute("markConfig", markConfig);
        for(Student std : stdList)
        {            
            MarkDetail md = new MarkDetail();
            md.setMarkConfig(markConfig);
            md.setStudentID(std.getID());
            md.setStudentFullName(std.getLastname() + " " + std.getFirstname());
            
            listMarkDetail.add(md);
        }
        
        Subject subject = new Subject();
        subject.setType(subjectType);
        subject.setID(subjectID);
        MarkDetail.fillMarkDetailList(listMarkDetail, selectedSemester, subject, selectedClass, markConfig);        
        session.setAttribute("listMarkDetail", listMarkDetail);
    }
    
    /**
     * @return the listSubjectName
     */
    public ArrayList<String> getListSubjectName() {
        return listSubjectName;
    }

    /**
     * @param listSubjectName the listSubjectName to set
     */
    public void setListSubjectName(ArrayList<String> listSubjectName) {
        this.listSubjectName = listSubjectName;
    }

    /**
     * @return the listClass
     */
    public ArrayList<String> getListClass() {
        return getListClassID();
    }

    /**
     * @param listClass the listClass to set
     */
    public void setListClass(ArrayList<String> listClass) 
    {
        this.setListClassID(listClass);
    }

    /**
     * @return the selectedSubject
     */
    public String getSelectedSubject() {
        return selectedSubject;
    }

    /**
     * @param selectedSubject the selectedSubject to set
     */
    public void setSelectedSubject(String selectedSubject) {
        this.selectedSubject = selectedSubject;
    }

    /**
     * @return the selectedClass
     */
    public String getSelectedClass() {
        return selectedClass;
    }

    /**
     * @param selectedClass the selectedClass to set
     */
    public void setSelectedClass(String selectedClass) {
        this.selectedClass = selectedClass;
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
     * @return the listSemester
     */
    public ArrayList<String> getListSemester() {
        return listSemester;
    }

    /**
     * @param listSemester the listSemester to set
     */
    public void setListSemester(ArrayList<String> listSemester) {
        this.listSemester = listSemester;
    }

    /**
     * @return the selectedSemester
     */
    public String getSelectedSemester() {
        return selectedSemester;
    }

    /**
     * @param selectedSemester the selectedSemester to set
     */
    public void setSelectedSemester(String selectedSemester) {
        this.selectedSemester = selectedSemester;
    }

    /**
     * @return the listClassID
     */
    public ArrayList<String> getListClassID() {
        return listClassID;
    }

    /**
     * @param listClassID the listClassID to set
     */
    public void setListClassID(ArrayList<String> listClassID) {
        this.listClassID = listClassID;
    }

    private void retriveSelectedSubject(HttpSession session) 
    {
        if(session.getAttribute("selectedSubject") == null)
            selectedSubject = null;
        else
            selectedSubject = session.getAttribute("selectedSubject").toString();
    }

    private void retriveSelectedSemester(HttpSession session) 
    {
        if(session.getAttribute("selectedSemester") == null)
            selectedSemester = null;
        else
            selectedSemester = session.getAttribute("selectedSemester").toString();
    }
    
    private void retriveSelectedClass(HttpSession session)
    {        
        if(session.getAttribute("selectedClass") == null)
            selectedClass = null;
        else
            selectedClass = session.getAttribute("selectedClass").toString();
    }
}