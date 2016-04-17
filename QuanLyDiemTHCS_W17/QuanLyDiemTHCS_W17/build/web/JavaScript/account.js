
function createCode(n) {
    var password = "";
    for (i = 0; i < n; i++) {
        a = rand13();
        password += String.fromCharCode(a);
    }
    return password;
}
function createCapcha(n) {
    var code = "";
    for (i = 0; i < n; i++)
    {

        a = Math.floor((Math.random() * 26) + 65);
        code += String.fromCharCode(a);
    }
    return code;
}
function rand13() {
    x = Math.floor((Math.random() * 3));
    if (x === 0) {
        return  Math.floor((Math.random() * 26) + 65);
    }
    else if (x === 1) {
        return Math.floor((Math.random() * 26) + 97);
    }
    else {
        return  Math.floor((Math.random() * 8) + 50);
    }
}
function createUser(lname, fname) {
    var result = "";
    lname = lname.toLowerCase();
    fname = fname.toLowerCase();
    lname = lname.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    lname = lname.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    lname = lname.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    lname = lname.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    lname = lname.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    lname = lname.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    lname = lname.replace(/đ/g, "d");

    fname = fname.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    fname = fname.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    fname = fname.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    fname = fname.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    fname = fname.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    fname = fname.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    fname = fname.replace(/đ/g, "d");
    fname = fname.replace("  ", " ");  // xóa nhiều dấu cách
    fname = fname.replace("  ", " ");
    fname = fname.replace("  ", " ");
    fname = fname.replace("  ", " ");
    lname = lname.replace(" ", ""); // xóa dấu cách ở tên 
    lname = lname.replace(" ", "");
    lname = lname.replace(" ", "");
    result += lname;
    result += fname.substr(0, 1).toUpperCase();

    for (i = 0; i < fname.length; i++) {
        if (fname[i] === " ")
            result += fname.substr(i + 1, 1).toUpperCase();
    }
    return result;
}
function createUname() {
    var lname = document.getElementById("lname");
    var fname = document.getElementById("fname");
    var uname = document.getElementById("uname");
    var username = createUser(fname.value, lname.value);
    uname.value = username;
}
function createPassword() {


    var email = document.getElementById("rd_email");
    var matkhau = document.getElementById("rd_password");
    matkhau.value = createCode(10);
}

function onloadPass() {
//    var pass = document.getElementById("rd_password");
//    pass.value = createCode(10);
    window.scrollTo(0, 160);
    var tcaptcha = document.getElementById("tcaptcha");
    
    var captchavalue=createCode(5).toUpperCase();
    draw(captchavalue, "#divcaptcha");
    tcaptcha.value =  captchavalue;

}










function draw(data, divid) {
    var dlength = data.length;
    var xcolor = ["#d62728", "#1f77b4", "#ffbb78", "#d9d9d9"];
    canvas = d3.select(divid).append("svg")
            .attr("width", 100)
            .attr("height", 30);


    for (i = 0; i < dlength; i++) {

        if (i % 2 === 0)
        {
            canvas.append("text")
                    .attr("x", 0 + 20 * i)
                    .attr("y",10)
                    .attr("dy", (.40 + .2) + "em")
                    .text(" " + data[i] + " ")
                    .style("fill", xcolor[i]);
        }
        else
        {
            canvas.append("text")
                    .attr("x", 0 + 20 * i)
                    .attr("y", 7)
                    .attr("dy", (.40) + "em")
                    .text(" " + data[i] + " ")
                    .style("fill", xcolor[i]);

        }
        //+xcolor[i]

    }



}














// $(document).ready(function() { var pass = createPassword(12); $("#password").val(pass);  $("#fname").focusout(function() { var x = $("#lname").val();var y = $("#fname").val().trim();var username = createUser(y, x);
// $("#uname").val(username);}); $("#lname").focusout(function() {  var x = $("#lname").val();  var y = $("#fname").val().trim(); var username = createUser(y, x);$("#uname").val(username); }); }); 
 