var ship = {

	direction: 0,
	power: 0.7,
	spin: 0,

	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(30, 30, 10, 10);
		return obj;
	},

	draw: function() {

		this.direction += this.spin;
		console.log(this.spin);
		
		screen.x = -this.physical.getx()+ canv.width/2;
		screen.y = -this.physical.gety() + canv.height/2;

		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		//ctx.arc(canv.width/2, canv.height/2, this.physical.getradius(), 0, 2 * Math.PI);

		//https://en.wikipedia.org/wiki/Circle#Equations
		ctx.moveTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.direction)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.direction)));
		ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.direction + 2.4)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.direction + 2.4)));
		ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.direction + 3.8)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.direction + 3.8)));
		ctx.closePath();
		ctx.fill();

		document.getElementById("pos").innerHTML = "X:" + Math.round(this.physical.getx()) + " Y:" + Math.round(this.physical.gety()) + " Speed:" + this.physical.getspeed();
	},


	left: function(){
		this.spin -= 0.01;
	},

	right: function(){
		this.spin += 0.01;
	},

	up: function(){
		this.physical.addforce((this.power * Math.cos(this.direction)) , (this.power * Math.sin(this.direction)));
	},

	down: function(){
		this.physical.addforce(-(this.power * Math.cos(this.direction)) , -(this.power * Math.sin(this.direction)));
	}

};
