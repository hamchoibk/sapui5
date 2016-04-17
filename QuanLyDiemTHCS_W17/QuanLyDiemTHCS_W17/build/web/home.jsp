<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <title> Home :  </title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

        <link rel="stylesheet" href="<s:url value="/Style/style.css"/>" type="text/css">
    </head>
    <body>



        <s:set name="myVar"><script> document.write(i);</script></s:set>
      var <s:property value="myVar"/>
    </body>


</html>
