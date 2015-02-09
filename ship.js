var ship = {


	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(40, 300, 999, 10, 10);
		return obj;
	},

	draw: function () {
		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		ctx.arc(this.p_x, this.p_y, this.p_width, 0, 2 * Math.PI);
		ctx.fill();
	}










}