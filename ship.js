var ship = {

	p_direction: 0,
	// power forward, back, left, right
	p_power: [10 , -3, -0.01, 0.01],
	p_spin: 0,
	p_hp: 100,
	p_armour: 0,
	//Status: 0 fine, 9 destroyed
	p_status: 0,

	create: function(){
		var obj = Object.create(this);
		 //12680000
		obj.physical = particle.create("ship", 0, 17590000, 10, 10);
		obj.weapon = weapon.create("machinegun", 50, 75, 500, 4000, 300, 20, 0.9);
		return obj;
	},
	
	update: function(time){
		this.physical.update(time);
		this.p_direction += (this.p_spin * time);
		if(this.p_direction > Math.PI){this.p_direction = -Math.PI;}
		if(this.p_direction < -Math.PI){this.p_direction = Math.PI;}
		if(this.p_hp <= 0){this.destroy();}
		
		return this.p_status;
	},
	
	draw: function() {
		game.getcontext().fillStyle= '#' + '900';
		game.getcontext().beginPath();

		//https://en.wikipedia.org/wiki/Circle#Equations
		
		game.getcontext().moveTo(this.physical.getx() + game.screen.x + (this.physical.getradius() * Math.cos(this.p_direction)) , this.physical.gety() + game.screen.y + (this.physical.getradius() * Math.sin(this.p_direction)));
		game.getcontext().lineTo(this.physical.getx() + game.screen.x + (this.physical.getradius() * Math.cos(this.p_direction + 2.4)) , this.physical.gety() + game.screen.y + (this.physical.getradius() * Math.sin(this.p_direction + 2.4)));
		game.getcontext().lineTo(this.physical.getx() + game.screen.x + (this.physical.getradius() * Math.cos(this.p_direction + 3.8)) , this.physical.gety() + game.screen.y + (this.physical.getradius() * Math.sin(this.p_direction + 3.8)));
		
		game.getcontext().closePath();
		game.getcontext().fill();
		
		this.weapon.draw(this);
	},


	left: function(){
		this.spin(false);
	},

	right: function(){
		this.spin(true);
	},

	up: function(){
		this.forward(this.p_power[0]);
	},

	down: function(){
		this.forward(this.p_power[1]);
	},
	
	spin: function(right){
		var spinner = right ? this.p_power[3] : this.p_power[2];
		this.p_spin += (spinner / this.physical.getmass());
		if(this.p_spin > 4.5){this.p_spin = 4.5;}
		if(this.p_spin < -4.5){this.p_spin = -4.5}
	},
	
	forward: function(power){
		this.physical.addforce(power * Math.cos(this.p_direction) , power * Math.sin(this.p_direction));
	},
	
	collided: function(obj){
		this.physical.collided(obj);
	},
	
	getrotation: function(){
		return this.p_direction;
	},
	
	shoot: function() {
        this.weapon.shoot(this);
	},
	
	destroy: function() {
		this.p_status = 9;
	},
	
	damage: function(damage){
		var armoureffect = Math.min(((Math.random() * 0.5) * damage), this.p_armour);
		
		this.p_armour -= armoureffect;
		this.p_hp -= (damage - armoureffect);

	}
};

