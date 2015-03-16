var updateobjects = [];
var playerui;

function start(){
	//canvas set up	
	canv=document.getElementById("mycan");
	ctx=mycan.getContext("2d");	
	ctx.font="20px Georgia";
	updateobjects[updateobjects.length] = ship.create();
	playerui = playerdisplay.create();
	createplanets();
	var d = new Date();
	oldtime = d.getTime(); 
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();
	requestAnimationFrame(paint);
}

//http://stackoverflow.com/questions/4288253/html5-canvas-100-width-height-of-viewport
    function resizeCanvas() {
            canv.width = window.innerWidth;
            canv.height = window.innerHeight;
    }
    
function createplanets(){
		updateobjects[updateobjects.length] = planet.create(0, 0, 63000000000000, 160000, 'FFFF00');		
		updateobjects[updateobjects.length] = planet.create(0, 3000000, 3700000000, 74000, '787878');
		updateobjects[updateobjects.length] = planet.create(0, 8321000, 4700000000, 77000, 'CC0000');
		updateobjects[updateobjects.length] = planet.create(0, 12721000, 7000000000, 50000, 'CC3300');
		updateobjects[updateobjects.length] = planet.create(0, 14942000, 4100000000, 96000, '787878');	
		updateobjects[updateobjects.length] = planet.create(0, 17530000, 1200000000, 52000, '00CC00');
		updateobjects[updateobjects.length] = planet.create(0, 18900000, 600000000, 43000, '0066FF');
		for(i = 2; i < updateobjects.length; i++) {
			updateobjects[i].orbit(updateobjects[1]);
		}
		
		updateobjects[updateobjects.length] = shipai.create(updateobjects[0]);
}

function update(){

	var d = new Date();
	var newtime = d.getTime();
	var updatetime = (newtime - oldtime)/100;
	updatetime = (updatetime > MAX_TIME_OUT) ? MAX_TIME_OUT : updatetime;

	//gravity and collisions
	for(i = 0; i < updateobjects.length; i++) {
		for(j = 0; j < updateobjects.length; j++) {
    			if(i == j){continue;}
			updateobjects[i].physical.gravity(updateobjects[j].physical, updatetime, 1);
			updateobjects[i].collided(updateobjects[j].physical, updatetime);
		}
	}

	//Update all the objects
	for(i = 0; i < updateobjects.length; i++) {
		updateobjects[i].update(updatetime);
	}

	oldtime = newtime;
}



function paint(){
	//left
	  if(keys[37] == true){
		if(map.ismapopen()){map.left();}
		else{updateobjects[0].left();}
	  }

	//right
	  if(keys[39] == true){
		if(map.ismapopen()){map.right();}
		else{updateobjects[0].right();}
	  }

	//up
	  if(keys[38] == true){
		if(map.ismapopen()){map.up();}
		else{updateobjects[0].up();}
	  }

	//down
	  if(keys[40] == true){
		if(map.ismapopen()){map.down();}
		else{updateobjects[0].down();}
	  }


	//Toggles map, if pressed
	if(map.draw() != false){requestAnimationFrame(paint); return;}

	update();

	//clear the screen
	ctx.clearRect(0, 0, canv.width, canv.height);
	
	updateobjects[0].updatescreen();
	
	//Draw all the objects
	for(i = updateobjects.length - 1; i >= 0; i--) {
		updateobjects[i].draw();
	}

	if(playerui.gettarget() != null){map.line(updateobjects[playerui.gettarget()])};
	

	requestAnimationFrame(paint);

}


// for multiple keys: http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once

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

document.onmousewheel = function(event) {
	if(map.ismapopen()){
		//up	
		if(event.deltaY < 0){
			map.mousewheelin();
		}

		//down	
		if(event.deltaY > 0){
			map.mousewheelout();
		}
	}
}

document.onmousemove = function(event) {

var bounding_box=canv.getBoundingClientRect();
mouseplace.x =(event.clientX - bounding_box.left) * (canv.width/bounding_box.width);        
mouseplace.y =(event.clientY - bounding_box.top) * (canv.height/bounding_box.height); 

}

