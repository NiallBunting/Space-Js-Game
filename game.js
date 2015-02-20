var canv;
var ctx;

var myship;
var myplanet;

var drawobjects = {};
var updateobjects = {};

var screen = {};
screen.x = 100;
screen.y = 100;

function start(){
	//canvas set up	
	canv=document.getElementById("mycan");
	ctx=mycan.getContext("2d");	
	myship = ship.create();
	myplanet = planet.create(5000, 5000, 200000, 4000);
	requestAnimationFrame(paint);
}



function paint(){

	//left
	  if(keys[37] == true){
		myship.left();
	  }

	//right
	  if(keys[39] == true){
		myship.right();
	  }

	//up
	  if(keys[38] == true){
		myship.up();
	  }

	//down
	  if(keys[40] == true){
		myship.down();
	  }

	//clear
	ctx.clearRect(0, 0, canv.width, canv.height);
	//gravity
	myship.physical.gravity(myplanet.physical);
	//collide
	if(myship.physical.collided(myplanet.physical)){
		myship.collided();
	}
	if(myship.physical.collided(myplanet.atmosphere.physical)){
		myship.physical.applypush(0.02, 0);
	}
	//update
	myship.update(1);
	myship.physical.update(1);	
	//draw
	myplanet.draw();
	myship.draw();
	requestAnimationFrame(paint);
}


// for multiple keys: http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once
var keys = [];

document.onkeydown = document.onkeyup = function(event) {
  var keyCode; 

  if(event == null)
  {
    keyCode = window.event.keyCode; 
  }
  else 
  {
    keyCode = event.keyCode; 
  }

  keys[keyCode] = (event.type == 'keydown');

}

var minimap = {
	update: function(){
		//Gets the position all all the planets
		// Should it show near people?
	},
	
	draw: function() {
		//Draws the box and everything with it
	}
};