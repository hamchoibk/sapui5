package Servlet;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
import InfoManagement.Account;
import java.util.ArrayList;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

/**
 *
 * @author eswar@vaannila.com
 */
public class ExcelCreator {

    public HSSFWorkbook createWorkbook(ArrayList userList) throws Exception {

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet("User Data");

        /**
         * Setting the width of the first three columns.
         */
        sheet.setColumnWidth(0, 1000);
        sheet.setColumnWidth(1, 1000);
        sheet.setColumnWidth(2, 5000);
        sheet.setColumnWidth(3, 4000);
        sheet.setColumnWidth(4, 4000);
        sheet.setColumnWidth(5, 6000);
        sheet.setColumnWidth(6, 4000);

        /**
         * Style for the header cells.
         */
        HSSFCellStyle headerCellStyle = wb.createCellStyle();
        HSSFFont boldFont = wb.createFont();
        boldFont.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        headerCellStyle.setFont(boldFont);

        HSSFRow row = sheet.createRow(0);

        HSSFCell cell = row.createCell(0);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("STT"));

        cell = row.createCell(1);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("Mã giáo viên"));

        cell = row.createCell(2);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("Họ tên"));

        cell = row.createCell(3);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("Tài khoản"));

        cell = row.createCell(4);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("Mật khẩu"));

        cell = row.createCell(5);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("Email"));

        cell = row.createCell(6);
        cell.setCellStyle(headerCellStyle);
        cell.setCellValue(new HSSFRichTextString("Thông tin"));

        for (int index = 1; index < userList.size(); index++) {
            row = sheet.createRow(index);
            Account account = (Account) userList.get(index);
            cell = row.createCell(0);

            HSSFRichTextString Stt = new HSSFRichTextString("" + index);
            cell.setCellValue(Stt);

            cell = row.createCell(1);
            HSSFRichTextString Mgv = new HSSFRichTextString(account.getMaGiaoVien());
            cell.setCellValue(Mgv);

            cell = row.createCell(2);

            HSSFRichTextString hoten = new HSSFRichTextString(account.getHoDem() + account.getTen());
            cell.setCellValue(hoten);
            cell = row.createCell(3);

            HSSFRichTextString username = new HSSFRichTextString(account.getUsername());
            cell.setCellValue(username);

            cell = row.createCell(4);
            HSSFRichTextString password = new HSSFRichTextString(account.getDefPassword());
            cell.setCellValue(password);

            cell = row.createCell(5);
            HSSFRichTextString email = new HSSFRichTextString(account.getEmail());
            cell.setCellValue(email);

            cell = row.createCell(6);
            HSSFRichTextString thongtin = new HSSFRichTextString(account.getThongTin());
            cell.setCellValue(thongtin);
        }  
        return wb;
    }
}
