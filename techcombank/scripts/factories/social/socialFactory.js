'use strict';

tcbmwApp.factory('SocialFactory', function(){
    var particulars={
        prevState:'',
        checkParameter:'',
        trueLoad:''
    };

    return {
        setParticulars:function(data){
            particulars=data;
        },
        getParticulars:function(data){
            return particulars;
        },
        resetParticulars:function(data){
            particulars={
              prevState:'',
              checkParameter:'',
              trueLoad:''
            };
        }
    };
});