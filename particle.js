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
	gravity: function (obj) {
		var grav = 2;
		var xdist = obj.getx() - this.getx();
		var ydist = obj.gety() - this.gety();
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		var force = (grav * this.getmass() * obj.getmass()) / (dist * dist);
		this.p_xforce += force * (xdist/dist);
		this.p_yforce += force * (ydist/dist);
	},

	//calculates gravity and negates it on an a object
	floorpush: function (obj) {
		var xdist = obj.getx() - this.getx();
		var ydist = obj.gety() - this.gety();
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		var force = (grav * this.getmass() * obj.getmass()) / (dist * dist);
		this.p_xforce -= force * (xdist/dist);
		this.p_yforce -= force * (ydist/dist);
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
	
	//Checks if circles have collided, then applys the force
	collided: function (obj) {
		if(this.havecollided(obj)){
			//negates gravity (pushes up from the ground) 
			this.floorpush(obj);
			//calculates the push in the x direction
			var velocitytotalx = ((this.getxspeed() * this.getmass()) + (obj.getxspeed() * obj.getmass())) / (this.getmass() + obj.getmass());
			var forcex = (this.getmass() * velocitytotalx) - (this.getmass() * this.getxspeed());
			//calculates the push in the y direction
			var velocitytotaly = ((this.getyspeed() * this.getmass()) + (obj.getyspeed() * obj.getmass())) / (this.getmass() + obj.getmass());
			var forcey = (this.getmass() * velocitytotaly) - (this.getmass() * this.getyspeed());
			//forcex *= obj.getdensity();
			//forcey *= obj.getdensity();
			//adds the force
			this.addforce(-forcex, -forcey);
			return true;
		}
		else{
			return false;
		}
	},

	//returns the distance traveled
	getspeed: function () {
		var xdist = this.p_px - this.getx();
		var ydist = this.p_py - this.gety();
		return Math.sqrt((xdist * xdist) + (ydist * ydist));
	},

	getxspeed: function () {
		return this.p_px - this.getx();
	},

	getyspeed: function () {
		return this.p_py - this.gety();
	}
};






