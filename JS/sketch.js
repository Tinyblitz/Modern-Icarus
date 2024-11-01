// Check the Readme File

var mode;
var needInput = true;

var timer = 0;
var timeTracker;
var timeLimit = 20;   // in seconds

var button;

// Variables for player character
var player;
var pairWings;
var wingLFrames = []
var wingRFrames = []
const wingCap = 5;

var hubrisMeter = 0;

var x_pos;
var y_pos;
var p_size = 40;

// Variables for main text
var tSize = 30;
var fade;
var fadeAmount = 1;
var textX, textY;

// Variables for hiddenWords
var hWords = [];
var hidSize = 15;

// Variables for SavedWords
var textCircles = [];
var numCirclesFilled = -1;
var sWords = [];

// Variables for FlyWords
var flySize = 20;
var numFlyWords = 8;
var flyWordHolder = [];

// Sounds
var quake;
var wind;
var bubble;
var splash;

// Ripple Effect variables
let cols;
let rows;
let current; // = new float[cols][rows];
let previous; // = new float[cols][rows];

let dampening = 0.99;


var lerpVal = 0;

// Variables for sky background
var skyBG;
var skyBG1_X, skyBG2_X;
var tintNum = -1;
var bgSpeed = 2;
var skyScale = 1;
var skySun;

// Variables for sea background
var seaBG;
var fadeBG = 255;
var initSeaTextY;
var sTextY;

// Stored sentences - Blanks are transitions
var curSentence = 0;
var sentences = [
  // Intro Scene - curSentence = 0
  " ",
  "I magine Icarus",
  "C reatively \n carving his dream",
  "A lways \n out of reach",
  "R idges as strong \n as his beliefs, lays",
  "U nderneath \n an innocent soul",
  "S tranded \n in a fantasy",
  
  // Prison Scene - curSentence = 7
  "Icarus had swum away, \n coming at last to the city",
  "Where he rented a house \n and tended the garden",
  "Never dreaming \n that the gray, \n respectable suit",
  "Concealed arms that \n could control huge wings",
  "Those sad, defeated eyes \n had once compelled the sun",
  "Nightly Icarus \n probes his wound",
  "Daily in his workshop, \n curtains carefully drawn",
  "Constructs small wings \n and tries to fly",
  
  // Sky Scene - curSentence = 15
  " ",
  "Flying towards the heavens \n Embellishing the sky with pearl like wings \n Caressing Icarus, soaring passionately. \n His own hero in his eyes",
  "Grow your wings of freedom \n Escape from this labyrinth of loneliness and fatigue \n To be freed from the life you are locked in",
  "But never forget \n your father's words",
  "What Do You Wish to Improve?",
  "Icarus, \n full of newfound determination, \n decides to focus on improving his \n",
  "What Can You Live Without?",
  "Icarus, \n in order to focus on his new goals, \n decides to drop from his life his \n",
  "Are You Satisfied?",
  
  // Sun Scene - curSentence = 24
  "Wings so mighty and beautiful",
  "What I would do to fly so high",
  "To soar above the clouds",
  "...and meet the beautiful rays",
  
  // Falling - curSentence = 28
  "With melting wax \n and loosened strings",
  "Sunk hapless Icarus \n on unfaithful wings",
  "Headlong he \n rushed through \n the affrighted air",
  "With limbs distorted \n and \n dishevelled hair",
  
  // Ocean Scene - curSentence = 32
  "His scattered plumage \n danced upon the wave",
  "And sorrowing Nereids \n decked his watery grave",
  "O'er his pale corse \n their pearly sea-flowers shed",
  "And strewed \n with crimson moss \n his marble bed",
  "Struck in \n their coral towers \n the passing bell",
  "And wide in ocean \n tolled his echoing knell",
  
  // Bad Ending - curSentence = 38
  "You are a foolish one",
  "Excessive ambition \n never makes it to see \n the light of day",
  "You had too much \n hope in yourself",
  "Your pride took you away \n\n\n Bad Ending",
  
  // Good Ending - curSentence = 42
  "Icarus, \n remembers those wings may break",
  "Shining boyishly, \n coming close to all those stars \n like stage lights",
  "After aching and fading \n in the dark",
  "Seeing the sun \n for the first time \n and it is all he want",
  "but even the brightest \n and prettiest of lights \n can burn him out",
  "Icarus, \n remembers the world beneath", 
  "And the love \n that the earth has given \n him all these years",
  "Flies back down...",
  " "
];

