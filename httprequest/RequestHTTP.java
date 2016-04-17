

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class RequestHTTP {

    private final String USER_AGENT = "Mozilla/5.0";

    public static void main(String[] args) throws Exception {
        RequestHTTP http = new RequestHTTP();
        System.out.println("Testing 1 - Send Http GET request");
        
        //183.81.83.67
        String supper = "http://topsip.vn"; //http://118.71.70.204/ 1.55.99.98
       while(true) {

           
            try {
                http.sendGet(supper);
            } catch (Exception ex) {

            }
        }

    }

    // HTTP GET request
    private void sendGet(String _url) throws Exception {

       // String url = "http://183.81.84.183/sach";//login.cgi?username=admin&psd=maimocmac";
        URL obj = new URL(_url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("Response Code : " + responseCode);
        if (responseCode == 200) {
            System.out.println("\nSending 'GET' request to URL : " + _url);

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(con.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            //print result
            System.out.println("OKE NHE");
        }

    }

	// HTTP POST request
}
