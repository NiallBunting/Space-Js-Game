var planet = {

	p_colour: 999,
	p_orbit_object: 0,
	p_orbit_dist: 0,
	
	create: function(x, y, mass, width, colour){
		var obj = Object.create(this);
		obj.physical = particle.create("planet", x, y, mass, width);
		obj.atmosphere = atmosphere.create(width, 3000);
		obj.p_colour = colour;
		return obj;
	},

	orbit: function(obj){
		this.p_orbit_object = obj;
	
		var velocity = (game.getgravity() * (obj.physical.getmass() + this.physical.getmass()));

		this.p_orbit_dist = calculate_distance(obj.physical.getx() , this.physical.getx(), obj.physical.gety(), this.physical.gety());
		
		velocity /= this.p_orbit_dist;
		
		velocity = Math.sqrt(velocity * 0.1);

		//this.physical.setvelocity(velocity, 0);

	},

	draw: function () {
		this.atmosphere.draw(this.physical.getx(), this.physical.gety());
		game.getcontext().fillStyle= '#' + this.p_colour;
		game.getcontext().beginPath();
		game.getcontext().arc(this.physical.getx() + game.screen.x, this.physical.gety() + game.screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		game.getcontext().fill();
	},

	update: function (time) {		
		this.keep_orbit();
		this.physical.update(time);
		
		return 0;
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
	p_atmospheresize: 0,
	
	create: function(radius, atmospheresize){
		radius += atmospheresize;
		var obj = Object.create(this);
		obj.p_atmospheresize = atmospheresize;
		obj.physical = particle.create("atmosphere", 0, 0, 200, radius);
		obj.p_radius = radius;
		obj.physical.setdensity(0.01);
		return obj;
	},
	
	draw: function(x, y){
		this.physical.setx(x);
		this.physical.sety(y);


		var gradient = game.getcontext().createRadialGradient(this.physical.getx() + game.screen.x,this.physical.gety() + game.screen.y,this.physical.getradius() - this.p_atmospheresize,this.physical.getx() + game.screen.x,this.physical.gety() + game.screen.y,this.physical.getradius());
		gradient.addColorStop(0,"rgba(200, 200, 255, 1)");
		gradient.addColorStop(1,"rgba(0, 0, 0, 0.1)");

		// Fill with gradient
		game.getcontext().fillStyle = gradient;


		//game.getcontext().fillStyle= "rgba(200, 200, 255, 0.7)";
		game.getcontext().beginPath();
		game.getcontext().arc(this.physical.getx() + game.screen.x, this.physical.gety() + game.screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		game.getcontext().fill();
	}
};