// Hidden words for prison scene
var prisonWords = [
  "His father once told him, \"Don’t fly too high!\"",
  "That nice Mr. Hicks \n the neighbors called him",
  "What was he doing \n aging in a suburb?",
  "Can the genius \n of the hero fall",
  "To the middling stature \n of the merely talented?",
  "But now rides \n commuter trains",
  "Serves on \n various committees"
];

// Stored words for sky scene
// Point distribution for hubris meter
// 1-3 : 1 point
// 4-6 : 2 points
// 7-8 : 3 points
var skyWords1 = [
  "Health",
  "Knowledge",
  "Habits",
  "Career",
  "House",
  "Car",
  "Lust",
  "Kill Count"
];

var skyWords2 = [
  "Money",
  "Dreams",
  "Negativity",
  "Love",
  "Rules",
  "Honesty",
  "Family",
  "Friends"
];

var skyWords3 = [
  "more",
  "more",
  "more",
  "more",
  "more",
  "more",
  "M O R E",
  "MORE"
];

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  
  textAlign(CENTER);
  textFont("Verdana");
  fade = 0;
  
  button = createButton('Begin');
  button.center();
  
  mode = 0;
  
  // Testing
  //mode = 1;
  //curSentence = 2;
  //mode = 2;
  //mode = 3;
  //curSentence = 24;
  //mode = 4;
  //curSentence = 28;
  
  //needInput = false;
  //button.hide();
  
  // Player variables
  x_pos = width/2;
  y_pos = 3*height/4;
  player = new Player(x_pos, y_pos, p_size, 0.90, 8.0, 0.1);
  
  // Ripple Effect Variables
  cols = width;
  rows = height;
  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  
  // Set hidden words
  for (let i = 0; i < prisonWords.length; i++){
    if (i == 0) hWords.push(new hiddenWord(width/2, height*0.85, prisonWords[i]));
    else if (i < 4) hWords.push(new hiddenWord(width/4, height*0.25*i, prisonWords[i]));
    else hWords.push(new hiddenWord(3*width/4, height*0.25*(i-3), prisonWords[i]));
  }
  
  // Load Images
  
  // Wings
  pairWings = loadImage('Images/wings/pairWings.png');
  for (let i = 0; i < wingCap; i++){ wingLFrames[i] = loadImage("Images/wings/wingL" + nf(i) + ".png"); }
  for (let i = 0; i < wingCap; i++){ wingRFrames[i] = loadImage("Images/wings/wingR" + nf(i) + ".png"); }
  
  // Backgrounds
  skyBG = loadImage('Images/sky_bg.jpg');
  skyBG1_X = 0;
  skyBG2_X = windowWidth;
  skySun = loadImage('Images/sky_sun.jpg');
  seaBG = loadImage('Images/seafloor.png');
  
  initSeaTextY = height*0.6;
  sTextY = initSeaTextY;
  
  // Load Sounds
  quake = loadSound('Sounds/quake.mp3');
  wind = loadSound('Sounds/wind.mp3');
  bubble = loadSound('Sounds/Bubble.mp3');
  splash = loadSound('Sounds/Splash.mp3');
}

