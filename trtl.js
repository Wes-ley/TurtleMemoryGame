var $window = $(window);
var speed = 10;
var spin_rate = 1;
var logging = true;

var turtles = new Array(4);

var width = $window.width();
var height = $window.height();
console.log("window size: " + width + ", " + height);

var starting_positions = [ [0, 0, -1, -1, -1 ,0],
            [width - 500, height - 500, 1, 1, 1, 180],
            [0, height - 500, 1, 1, -1, 1],
            [width - 500, 0, 1, -1, 1, 90]];

for(var i = 1; i <= turtles.length; i++){
    pos = starting_positions[i-1];
    div = document.getElementById("trtl" + i);
    turtles[i-1] = new Turtle(i, div, pos[0], pos[1], pos[2], pos[3], pos[4], pos[5]);
    console.log(turtles[i-1]);
    init_turtle(i-1);
}

turtles[0].div.getElementsByClassName("shell")[0].setAttribute("id", "red");
turtles[1].div.getElementsByClassName("shell")[0].setAttribute("id", "blue");
turtles[2].div.getElementsByClassName("shell")[0].setAttribute("id", "green");
turtles[3].div.getElementsByClassName("shell")[0].setAttribute("id", "yellow");


// turn on collision detection
setInterval(BounceCollusion, 500);

// turtle constructor
function Turtle(index, div ,x ,y, x_dir, y_dir, spin, degree) {
    this.index = index;
    this.div = div;
    this.x = x;
    this.y = y;
    this.x_dir = x_dir;
    this.y_dir = y_dir;
    this.spin = spin;
    this.degree = degree;
    //init_turtle(this.index);
    return this;
}

function init_turtle(x){

    setInterval(BounceX, 100, turtles[x]);
    setInterval(BounceY, 100, turtles[x]);
    //SetInterval(BounceCollusion, 100, turtles[x]);
}

// "bounce" turtles off left and right boundries
function BounceX (turtle){

    turtle.x = turtle.x + speed * turtle.x_dir;

    turtle.div.style.left = turtle.x + "px";

    turtle.degree += turtle.spin;
    rotate(turtle.div, turtle.degree);

    // left boundry
    if(turtle.x < - 125){
        UpdateSpin(turtle, turtle.y_dir, false);
        turtle.x_dir = 1;

    }
    // right boundry
    else if(turtle.x > $window.width() - 400){
        UpdateSpin(turtle, turtle.y_dir, true);
        turtle.x_dir = -1;
    }
}

// "bounce" turtles off top and bot boundries
function BounceY (turtle){
    turtle.y = turtle.y + speed * turtle.y_dir;
    turtle.div.style.top = turtle.y + "px";

    // top boundry
    if(turtle.y < - 115){
        UpdateSpin(turtle, turtle.x_dir, true);
        turtle.y_dir = 1;

    }
    // bottom boundry
    else if( turtle.y > $window.height() - 400){
        UpdateSpin(turtle, turtle.x_dir, false);
        turtle.y_dir = -1;

    }
}

// check for turtle collisions and "bounce" them upon collision
function BounceCollusion (){
    for (var i = 0; i < turtles.length; i++){
        var t1 = turtles[i];
        console.log(i);

        for(var j = i+1; j < turtles.length; j++) {
            var t2 = turtles[j];

            var x_diff = t1.x - t2.x;
            var y_diff = t1.y - t2.y;

            if ((x_diff < 250 && x_diff > -250) && (y_diff < 250 && y_diff > -250)){
                // bounce x
                if (t1.x > t2.x){
                t1.x_dir = 1;
                t2.x_dir = -1;
                }
                else{
                    t1.x_dir = -1;
                    t2.x_dir = 1;
                }
                //bounce y
                if(t1.y > t2.y){
                    t1.y_dir = 1;
                    t2.y_dir = -1;
                }
                else{
                    t1.y_dir = -1;
                    t2.y_dir = 1;
                }

            }
        }
    }
}

function UpdateSpin (turtle, direction, top_or_right) {
    // set spin for top or right collision
    if (top_or_right) {
        if (direction > 0)
            turtle.spin -= spin_rate;
        else
            turtle.spin += spin_rate;
    }
    // set spin for bottom or left collision
    else {
        if (direction > 0)
            turtle.spin += spin_rate;
        else
            turtle.spin -= spin_rate;
    }

    //keep range limited
    if (turtle.spin > 15)
        turtle.spin = 15;
    if (turtle.spin < -15)
        turtle.spin = -15;
}

function rotate(div, deg){
    div.style.webkitTransform = 'rotate('+deg+'deg)';
    div.style.mozTransform    = 'rotate('+deg+'deg)';
    div.style.msTransform     = 'rotate('+deg+'deg)';
    div.style.oTransform      = 'rotate('+deg+'deg)';
    div.style.transform       = 'rotate('+deg+'deg)';
}
