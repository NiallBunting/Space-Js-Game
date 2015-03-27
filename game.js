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
	p_mouseclick: 0,
	
	//
	p_ui:0,
	
	p_player: 0,
	p_objects: 0,
	p_drawobjects: 0,
	
	init: function(){
		//Variables
		this.screen = {x: 0, y: 0};
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
		
		//Create ui
		this.p_ui = ui.create();
		
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
		this.p_objects[this.p_objects.length] = shipai.create(this.p_player);
	},
	
	update: function(){
		//checks for keypresses
		this.keypresses();
		
		//Updates the time
		var oldtime = this.gettime();
		this.updatetime();
		var updatetime = (this.gettime() - oldtime)/100;
		updatetime = (updatetime > this.p_maxtimeout) ? this.p_maxtimeout : updatetime;
		
		this.p_ui.update();
		
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
		
		//draw the ui
		game.p_ui.draw();
		
		requestAnimationFrame(game.draw);
	},
	
	keypresses: function(){
		
		if(!this.p_ui.isdisplayopen()){
			//left
			if(this.p_keys[37] == true || this.p_keys[65] == true){
					this.p_player.left();
			}

			//right
			if(this.p_keys[39] == true || this.p_keys[68] == true){
				this.p_player.right();
			}

			//up
			if(this.p_keys[38] == true || this.p_keys[87] == true){
				this.p_player.up();
			}

			//down
			if(this.p_keys[40] == true || this.p_keys[83] == true){
				this.p_player.down();
			}
			  
			//space
			if(this.p_keys[32] == true){
				this.p_player.shoot();
			}
			
			//reload
			if(this.p_keys[82] == true){
				this.p_player.weapon.manualreload();
			}
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
		
		this.p_ui.keys(this.p_keys);
	},
	
	setmousepos: function(newx, newy){
		this.p_mousepos = {x: newx, y: newy};
		
		this.p_ui.mousepos(this.p_mousepos);
	},
	
	setclicked: function(){
		this.p_mouseclick = {};
		this.p_mouseclick.x = this.mousepos.x;
		this.p_mouseclick.y = this.mousepos.y;
		
		this.p_ui.click(this.p_mouseclick);
	},
	
	//Higher is rolling up
	setmouseroll: function(val){
		this.p_mousewheel += val;
		
		this.p_ui.mousewheel(this.p_mousewheel);
	},
	
	getgravity: function(){
		return this.p_gamegrav;
	},
	
	playerkilled: function(){
		console.log("You Died");
	},
	
	getplayer: function(){
		return this.p_player;
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
//console.log(keyCode);
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

document.onclick = function(event) {
	game.setclicked();
}

//Helper Functions
function calculate_distance(x1 , x2, y1, y2) {
		var xdist = x1 - x2;
		var ydist = y1 - y2;
		return Math.sqrt((xdist * xdist)+(ydist * ydist));
}