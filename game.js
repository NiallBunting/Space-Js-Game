var updateobjects = [];

function start(){
	//canvas set up	
	canv=document.getElementById("mycan");
	ctx=mycan.getContext("2d");	
	ctx.font="20px Georgia";
	updateobjects[updateobjects.length] = ship.create();
	updateobjects[updateobjects.length] = planet.create(0, 0, 20000000000, 40000);
	//updateobjects[updateobjects.length] = planet.create(100000, 100000, 2000000, 30000);
	var myforce = 1700;
	updateobjects[0].physical.addforce(myforce, 0);
	updateobjects[0].update(1);
	var d = new Date();
	oldtime = d.getTime();
	requestAnimationFrame(paint);
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

	//clear the screen
	ctx.clearRect(0, 0, canv.width, canv.height);
	//gravity and collisions
	for(i = 0; i < updateobjects.length; i++) {
		for(j = 0; j < updateobjects.length; j++) {
    			if(i == j){continue;}
			updateobjects[i].physical.gravity(updateobjects[j].physical);
			updateobjects[i].collided(updateobjects[j].physical);
		}
	}


	var d = new Date();
	var newtime = d.getTime();
	var updatetime = (newtime - oldtime)/100;
	updatetime = (updatetime > MAX_TIME_OUT) ? MAX_TIME_OUT : updatetime;

	//Update all the objects
	for(i = 0; i < updateobjects.length; i++) {
		updateobjects[i].update(updatetime);
	}

	oldtime = newtime;

	//Draw all the objects
	for(i = updateobjects.length - 1; i >= 0; i--) {
		updateobjects[i].draw();
	}
	map.line(updateobjects[1]);
	
	//Toggles map, if pressed
	map.draw();
	
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
	//console.log(event);
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
		if(!this.pressed()){return;}
		
		//remember the previous screen
		this.p_screenx = screen.x;
		this.p_screeny = screen.y;

		//draw the title
		ctx.clearRect(0, 0, canv.width, canv.height);
		ctx.fillText("Map.",50,50);
		//scale out
		ctx.scale(1/this.p_factor, 1/this.p_factor);

		//setup the screen x and y with offset
		screen.x = (canv.width*this.p_factor)/2 + this.p_offsetx;
		screen.y = (canv.height*this.p_factor)/2 + this.p_offsety;

		//draw the planets
		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		ctx.arc(updateobjects[0].physical.getx() + screen.x, updateobjects[0].physical.gety() + screen.y, (3 * this.p_factor), 0, 2 * Math.PI);
		ctx.fill();

		for(i = updateobjects.length - 1; i >= 0; i--) {
			updateobjects[i].draw();
		}
		
		this.estimatedpath(0);
		
		ctx.scale(this.p_factor, this.p_factor);

		//put the offset back
		screen.x = this.p_screenx;
		screen.y = this.p_screeny;
		
	},
	
	//To draw the path the object will take
	estimatedpath: function (objnum) {
		var estimateobj = updateobjects[objnum].physical.clone();
		
		//estimateobj.update(0.01);
		
		for(i = 100; i < 500; i++){
			for(j = 0; j < updateobjects.length; j++) {
    			if(j === objnum){continue;}
				estimateobj.gravity(updateobjects[j].physical);
			}
			
			estimateobj.update(1);
			
			ctx.strokeStyle= '#' + i;
			ctx.beginPath();
				ctx.arc(estimateobj.getx() + screen.x, estimateobj.gety() + screen.y, (3 * 1000), 0, 2 * Math.PI);
				//ctx.lineWidth = 1500;
				//ctx.moveTo(estimateobj.getx() + screen.x, estimateobj.gety() + screen.y);
				//ctx.lineTo(0 + screen.x, 0 + screen.y);
				//console.log(estimateobj.p_py + screen.y + " " + estimateobj.gety() + screen.y);
			ctx.fill();
		}
	},

	left: function () {
		this.p_offsetx += this.p_factor * 2;
	},

	right: function () {
		this.p_offsetx -= this.p_factor * 2;
	},

	up: function () {
		this.p_offsety += this.p_factor * 2;
	},

	down: function () {
		this.p_offsety -= this.p_factor * 2;
	},

	mousewheelin: function () {
		this.p_factor -= 100;
		if(this.p_factor < 200){this.p_factor = 200;}
	},

	mousewheelout: function () {
		this.p_factor += 100;
		if(this.p_factor > 10000){this.p_factor = 10000;}
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