function draw() {
  
  if (curSentence == 0) mode = 0;
  else if (curSentence < 15) mode = 1;
  else if (curSentence < 24) mode = 2;
  else if (curSentence < 28) mode = 3;
  else if (curSentence < 42) mode = 4;
  else mode = 5;
  
  switch(mode){
      
    //////////////////////////////////~~~ Intro Scene ~~~///////////////////////////////////////
    case 0:
      background(0);

      fill(255);
      textSize(tSize);
      textStyle(BOLD);
      text("Modern Day Icarus", width/2, height/4);
      
      textSize(tSize - 15);
      textStyle(ITALIC)
      text("An interactive poem", width/2, height/4 + tSize);
      
      textStyle(NORMAL)
      text("Controls \n Drag with Mouse ---> MOVE \n Spacebar ---> SKIP \n R key ---> RESTART", width/2, 3*height/4);
      
      button.mousePressed(startGame);
      break;
    
    /////////////////////////////////~~~ Prison Scene ~~~/////////////////////////////////////
    case 1:
      background(0);
  
      // After Introduction
      if (curSentence > 6){
        if (curSentence > 7){
          rippleEffect();
          
          // Display hidden words
          hWords.forEach(function(hW){
            hW.update();
            hW.display();
          });
        }
        player.update();
        player.display();
      }
      
      // Transition point to sky scene - player must grab the wings
      if (curSentence == 14){
        
        image(pairWings, width/2 - 150/2, height/2 - 80, 150, 75);
        
        let disX = width/2 - mouseX;
	    let disY = height/2 - mouseY;
	    let dis = createVector(disX, disY);
	    if (dis.mag() < player.size / 2 && player.over) {
          needInput = false;
          fade = -1;
          quake.play();
          player.wingsActive = true;
        }
        else needInput = true;
      }
      fill(255, 255, 255, fade);
      textStyle(NORMAL);
      textSize(tSize);
      
      text(sentences[curSentence], width/2, height/4);
      break;
    
    //////////////////////////////~~~ Sky Scene ~~~//////////////////////////////////////
    case 2:
      //print(hubrisMeter);
      
      // Start with shaking transition
      if (tintNum != 255) cantClick = 1;
      else cantClick = 0; 
    
      // The shaking
      if (tintNum == -1){
        background (lerpColor(color(40), color(135, 206, 235), lerpVal));
        lerpVal += 0.01;
        
        // Actions to signify end of shaking
        if (lerpVal >= 1.0){ 
          tintNum = 0; 
          lerpVal = 0;
          quake.stop();
          wind.loop();
          
          player.changeToNorm();
        }
        translate (random(-5,5), random(-5,5));
      }
      
      // After transition
      else {
        tint(255,tintNum);
    
        if (tintNum < 255){ tintNum += 1; }
        else{ tintNum = 255; }
        
        // Moving sky background to simulate flying
        image(skyBG, skyBG1_X, 0, width, height);
        image(skyBG, skyBG2_X, 0, width, height);
        
        // Backgrounds reset off screen to create a loop
        if (skyBG1_X <= -width){ skyBG1_X = width; }
        else{ skyBG1_X -= bgSpeed; }
    
        if (skyBG2_X <= -width){ skyBG2_X = width; }
        else{ skyBG2_X -= bgSpeed; }
        
        // Mad Lib Mode
        let isReading = true;
        if (numCirclesFilled != -1) isReading = false;
        
        if (!isReading){
          fade = 255;
          
          stroke(0);
          // Display circles at bottom that hold the collected text
          for (let i = 0; i < 3; i++){ textCircles[i].display(); }
          noStroke();
          
          // Display flying words
          flyWordHolder.forEach(function(fW) {
            fW.update();
            fW.display();
          });
          
          // 20 Second Timer - progress automatically when time is up
          if (curSentence == 23){
            if (timeTracker != second()) {
              timer++
              timeTracker = second();
            }
            if (timer >= timeLimit) numCirclesFilled = 3;
          }
          
          if (numCirclesFilled >= 3){
            numCirclesFilled = -1;
            fade = -1;
            sWords = [];
            
            if (curSentence != 23){
              textCircles.forEach(function(tC) {
                sWords.push(tC.textHolder);              
              });
            }
            else wind.stop();
          }
        }
        
        // Reading Mode
        else {
          
          // Switch to Mad Lib Mode
          if (curSentence == 19 || curSentence == 21 || curSentence == 23){
            fade = 0;
            numCirclesFilled = 0;
            
            for (let i = 0; i < 3; i++){
              textCircles[i] = new SavedWord(width/2 - 60 + i*60, height*0.9);
            }
            
            // Settting up the flying words
            let orderHolder;
            
            flyWordHolder = [];
            
            // Need to reset skywords
            // Round 1
            if (curSentence == 19){
              orderHolder = orderRandomizer(skyWords1.length);
              for (let i = 0; i < orderHolder.length; i++){
            
                let n = orderHolder[i];
                let p = 0;
                if (n < 3) p = 1;
                else if (n < 6) p = 2;
                else p = 3;
            
                x_ran = width + width*(i+1)*random(0.23, 0.28);
                y_ran = random(0.1*height, 0.91*height);
            
                flyWordHolder.push(new FlyingWord(x_ran, y_ran, p, skyWords1[n]));
              }
            }
            // Round 2
            if (curSentence == 21){
              orderHolder = orderRandomizer(skyWords2.length);
              for (let i = 0; i < orderHolder.length; i++){
            
                let n = orderHolder[i];
                let p = 0;
                if (n < 3) p = 1;
                else if (n < 6) p = 2;
                else p = 3;
            
                x_ran = width + width*(i+1)*random(0.23, 0.28);
                y_ran = random(0.1*height, 0.91*height);
            
                flyWordHolder.push(new FlyingWord(x_ran, y_ran, p, skyWords2[n]));
              }
            }
            // Round 3
            if (curSentence == 23){
              orderHolder = orderRandomizer(skyWords3.length);
              for (let i = 0; i < orderHolder.length; i++){
            
                let n = orderHolder[i];
                
                x_ran = width + width*(i+1)*random(0.23, 0.28);
                y_ran = random(0.1*height, 0.91*height);
            
                flyWordHolder.push(new FlyingWord(x_ran, y_ran, 1.0, skyWords3[n]));
              }
            }
          }
        }
      }
      
      player.update();
      player.display();
      
      if (curSentence == 23 && fade == -1) {
        player.y_pos = y_pos;
        player.size = 20;
        player.x_pos = width/2;
        player.wingScale = 0.5;
      }
      
      fill(255, 255, 255, fade);
      textSize(30);
      textStyle(NORMAL);
      
      if (curSentence == 20 || curSentence == 22){
        let newText = sentences[curSentence] + sWords[0] + ", " + sWords[1] + ", and " + sWords[2];
        
        text(newText, width/2, height/4);
      }
      else text(sentences[curSentence], width/2, height/4);
      break;
      
    ///////////////////////////////////~~~ Sun Scene ~~~///////////////////////////////////
    case 3:
      background(0);
      image(skySun, 0, 0, width, height);
      
      player.y_pos-=0.2;
      player.display();
      
      fill(255, 255, 255, fade);
      stroke(225,225,225, fade);
      textSize(30);
      textStyle(NORMAL);
      text(sentences[curSentence], width/2, height/3);
      
      noStroke();
      
      // Transition
      if (fade < 0 && curSentence == 27){
        player.y_pos = y_pos;
        player.wingsActive = false;
        if (hubrisMeter < 10) curSentence = 41;
      }
      break;
    
    ///////////////////////////////////~~~ Bad Ending ~~~////////////////////////////////////
    case 4:
      
      // Falling
      if (curSentence < 32) {
        background(0);
        
        fill(255, 255, 255, fade);
        textSize(30);
        textStyle(NORMAL);
        text(sentences[curSentence], width/2, height/4);
      }
      
      // Ocean
      else if (curSentence < 38){
        image(seaBG, 0, 0, width, height);
        
        player.display();
        
        background(0,0,0, fadeBG);
        fadeBG--;
        if (fadeBG <= 0) fadeBG = 0;

        fill(255, 255, 255, fade);
        textSize(30);
        textStyle(NORMAL);
        text(sentences[curSentence], width/2, sTextY);
        
        // Play bubble sound everytime new text shown
        if (fade < 0)  {
          sTextY = initSeaTextY;
          bubble.play();
        }
        else sTextY -= 0.7;
      }
      
      // End
      else {
        background(0);
        fill(255, 255, 255, fade);
        textSize(30);
        textStyle(NORMAL);
        text(sentences[curSentence], width/2, height/4);
        
        if (curSentence == 41 && fade < 0) resetGame();
      }
      break;
      
    //////////////////////////////////~~~ Good Ending ~~~////////////////////////////////////////
    case 5:
      background(0);
      
      fill(255, 255, 255, fade);
      textSize(30);
      textStyle(NORMAL);
      text(sentences[curSentence], width/2, height/4);
      
      if (fade < 0 && curSentence == 50) resetGame();
      break;
  }
  
  // Fade text - when text is faded, continues to next text
  if (needInput && fadeAmount == -1) fade = 255;
  else{
    if (fade<0) { 
      curSentence = (curSentence + 1) % sentences.length;
      if (curSentence == 32) splash.play();
      
      if (curSentence == 16 || curSentence == 17 || curSentence == 20 || curSentence == 22) fadeAmount = 1;
      else fadeAmount = 2;
    }
    if (fade>255) {
      if (curSentence == 16 || curSentence == 17 || curSentence == 20 || curSentence == 22) fadeAmount = -0.5;
      else fadeAmount = -1;
    }
    fade += fadeAmount; 
  }
}

