/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package MarkManagement;

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
public class UpdateMarkAction extends ActionSupport{
    private static String FAILURE = "success";
    
    public UpdateMarkAction() 
    {
        
    }
    
    private boolean isFirstLoad = false;
    private String status = "";
    private ArrayList<Subject> listSubject;
    private ArrayList<String> listSubjectName = new ArrayList<String>();    
    private ArrayList<String> listClass = new ArrayList<String>();
    private ArrayList<MarkDetail> listMarkDetail;
    
    private String selectedSubject;
    private String selectedClass;
    private MarkConfig markConfig;
    private String updatedPosition;
    private String updatedValue;
    
    public String updateMark()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        try
        {
            HttpSession session = request.getSession();
            listSubject = (ArrayList<Subject>) session.getAttribute("listSubject");
            listSubjectName = Subject.getListSubjectName(listSubject);
            listClass = (ArrayList<String>) session.getAttribute("listClass");
            selectedSubject = session.getAttribute("selectedSubject").toString();
            selectedClass = session.getAttribute("selectedClass").toString();
                        
            status = this.updateChangedMark(session);
            
            return SUCCESS;            
        }
        catch(Exception ex)
        {
            status = "Lỗi:" + ex.getMessage();
            return FAILURE;
        }
    }
    
    public String loadSubjectList()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        try 
        {
            HttpSession session = request.getSession();
            
            Semester semester = Semester.getCurrentSemester();
            if(semester == null)
            {
                status = "Không phải thời điểm cập nhật điểm (không thuộc thời gian học kỳ nào). "
                        + "Liên hệ quản trị để biết thêm thông tin";
                return FAILURE;
            }
            session.setAttribute("semesterID", semester.getID());
            String teacherID = session.getAttribute("teacherID").toString();
            
            listSubject = semester.getSubjectAssignment(teacherID);
            session.setAttribute("listSubject", listSubject);
            listSubjectName = Subject.getListSubjectName(listSubject);
            
            session.setAttribute("selectedSubject", null);
            session.setAttribute("selectedClass", null);
            session.setAttribute("listMarkDetail", null);        
            
            return SUCCESS;
        }
        catch (Exception ex) 
        {
            status = "Lỗi: " + ex.getMessage();
            return FAILURE;
        }
    }
    
    public String loadClassList()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        
        try
        {
            HttpSession session = request.getSession();
            
            listSubject = (ArrayList<Subject>) session.getAttribute("listSubject");
            listSubjectName = Subject.getListSubjectName(listSubject);
                        
            if(selectedSubject.equals("0")){
                return FAILURE;
            }
            else{
                session.setAttribute("selectedSubject", selectedSubject);
            }
            
            // get list of class according to selected subject            
            int index = listSubjectName.indexOf(selectedSubject);
            
            String semesterID = session.getAttribute("semesterID").toString();
            String teacherID = session.getAttribute("teacherID").toString();
            Semester sem = new Semester(semesterID);
            listClass = sem.getClassAssignment(teacherID, listSubject.get(index).getID());
            session.setAttribute("listClass", listClass);
            selectedClass = null;
            session.setAttribute("selectedClass", null);
            session.setAttribute("listMarkDetail", null);
            
            // get mark config for the selected subject's type
            String type = listSubject.get(index).getType();
            if(session.getAttribute("subject_type") != null)
            {
                String old_type = session.getAttribute("subject_type").toString();
                if(!type.equals(old_type))
                {
                    markConfig = sem.getMarkConfig(type);
                    session.setAttribute("subject_type", type);
                    session.setAttribute("markConfig", markConfig);
                }
            }
            else
            {
                markConfig = sem.getMarkConfig(type);
                session.setAttribute("subject_type", type);
                session.setAttribute("markConfig", markConfig);
            }
            
            return SUCCESS;
        }
        catch(Exception ex)
        {
            status = "Lỗi: " + ex;
            return FAILURE;
        }                
    }
    
    public String showMarkDetail()
    {
        HttpServletRequest request = ServletActionContext.getRequest();
        HttpSession session = request.getSession();
        try
        {
            // retrive subject list and class list
            listSubject = (ArrayList<Subject>) session.getAttribute("listSubject");
            listSubjectName = Subject.getListSubjectName(listSubject);
            listClass = (ArrayList<String>) session.getAttribute("listClass");
            session.setAttribute("selectedClass", selectedClass);            
            
            // retrive semesterID and selected subjectID from session
            String semesterID = session.getAttribute("semesterID").toString();            
            selectedSubject = session.getAttribute("selectedSubject").toString();
            int index = listSubjectName.indexOf(selectedSubject);
            String subjectID = listSubject.get(index).getID();
            markConfig = (MarkConfig) session.getAttribute("markConfig");           
            
            // get list mark detail
            Subject subject = new Subject();
            subject.setID(subjectID);
            String type = session.getAttribute("subject_type").toString();
            subject.setType(type);
            
            listMarkDetail = this.getListStudent(semesterID);
            MarkDetail.fillMarkDetailList(listMarkDetail, semesterID, subject, selectedClass, markConfig);            
            session.setAttribute("listMarkDetail", listMarkDetail);
            
            status = "Chi tiết điểm môn " + selectedSubject + " lớp " + selectedClass + 
                    " học kỳ " + semesterID;
            
            return SUCCESS;
        }
        catch(Exception ex)
        {
            session.setAttribute("listMarkDetail", null);
            status = "Lỗi: " + ex;            
            return FAILURE;
        }
    }
    
    public String reloadMarkDetail()
    {
        return this.showMarkDetail();
    }
    
    /**
     * @return the listSubject
     */
    public ArrayList<String> getListSubject() {
        return getListSubjectName();
    }

    /**
     * @param listSubject the listSubject to set
     */
    public void setListSubject(ArrayList<String> listSubject) {
        this.setListSubjectName(listSubject);
    }

    /**
     * @return the listClass
     */
    public ArrayList<String> getListClass() {
        return listClass;
    }

    /**
     * @param listClass the listClass to set
     */
    public void setListClass(ArrayList<String> listClass) {
        this.listClass = listClass;
    }

    /**
     * @return the isFirstLoad
     */
    public boolean isIsFirstLoad() {
        return isFirstLoad;
    }

    /**
     * @param isFirstLoad the isFirstLoad to set
     */
    public void setIsFirstLoad(boolean isFirstLoad) {
        this.isFirstLoad = isFirstLoad;
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
     * @return the markConfig
     */
    public MarkConfig getMarkConfig() {
        return markConfig;
    }

    /**
     * @param markConfig the markConfig to set
     */
    public void setMarkConfig(MarkConfig markConfig) {
        this.markConfig = markConfig;
    }    

    /**
     * @return the updatedPosition
     */
    public String getUpdatedPosition() {
        return updatedPosition;
    }

    /**
     * @param updatedPosition the updatedPosition to set
     */
    public void setUpdatedPosition(String updatedPosition) {
        this.updatedPosition = updatedPosition;
    }

    /**
     * @return the updatedValue
     */
    public String getUpdatedValue() {
        return updatedValue;
    }

    /**
     * @param updatedValue the updatedValue to set
     */
    public void setUpdatedValue(String updatedValue) {
        this.updatedValue = updatedValue;
    }

    private String updateChangedMark(HttpSession session) 
            throws SQLException, Exception 
    {        
        // get subject detail from session
        Subject subject = new Subject();
        String sbjType = session.getAttribute("subject_type").toString();
        subject.setType(sbjType);
        int index = listSubjectName.indexOf(selectedSubject);
        subject.setID(listSubject.get(index).getID());
        
        // analyst mark record and mark element to be updated
        int separator = updatedPosition.indexOf("_");
        String recordIndex = updatedPosition.substring(0, separator);
        String markType = updatedPosition.substring(separator+1, separator+2);
        String markIndex = updatedPosition.substring(separator+2);
        
        int checkInput = this.validateMark(markType, updatedValue);
        if(checkInput != 0)
            return this.getValidationError(checkInput);
        
        // Parse string to int
        int rcIndex = Integer.parseInt(recordIndex);
        listMarkDetail = (ArrayList<MarkDetail>) session.getAttribute("listMarkDetail");
        MarkDetail md = listMarkDetail.get(rcIndex);
        
        // retrieve mark element to be updated        
        String semesterID = session.getAttribute("semesterID").toString();
        Mark mark;
        if(markType.equals("H"))
        {
            mark = md.HK;
            md.HK = this.processUpdateMark(mark, markType, md.getStudentID(), subject, semesterID);
        }
        else {
            int mIndex = Integer.parseInt(markIndex);
            if (markType.equals("M")) {
                mark = md.M[mIndex];
                md.M[mIndex] = this.processUpdateMark(mark, markType, md.getStudentID(), subject, semesterID);
            } else if (markType.equals("P")) {
                mark = md.P15[mIndex];
                md.P15[mIndex] = this.processUpdateMark(mark, markType, md.getStudentID(), subject, semesterID);
            } else if (markType.equals("V")) {
                mark = md.P45[mIndex];
                md.P45[mIndex] = this.processUpdateMark(mark, markType, md.getStudentID(), subject, semesterID);
            }
        }
        
        // calculate average mark and save mark detail back to session
        listMarkDetail.set(rcIndex, md);
        session.setAttribute("listMarkDetail", listMarkDetail);       
        return "Đã cập nhật thành công";
    }
    
    private Mark processUpdateMark(Mark mark, String markType, String studentID, Subject subject, String semesterID) 
            throws SQLException, Exception
    {
        if(updatedValue == null || updatedValue.equals("")) // remove
        {
            status = "remove";
            if(!MarkDetail.removeMark(mark, subject.getType()))
                return mark;
            else
                return null;
        }
        else if(mark == null) // insert
        {
            Mark newMark = new Mark(null, updatedValue);
            if(!MarkDetail.insertMark(newMark, markType, subject, semesterID, studentID))
                return null;
            else
            {
                status = "new ID: " + newMark.ID;
                return newMark;
            }
        }
        else // update
        {
            Mark newMark = new Mark(mark.ID, updatedValue);
            if(!MarkDetail.updateMark(newMark, subject.getType())){
                return mark;
            }
            else{             
                return newMark;
            }
        }
    }

    private ArrayList<MarkDetail> getListStudent(String semesterID) 
            throws SQLException, Exception 
    {
        ArrayList<MarkDetail> listMark = new ArrayList<MarkDetail>();
        ArrayList<Student> listStudent = Student.getStudentByClass(selectedClass, semesterID);
        for(Student std : listStudent)
        {
            MarkDetail md = new MarkDetail();
            md.setMarkConfig(markConfig);
            md.setStudentID(std.getID());
            md.setStudentFullName(std.getLastname() + " " + std.getFirstname());
            listMark.add(md);
        }
        
        return listMark;
    }

    private int validateMark(String markType, String updatedValue) 
    {
        if(updatedValue.equals(""))
            return 0;
        
        if(markType.equals("H"))
        {
            try
            {
                Float.parseFloat(updatedValue);
                return 0;
            } catch (Exception ex)
            {
                return 1;
            }
        }
        else
        {
            try
            {
                float f = Float.parseFloat(updatedValue);
                int i = (int) f;
                if(i < f)
                    return 2;
                else return 0;
            }
            catch(Exception ex)
            {
                return 1;
            }                    
        }
    }

    private String getValidationError(int check) 
    {
        switch(check)
        {
            case 1:
                return "Lỗi: Dữ liệu nhập vào phải là số";
            case 2:
                return "Lỗi: Dữ liệu nhập vào cho trường này phải là số nguyên";
            default:
                return "";
        }    
    }
}