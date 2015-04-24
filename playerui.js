var ui = {
	
	p_displayopen: false,
	
	create: function(){
		var obj = Object.create(this);
		obj.display = leftdisplay.create();
		obj.minimap = minimap.create();
		return obj;
	},
	
	click: function(click){
	
	},
	
	mousepos: function(pos){
		
	},
	
	keys: function(keys){
		// The M key
		if(keys[77] == true){
			this.p_displayopen = true;
			this.display.mappress();
		}else{
			this.p_displayopen = false;
			this.display.mapunpress();
		}
		
	},
	
	mousewheel: function(wheel){
		
	},
	
	isdisplayopen: function(){
		this.p_displayopen;
	},
	
	update: function(){
	},
	
	draw: function(){
		
		if(!this.p_displayopen){
			game.getcontext().fillStyle= '#0f0';
			game.getcontext().fillText("Hp: "+ Math.ceil(game.getplayer().gethp()) + " Armour: " + Math.ceil(game.getplayer().getarmour()) ,10,20);
			game.getcontext().fillText("Cosmic Speed: " + Math.ceil(game.getplayer().physical.getspeed()) + " Fuel: " + Math.ceil(game.getplayer().getfuel()),10,40);
			game.getcontext().fillText(game.getplayer().weapon.gettype(),10,60);
			game.getcontext().fillText(game.getplayer().weapon.getammo(),10,80);
			
			this.minimap.draw();
		}else{
			this.display.draw();
		}
	}
	
};

var minimap = {
	create: function(){
		var obj = Object.create(this);
		return obj;
	},
	
	draw: function(){	
		var size = 80;				
		var scale = (game.getplayer().physical.getspeed() * 5) + 100;
		game.getcontext().scale(1/scale, 1/scale);
		game.getcontext().fillStyle= "rgba(255, 255, 255, 0.5)";
		game.getcontext().beginPath();
		game.getcontext().arc((game.getcanvas().width - 100) * scale, (game.getcanvas().height - 100) * scale , size * scale, 0, 2 * Math.PI);
		game.getcontext().fill();
		game.getcontext().lineWidth = 4 * scale;
		game.getcontext().strokeStyle = "rgba(255, 255, 255, 0.8)";
		game.getcontext().stroke();



		
		for(var i = 0; i < game.p_objects.length; i++) {
			// if(game.p_objects[i] == game.getplayer()){continue;}
			if(calculate_distance(game.p_objects[i].physical.getx() , game.getplayer().physical.getx(), game.p_objects[i].physical.gety(), game.getplayer().physical.gety()) < ((size - 1) * scale)){

				game.getcontext().fillStyle= '#333';
				game.getcontext().beginPath();
				game.getcontext().arc(((game.getcanvas().width - 100) * scale) + (game.p_objects[i].physical.getx() - game.getplayer().physical.getx()), ((game.getcanvas().height - 100) * scale) + (game.p_objects[i].physical.gety() - game.getplayer().physical.gety()), scale * 2, 0, 2 * Math.PI);
				game.getcontext().fill();

			}
		}
		
		game.getcontext().scale(scale, scale);

	}
};

var leftdisplay = {	
	p_mapppress: 0,
	
	create: function(){
		var obj = Object.create(this);
		return obj;
	},
	
	draw: function(){
		if(this.p_mapppress){
			//map.draw();
		}
	},
	
	mappress: function(){
		this.p_mapppress = true;
	},
	
	mapunpress:function(){
		this.p_mapppress = false;
	}
};

/*
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
		game.getcontext().clearRect(0, 0, canv.width, canv.height);
		
		//draw the ui
		game.getcontext().fillStyle= '#' + 'fff';		
		game.getcontext().fillRect(0, 0, canv.width, 40);
		game.getcontext().fillStyle= '#' + 'aaa';		
		game.getcontext().fillRect(0, 40, canv.width, 2);
		
		game.getcontext().fillText("Map.",20,20);
		

		
		//scale out
		game.getcontext().scale(1/this.p_factor, 1/this.p_factor);

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
*/
