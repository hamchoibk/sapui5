/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package InfoManagement;

import java.util.ArrayList;

/**
 *
 * @author Sony
 */
public class ListNewAccount {
    
    private ArrayList<Account> list ;

    public ListNewAccount() {
        
        
        list= new ArrayList<Account>();
    }
    
    public void addAccount(Account acc)
    {
        list.add(acc);
    }
    public void removeAccount(String username)
    {
        if(list!= null)
        {
            
            for(Account acc: list)
            {
                if(acc.getUsername().trim().equals(username))
                   
                    list.remove(acc);
                
                
            }
        }
        
    }

    /**
     * @return the list
     */
    public ArrayList<Account> getList() {
        return list;
    }

    /**
     * @param list the list to set
     */
    public void setList(ArrayList<Account> list) {
        this.list = list;
    }
    
    
}
