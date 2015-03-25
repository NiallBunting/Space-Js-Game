var ship = {

	p_direction: 0,
	// power forward, back, left, right
	p_power: [10 , -3, -0.01, 0.01],
	p_spin: 0,

	create: function(){
		var obj = Object.create(this);
		 //12680000
		obj.physical = particle.create(0, 17590000, 10, 10);
		//obj.weapon = weapon.create("machinegun", 50, 0.001, 500, 4000, 300, 20);
		return obj;
	},
	
	update: function(time){
		this.physical.update(time);
		this.p_direction += (this.p_spin * time);
		if(this.p_direction > Math.PI){this.p_direction = -Math.PI;}
		if(this.p_direction < -Math.PI){this.p_direction = Math.PI;}
	},

	updatescreen: function (){
		screen.x = -this.physical.getx()+ canv.width/2;
		screen.y = -this.physical.gety() + canv.height/2;
		
		//console.log("X:" + Math.round(this.physical.getx()) + " Y:" + Math.round(this.physical.gety()) + " Speed:" + this.physical.getspeed());
	},
	
	draw: function() {
		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		//ctx.arc(canv.width/2, canv.height/2, this.physical.getradius(), 0, 2 * Math.PI);

		//https://en.wikipedia.org/wiki/Circle#Equations
		//ctx.moveTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.p_direction)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.p_direction)));
		//ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.p_direction + 2.4)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.p_direction + 2.4)));
		//ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.p_direction + 3.8)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.p_direction + 3.8)));
		
		ctx.moveTo(this.physical.getx() + screen.x + (this.physical.getradius() * Math.cos(this.p_direction)) , this.physical.gety() + screen.y + (this.physical.getradius() * Math.sin(this.p_direction)));
		ctx.lineTo(this.physical.getx() + screen.x + (this.physical.getradius() * Math.cos(this.p_direction + 2.4)) , this.physical.gety() + screen.y + (this.physical.getradius() * Math.sin(this.p_direction + 2.4)));
		ctx.lineTo(this.physical.getx() + screen.x + (this.physical.getradius() * Math.cos(this.p_direction + 3.8)) , this.physical.gety() + screen.y + (this.physical.getradius() * Math.sin(this.p_direction + 3.8)));
		
		ctx.closePath();
		ctx.fill();
		
		//this.weapon.draw(this);
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
        //this.weapon.shoot(this);
	},
	
	destroy: function() {
		return;
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
	p_draw: false,
	
	p_currentmag: 0, //Players mag ammo
	p_currentammo: 0, // Players ammo
	p_currentreloadreadytime: 0, //If time is after this then ready
	
	create: function(type, magrounds, firetime, ammo, reloadtime, maxdistance, power){
		var obj = Object.create(this);
		obj.p_type = type;
		obj.p_magrounds = obj.p_currentmag = magrounds;
		obj.p_firetime = firetime;
		obj.p_ammo = obj.p_currentammo = ammo;
		obj.p_reloadtime = reloadtime;
		obj.p_maxdistance = maxdistance;
		obj.p_power = power;
		obj.p_currentreloadreadytime = d.getTime();
		return obj;
	},
	
	draw: function(ship){
		if(this.p_draw <= 0){return;}
		this.p_draw--;
	
		ctx.fillStyle= '#' + 'fff';
		ctx.beginPath();
		ctx.moveTo(ship.physical.getx() + screen.x + (ship.physical.getradius() * Math.cos(ship.p_direction)) , ship.physical.gety() + screen.y + (ship.physical.getradius() * Math.sin(ship.p_direction)));
		ctx.lineTo(ship.physical.getx() + screen.x + (this.p_maxdistance * Math.cos(ship.p_direction)) , ship.physical.gety() + screen.y + (this.p_maxdistance * Math.sin(ship.p_direction)));
		ctx.stroke();
	},
	
	gettype:function(){
		return this.p_type;
	},
	
	shoot: function(ship){
		if(this.reload() != 1){return;} //Still reloading or now reloading
		//console.log(this.p_currentmag + " " + this.p_currentammo);
		this.p_draw = 1;
		this.p_currentmag--;
	},
	
	reload: function(){
		//Checks if time is up and ammo is 0 to refill
		if(d.getTime() > this.p_currentreloadreadytime && this.p_currentmag == 0){
			this.p_currentmag = this.p_magrounds;
			this.p_currentammo -= this.p_magrounds;
			return 1;
		}
				
		//Checks if still reloading
		if(d.getTime() <= this.p_currentreloadreadytime){
			return 0;
		}
		
		//Out of ammo so reloads
		if(this.p_currentmag <= 0){
			this.p_currentreloadreadytime = d.getTime() + p_reloadtime;
			return 0;
		}
		
		return 1;
		
	}
};
