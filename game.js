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
	p_name:false,
	
	//
	p_ui:0,
	
	p_player: 0,   
	p_objects: 0,
	p_drawobjects: 0,
	
	p_stars: 0,
	
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
		window.addEventListener('resize', this.resizecanvas, false);
		this.resizecanvas();

		//Create time
		this.updatetime();
		
		//Creates the player and the planets
		this.createuniverse();
		
		//Create ui
		this.p_ui = ui.create();

		//create audio
		this.audio = audio.create();
		
		//Creates the stars
		this.p_stars = [];
		for(var i = 0; i < 50; i++){
			this.p_stars[i] = [this.getcanvas().width * Math.random(),this.getcanvas().height * Math.random(), Math.ceil(3 * Math.random())];
		}
		
		requestAnimationFrame(game.loop);
	},
	
	resizecanvas: function(){
		//http://stackoverflow.com/questions/4288253/html5-canvas-100-width-height-of-viewport
		game.p_canv.width = window.innerWidth;
		game.p_canv.height = window.innerHeight;
		game.p_ctx.font='normal 20px Arial';
	},
	
	createuniverse: function(){
		this.p_objects[this.p_objects.length] = ship.create();
		this.p_player = this.p_objects[this.p_objects.length - 1];
		
		this.p_objects[this.p_objects.length] = planet.create(0, 0, 63000000000000, 160000, 'FFFF00', "Sun");	
		var rand = Math.random() * 2 * Math.PI;
		this.p_objects[this.p_objects.length] = planet.create(5200000 * Math.cos(rand), 5200000 * Math.sin(rand), 370000000, 74000, '787878', "Tars");
		var rand = Math.random() * 2 * Math.PI;
		this.p_objects[this.p_objects.length] = planet.create(6000000 * Math.cos(rand), 6000000 * Math.sin(rand), 470000000, 77000, 'CC0000', "Niallopia");
		var rand = Math.random() * 2 * Math.PI;
		this.p_objects[this.p_objects.length] = planet.create(6400000 * Math.cos(rand), 6400000 * Math.sin(rand), 700000000, 50000, 'CC3300', "Larth");
		var rand = Math.random() * 2 * Math.PI;
		this.p_objects[this.p_objects.length] = planet.create(6880000 * Math.cos(rand), 6800000 * Math.sin(rand), 410000000, 96000, '787878', "Vapper");
		var rand = Math.random() * 2 * Math.PI;	
		this.p_objects[this.p_objects.length] = planet.create(7000000 * Math.cos(rand), 7000000 * Math.sin(rand), 240000000, 52000, '00CC00', "Nabb");
		var rand = Math.random() * 2 * Math.PI;
		var xpos = 6900000 * Math.cos(rand);
		var ypos = 6900000 * Math.sin(rand);

		this.p_objects[this.p_objects.length] = planet.create(xpos, ypos, 340000000, 43000, '0066FF', "TuTu");

		this.p_player.physical.setx(xpos + 42990);

		this.p_player.physical.sety(ypos);
		for(var i = 2; i < this.p_objects.length; i++) {
			this.p_objects[i].orbit(this.p_objects[1]);
		}
		
		
	},
	
	//The game loop
	loop: function(){
		game.update();
		game.draw();
		requestAnimationFrame(game.loop);
	},
	
	update: function(){
		//checks for keypresses
		this.keypresses();
		
		this.p_ui.update();

		if(game.getui().mainmenuopen()){return;}
		//Updates the time
		var oldtime = this.gettime();
		this.updatetime();
		var updatetime = (this.gettime() - oldtime)/100;
		updatetime = (updatetime > this.p_maxtimeout) ? this.p_maxtimeout : updatetime;
		
		
		//Updates gravity and collisions
		for(var i = 0; i < this.p_objects.length; i++) {
			for(var j = 0; j < this.p_objects.length; j++) {
    			if(i == j){continue;}
				this.p_objects[i].physical.gravity(this.p_objects[j].physical, updatetime, 1);
				this.p_objects[i].collided(this.p_objects[j].physical, updatetime);
			}
		}
		
		if(this.p_player.update(updatetime) == 9){
			this.playerkilled();
		}

		//Updates the positions
		for(var i = 0; i < this.p_objects.length; i++) {
			if(this.p_objects[i] == this.p_player){continue;}
			var val = this.p_objects[i].update(updatetime);
			if (val == 9){
				this.p_objects.splice(i, 1);
			}
		}

		//possibly adds ai
		if(Math.random() < 0.003 && this.p_objects.length < 30){
			this.p_objects[this.p_objects.length] = shipai.create(this.p_player);
		}
		
	},
	
	draw: function(){
	
		//clear the screen
		this.getcontext().clearRect(0, 0, this.getcanvas().width, this.getcanvas().height);
		
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
		{
		game.getcontext().fillStyle= '#' + '000';
		this.getcontext().fillRect(20,20,150,100);
		}

		//draw stars
		this.drawstars();


		//Sets the canvas pos on player
		this.setcanvaspos(this.p_player);
	
		//Draw all the objects
		for(var i = 0; i <= this.p_objects.length - 1; i++) {
			if(this.p_player == this.p_objects[i]){continue;}
			this.p_objects[i].draw();
		}

		//Draws player on top
		this.p_player.draw();
		
		//draw the ui
		game.p_ui.draw();
	},
	
	drawstars: function(){
		this.p_ctx.fillStyle= '#' + 'fff';
		
		//This sets the speed of the stars compared to cosmic speed, modulused to stay on screen
		var screenxpush = ((this.screen.x) / 50) % this.getcanvas().width;
		var screenypush = ((this.screen.y) / 50) % this.getcanvas().height;
		
		screenxpush = screenxpush < 0 ? this.getcanvas().width - Math.abs(screenxpush) : screenxpush;
		screenypush = screenypush < 0 ? this.getcanvas().height - Math.abs(screenypush) : screenypush;

		for(var i = 0; i < this.p_stars.length-1; i++){
			if(((this.p_stars[i][1] + screenypush) % this.getcanvas().height) < 1){
				this.p_stars[i][0] = Math.random() * this.getcanvas().width;
			}
			this.p_ctx.fillRect((this.p_stars[i][0] + screenxpush) % this.getcanvas().width, (this.p_stars[i][1] + screenypush) % this.getcanvas().height , this.p_stars[i][2], this.p_stars[i][2]);
		}
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
		this.p_mouseclick.x = this.p_mousepos.x;
		this.p_mouseclick.y = this.p_mousepos.y;
		this.p_ui.click(this.p_mouseclick);
	},
	
	//Higher is rolling up
	setmouseroll: function(val){
		this.p_mousewheel = val;
		
		this.p_ui.mousewheel(this.p_mousewheel);
	},
	
	getgravity: function(){
		return this.p_gamegrav;
	},

	playerkilled: function(){
		game.audio.yourdead.play();
		if(typeof(Storage) !== "undefined") {
		var name = prompt("Please enter your name", "Captain N");

		//this could be done much better by having a rolling score datastructure
		if(localStorage.getItem("firstscore") < this.getplayer().getmoney() || localStorage.getItem("firstscore") == "null")
		{
			//pushes down
			localStorage.setItem("fifthname", localStorage.getItem("forthname"));
			localStorage.setItem("fifthscore", localStorage.getItem("forthscore"));
			localStorage.setItem("forthname", localStorage.getItem("thirdname"));
			localStorage.setItem("forthscore", localStorage.getItem("thirdscore"));
			localStorage.setItem("thirdname", localStorage.getItem("secondname"));
			localStorage.setItem("thirdscore", localStorage.getItem("secondscore"));
			localStorage.setItem("secondname", localStorage.getItem("firstname"));
			localStorage.setItem("secondscore", localStorage.getItem("firstscore"));
			//new info
			localStorage.setItem("firstname", name);
			localStorage.setItem("firstscore", this.getplayer().getmoney());
		}
		else{
			if(localStorage.getItem("secondscore") < this.getplayer().getmoney() || localStorage.getItem("secondscore") == "null")
			{
				//pushesdown
				localStorage.setItem("fifthname", localStorage.getItem("forthname"));
				localStorage.setItem("fifthscore", localStorage.getItem("forthscore"));
				localStorage.setItem("forthname", localStorage.getItem("thirdname"));
				localStorage.setItem("forthscore", localStorage.getItem("thirdscore"));
				localStorage.setItem("thirdname", localStorage.getItem("secondname"));
				localStorage.setItem("thirdscore", localStorage.getItem("secondscore"));
				//new info
				localStorage.setItem("secondname", name);
				localStorage.setItem("secondscore", this.getplayer().getmoney());
			}
			else
			{
				if(localStorage.getItem("thirdscore") < this.getplayer().getmoney() || localStorage.getItem("thirdscore") == "null")
				{
					//pushes down
					localStorage.setItem("fifthname", localStorage.getItem("forthname"));
					localStorage.setItem("fifthscore", localStorage.getItem("forthscore"));
					localStorage.setItem("forthname", localStorage.getItem("thirdname"));
					localStorage.setItem("forthscore", localStorage.getItem("thirdscore"));
					//new info
					localStorage.setItem("thirdname", name);
					localStorage.setItem("thirdscore", this.getplayer().getmoney());
				}
				else{
					if(localStorage.getItem("forthscore") < this.getplayer().getmoney() || localStorage.getItem("forthscore") == "null")
					{	//pushes down
						localStorage.setItem("fifthname", localStorage.getItem("forthname"));
						localStorage.setItem("fifthscore", localStorage.getItem("forthscore"));
						//new info
						localStorage.setItem("forthname", name);
						localStorage.setItem("forthscore", this.getplayer().getmoney());
					}
					else{
						if(localStorage.getItem("fifthscore") < this.getplayer().getmoney()  || localStorage.getItem("fifthscore") == "null")
						{
							localStorage.setItem("fifthname", name);
							localStorage.setItem("fifthscore", this.getplayer().getmoney());
						}
					}
				}
			}

		}

		}else{
			alert("Unable to set highscore.");
		}
		
		game.getui().menumaintrue();
		location.reload();
		
	},
	
	getplayer: function(){
		return this.p_player;
	},

	getui: function(){
		return this.p_ui;
	}
};

