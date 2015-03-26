var game = {
	p_gamegrav: 6,
	p_maxtimeout: 0.2,
	p_canv: 0,
	p_ctx: 0,
	p_oldtime: 0,
	//inputdevices
	p_keys: 0,
	p_mousewheel: 0,
	p_mousepos: 0,
	
	p_player: 0,
	p_objects: 0,
	p_drawobjects: 0,
	
	init: function(){
		//Variables
		this.screen = {};
		this.screen.x = 0;
		this.screen.y = 0;
		this.p_keys = [];
		this.p_mousepos = [];
		this.p_gamegrav = C_GAME_GRAVITY;
		this.p_maxtimeout = C_MAX_TIME_OUT;
		this.p_objects = [];
		
		//Initialise Canvas, and allow canvas resizing
		this.p_canv=document.getElementById("mycan");
		this.p_ctx=this.p_canv.getContext("2d");	
		this.p_ctx.font="20px Georgia";
		window.addEventListener('resize', this.resizecanvas, false);
		this.resizecanvas();
		
		//Create time
		this.updatetime();
		
		//Creates the player and the planets
		this.createuniverse();
		
		//for(var i = 0; i < 10000; i++){
		//	this.update();
		//	this.draw();
		//}
		requestAnimationFrame(game.draw);
	},
	
	resizecanvas: function(){
		//http://stackoverflow.com/questions/4288253/html5-canvas-100-width-height-of-viewport
		game.p_canv.width = window.innerWidth;
		game.p_canv.height = window.innerHeight;
	},
	
	createuniverse: function(){
		this.p_objects[this.p_objects.length] = ship.create();
		this.p_player = this.p_objects[this.p_objects.length - 1];
		
		this.p_objects[this.p_objects.length] = planet.create(0, 0, 63000000000000, 160000, 'FFFF00');		
		this.p_objects[this.p_objects.length] = planet.create(0, 3000000, 3700000000, 74000, '787878');
		this.p_objects[this.p_objects.length] = planet.create(0, 8321000, 4700000000, 77000, 'CC0000');
		this.p_objects[this.p_objects.length] = planet.create(0, 12721000, 7000000000, 50000, 'CC3300');
		this.p_objects[this.p_objects.length] = planet.create(0, 14942000, 4100000000, 96000, '787878');	
		this.p_objects[this.p_objects.length] = planet.create(0, 17530000, 1200000000, 52000, '00CC00');
		this.p_objects[this.p_objects.length] = planet.create(0, 18900000, 600000000, 43000, '0066FF');
		for(i = 2; i < this.p_objects.length; i++) {
			this.p_objects[i].orbit(this.p_objects[1]);
		}
		
		this.p_objects[this.p_objects.length] = shipai.create(this.p_player);
		//this.p_objects[this.p_objects.length] = shipai.create(this.p_objects[this.p_objects.length - 1]);
	},
	
	update: function(){
		//checks for keypresses
		this.keypresses();
		
		//Updates the time
		var oldtime = this.gettime();
		this.updatetime();
		var updatetime = (this.gettime() - oldtime)/100;
		updatetime = (updatetime > this.p_maxtimeout) ? this.p_maxtimeout : updatetime;
		
		//Updates gravity and collisions
		for(i = 0; i < this.p_objects.length; i++) {
			for(j = 0; j < this.p_objects.length; j++) {
    			if(i == j){continue;}
				this.p_objects[i].physical.gravity(this.p_objects[j].physical, updatetime, 1);
				this.p_objects[i].collided(this.p_objects[j].physical, updatetime);
			}
		}
		
		//Updates the positions
		for(i = 0; i < this.p_objects.length; i++) {
			var val = this.p_objects[i].update(updatetime);
			if (val == 9){
				if(this.p_objects[i] == this.p_player){
					this.playerkilled();
				}
				this.p_objects.splice(i, 1);
			}
		}
		
	},
	
	draw: function(){

		game.update();
	
		//clear the screen
		game.getcontext().clearRect(0, 0, game.getcanvas().width, game.getcanvas().height);
		
		//Sets the canvas pos on player
		game.setcanvaspos(game.p_player);
	
		//Draw all the objects
		for(i = game.p_objects.length - 1; i >= 0; i--) {
			game.p_objects[i].draw();
		}
		
		requestAnimationFrame(game.draw);
	},
	
	keypresses: function(){
		//left
		if(this.p_keys[37] == true){
			this.p_player.left();
		}

		//right
		if(this.p_keys[39] == true){
			this.p_player.right();
		}

		//up
		if(this.p_keys[38] == true){
			this.p_player.up();
		}

		//down
		if(this.p_keys[40] == true){
			this.p_player.down();
		}
		  
		//space
		if(this.p_keys[32] == true){
			this.p_player.shoot();
		}
	},
	
	getcontext: function(){
		return this.p_ctx;
	},
	
	getcanvas: function(){
		return this.p_canv;
	},
	
	updatetime: function(){
		var d = new Date();
		this.p_oldtime = d.getTime(); 
	},		
	
	gettime: function(){
		return this.p_oldtime;
	},
	
	setcanvaspos: function(obj){
		this.screen.x = -obj.physical.getx()+ this.getcanvas().width/2;
		this.screen.y = -obj.physical.gety() + this.getcanvas().height/2;
	},
	
	setkeycode:function(key, code){
		this.p_keys[key] = code;
	},
	
	setmousepos: function(x, y){
		this.p_mousepos[0] = x;
		this.p_mousepos[1] = y;
	},
	
	//Higher is rolling up
	setmouseroll: function(val){
		this.p_mousewheel += val;
	},
	
	getgravity: function(){
		return this.p_gamegrav;
	},
	
	playerkilled: function(){
		console.log("You Died");
	}
};

