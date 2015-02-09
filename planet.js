var planet = {

	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(400, 400, 400, 100);
		return obj;
	},

	draw: function () {
		ctx.fillStyle= '#' + '999';
		ctx.beginPath();
		ctx.arc(this.physical.getx(), this.physical.gety(), this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	}


};
