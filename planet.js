var planet = {

	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(5000, 5000, 200000, 4000);
		return obj;
	},

	draw: function () {
		ctx.fillStyle= '#' + '999';
		ctx.beginPath();
		ctx.arc(this.physical.getx() + screen.x, this.physical.gety() + screen.y, this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	}


};
