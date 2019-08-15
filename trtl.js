// movement and positioning vars
var $window = $(window);
var mov_speed = 3;
var spin_rate = 0.02;
var interval_rate = 20;
var width = $window.width();
var height = $window.height();
var speed = 2;
var max_spin = 5;

// core game vars
var system_pattern = [];
var player_pattern = [];
var system_index = 0;
var player_index = 0;
var run_memory;
var tempo;
var matching = true;
var level = 0;
var started = false;
var colors = ["Red", "Yellow","Green", "Blue"];
colors = shuffle(colors);

// turtle models
var turtles = new Array(4);

//TODO: get this to work so the sound isn't so jarring
// adjust sounds
var wrong = document.getElementById("soundbuttonWrong");
wrong.volume = .2;

// turtle constructor (encapsulates model data)
function Turtle(index, div ,x ,y, x_dir, y_dir, spin, degree) {
    this.index = index;
    this.div = div;
    this.shell = div.getElementsByClassName("shell")[0];
    this.x = x
    this.y = y
    this.div.style.left = x + "px";
    this.div.style.top = y + "px";
    this.x_dir = x_dir;
    this.y_dir = y_dir;
    this.spin = spin;
    this.degree = degree;
    return this;
}

// TODO: clean up this file by moving static data to a json config file
// static data for initializing turtle models [x-cord, y-cord, x_dir, y_dir, spin, degree/heading]
var starting_positions = [ [-50, -50, -1, -1, 0, 0],
            [width - 250, height - 400, 1, 0, 0, 0],
            [-50, height - 500, 1, 1, 0, 0],
            [width - 500, 0, 1, -1, 0, 0]];

// use the static data defined above to create turtle objects
for(var i = 1; i <= turtles.length; i++){

    // set starting positions
    var pos = starting_positions[i-1];

    // get turtle div
    var div = document.getElementById("trtl" + i);

    // create turtle model
    turtles[i-1] = new Turtle(i, div, pos[0], pos[1], pos[2], pos[3], pos[4], pos[5]);

    // set colors with css
    turtles[i-1].div.getElementsByClassName("shell")[0].setAttribute("id", colors[i-1]);

    // initalize movement
    init_turtle(i-1);
}

// turn on collision detection
setInterval(BounceCollusion, (10 * interval_rate));

// add onClick function to start button
document.getElementById("startButton").setAttribute("onclick", "Start(event)");

// function that starts the game
function Start(){
    console.log("start button clicked")
    started = true;
    $("#startButton").css("pointer-events", "none");
    $(".shell").css("pointer-events", "none");
    level = 1;
    $("#displayText").html("--");
    matching = true;
    clearInterval(run_memory);
    newMemory();
    setTimeout(function() {run_memory = setInterval(playMemory, 1000);}, 500);
}

// set turtle click handler
$("div[class*='shell']").on("click", function(event) {
    if(started == false)
    {
        console.log(this.id + " clicked")
        $("#" + this.id).addClass("activated");
        setTimeout(function (id) {$("#" + id).removeClass("activated"); }, 500, this.id);
        $("#soundbutton" + this.id).get(0).play();
    }
    else if (event.which == 1) {
        console.log(this.id + " clicked")
        $("#" + this.id).addClass("activated");
        $("#soundbutton" + this.id).get(0).cloneNode().play();
        setTimeout(function (id) {$("#" + id).removeClass("activated"); }, 500, this.id);
        player_pattern.push(this.id);
        player_index++;

        for (i = 0; i < player_pattern.length; i++) {
            if (system_pattern[i] != player_pattern[i]) {
                matching = false;
            }
        }
        if (!matching) {
            $("#displayText").html("!!");
            wrong.play();
            player_pattern = [];
            system_index = 0;
            player_index = 0;
            matching = true;
            $(".shell").css("pointer-events", "none");

            // restart
            system_pattern = [];
            level = 1;
            newMemory();
            setTimeout(function() {run_memory = setInterval(playMemory, tempo);}, 1000);
        }
        else {
            if (player_index == system_index) {
                if (matching) {
                    if (level == 20) {
                        win();
                    }
                    else {
                        player_pattern = [];
                        system_index = 0;
                        player_index = 0;
                        newMemory();
                        level++;

                        switch(level) {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                                tempo = 1000;
                                break;
                            case 5:
                                tempo = 700;
                                break;
                            case 9:
                                tempo = 500;
                                break;
                            case 13:
                                tempo = 300;
                                break;
                        }
                        setTimeout(function() {run_memory = setInterval(playMemory, tempo);}, 1000);
                        $(".shell").css("pointer-events", "none");
                    }
                }
            }
        }
    }
});




