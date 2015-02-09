var ship = {


	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(30, 30, 10, 10);
		return obj;
	},

	draw: function() {
		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		ctx.arc(this.physical.getx(), this.physical.gety(), this.physical.getradius(), 0, 2 * Math.PI);
		ctx.fill();
	}

};
