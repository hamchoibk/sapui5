package Function;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
/**
 *
 * @author Administrator
 */
public class Security 
{
    public static String getHashCodeMD5(String input) throws NoSuchAlgorithmException
    {
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(input.getBytes());
 
        byte byteData[] = md.digest();
 
        //convert the byte to hex format method
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < byteData.length; i++) {
            sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
        }
        
        return sb.toString();
    }
}
