var particle = {

	//The internal values, prefixed with a p_ (for private)
   	p_mass: 10,
	p_xforce: 0,
	p_yforce: 0,
   	p_x: 200,
   	p_y: 200,
	p_px: 200,
	p_py: 200,

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

        setmass: function (value) {	
	    this.p_mass = value;
        },
		
		getradius: function () {
			return this.p_width;
		},

	//updated all the physics
	update: function (time) {
		
		var accelx = this.p_xforce;
		var accely = this.p_yforce;

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
		if(this.collided(obj)){return;}
		var grav = 2;
		var xdist = obj.getx() - this.getx();
		var ydist = obj.gety() - this.gety();
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		var force = (grav * this.getmass() * obj.getmass()) / (dist * dist);
		this.p_xforce += force * (xdist/dist);
		this.p_yforce += force * (ydist/dist);
	},

	//adds a force to an object
	addforce: function (xforce, yforce) {
		this.p_xforce += xforce;
		this.p_yforce += yforce;
	},
	
	//Checks if circles have collided
	collided: function (obj) {
		var xdist = obj.getx() - this.getx();
		var ydist = obj.gety() - this.gety();
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		var radiustotal = this.getradius() + obj.getradius();
		if(dist <= radiustotal){
			return radiustotal - dist;
		}
		else{
			return 0;
		}
	},

	//returns the distance traveled
	getspeed: function () {
		var xdist = this.p_px - this.getx();
		var ydist = this.p_py - this.gety();
		return Math.round(Math.sqrt((xdist * xdist) + (ydist * ydist)));
	},
	
	//TODO
	//adds some friction to be calcualted
	applypush: function(frictionval, direction){
		//should add a force in the wrong direction,
		//takes in a percentage slowed down
		var xdist = this.p_px - this.getx();
		var ydist = this.p_py - this.gety();
		
		xdist *= frictionval;
		ydist *= frictionval;
		
		if(frictionval == 1){
			//need to stop things getting in eachother
		}
		
		this.addforce(xdist, ydist);
	}

};






