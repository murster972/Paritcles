// Inspired from "The Code Train" code challenge #78: https://www.youtube.com/watch?v=UcdigVaIYAk&index=113&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH

var w = window.innerWidth;
var h = window.innerHeight;
var particles;

var mouse_pos;

var test_intersect = {};

function setup(){
    createCanvas(w, h);

    mouse_pos = createVector(-99999, -99999);

    p_group = createParticleGroup(5);

    particles = p_group;

    //particles = [new Particle(50, 50, 40, 1)];
}

function draw(){
    background(0);

    for(let i = particles.length - 1; i >= 0; i--){
        particles[i].update(mouse_pos.x, mouse_pos.y);
        particles[i].atWall();
        particles[i].collision();
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
    var size = 80;
    var spacing = size + 10;

    var grid_size = spacing * n;
    var start = {x: (window.innerWidth - grid_size) / 2, y: (window.innerHeight - grid_size) / 2}
    var pos = createVector(start.x, start.y);

    for(var col = 0, id=0; col < n; col++){
        for(var row = 0; row < n; row++, id++){
            p.push(new Particle(pos.x, pos.y, size, id));
            pos.x += spacing;
            test_intersect[id] = [];
        }
        pos.y += spacing;
        pos.x = start.x;
    }

    return p
}


function Particle(x, y, d, id){
    this.pos = createVector(x, y);
    this.diameter = d;
    this.radius = d / 2;

    this.id = id;

    //velocity of particle
    this.vel = {v: 0, h: 0};

    //force
    this.force = {repulse: 3, slow_down: 0.05};

    //acc of particle
    this.acc = {v: 0, h: 0};
    this.prev_vel = {v: NaN, h: NaN};

    this.alpha = 200;

    this.show = function(){
        noStroke();

        if(this.vel.v == 0 && this.vel.h == 0){
            fill(255, this.alpha);
        }
        else{
            fill(255, 0, 0, this.alpha);
        }

        ellipse(this.pos.x, this.pos.y, this.diameter);
    }

    this.update = function(x, y){
        //mouse not touching else touching particle
        if((x >= this.pos.x - this.radius && x <= this.pos.x + this.radius) &&
           (y >= this.pos.y - this.radius && y <= this.pos.y + this.radius)){
            this.applyForce(x, y);
        }
        else{
            if((this.prev_vel.v >= 0 && this.vel.v < 0) || (this.prev_vel.v <= 0 && this.vel.v > 0)){
                this.acc.v = 0;
                this.vel.v = 0;
            }
            if((this.prev_vel.h >= 0 && this.vel.h < 0) || (this.prev_vel.h <= 0 && this.vel.h > 0)){
                this.acc.h = 0;
                this.vel.h = 0;
            }
        }


        this.pos.x += this.vel.h;
        this.pos.y += this.vel.v;

        this.pos.x = constrain(this.pos.x, 0 + this.radius, w - this.radius);
        this.pos.y = constrain(this.pos.y, 0 + this.radius, h - this.radius);

        this.prev_vel = {v: this.vel.v, h: this.vel.h};

        this.vel.v += this.acc.v;
        this.vel.h += this.acc.h;
    }

    //checks if collision with another pixel, i.e. if two circles intercept
    this.collision = function(){
        for(var i = 0; i < particles.length; i++){
            if(particles[i].id == this.id) continue;
            //https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
            var p1 = this.pos;
            var p0 = particles[i].pos;

            //distance between p0 and p1 (center of circles)
            var d = sqrt(sq(p1.x - p0.x) + sq(p1.y - p0.y));

            //no intersection between the two particles
            if(d > particles[i].radius + this.radius || d < abs(particles[i].radius - this.radius)){

            }
            else{
                this.resetForces();
                this.applyForce(particles[i].pos.x, particles[i].pos.y);
                //console.log(1);
            }
        }
    }

    this.resetForces = function(){
        this.acc = {h: 0, v: 0};
        this.vel = {h: 0, v: 0};
        this.prev_vel = {v: NaN, h: NaN};
    }

    this.atWall = function(){
        //NOTE: this is an AWFUL way todo this and is NOT final
        if(this.pos.x == 0 + this.radius){
            this.resetForces();
            if(this.pos.y == 0 + this.radius) this.applyForce(0, 0);
            else if(this.pos.y == h - this.radius) this.applyForce(0, h);
            else this.applyForce(0, this.pos.y);
        }
        else if(this.pos.x == w - this.radius){
            this.resetForces();
            if(this.pos.y == 0 + this.radius) this.applyForce(w, 0);
            else if(this.pos.y == h - this.radius) this.applyForce(w, h);
            else this.applyForce(w, this.pos.y);
        }
        else if(this.pos.y == 0 + this.radius){
            this.resetForces();
            if(this.pos.x == 0 + this.radius) this.applyForce(0, 0);
            else if(this.pos.x == w - this.radius) this.applyForce(w, 0);
            else this.applyForce(this.pos.x, 0);
        }
        else if(this.pos.y == h - this.radius){
            this.resetForces();
            if(this.pos.x == 0 + this.radius) this.applyForce(0, h);
            else if(this.pos.x == w - this.radius) this.applyForce(w, h);
            else this.applyForce(this.pos.x, h);
        }
    }

    //will push particle away from mouse in approp direction
    //and eventually will have a chain affect on the particles surruonding it
    //NOTE: lookup gravitional attraction and repulation formulas and this video
    //      https://www.youtube.com/watch?v=OAcXnzRNiCY&list=PLRqwX-V7Uu6ZiZxtDDRCi6uhfTH4FilpH&index=73
    this.applyForce = function(x, y){
        //checks if mouse is at left or right of particle
        this.vel.h = (x < this.pos.x) ? this.force.repulse : -this.force.repulse;
        this.acc.h = (x < this.pos.x) ? -this.force.slow_down : this.force.slow_down;

        if(x == this.pos.x){
            this.vel.h = 0;
            this.acc.h = 0
        }

        //checks if mouse is at top or bottom of particle
        this.vel.v = (y < this.pos.y) ? this.force.repulse : -this.force.repulse;
        this.acc.v = (y < this.pos.y) ? -this.force.slow_down : this.force.slow_down;

        if(y == this.pos.y){
            this.vel.v = 0;
            this.acc.v = 0
        }
    }
}