// set turtle into motion
function init_turtle(x){

    setInterval(BounceX, (2 * interval_rate), turtles[x]);
    setInterval(BounceY, (2 * interval_rate), turtles[x]);
}

// "bounce" turtles off left and right boundries
function BounceX (turtle){


    turtle.x = turtle.x + mov_speed * turtle.x_dir;

    turtle.div.style.left = turtle.x + "px";
    turtle.degree += turtle.spin;
    rotate(turtle.div, turtle.degree);

    // left boundry
    if(turtle.x < - 125){
        UpdateSpin(turtle, turtle.y_dir, false);
        turtle.x_dir = 1;

    }
    // right boundry
    else if(turtle.x > $window.width() - 375){
        UpdateSpin(turtle, turtle.y_dir, true);
        turtle.x_dir = -1;
    }
}

// "bounce" turtles off top and bot boundries
function BounceY (turtle){
    turtle.y = turtle.y + mov_speed * turtle.y_dir;
    turtle.div.style.top = turtle.y + "px";

    // top boundry
    if(turtle.y < - 135){
        UpdateSpin(turtle, turtle.x_dir, true);
        turtle.y_dir = 1;

    }
    // bottom boundry
    else if( turtle.y > $window.height() - 375){
        UpdateSpin(turtle, turtle.x_dir, false);
        turtle.y_dir = -1;
    }
}

// check for turtle collisions and "bounce" them upon collision
function BounceCollusion (){
    for (var i = 0; i < turtles.length; i++){
        var t1 = turtles[i];

        for(var j = i+1; j < turtles.length; j++) {
            var t2 = turtles[j];

            var x_diff = t1.x - t2.x;
            var y_diff = t1.y - t2.y;
            var proximity = 225;

            if ((x_diff < proximity && x_diff > -proximity) && (y_diff < proximity && y_diff > -proximity)){

                // bounce x
                if (t1.x > t2.x){
                t1.x_dir = 1;
                t2.x_dir = -1;
                AverageSpin(t1, t2);

                }
                else{
                    t1.x_dir = -1;
                    t2.x_dir = 1;
                    AverageSpin(t1, t2);

                }
                //bounce y
                if(t1.y > t2.y){
                    t1.y_dir = 1;
                    t2.y_dir = -1;
                    AverageSpin(t1, t2);
                }
                else{
                    t1.y_dir = -1;
                    t2.y_dir = 1;
                    AverageSpin(t1, t2);
                }
            }
        }
    }
}

function AverageSpin(t1, t2){

    var spin_avg = t1.rotation + t2.rotation;
    t1.roation = spin_avg / 2.0;
    t2.rotation = spin_avg / 2.0;
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
    if (turtle.spin > max_spin)
        turtle.spin = max_spin;
    if (turtle.spin < -max_spin)
        turtle.spin = -max_spin;
}

function newMemory() {
    var temp = Math.floor((Math.random() * 4) + 1);
    switch(temp) {
        case 1:
            system_pattern.push("Green");
            break;
        case 2:
            system_pattern.push("Red");
            break;
        case 3:
            system_pattern.push("Yellow");
            break;
        case 4:
            system_pattern.push("Blue");
            break;
    }
}

// display the pattern
function playMemory() {
    $("#displayText").html(level);
    tempColor = system_pattern[system_index];
    $("#soundbutton" + tempColor).get(0).play();
    $("#" + tempColor).addClass("activated");
    setTimeout(function(id) {$("#" + id).removeClass("activated");}, 300, tempColor);
    system_index++;
    if (system_index == system_pattern.length) {
        clearInterval(run_memory);
        $(".shell").css("pointer-events", "auto");
    }
}

function rotate(div, deg){
    div.style.webkitTransform = 'rotate('+deg+'deg)';
    div.style.mozTransform    = 'rotate('+deg+'deg)';
    div.style.msTransform     = 'rotate('+deg+'deg)';
    div.style.oTransform      = 'rotate('+deg+'deg)';
    div.style.transform       = 'rotate('+deg+'deg)';
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
