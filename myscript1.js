var x;


$(document).keypress(function(e) {
    if(e.which == 13) {
        x=document.getElementById("speech");
        document.getElementById("user").innerHTML = x;
        document.getElementById("demo").innerHTML = Date();
    }
});