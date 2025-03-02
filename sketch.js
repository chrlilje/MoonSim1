
let moon;
let gemini;
let trackDots = [];

function setup() {
  createCanvas(1400, 1200);
  moon  = new Planet(700, 500, 30, 100, "assets/moon.png");
  moon.preload();
  moon.resize(moon.r, moon.r);

  gemini = new Spaceship(700, 250, 40, 10, 1, -0.9, 0);
  angleMode(DEGREES);

  //Setup a settimeout function to create track dots
  let interval = setInterval(() => {
    trackDots.push(new trackDot(gemini.x, gemini.y, 5));
    // remove the first element of the array if it is too long
    if(trackDots.length > 64) {
      trackDots.shift();
    }
  }, 1000);
}

function draw() {
  background(220);

  moon.update();
  drawPlanet(moon);

  gemini.update();
  drawSpaceship(gemini);

  gravitationalPull(moon, gemini);

  // Draw the track dots
  for(let dots of trackDots) {
    ellipse(dots.x, dots.y, dots.r, dots.r);
  }
}



class trackDot {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

}

class Spaceship {
  constructor(x, y, w, h, m, vx, vy) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.m = m;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

class Planet {
  constructor(x, y, r, m, imglink) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.m = m;
    this.imglink = imglink;
    this.img = null;
    this.rotation = 0;
  }

  preload() {
    this.img = loadImage(this.imglink);
  }
  resize(x, y) {
   this.img.resize(x, y);
  }
  update() {
    this.rotation += 0.001*deltaTime;
  }
}

// Make a function that uses the gravitational pull from the planet to change the vx and vy of the spaceship
// Use M*G = k and substitute

function gravitationalPull(planet, spaceship) {
  let r = dist(spaceship.x, spaceship.y, planet.x, planet.y);

  let k = 9; // Gravitational constant times the mass of the planet
  line(spaceship.x, spaceship.y, planet.x, planet.y);
 
  // Calculate the angle of the vector between the spaceship and the planet

  let angle = atan2(planet.y - spaceship.y, planet.x-spaceship.x); 

  let dVx = deltaTime*cos(angle)*k/(r*r);
  let dVy = deltaTime*sin(angle)*k/(r*r);

  spaceship.vx += dVx;
  spaceship.vy += dVy;
  // Dump out some values to see what is happening  
  textSize(20);
  text("Distange: " + r.toFixed(1), 10, 40);
  text("angle: " + angle.toFixed(1), 10, 70);
  // calculate the combined velocity of the spaceship
  let v = sqrt(spaceship.vx*spaceship.vx + spaceship.vy*spaceship.vy);
  text("Velocity: " + v.toFixed(3), 10, 100);

}

function drawSpaceship(spaceship) {

  // Rotate the spaceship to the direction it is moving
  let angle = atan2(spaceship.vy, spaceship.vx);

  push();
  translate(spaceship.x, spaceship.y);
  rotate(angle);
  fill(0);
  rectMode(CENTER);
  rect(-spaceship.w/2, 0,spaceship.w , spaceship.h);
  pop();
}


function drawPlanet(planet) {
  push();
  translate(planet.x, planet.y);
  rotate(planet.rotation);
  imageMode(CENTER);
  image(planet.img, 0,0);
  // Center dot
  fill(0);
  ellipse(0,0, 5, 5);
  pop();
}