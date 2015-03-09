var particle = {

	//The internal values, prefixed with a p_ (for private)
   	p_mass: 0,
	p_xforce: 0,
	p_yforce: 0,
   	p_x: 0,
   	p_y: 0,
	p_px: 0,
	p_py: 0,
	p_density: 1,
	p_width:1,

        create: function (x, y, mass, width) {
            var obj = Object.create(this);
	    obj.setx(x);
	    obj.sety(y);
	    obj.setmass(mass);
	    obj.p_width = width;
            return obj;
        },

        getx: function () {
            return this.p_x;
        },

	setx: function (value) {
	    this.p_x = this.p_px = value;
	},

        gety: function () {
            return this.p_y;
        },

	sety: function (value) {
	    this.p_y = this.p_py = value;
	},

        getmass: function () {
            return this.p_mass;
        },

	setdensity: function (value) {
		this.p_density = value;
	},

        getdensity: function () {
            return this.p_density;
        },

        setmass: function (value) {	
	    this.p_mass = value;
        },
		
	getradius: function () {
		return this.p_width;
	},

	//updated all the physics
	update: function (time) {
		//console.log(this.p_xforce + "speed:" + this.getspeed());
		var accelx = this.p_xforce / this.p_mass;
		var accely = this.p_yforce / this.p_mass;

		this.p_xforce = 0;
		this.p_yforce = 0;

		this.p_x += accelx * time * time;
		this.p_y += accely * time * time;

		var x = this.p_x * 2 - this.p_px;
		var y = this.p_y * 2 - this.p_py;
		this.p_px = this.p_x;
		this.p_py = this.p_y;
		this.p_x = x;
		this.p_y = y;
	},

	//calculates gravity on an a object
	gravity: function (obj, time, positive) {
		var xdist = obj.getx() - this.getx();
		var ydist = obj.gety() - this.gety();
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		var force = (GAME_GRAVITY * this.getmass() * obj.getmass()) / (dist * dist);
		this.p_xforce += positive * force * (xdist/dist) * time;
		this.p_yforce += positive * force * (ydist/dist) * time;
	},

	//adds a force to an object
	addforce: function (xforce, yforce) {
		this.p_xforce += xforce;
		this.p_yforce += yforce;
	},

	havecollided: function (obj){
		var dist = calculate_distance(obj.getx(), this.getx(), obj.gety(), this.gety());
		var radiustotal = this.getradius() + obj.getradius();
		if(dist < radiustotal){
			return true;
		}else{
			return false;
		}
	},
	
	setvelocity: function (x, y) {
		this.p_px = this.p_x + x;
		this.p_py = this.p_y + y;
	},
	
	//Checks if circles have collided, then applys the force
	collided: function (obj, time) {
		if(this.havecollided(obj)){
			//negates gravity (pushes up from the ground) 
			this.gravity(obj, 1 , -1);
			//calculates the push in the x direction
			var velocitytotalx = ((this.getxspeed() * this.getmass()) + (obj.getxspeed() * obj.getmass())) / (this.getmass() + obj.getmass());
			//calculates the push in the y direction
			var velocitytotaly = ((this.getyspeed() * this.getmass()) + (obj.getyspeed() * obj.getmass())) / (this.getmass() + obj.getmass());
			
			//adds the force
			this.setvelocity(velocitytotalx, velocitytotaly);
			return true;
		}
		else{
			return false;
		}
	},

	//returns the distance traveled
	getspeed: function () {
		return calculate_distance(this.p_px, this.getx(), this.p_py, this.gety());
	},

	getxspeed: function () {
		return this.p_px - this.getx();
	},

	getyspeed: function () {
		return this.p_py - this.gety();
	},
	
	clone: function() {
        var obj = Object.create(this);
		obj.p_mass = this.p_mass;
		obj.p_xforce = this.p_xforce;
		obj.p_yforce = this.p_yforce;
		obj.p_x = this.p_x;
		obj.p_y = this.p_y;
		obj.p_px = this.p_px;
		obj.p_py = this.p_py;
		obj.p_density = this.p_density;
		obj.p_width = this.p_width;
		return obj;
	}
};






