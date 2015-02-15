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

		//https://en.wikipedia.org/wiki/Circle#Equations
		var testx = canv.width/2 + (this.physical.getradius() * Math.cos(this.direction));
		var testy = canv.height/2 + (this.physical.getradius() * Math.sin(this.direction));
		
		ctx.moveTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.direction)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.direction)));
		ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.direction + 2.4)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.direction + 2.4)));
		ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.direction + 3.8)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.direction + 3.8)));
		ctx.closePath();
		ctx.stroke();

		document.getElementById("pos").innerHTML = "X:" + Math.round(this.physical.getx()) + " Y:" + Math.round(this.physical.gety()) + " Speed:" + this.physical.getspeed();
	},


	left: function(){
		this.direction -= 0.1;
	},

	right: function(){
		this.direction += 0.1;
	},

	up: function(){
		this.physical.addforce(0, -0.7);
	},

	down: function(){
		this.physical.addforce(0, 0.7);
	}

};
