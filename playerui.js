var ui = {
	
	p_displayopen: false,
	p_mapfactor: 30000,
	p_mapopen:false,
	p_buttons:0,
	p_hover:0,
	p_popup:0,
	p_mapoffset:0,
	p_mousemove: false,
	p_mouseposition: 0,
	p_planetover: 0,
	p_mainmenu:true,
	p_drawbuymenu: 0,
	p_planetbuyingfrom: false,
	p_buymenu:0,
	
	create: function(){
		var obj = Object.create(this);
		obj.minimap = minimap.create();
		obj.p_buttons = [];
		obj.p_hover = [];
		obj.p_mapoffset = [0, 0];
		return obj;
	},
	
	click: function(click){
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
				//buttontomenu
				this.createbutton(game.getcanvas().width - 115,4, game.getcanvas().width - 15, 21,game.getui().menumaintrue,0);
			}else{
					this.p_buttons = [];
					this.setupmap();			
			}
		}

		if(this.p_mapopen){			
			//left
			if(keys[37] == true || keys[65] == true){
					this.p_mapoffset[0] -= (5 * this.p_mapfactor);
			}

			//right
			if(keys[39] == true || keys[68] == true){
					this.p_mapoffset[0] += (5 * this.p_mapfactor);
			}

			//up
			if(keys[38] == true || keys[87] == true){
					this.p_mapoffset[1] -= (5 * this.p_mapfactor);
			}

			//down
			if(keys[40] == true ||keys[83] == true){
					this.p_mapoffset[1] += (5 * this.p_mapfactor);
			}

		}



		
	},
	//button to close the map
	closemap: function(){
		var temp = [];
		temp[77] = true;	
		game.getui().keys(temp);
	},

	//creates the buttons
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
	//called when center on ship called
	centeronship: function(){
		game.getui().p_mapoffset = [-game.getplayer().physical.getx(), -game.getplayer().physical.gety()]
	},
	//the method called when hoving over planet
	planethover: function(planet){
		game.getui().p_planetover = planet;
	},
	//Creates the hovers over the planets
	moveplanethover: function(x, y, radius, object){
		x = ((x + this.p_mapoffset[0]) / this.p_mapfactor) + (game.getcanvas().width/2);
		y = ((y + this.p_mapoffset[1]) / this.p_mapfactor) + (game.getcanvas().height/2);
		radius /= this.p_mapfactor;

		this.createhover(x-radius, y-radius, x+radius, y+radius, this.planethover, object);
	},

	menumaintrue:function(){
		game.getui().p_mainmenu = true;
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
		game.getcontext().fillText("MouseLock.",20,100);
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
	//Draws the name of the planet on the map
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

	onplanet: function(obj, draw){
		if(draw){this.p_drawbuymenu = 30;}
		this.p_planetbuyingfrom = obj;

	},
	
	
	isdisplayopen: function(){
		this.p_displayopen;
	},
	
	update: function(){
		if(!this.p_mapopen && !this.p_drawbuymenu){
		this.p_buttons = [];
			//buttontomenu
			this.createbutton(game.getcanvas().width - 115,4, game.getcanvas().width - 15, 21,this.menumaintrue,0);
		}
		
		//Checks if near the edge of the screen, to scroll
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

		if(this.p_drawbuymenu > 0){
			this.p_drawbuymenu--;
		}
	},

	drawmainmenu:function(){

			this.p_buttons = [];

			this.createbutton(20,65,200,95,game.getui().mainmenuclose,0);
			this.createbutton(20,105,200,135,game.getui().link,"./about.html");
			this.createbutton(20,145,200,175,game.getui().link,"https://github.com/NiallBunting/HTML5JS-Game");
			this.createbutton(20,185,200,215,game.getui().soundtoggle,0);

			game.getcontext().fillStyle = '#fff';
			game.getcontext().fillRect(0, 0, game.getcanvas().width, game.getcanvas().height);
			game.getcontext().fillStyle = '#000';	
			game.p_ctx.font='normal 50px Arial';
			game.getcontext().fillText("Spacegame!",20,50);
			game.p_ctx.font='normal 20px Arial';
			game.getcontext().fillText("Play",20,90);		
			game.getcontext().fillText("About Page <- Contains the instructions.",20,130);	
			game.getcontext().fillText("GitHub",20,170);
			game.getcontext().fillText("Sound Off/On",20,210);

			if(typeof(Storage) !== "undefined") {
			game.getcontext().fillText("High Scores",game.getcanvas().width - 305,90);
			game.getcontext().fillText("1. " + localStorage.getItem("firstname") + " \u00A3" + localStorage.getItem("firstscore"),game.getcanvas().width - 305,110);
			game.getcontext().fillText("2. " + localStorage.getItem("secondname") + " \u00A3" + localStorage.getItem("secondscore"),game.getcanvas().width - 305,130);
			game.getcontext().fillText("3. " + localStorage.getItem("thirdname") + " \u00A3" + localStorage.getItem("thirdscore"),game.getcanvas().width - 305,150);
			game.getcontext().fillText("4. " + localStorage.getItem("forthname") + " \u00A3" + localStorage.getItem("forthscore"),game.getcanvas().width - 305,170);	
			game.getcontext().fillText("5. " + localStorage.getItem("fifthname") + " \u00A3" + localStorage.getItem("fifthscore"),game.getcanvas().width - 305,190);
			} else {
			
			}
	
	},

	soundtoggle:function(){
		if(game.audio.getsoundvol() == 1){
		game.audio.changevol(0);
		}else{
		game.audio.changevol(1);
		}
	},

	link:function(url){
		document.location.href = url;
	},
	
	draw: function(){
		if(this.p_mainmenu){
			this.drawmainmenu();
			
		}else{

			//draws the ui
			if(!this.p_displayopen){
				game.getcontext().fillStyle= '#bbb';
				game.getcontext().fillRect(game.getcanvas().width - 115, 25, 100, -21);
				game.getcontext().fillStyle= '#0f0';
				game.getcontext().fillText("Hp: "+ Math.ceil(game.getplayer().gethp()) + "/" + Math.ceil(game.getplayer().p_maxhp) + " Armour: " + Math.ceil(game.getplayer().getarmour())  + "/" + Math.ceil(game.getplayer().p_maxarmour),10,20);
				game.getcontext().fillText("Cosmic Speed: " + Math.ceil(game.getplayer().physical.getspeed()) + " Fuel: " + Math.ceil(game.getplayer().getfuel()) + "/" + Math.ceil(game.getplayer().p_maxfuel),10,40);
				game.getcontext().fillText("\u00A3" + Math.round(game.getplayer().getmoney()),10,60);
				game.getcontext().fillText(game.getplayer().weapon.gettype(),10,80);
				game.getcontext().fillText(game.getplayer().weapon.getammo(),10,100);
				game.getcontext().fillStyle= '#000';
				game.getcontext().fillText("Menu.",game.getcanvas().width - 115,20);
				if(!this.p_drawbuymenu){this.minimap.draw();}
			}

			if(this.p_displayopen){
				this.showmap();
			}
			else{
				if(this.p_drawbuymenu > 0){
					this.showbuymenu();
				}
			}
		}


	},

	mainmenuopen: function(){
		return this.p_mainmenu;
	},

	mainmenuclose: function(){
		game.getui().p_mainmenu = false;
	},

	showbuymenu: function(){
			this.p_buttons = [];
			this.createbutton(game.getcanvas().width - 115,4, game.getcanvas().width - 15, 21,this.menumaintrue,0);

			game.getcontext().fillStyle = 'rgba(200, 200, 200, 0.8)';
			game.getcontext().fillRect(20, 110, 200, 300);
			game.getcontext().fillRect(300, 110, 200, 300);
			this.createbutton(20,330,200,350,this.changebuymenupage,0);

			if(this.p_buymenu == 0)		{	
			this.createbutton(20,105,200,135,this.changebuymenupage,1);
			this.createbutton(20,145,200,175,this.changebuymenupage,2);
			this.createbutton(20,185,200,215,this.changebuymenupage,3);
			this.createbutton(20,225,200,255,this.changebuymenupage,4);

			game.getcontext().fillStyle = '#000';	
			game.p_ctx.font='normal 20px Arial';
			game.getcontext().fillText("Ship",20,130);		
			game.getcontext().fillText("Upgrades",20,170);	
			game.getcontext().fillText("Cargo",20,210);
			game.getcontext().fillText("Weapon",20,250);

			game.getcontext().fillText("Choose Section...",300,130);
			}
			if(this.p_buymenu == 1)		{	
			this.createbutton(20,105,200,135,this.increasevalue,["fuel", 0, (game.getplayer().p_maxfuel - game.getplayer().p_fuel) / 50]);
			this.createbutton(20,145,200,175,this.increasevalue,["armour", 0, (game.getplayer().p_maxarmour - game.getplayer().p_armour)/2]);
			this.createbutton(20,185,200,215,this.increasevalue,["hp", 0, (game.getplayer().p_maxhp - game.getplayer().p_hp)]);
			this.createbutton(20,225,200,255,this.increasevalue,["ammo", 50, 10]);

			game.getcontext().fillStyle = '#000';	
			game.p_ctx.font='normal 20px Arial';
			game.getcontext().fillText("Buy Fuel",20,130);			
			game.getcontext().fillText("Buy Armour",20,170);		
			game.getcontext().fillText("Repair Hp",20,210);	
			game.getcontext().fillText("Ammo",20,250);		
			game.getcontext().fillText("Back",20,350);

			game.getcontext().fillText("\u00A3" + (game.getplayer().p_maxfuel - game.getplayer().p_fuel) / 50 + " \u00A30.02 each",300,130);
			game.getcontext().fillText("\u00A3" + (game.getplayer().p_maxarmour - game.getplayer().p_armour) / 2+ " \u00A30.50 each",300,170);
			game.getcontext().fillText("\u00A3" + (game.getplayer().p_maxhp - game.getplayer().p_hp)+ " \u00A31.00 each",300,210);
			game.getcontext().fillText("\u00A310 for 50",300,250);
			}
			if(this.p_buymenu == 2)		{	
			this.createbutton(20,105,200,135,this.increasevalue,["maxarmour", 25, 100]);
			this.createbutton(20,145,200,175,this.increasevalue,["maxfuel", 100, 100]);
			this.createbutton(20,185,200,215,this.increasevalue,["forward", 1, 100]);
			this.createbutton(20,225,200,255,this.increasevalue,["back", 0.5, 100]);
			this.createbutton(20,265,200,295,this.increasevalue,["side", 0.01, 100]);

			game.getcontext().fillStyle = '#000';	
			game.p_ctx.font='normal 20px Arial';
			game.getcontext().fillText("Upgrade Armour",20,130);		
			game.getcontext().fillText("Upgrade Fuel",20,170);	
			game.getcontext().fillText("Forward Power",20,210);
			game.getcontext().fillText("Back Power",20,250);
			game.getcontext().fillText("Side Power",20,290);
			game.getcontext().fillText("Back",20,350);

			game.getcontext().fillText("\u00A3100 for 25"  ,300,130);
			game.getcontext().fillText("\u00A3100 for 100" ,300,170);
			game.getcontext().fillText("\u00A3100 for 1 power" ,300,210);
			game.getcontext().fillText("\u00A3100 for .5 power" ,300,250);
			game.getcontext().fillText("\u00A3100 for .01" ,300,290);
			}
			if(this.p_buymenu == 3)		{	
			this.createbutton(20,105,200,135,this.increasevalue,["buygoods",10, 10]);
			this.createbutton(20,145,200,175,this.increasevalue,["sellgoods",game.getplayer().p_goods, (-1.50*game.getplayer().p_goods)]);

			game.getcontext().fillStyle = '#000';	
			game.p_ctx.font='normal 20px Arial';
			game.getcontext().fillText("Buy Goods",20,130);		
			game.getcontext().fillText("Sell Goods",20,170);
			game.getcontext().fillText("Have to trade",20,210);
			game.getcontext().fillText("at another planet.",20,230);	
			game.getcontext().fillText("Back",20,350);

			game.getcontext().fillText("\u00A31.00 for 10"  ,300,130);
			game.getcontext().fillText("\u00A31.50 for 10" ,300,170);
			game.getcontext().fillText("Goods: " + game.getplayer().p_goods,300,210);
			}

			if(this.p_buymenu == 4)		{	
			this.createbutton(20,105,200,135,this.increasevalue,["wdistance", 10, 100]);
			this.createbutton(20,145,200,175,this.increasevalue,["wdamage", 1, 100]);

			game.getcontext().fillStyle = '#000';	
			game.p_ctx.font='normal 20px Arial';
			game.getcontext().fillText("Distance Increase",20,130);		
			game.getcontext().fillText("Damage Increase",20,170);	
			game.getcontext().fillText("Back",20,350);

			game.getcontext().fillText("\u00A3100 for 10 distance"  ,300,130);
			game.getcontext().fillText("\u00A3100 for 1 power" ,300,170);
			}
	},

	changebuymenupage:function(val){
		game.getui().p_buymenu = val;
	},

	increasevalue:function(data){
		var amount = data[1];
		var cost = data[2];
		if((game.getplayer().p_money - cost) < 0){return;}

		switch(data[0]){
			case "maxarmour":
			game.getplayer().p_maxarmour += amount;
			break;
			case "maxfuel":
			game.getplayer().p_maxfuel += amount;
			break;
			case "forward":
			game.getplayer().p_power[0] += amount;
			break;
			case "backward":
			game.getplayer().p_power[1] -= amount;
			break;
			case "side":
			game.getplayer().p_power[2] -= amount;
			game.getplayer().p_power[3] += amount;
			break;
			case "fuel":
			game.getplayer().p_fuel = game.getplayer().p_maxfuel;
			break;
			case "armour":
			game.getplayer().p_armour = game.getplayer().p_maxarmour;
			break;
			case "hp":
			game.getplayer().p_hp = game.getplayer().p_maxhp;
			break;
			case "ammo":
			game.getplayer().weapon.p_currentammo += amount;
			break;
			case "wdamage":
			game.getplayer().weapon.p_power += amount;
			break;
			case "wdistance":
			game.getplayer().weapon.p_maxdistance += amount;
			break;
			case "buygoods":
			if(game.getplayer().p_goods == 0){game.getplayer().p_goodplanet = game.getui().p_planetbuyingfrom;}
			if(game.getui().p_planetbuyingfrom != game.getplayer().p_goodplanet){return;}
			game.getplayer().p_goods += amount;
			break;
			case "sellgoods":
			if(game.getplayer().p_goodplanet == game.getui().p_planetbuyingfrom){return;}
			game.getplayer().p_goods = 0;
			break;
		}

		game.getplayer().addmoney(-cost);
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
	
	draw: function(){	
		var size = 80;				
		var scale = (game.getplayer().physical.getspeed() / 6) + 100;
		game.getcontext().scale(1/scale, 1/scale);
		game.getcontext().fillStyle= "rgba(255, 255, 255, 0.5)";
		game.getcontext().beginPath();
		game.getcontext().arc((game.getcanvas().width - 100) * scale, (game.getcanvas().height - 100) * scale , size * scale, 0, 2 * Math.PI);
		game.getcontext().fill();
		game.getcontext().lineWidth = 4 * scale;
		game.getcontext().strokeStyle = "rgba(255, 255, 255, 0.8)";
		game.getcontext().stroke();
	
		//drawing the direction dot
		if(this.p_target != 0){
			game.getcontext().fillStyle= '#f00';
			var targetposangle = -Math.atan2(this.p_target.physical.getx()- game.getplayer().physical.getx(), this.p_target.physical.gety() - game.getplayer().physical.gety()) + (Math.PI/2);
			var targetx = (game.getcanvas().width - 100) * scale + (size * scale * Math.cos(targetposangle));
			var targety = (game.getcanvas().height - 100) * scale + (size * scale * Math.sin(targetposangle));
			game.getcontext().beginPath();
			game.getcontext().arc(targetx, targety , 5 * scale, 0, 2 * Math.PI);
			game.getcontext().fill();
		}


		//draws enemy dots
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
		//draws text about target
		if(this.p_target != 0){
			var speed = Math.round(calculate_distance(this.p_target.physical.getxspeed(), game.getplayer().physical.getxspeed(), this.p_target.physical.getyspeed(), game.getplayer().physical.getyspeed()));
			var distance = Math.round(calculate_distance(this.p_target.physical.getx(), game.getplayer().physical.getx(), this.p_target.physical.gety(), game.getplayer().physical.gety()) - this.p_target.physical.getradius());		
			game.getcontext().fillStyle = '#0f0';
			game.getcontext().fillText("Distance: " + distance,(game.getcanvas().width - 200), (game.getcanvas().height - 220));
			game.getcontext().fillText("Speed:    " + speed,(game.getcanvas().width - 200), (game.getcanvas().height - 200) );
			game.getcontext().fillText("Target:   "+ this.p_target.getname(),(game.getcanvas().width - 200), (game.getcanvas().height - 240));	
		}

	}
};