var weapon = {
	p_type: 0, //Weapon Type
	p_magrounds: 0, // Rounds in magazine
	p_firetime: 0, // Time betweenshots
	p_ammo: 0, // Total ammo
	p_reloadtime: 0, // reload time
	p_maxdistance: 0, //distance rounds fires
	p_power: 0,
	p_accuraccy: 0,
	p_draw: 0,
	
	p_currentmag: 0, //Players mag ammo
	p_currentammo: 0, // Players ammo
	p_currentreloadreadytime: 0, //If time is after this then ready
	p_currentshootagaintime: 0,
	
	create: function(type, magrounds, firetime, ammo, reloadtime, maxdistance, power, accuraccy){
		var obj = Object.create(this);
		obj.p_type = type;
		obj.p_magrounds = obj.p_currentmag = magrounds;
		obj.p_firetime = firetime;
		obj.p_ammo = obj.p_currentammo = ammo;
		obj.p_reloadtime = reloadtime;
		obj.p_maxdistance = maxdistance;
		obj.p_power = power;
		obj.p_accuraccy = accuraccy;
		obj.p_currentreloadreadytime = obj.p_currentshootagaintime = game.gettime();
		return obj;
	},
	
	draw: function(ship){
		if(this.p_draw != 0){
		
			game.getcontext().fillStyle= '#' + 'fff';
			game.getcontext().beginPath();
			game.getcontext().moveTo(ship.physical.getx() + game.screen.x + (ship.physical.getradius() * Math.cos(ship.p_direction)) , ship.physical.gety() + game.screen.y + (ship.physical.getradius() * Math.sin(ship.p_direction)));
			game.getcontext().lineTo(game.screen.x + this.p_draw.physical.getx(), game.screen.y + this.p_draw.physical.gety());
			game.getcontext().stroke();
			
			this.p_draw = 0;
		}
	},
	
	gettype:function(){
		return this.p_type;
	},
	
	shoot: function(ship){
		if(this.reload() != 1){return 0;} //Still reloading or now reloading
		
		//Now checks time to shoot has passed
		if(this.p_currentshootagaintime > game.gettime()){return 0;}	
		
		//console.log(this.p_currentmag + " " + this.p_currentammo);
		
		//Adds reshoot time
		this.p_currentshootagaintime = game.gettime() + this.p_firetime;

		// Removes one from current mag
		this.p_currentmag--;
		
		//Needs to do do damage
		var shipx = ship.physical.getx() + (ship.physical.getradius() * Math.cos(ship.p_direction));
		var shipy = ship.physical.gety() + (ship.physical.getradius() * Math.sin(ship.p_direction));
		var xshot = ship.physical.getx() + (this.p_maxdistance * (Math.cos(ship.p_direction) + this.accuracyeffect()));
		var yshot = ship.physical.gety() + (this.p_maxdistance * (Math.sin(ship.p_direction) + this.accuracyeffect()));
		
		
	
		
		var p1 = {x:shipx, y:shipy};
		
		var p2 = {x:xshot, y:yshot};
		
		var resultcordinates = false;
		var resultobject = null;
		for(i = game.p_objects.length - 1; i >= 0; i--) {
			if(game.p_objects[i].physical.gettype() == "ship" && game.p_objects[i].physical != ship.physical){
				var c = {x: game.p_objects[i].physical.getx(), y:game.p_objects[i].physical.gety()};

				var tempresult = interceptOnCircle(p1, p2, c, game.p_objects[i].physical.getradius());
				
				if(tempresult != false){
					if(resultcordinates == false){resultcordinates = tempresult; resultobject = game.p_objects[i];}
					else{
						var currentdist = calculate_distance(shipx , resultcordinates[0], shipy, resultcordinates[1]);
						var newdist = calculate_distance(shipx , tempresult[0], shipy, tempresult[1]);
						
						if(newdist < currentdist){
							resultcordinates = tempresult; 
							resultobject = game.p_objects[i];
						}
					}
				}
			}
		}
		
		
		console.log(resultcordinates[0]);
		console.log(resultcordinates[1]		);
		console.log( resultobject);
		
		//Draws the round
		if(Math.random() > 0 && resultobject != null){this.p_draw = resultobject;}
	},
	
	reload: function(){
		//Checks if time is up and ammo is 0 to refill
		if(game.gettime() < this.p_currentreloadreadytime && this.p_currentmag == 0){
			if(this.p_currentammo >= this.p_magrounds){
				this.p_currentmag = this.p_magrounds;
				this.p_currentammo -= this.p_magrounds;
			}
			else{
				if(this.p_currentammo > 0){
					this.p_currentmag = this.p_currentammo;
					this.p_currentammo = 0;
				}
				else{
					return 0;
				}
			}
			return 1;
		}
				
		//Checks if still reloading
		if(game.gettime() <= this.p_currentreloadreadytime){
			return 0;
		}
		
		//Out of ammo so reloads
		if(this.p_currentmag <= 0){
			this.p_currentreloadreadytime = game.gettime() + this.p_reloadtime;
			return 0;
		}
		
		return 1;
		
	},
	
	accuracyeffect: function(){
		var accuracytop = (1 - this.p_accuraccy);
		var accuracybottom = 0 - (1 - this.p_accuraccy);
		return ((Math.random() * accuracytop * 2) + accuracybottom);
	}
}