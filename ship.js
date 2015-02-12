var ship = {

	direction: 0,

	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(30, 30, 10, 10);
		return obj;
	},

	draw: function() {

		screen.x = -this.physical.getx()+ canv.width/2;
		screen.y = -this.physical.gety() + canv.height/2;

		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		ctx.arc(canv.width/2, canv.height/2, this.physical.getradius(), 0, 2 * Math.PI);

		//ctx.moveTo(100,110);
		//ctx.lineTo(200,10);
		//ctx.lineTo(300,110);
		//ctx.closePath();
		ctx.fill();

		document.getElementById("pos").innerHTML = "X:" + Math.round(this.physical.getx()) + " Y:" + Math.round(this.physical.gety()) + " Speed:" + this.physical.getspeed();
	}

};
