
package Function;

import DAO.DBconnect;




public class ConnectInfo {

    public static boolean isConnect() {
        if (DBconnect.connect()) {
            DBconnect.closeConnect();
            return true;
        } else {
            return false;
        }

    }
}
