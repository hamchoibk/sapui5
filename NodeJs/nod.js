var fs = require('fs');


var path =  "F:/VPBank/view";
     
fs.readdir(path, function(err, items) {
   // console.log(items); 
    for (var i=0; i<items.length; i++) {
        item = items[i];
         console.log( " Item  " + i +" : " + item);
        
    }
});