function startGame(){
  button.hide();
  fade = -1;
  needInput = false;
}

function mousePressed() { player.pressed(); }

function mouseReleased() { player.released(); }

function keyReleased(){
  if (key == " " && !needInput) {
    if (curSentence == 41 || curSentence == 50) return false;
    fade = -1;
  }
  if (key == "r") resetGame();
  return false;
}

// Player function
function Player (_x, _y, _s, _d, _m, _k_in) {
  this.x_pos = _x;
  this.y_pos= _y;
  this.size = _s;
  
  this.isSpring = true;
  
  this.wingsActive = false;
  this.wingScale = 1;
  
  // Holds the animation frames of the wings
  this.wLFrames = wingLFrames;
  this.wRFrames = wingRFrames;
  // Variables used to cycle through animation frames
  this.frameCap = wingCap;
  this.frameTracker = 1;                    
  this.frameSpeed = 6;

  this.over = false;
  this.move = false;

  // Spring simulation constants
  this.mass = _m;       // Mass
  this.k = _k_in;       // Spring constant
  this.damp = _d;       // Damping
  this.rest_posx = _x;  // Rest position X
  this.rest_posy = _y;  // Rest position Y

  // Spring simulation variables
  //float pos = 20.0; // Position
  this.velx = 0.0;   // X Velocity
  this.vely = 0.0;   // Y Velocity
  this.accel = 0;    // Acceleration
  this.force = 0;    // Force
  
  this.changeToNorm = function(){ this.isSpring = false; }
  
  this.changeToSpring = function(){ this.isSpring = true; }
  
  this.update = function() {
    
    // Free Movement
	if (this.move) {
	  this.y_pos = mouseY;
	  this.x_pos = mouseX;
	}
    
    // Spring Movement
    else if (this.isSpring) {
	this.force = -this.k * (this.y_pos - this.rest_posy);  // f=-ky
	this.accel = this.force / this.mass;                 // Set the acceleration, f=ma == a=f/m
	this.vely = this.damp * (this.vely + this.accel);         // Set the velocity
	this.y_pos = this.y_pos + this.vely;           // Updated position

	this.force = -this.k * (this.x_pos - this.rest_posx);  // f=-ky
	this.accel = this.force / this.mass;                 // Set the acceleration, f=ma == a=f/m
	this.velx = this.damp * (this.velx + this.accel);         // Set the velocity
	this.x_pos = this.x_pos + this.velx;           // Updated position
    }

	if ((this.overEvent() || this.move)) this.over = true;
	else this.over = false;
  }

  // Test to see if mouse is over player
  this.overEvent = function() {
    if (mode != 1 && mode != 2) return false;
    
	let disX = this.x_pos - mouseX;
	let disY = this.y_pos - mouseY;
	let dis = createVector(disX, disY);
	if (dis.mag() < this.size / 2 ) return true;
    else return false;
  }

  this.display = function() {
    // Chain
    switch(mode){
      case 1:
        stroke(255);
        break;
      case 2:
      case 3:
        stroke(255,255,255,30);
        break;
    }
    line(this.x_pos, this.y_pos, _x, _y);
    noStroke();
    
    // Wings
    
    if (this.wingsActive){
      let x_left;
      let x_right;
      if (this.frameTracker == 3){
        x_left = this.x_pos - 57*this.wingScale/2 - 30*this.wingScale;
        x_right = this.x_pos - 57*this.wingScale/2 + 30*this.wingScale;
      }
      else{
        x_left = this.x_pos - 57*this.wingScale/2 - 40*this.wingScale;
        x_right = this.x_pos - 57*this.wingScale/2 + 40*this.wingScale;
      }
      // Left wings
      image(this.wLFrames[this.frameTracker], x_left, this.y_pos - 150*this.wingScale/2, 57*this.wingScale, 150*this.wingScale);
    
      // Right wings
      image(this.wRFrames[this.frameTracker], x_right, this.y_pos - 150*this.wingScale/2, 57*this.wingScale, 150*this.wingScale);
    
      // Set the speed at which frames are cycled through
      if (frameCount % this.frameSpeed == 0){                     
        this.frameTracker++;
        if (this.frameTracker >= this.frameCap){ this.frameTracker = 0; }
      }
      if (this.isSpring) this.frameTracker = 1;
    }
    
    if (this.over) fill(153); 
    else fill(205);
    ellipse(this.x_pos, this.y_pos, this.size, this.size);
  }

  this.pressed = function() {
	if (this.over) this.move = true;
	else this.move = false;
  }

  this.released = function() {
	this.move = false;
  }
};

