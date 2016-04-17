/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Servlet;

import DAO.AccountBusiness;
import InfoManagement.Account;
import com.opensymphony.xwork2.ActionSupport;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import org.apache.struts2.ServletActionContext;

/**
 *
 * @author Sony
 */
public class ActionExcel extends ActionSupport {

    public String lblError;

    @Override
    public String execute() throws Exception {
        //HttpServletRequest request = ServletActionContext.getRequest();

        List<Account> listacc = AccountBusiness.getAllAccount();
        ArrayList user = null;
        HttpServletResponse response = ServletActionContext.getResponse();
        user = (ArrayList) listacc;
        ExcelCreator excelCreator = new ExcelCreator();
        HSSFWorkbook workbook = excelCreator.createWorkbook(user);
        try {
            response.setHeader("Content-Disposition", "attachment; filename=UserDetails.xls");
            ServletOutputStream out = response.getOutputStream();
            workbook.write(out);
            out.flush();
            out.close();
            lblError = " s" + listacc.size();
            return SUCCESS;

        } catch (Exception ex) {

            lblError = " Lỗi <Br> Error: Sixe " + ex.toString() + user.size();
            return ERROR;
        }

    }

    /**
     * @return the response
     */
}
