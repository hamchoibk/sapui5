var fs = require('fs');
var minifier = require('E:/mini/node_modules/minifier/src/minify.js');


var path =  "F:/VPBank/view";
var outPath ='F:/VPBank/Minify/view/';
var option=null;   
var item =null;        
fs.readdir(path, function(err, items) {
   // console.log(items); 
    for (var i=0; i<items.length; i++) {
        item = items[i];
         console.log( " Item  " + i +" : " + item);
        if(item.substring(item.length-2) =='js')
        {
         option  ={};  // option  minify  : include   Out put path

         option.output =outPath+ item;
         minifier.minify(path+'/'+ item, option);               
        }
    }
});