// SavedWord Function
function SavedWord(_x,_y){
  this.x_pos = _x;
  this.y_pos= _y;
  this.size = 30;
  this.textHolder = " ";
  
  // functions
  this.setText = function(_t) { this.textHolder = _t; }
  
  this.getText = function() { return this.textHolder; }
  
  this.display = function() {
    if (this.textHolder == " ") noFill();
    else fill(255, 191, 0);
    ellipse(this.x_pos, this.y_pos, this.size, this.size);
  }
};

// HiddenWord Function
function hiddenWord(_x, _y, _t){
  this.x_pos = floor(_x);
  this.y_pos = floor(_y);
  this.size = 30;
  
  this.fadeC = -1;
  this.fadeA = 0;
  
  this.active = false;
  this.over = false;
  
  this.secondTracker = second();
  this.counter = 0;
  this.ranC = floor(random(3,8));
  this.isRipple = false;
  
  this.overEvent = function() {
	let disX = this.x_pos - mouseX;
	let disY = this.y_pos - mouseY;
	let dis = createVector(disX, disY);
	if (dis.mag() < player.size / 2 && player.over) return true;
    else return false;
  }
  
  this.update = function(){
    if (this.active){
      if (this.fadeC < 0) this.fadeA = 1;
      if (this.fadeC > 255) this.fadeA = -2; 
      this.fadeC += this.fadeA;
      
      if (this.fadeC < 0) this.active = false;
    }
    
    if (this.secondTracker != second()){
      this.counter++;
      this.secondTracker = second();
    }
    
    // Time between ripples
    if (this.counter == this.ranC){
      this.counter = 0;
      this.isRipple = true;
    }
    
    if (this.overEvent()) this.over = true;
	else this.over = false;
    if (this.over) this.active = true;
  };
  
  this.display = function(){
    if (this.active){
      fill(255, 255, 255, this.fadeC);
      textStyle(NORMAL);
      textSize(hidSize); 
      text(_t, this.x_pos, this.y_pos);
    }
    else {
      if (this.isRipple) {
        previous[this.x_pos][this.y_pos] = 2500;
        this.isRipple = false;
        this.ranC = floor(random(3,8));
      }
    }
  };
};