///////////////////
///////////////////


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

  game.setkeycode(keyCode, (event.type == 'keydown'));

}

document.onmousewheel = function(event) {
		//up	
		if(event.deltaY < 0){
			game.setmouseroll(1);
		}

		//down	
		if(event.deltaY > 0){
			game.setmouseroll(-1);
		}
}

document.onmousemove = function(event) {

	var bounding_box= game.getcanvas().getBoundingClientRect();
	game.setmousepos((event.clientX - bounding_box.left) * (game.getcanvas().width/bounding_box.width) , (event.clientY - bounding_box.top) * (game.getcanvas().height/bounding_box.height)); 

}

//Helper Functions
function calculate_distance(x1 , x2, y1, y2) {
		var xdist = x1 - x2;
		var ydist = y1 - y2;
		return Math.sqrt((xdist * xdist)+(ydist * ydist));
}

http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
function interceptOnCircle(p1,p2,c,r){
    //p1 is the first line point
    //p2 is the second line point
    //c is the circle's center
    //r is the circle's radius

    var p3 = {x:p1.x - c.x, y:p1.y - c.y} //shifted line points
    var p4 = {x:p2.x - c.x, y:p2.y - c.y}

    var m = (p4.y - p3.y) / (p4.x - p3.x); //slope of the line
    var b = p3.y - m * p3.x; //y-intercept of line

    var underRadical = Math.pow((Math.pow(r,2)*(Math.pow(m,2)+1)),2)-Math.pow(b,2); //the value under the square root sign 

    if (underRadical < 0){
    //line completely missed
        return false;
    } else {
        var t1 = (-2*m*b+2*Math.sqrt(underRadical))/(2 * Math.pow(m,2) + 2); //one of the intercept x's
        var t2 = (-2*m*b-2*Math.sqrt(underRadical))/(2 * Math.pow(m,2) + 2); //other intercept's x
        var i1 = {x:t1,y:m*t1+b} //intercept point 1
        var i2 = {x:t2,y:m*t2+b} //intercept point 2
        return [i1,i2];
    }
}