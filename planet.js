var planet = {

	colour: 999,

	create: function(x, y, mass, width, colour){
		var obj = Object.create(this);
		obj.physical = particle.create(x, y, mass, width);
		obj.atmosphere = atmosphere.create(width + 1000);
		obj.colour = colour;
		return obj;
	},

	draw: function () {
		this.atmosphere.draw(this.physical.getx(), this.physical.gety());
		ctx.fillStyle= '#' + this.colour;
		ctx.beginPath();
		ctx.arc(this.physical.getx() + screen.x, this.physical.gety() + screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	},

	update: function (time) {
		this.physical.update(time);
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
