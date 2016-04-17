'use strict';

tcbmwApp.factory('FavouritesFactory', ['_',function(_){
    var favourite={
        id:'',
        name:'',
        imgUrl:'',
        channel:'',
        mobile:'',
        email:'',
        channelUrl:''
    };

    var favourites=[
                 ];

    return {
      getFavourite:function(){
         return favourite;
      },
      setFavourite:function(data){
         favourite=data;
      },
      resetFavourite:function(){
        favourite={
          id:'',
          name:'',
          imgUrl:'',
          channel:'',
          mobile:'',
          email:'',
          channelUrl:''
        };
      },
      findAll:function(){
          if (session.favoriteFriends !== undefined && session.favoriteFriends != null) {
              if (session.favoriteFriends.length !== undefined)
                return session.favoriteFriends.slice(0,5);
              else
                return session.favoriteFriends;
          }
          return [];
      },
      findById:function(id){
         return _.find(favourites,function(element){ return element.id == id; })
      }
    }
}]);