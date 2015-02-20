var planet = {

	create: function(x, y, mass, width){
		var obj = Object.create(this);
		obj.physical = particle.create(x, y, mass, width);
		obj.atmosphere = atmosphere.create(width + 1000);
		return obj;
	},

	draw: function () {
		this.atmosphere.draw(this.physical.getx(), this.physical.gety());
		ctx.fillStyle= '#' + '999';
		ctx.beginPath();
		ctx.arc(this.physical.getx() + screen.x, this.physical.gety() + screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
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
		obj.physical = particle.create(0, 0, 0, radius);
		obj.p_radius = radius;
		return obj;
	},
	
	draw: function(x, y){
		this.physical.setx(x);
		this.physical.sety(y);
		ctx.fillStyle= '#' + 'ccc';
		ctx.beginPath();
		ctx.arc(this.physical.getx() + screen.x, this.physical.gety() + screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	}
};