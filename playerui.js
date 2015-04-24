var ui = {
	
	p_displayopen: false,
	p_mapfactor: 30000,
	p_mapopen:false,
	p_buttons:0,
	p_hover:0,
	p_popup:0,
	p_mapoffset:0,
	p_mousemove: true,
	p_mouseposition: 0,
	p_planetover: 0,
	
	create: function(){
		var obj = Object.create(this);
		obj.minimap = minimap.create();
		obj.p_buttons = [];
		obj.p_hover = [];
		obj.p_mapoffset = [0, 0];
		return obj;
	},
	
	click: function(click){
	//check display is open
		if(!this.p_displayopen) return;
		//mouse move
		if(this.p_mousemove){

		}
	//check if clicking a button
		for(var i = 0; i < this.p_buttons.length ; i++){
			if (click.x > this.p_buttons[i][2]) continue;
			if (click.x < this.p_buttons[i][0]) continue;
			if (click.y > this.p_buttons[i][3]) continue;
			if (click.y < this.p_buttons[i][1]) continue;

			this.p_buttons[i][4](this.p_buttons[i][5]);
		}
	},
	
	mousepos: function(pos){
		this.p_mouseposition = pos;
		//hover in update
	},

	createbutton:function(x1, y1, x2, y2, functioncalled, varibles){
		this.p_buttons[this.p_buttons.length] = [x1, y1, x2, y2, functioncalled, varibles];
	},

	createhover:function(x1, y1, x2, y2, functioncalled, varibles){
		this.p_hover[this.p_hover.length] = [x1, y1, x2, y2, functioncalled, varibles];
	},

	keys: function(keys){
		// The M key
		if(keys[77] == true){
			this.p_displayopen = this.p_displayopen ? false : true;
			this.p_mapopen = this.p_displayopen;
			if(!this.p_displayopen){
				this.p_mapfactor = 30000;
				this.p_buttons = [];
				this.p_hover = [];
				this.p_mapoffset = [0, 0];
			}else{
				this.setupmap();			
			}
		}
		
	},

	closemap: function(){
		var temp = [];
		temp[77] = true;	
		game.getui().keys(temp);
	},

	setupmap:function(){
		//zoom
		this.createbutton(15,4,115,21,game.getui().mousewheel,-1);
		this.createbutton(15,44,115,61,game.getui().mousewheel,1);
		//lock default off
		this.createbutton(15,84,115,101,game.getui().mousemove,0);
		//player
		this.createbutton(15,124,115,141,game.getui().centeronship,0);
		//cleartarget
		this.createbutton(15,164,115,181,game.getui().cleartarget,0);

		//exit
		this.createbutton(game.getcanvas().width - 115,4, game.getcanvas().width - 15, 21,game.getui().closemap,0);

	},
	
	//removes the target
	cleartarget:function(){
		game.getui().minimap.settarget(0);
	},

	//allows movement from edge of screen
	mousemove:function(){
		game.getui().p_mousemove = !game.getui().p_mousemove;
	},

	centeronship: function(){
		game.getui().p_mapoffset = [-game.getplayer().physical.getx(), -game.getplayer().physical.gety()]
	},

	planethover: function(planet){
		game.getui().p_planetover = planet;
	},

	moveplanethover: function(x, y, radius, object){
		x = ((x + this.p_mapoffset[0]) / this.p_mapfactor) + (game.getcanvas().width/2);
		y = ((y + this.p_mapoffset[1]) / this.p_mapfactor) + (game.getcanvas().height/2);
		radius /= this.p_mapfactor;

		this.createhover(x-radius, y-radius, x+radius, y+radius, this.planethover, object);
	},

	showmap: function(){
		
		//save the screen
		var screenx = game.screen.x;
		var screeny = game.screen.y;

		game.getcontext().fillStyle = "rgba(255, 255, 255, 0.8)";
		game.getcontext().fillRect(0, 0, game.getcanvas().width, game.getcanvas().height);
		//draw the ui

		game.getcontext().fillStyle= 'rgba(0, 0, 0, 0.2)';
		game.getcontext().fillRect(15, 25, 100, -21);
		game.getcontext().fillRect(15, 65, 100, -21);
		game.getcontext().fillRect(15, 105, 100, -21);
		game.getcontext().fillRect(15, 145, 100, -21);
		game.getcontext().fillRect(15, 185, 100, -21);
		game.getcontext().fillRect(game.getcanvas().width - 115, 25, 100, -21);
		game.getcontext().fillStyle= '#000';
		game.getcontext().fillText("Zoom In.",20,20);
		game.getcontext().fillText("Zoom Out.",20,60);
		game.getcontext().fillText("Lock.",20,100);
		game.getcontext().fillText("Player.",20,140);
		game.getcontext().fillText("Clear Tar.",20,180);
		game.getcontext().fillText("Exit Map.",game.getcanvas().width - 115,20);


		//scale out
		game.getcontext().scale(1/this.p_mapfactor, 1/this.p_mapfactor);

		//setup the screen x and y with offset
		game.screen.x = (game.getcanvas().width*this.p_mapfactor)/2 + this.p_mapoffset[0];
		game.screen.y = (game.getcanvas().height*this.p_mapfactor)/2 + this.p_mapoffset[1];

		//removes the hovers
		this.p_hover = [];
		//draw everything
		for(var i = game.p_objects.length - 1; i >= 0; i--) {
			if(game.p_objects[i].physical.gettype() != "planet"){continue;}
			game.p_objects[i].draw();
			this.moveplanethover(game.p_objects[i].physical.getx(), game.p_objects[i].physical.gety(), game.p_objects[i].physical.getradius(), game.p_objects[i]);
		}

		game.getcontext().scale(this.p_mapfactor, this.p_mapfactor);

		game.screen.x = screenx;
		game.screen.y = screeny;   
		
		this.drawpopup();
		this.p_planetover = 0;

	},

	drawpopup: function(){
		if(this.p_planetover == 0){return;}
		this.minimap.settarget(this.p_planetover);
		game.getcontext().fillStyle= '#000';
		game.getcontext().fillText(this.p_planetover.getname(),this.p_mouseposition.x,this.p_mouseposition.y);

	},
	
	//wheel is one when rolling up, -1 down
	mousewheel: function(wheel){
		if(game.getui().p_mapopen){
			if(wheel == 1){
				if(game.getui().p_mapfactor < 100000){
					game.getui().p_mapfactor += 1000;
				}
			}else{
				if(game.getui().p_mapfactor > 1000){
					game.getui().p_mapfactor -= 1000;
				}
			}
		}
	},
	
	isdisplayopen: function(){
		this.p_displayopen;
	},
	
	update: function(){
		if(this.p_mousemove){
			if(this.p_mouseposition.x > game.getcanvas().width - (game.getcanvas().width * 0.1)){this.p_mapoffset[0] -= (5 * this.p_mapfactor);}
			if(this.p_mouseposition.x < (game.getcanvas().width * 0.1)){this.p_mapoffset[0] += (5 * this.p_mapfactor);}
			if(this.p_mouseposition.y > game.getcanvas().height - (game.getcanvas().height * 0.1)){this.p_mapoffset[1] -= (5 * this.p_mapfactor);}
			if(this.p_mouseposition.y < (game.getcanvas().height * 0.1)){this.p_mapoffset[1] += (5 * this.p_mapfactor);}
		}

		//check hover
		for(var i = 0; i < this.p_hover.length ; i++){
			if (this.p_mouseposition.x > this.p_hover[i][2]) continue;
			if (this.p_mouseposition.x < this.p_hover[i][0]) continue;
			if (this.p_mouseposition.y > this.p_hover[i][3]) continue;
			if (this.p_mouseposition.y < this.p_hover[i][1]) continue;

			this.p_hover[i][4](this.p_hover[i][5]);
		}
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
			this.showmap();
		}

	}
	
};

var minimap = {
	p_target:0,

	create: function(){
		var obj = Object.create(this);
		return obj;
	},
	
	settarget:function(target){
		this.p_target = target;
	},
//x = cx + r * cos(a)
//y = cy + r * sin(a)
	
	draw: function(){	
		if(this.p_target != 0){
			var speed = Math.round(calculate_distance(this.p_target.physical.getxspeed(), game.getplayer().physical.getxspeed(), this.p_target.physical.getyspeed(), game.getplayer().physical.getyspeed()));
			var distance = Math.round(calculate_distance(this.p_target.physical.getx(), game.getplayer().physical.getx(), this.p_target.physical.gety(), game.getplayer().physical.gety()));		
			game.getcontext().fillStyle= '"rgba(0, 0, 0, 0.8)"';
			game.getcontext().fillText("Distance: " + distance,(game.getcanvas().width - 200), (game.getcanvas().height - 240));
			game.getcontext().fillText("Speed:    " + speed,(game.getcanvas().width - 200), (game.getcanvas().height - 200) );
			game.getcontext().fillText("Target:   "+ this.p_target.getname(),(game.getcanvas().width - 200), (game.getcanvas().height - 280));	
		}
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