// FlyingWord Function
function FlyingWord(_x, _y, _p, _t){
  this.x_pos = _x;
  this.y_pos = _y;
  this.pointVal = _p;
  this.textHolder = _t;
  this.active = 1;
  this.movespeed = 4;
  
  // functions
  this.getPoint = function() { return this.pointVal; }
  
  this.update = function() {
    if (!this.active) return;
    
    this.x_pos -= this.movespeed;
    if (this.x_pos <= 0) this.x_pos = width*2;
    
    if (player.over 
        && mouseX >= this.x_pos - textWidth(this.textHolder)/2 
        && mouseX <= this.x_pos + textWidth(this.textHolder)/2 
        && mouseY >= this.y_pos - 2*flySize/3 
        && mouseY <= this.y_pos + 2*flySize/3){
      for (let i = 0; i < 3; i++){
        if (textCircles[i].getText() == " "){
          textCircles[i].setText(this.textHolder);
          numCirclesFilled++;
          this.active = 0;
          hubrisMeter += this.pointVal;
          break;
        }
      }
	}
  }
  
  this.display = function() {
    if (this.active) {
      fill(0);
      textStyle(NORMAL);
      textSize(flySize); 
      text(_t, this.x_pos, this.y_pos);
    }
  }
  
};

// Returns an array including numbers 0 - a in a random order
function orderRandomizer(a){
  let finalArray = [];
  let testArray = [];
  
  for (let i = 0; i < a; i++){ testArray.push(i); }
  
  while (finalArray.length < 8){
    
    // Isolate a number in array
    let num = floor(random(0,testArray.length));
    
    // Add isolated number to empty array
    finalArray.push(testArray[num]);
    
    // Base Case: return the completed array
    if (testArray.length == 1) return finalArray;
    
    // Produce new array without isolated number
    if (num == 0) testArray = subset(testArray, 1, testArray.length - 1);
    else if (num == testArray.length - 1) testArray = subset(testArray, 0, testArray.length - 1);
    else testArray = concat(subset(testArray, 0, num), subset(testArray, num+1, testArray.length - 1 - num));
  }
}

function rippleEffect(){
  loadPixels();
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      current[i][j] =
        (previous[i - 1][j] +
          previous[i + 1][j] +
          previous[i][j - 1] +
          previous[i][j + 1]) /
          2 -
        current[i][j];
      current[i][j] = current[i][j] * dampening;
     
      let index = (i + j * cols) * 4;
      pixels[index + 0] = current[i][j];
      pixels[index + 1] = current[i][j];
      pixels[index + 2] = current[i][j];
    }
  }
  updatePixels();

  let temp = previous;
  previous = current;
  current = temp;
}

function resetGame(){
  curSentence = 0;
  button.show();
  
  // Reset player variables
  player.size = p_size;
  player.wingsActive = false;
  player.wingScale = 1;
  player.isSpring = true;
  
  // Reset sounds
  wind.stop();
  quake.stop();
  bubble.stop();
  splash.stop();
  
  // Miscellaneous
  fadeBG = 255;
  needInput = true;
  hubrisMeter = 0;
  numCirclesFilled = -1;
  lerpVal = 0;
  tintNum = -1;
  skyScale = 1;
}