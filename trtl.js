var $window = $(window);
var turtle = document.getElementById("trtl");
var x = 500;
var y = 160;
speed = 5;
x_dir = 1;
y_dir = 1;

// x movement
setInterval(function(){
    x = x + speed * x_dir;
    turtle.style.left = x + "px";

    // left boundry
    if(x < 150){
        x_dir = 1;
        transition(2);
    }
    // right boundry
    if(x > $window.width() - 150){
        x_dir = -1;

        transition(1);
    }
},100);

// y movement
setInterval(function(){
    y = y + speed * y_dir;
    console.log(y);
    turtle.style.top = y + "px";
    // top boundry
    if(y < 160){
        y_dir = 1;
    }
    // bottom boundry
    if(y > $window.height() - 150){
        y_dir = -1;
    }
},100);

function transition(x){
    turtle.style.animation = "walking-turtle-0"+x+" 10s ease-in-out infinite alternate";
}
