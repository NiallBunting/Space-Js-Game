var canv;
var ctx;

var myship;
var myplanet;

var screen = {};
screen.x = 100;
screen.y = 100;

function start(){
	//canvas set up	
	canv=document.getElementById("mycan");
	ctx=mycan.getContext("2d");	
	myship = ship.create();
	myplanet = planet.create();
	requestAnimationFrame(paint);
}



function paint(){
	//clear
	ctx.clearRect(0, 0, canv.width, canv.height);
	//gravity
	myship.physical.gravity(myplanet.physical);
	//collide
	myship.physical.collided(myplanet.physical);
	//update
	myship.physical.update(1);	
	//draw
	myship.draw();
	myplanet.draw();
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

  keys[keyCode] = event.type == 'keydown';

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
}
