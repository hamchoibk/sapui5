'use strict';
//To fetch user details and balance from backend
tcbmwApp.factory('ProfileFactory', function(){
     var profile ={
            fullname:'',
            sex:'',
            fibname:'',
            mbbname:'',
            idnumber:'',
            issuedate:'',
            addrl1:'',
            addrl2:'',
            addrl3:'',
            addrl4:'',
            custSector:'',
            password:'',
            imgData1:'',
            imgData2:''
     };

     return {
             setProfile:function(data){
                 profile = data;
             },
             getProfile:function(){
                 return profile;
             },
             setPassword:function(data){
                 profile.password=data;
             },
             getPassword:function(){
                 return profile.password;
             },
             clear:function(){
                profile ={
                    fullname:'',
                    fibname:'',
                    mbbname:'',
                    idnumber:'',
                    addrl1:'',
                    addrl2:'',
                    addrl3:'',
                    addrl4:'',
                    custSector:'',
                    password:'',
                    imgData1:'',
                    imgData2:''
                };
             }
     };
});