var map = {
	p_screenx:0,
	p_screeny:0,
	p_factor:3000,
	p_previouspress: 0,
	p_open:0,
	p_offsetx: 0,
	p_offsety: 0,

	pressed: function() {
		if(keys[77] == true && this.p_previouspress === 0){
			if(this.p_open === 1){
				this.p_open = 0; 
				this.p_offsetx = this.p_offsety = 0;
				this.p_factor = 3000;
			}else{
				this.p_open = 1;
			}
			this.p_previouspress = 1;
		}
		if(keys[77] == false){
			this.p_previouspress = 0;
		}

		return this.p_open;
	},

	draw: function() {
		//dont draw anything if map open is 0
		if(!this.pressed()){return false;}
		
		//remember the previous screen
		this.p_screenx = screen.x;
		this.p_screeny = screen.y;

		//draw the title
		ctx.clearRect(0, 0, canv.width, canv.height);
		
		//draw the ui
		ctx.fillStyle= '#' + 'fff';		
		ctx.fillRect(0, 0, canv.width, 40);
		ctx.fillStyle= '#' + 'aaa';		
		ctx.fillRect(0, 40, canv.width, 2);
		
		ctx.fillText("Map.",20,20);
		

		
		//scale out
		ctx.scale(1/this.p_factor, 1/this.p_factor);

		//setup the screen x and y with offset
		screen.x = (canv.width*this.p_factor)/2 + this.p_offsetx;
		screen.y = (canv.height*this.p_factor)/2 + this.p_offsety;

		//Calculate the mouse
		var mouseobj = particle.create(((mouseplace.x * this.p_factor) - screen.x), ((mouseplace.y * this.p_factor) - screen.y), 0, (4 * this.p_factor));

		
		//draw the ship
		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		ctx.arc(updateobjects[0].physical.getx() + screen.x, updateobjects[0].physical.gety() + screen.y, (3 * this.p_factor), 0, 2 * Math.PI);
		ctx.fill();
		
		//draw everything
		for(i = updateobjects.length - 1; i >= 0; i--) {
			updateobjects[i].draw();
		}
		this.mouseover(mouseobj);	
		
		ctx.scale(this.p_factor, this.p_factor);

		//put the offset back
		screen.x = this.p_screenx;
		screen.y = this.p_screeny;
		
	},
	
	mouseover: function (mouseobj) {
		
		for(i = updateobjects.length - 1; i >= 0; i--) {
			if(updateobjects[i].physical.havecollided(mouseobj)){
				if(i != 0) {playerui.settarget(i);}
				else{playerui.settarget(null);}
				
				//draw mouse
				ctx.fillStyle= "rgba(0, 255, 255, 0.4)";
				ctx.beginPath();
				ctx.arc(mouseobj.getx() + screen.x, mouseobj.gety() + screen.y, mouseobj.getradius(), 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	},
	
	left: function () {
		this.p_offsetx += this.p_factor * 10;
	},

	right: function () {
		this.p_offsetx -= this.p_factor * 10;
	},

	up: function () {
		this.p_offsety += this.p_factor * 10;
	},

	down: function () {
		this.p_offsety -= this.p_factor * 10;
	},

	mousewheelin: function () {
		this.p_factor -= 100;
		if(this.p_factor < 200){this.p_factor = 200;}
	},

	mousewheelout: function () {
		this.p_factor += 100;
		if(this.p_factor > 10000000){this.p_factor = 10000000;}
	},

	ismapopen: function() {
		return this.p_open;
	},

	line: function(obj) {
		ctx.strokeStyle= '#' + '000';
		ctx.lineWidth = 1;
		ctx.beginPath();
      		ctx.moveTo(updateobjects[0].physical.getx()+ screen.x, updateobjects[0].physical.gety()+ screen.y);
      		ctx.lineTo(obj.physical.getx()+ screen.x, obj.physical.gety()+ screen.y);
		ctx.stroke();
		var dist =  Math.round(calculate_distance(updateobjects[0].physical.getx(), obj.physical.getx(), 
			updateobjects[0].physical.gety(), obj.physical.gety()) - obj.physical.getradius());
		ctx.fillText("Distance: " + dist,50,50);
	}
};

//Helper Functions
function calculate_distance(x1 , x2, y1, y2) {
		var xdist = x1 - x2;
		var ydist = y1 - y2;
		return Math.sqrt((xdist * xdist)+(ydist * ydist));
}