var audio = {
	p_musicvol: 1,
	p_soundvol: 1  ,

	create: function(){
		var obj = Object.create(this);
		obj.puff= new Audio('puff.mp3');
		obj.explosion= new Audio('explosion.mp3');
		obj.shoot= new Audio('shoot.mp3');
		obj.yourdead= new Audio('yourdead.mp3');
		obj.slap= new Audio('slap.mp3');
		obj.engine= new Audio('engine.mp3');
            	return obj;
        },

	changevol: function(val){
		this.p_soundvol = val;
		this.puff.volume = val;
		this.explosion.volume = val;
		this.puff.shoot = val;
		this.puff.yourdead = val;
		this.puff.slap = val;
		this.puff.engine = val;
	},

	getsoundvol: function(){
		return this.p_soundvol;
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

		event.preventDefault();
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
	event.preventDefault();
	var bounding_box= game.getcanvas().getBoundingClientRect();
	game.setmousepos((event.clientX - bounding_box.left) * (game.getcanvas().width/bounding_box.width) , (event.clientY - bounding_box.top) * (game.getcanvas().height/bounding_box.height)); 
}

document.onclick = function(event) {
	event.preventDefault();
	game.setclicked();
}

//Helper Functions
function calculate_distance(x1 , x2, y1, y2) {
		var xdist = x1 - x2;
		var ydist = y1 - y2;
		return Math.sqrt((xdist * xdist)+(ydist * ydist));
}
