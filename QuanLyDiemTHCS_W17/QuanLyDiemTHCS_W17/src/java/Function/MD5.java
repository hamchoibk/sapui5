/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package Function;
import java.security.MessageDigest;

 
public class MD5
{
    public static String hashPassWord(String input) throws Exception
    {
    
       
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(input.getBytes());
 
        byte byteData[] = md.digest();
 
        //convert the byte to hex format method
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < byteData.length; i++) {
         sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
        }
 
       // System.out.println("Digest(in hex format):: " + sb.toString());
 
       return sb.toString();
    }
    
}