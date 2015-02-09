var canv;
var ctx;

var myship;
var myplanet;

var screen = {
	x: 0,
	y: 0
};

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
	myship.physical.addforce(-1, 0);
  }

//right
  if(keys[38] == true){
	myship.physical.addforce(0, -1);
  }

//up
  if(keys[39] == true){
	myship.physical.addforce(1, 0);
  }

//down
  if(keys[40] == true){
	myship.physical.addforce(0, 1);
  }
}
