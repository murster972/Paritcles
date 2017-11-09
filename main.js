// Inspired from "The Code Train" code challenge #78: https://www.youtube.com/watch?v=UcdigVaIYAk&index=113&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH

var w = window.innerWidth;
var h = window.innerHeight;
var particles;

var mouse_pos;

function setup(){
    createCanvas(w, h);

    mouse_pos = createVector(-99999, -99999);

    p_group = createParticleGroup(10);

    particles = p_group;

    //particles.push(new Particle());
}

function draw(){
    background(0);

    for(let i = particles.length - 1; i >= 0; i--){
        particles[i].update(mouse_pos.x, mouse_pos.y);
        particles[i].show();
    }
}

function mouseMoved(){
    mouse_pos.x = mouseX;
    mouse_pos.y = mouseY;
}

//returns an array containgin n grouped particles
function createParticleGroup(n){
    var p = [];
    var size = 10;
    var spacing = size + 10;

    var grid_size = spacing * n;
    var start = {x: (window.innerWidth - grid_size) / 2, y: (window.innerHeight - grid_size) / 2}
    var pos = createVector(start.x, start.y);

    for(var col = 0; col < n; col++){
        for(var row = 0; row < n; row++){
            p.push(new Particle(pos.x, pos.y, size));
            pos.x += spacing;
        }
        pos.y += spacing;
        pos.x = start.x;
    }

    return p
}


function Particle(x, y, d){
    this.pos = createVector(x, y);
    this.diameter = d;
    this.vel = {v: 0, h: 0};

    this.show = function(){
        //noStroke();
        stroke(255);
        fill(255, this.alpha);
        ellipse(this.pos.x, this.pos.y, this.diameter);
    }

    this.update = function(x, y){
        //mouse not touching else touching particle
        if(x < this.pos.x && x > this.pos.x + this.diameter) return 0;
        else this.applyForce(x, y);
    }

    //will push particle away from mouse in approp direction
    //and eventually will have a chain affect on the particles surruonding it
    this.applyForce = function(x, y){
        //checks if mouse is at left or right of particle
        x_side = (x <= this.pos.x + (this.diameter / 2)) ? "left" : "right";

        //checks if mouse is at top or bottom of particle
        y_side = (y <= this.pos.y + (this.diameter / 2)) ? "top" : "bottom";

    }
}
