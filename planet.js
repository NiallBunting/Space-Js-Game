var planet = {

	p_colour: 999,
	p_orbit_object: 0,
	p_orbit_dist: 0,
	
	create: function(x, y, mass, width, colour){
		var obj = Object.create(this);
		obj.physical = particle.create("planet", x, y, mass, width);
		obj.atmosphere = atmosphere.create(width + 1000);
		obj.p_colour = colour;
		return obj;
	},

	orbit: function(obj){
		this.p_orbit_object = obj;
	
		var velocity = (GAME_GRAVITY * (obj.physical.getmass() + this.physical.getmass()));

		this.p_orbit_dist = calculate_distance(obj.physical.getx() , this.physical.getx(), obj.physical.gety(), this.physical.gety());
		
		velocity /= this.p_orbit_dist;
		
		velocity = Math.sqrt(velocity * 0.1);

		this.physical.setvelocity(velocity, 0);

	},

	draw: function () {
		this.atmosphere.draw(this.physical.getx(), this.physical.gety());
		ctx.fillStyle= '#' + this.p_colour;
		ctx.beginPath();
		ctx.arc(this.physical.getx() + screen.x, this.physical.gety() + screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	},

	update: function (time) {		
		this.keep_orbit();
		this.physical.update(time);

	},
	
	keep_orbit: function (){
		if(this.p_orbit_object == 0){return;}
		var dist = calculate_distance(this.physical.getx() , this.p_orbit_object.physical.getx(), this.physical.gety(), this.p_orbit_object.physical.gety());
	
		// NEEDS TO WORK OUT ANGLE IT IS AND THEN THE DISTANCE FROM ITS PROPPER POSITION
	
		if(dist < this.p_orbit_dist){
			//TODO
		}
		
		if(dist > this.p_orbit_dist){
			//TODO
		}
	},

	collided: function(obj){
		this.physical.collided(obj);
	}


};

var atmosphere = {
	p_thickness: 0,
	p_breathable: 0,
	p_colour: 0,
	p_weather: 0,
	p_radius: 10,
	
	create: function(radius){
		var obj = Object.create(this);
		obj.physical = particle.create(0, 0, 200, radius);
		obj.p_radius = radius;
		obj.physical.setdensity(0.01);
		return obj;
	},
	
	draw: function(x, y){
		this.physical.setx(x);
		this.physical.sety(y);
		ctx.fillStyle= "rgba(200, 200, 200, 0.5)";
		ctx.beginPath();
		ctx.arc(this.physical.getx() + screen.x, this.physical.gety() + screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	}
};
