function validateFormAddnewAccount()
{
    
   var username=document.frmadd.username.value;
    var hodem =document.frmadd.hodem.value;
   var ten = document.frmadd.ten.value;
   
    var info=document.frmadd.info.value;
   var password=document.frmadd.password.value;
    

      if (hodem === "" || hodem === null)
    {

      
        document.getElementById("lblError").innerHTML = "Vui lòng nhập Họ Đệm";
        document.frmadd.hodem.focus();

        return false;
    }
     if (ten === "" || ten === null)
    {

      
        document.getElementById("lblError").innerHTML = "Vui lòng nhập tên";
        document.frmadd.ten.focus();

        return false;
    }
   
   
    if (info === "" || info === null)
    {

      
        document.getElementById("lblError").innerHTML = "Vui lòng nhập thông tin";
        document.frmadd.info.focus();

        return false;
    }
       
     if (username === "" || username === null)
    {

      
        document.getElementById("lblError").innerHTML = "Vui lòng nhập Tài khoản";
        document.frmadd.username.focus();

        return false;
    }
     if (password === "" || password === null)
    {

      
        document.getElementById("lblError").innerHTML = "Vui lòng nhập mật khẩu";
        document.frmadd.password.focus();

        return false;
    }
   
     return(true);
    
}


function validateFormLogin()
{
    var username = document.frm.username.value;
    var password = document.frm.password.value;
    if (username === "" || username === null)
    {

        //   alert("Error: username");
        document.getElementById("txtError").innerHTML = "Vui lòng nhập Tài khoản";
        document.frm.username.focus();

        return false;
    }
    if (username.length < 4)
    {
        document.getElementById("txtError").innerHTML = "Tên đăng nhập ngắn quá";
        //document.frm.oldpass.focus();

        return false;
    }
    if (password.length < 4)
    {
        document.getElementById("txtError").innerHTML = "Mật khẩu ngắn quá";
        //document.frm.oldpass.focus();

        return false;
    }
    if (paassword == "" || password == null)
    {
        //  alert("Error: password");
        document.getElementById("txtError").innerHTML = "Vui lòng nhập mật khẩu";
        document.frm.password.focus();

        return false;
    }
    return (true);
}


function validateFormChangePass()
{

    var oldpass = document.frm.oldpass.value;
    var newpass = document.frm.newpass.value;
    var renewpass = document.frm.renewpass.value;
    if (oldpass == null || oldpass == "")
    {

        // alert("Error: Old");
        document.getElementById("lblError").innerHTML = "Vui lòng nhập mật khẩu cũ";
        document.frm.oldpass.focus();

        return false;
    }
    if (oldpass.length < 4)
    {
        document.getElementById("lblError").innerHTML = "mật khẩu cũ quá ngắn";
        //document.frm.oldpass.focus();

        return false;

    }


    if (newpass == null || newpass == "")
    {
        //alert("Error: new");
        document.getElementById("lblError").innerHTML = "Vui lòng nhập mật khẩu mới";
        document.frm.newpass.focus();

        return false;
    }
    if (newpass.length < 4)
    {
        document.getElementById("lblError").innerHTML = "mật khẩu mới quá ngắn";
        //document.frm.oldpass.focus();

        return false;

    }

    if (renewpass != newpass)
    {
        //alert("Error: new");
        document.getElementById("lblError").innerHTML = "Mật khẩu mới không khớp";
        // document.frm.newpass.focus();

        return false;
    }
    if (oldpass == newpass)
    {
        //alert("Error: new");
        document.getElementById("lblError").innerHTML = "Trùng mật khẩu mới trùng với cũ";
        // document.frm.newpass.focus();

        return false;
    }

    return(true);
}