var ship = {

	p_direction: 0,
	// power forward, back, left, right
	p_power: [10 , -3, -0.01, 0.01],
	p_spin: 0,

	create: function(){
		var obj = Object.create(this);
		obj.physical = particle.create(0, 120000, 10, 10);
		return obj;
	},
	
	update: function(time){
		this.physical.update(time);
	
		this.p_direction += (this.p_spin * time);
		
		screen.x = -this.physical.getx()+ canv.width/2;
		screen.y = -this.physical.gety() + canv.height/2;
		
		//console.log("X:" + Math.round(this.physical.getx()) + " Y:" + Math.round(this.physical.gety()) + " Speed:" + this.physical.getspeed());
		
	},

	draw: function() {
		ctx.fillStyle= '#' + '900';
		ctx.beginPath();
		//ctx.arc(canv.width/2, canv.height/2, this.physical.getradius(), 0, 2 * Math.PI);

		//https://en.wikipedia.org/wiki/Circle#Equations
		ctx.moveTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.p_direction)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.p_direction)));
		ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.p_direction + 2.4)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.p_direction + 2.4)));
		ctx.lineTo(canv.width/2 + (this.physical.getradius() * Math.cos(this.p_direction + 3.8)) , canv.height/2 + (this.physical.getradius() * Math.sin(this.p_direction + 3.8)));
		ctx.closePath();
		ctx.fill();
	},


	left: function(){
		this.spin(false);
	},

	right: function(){
		this.spin(true);
	},

	up: function(){
		this.forward(this.p_power[0]);
	},

	down: function(){
		this.forward(this.p_power[1]);
	},
	
	spin: function(right){
		var spinner = right ? this.p_power[3] : this.p_power[2];
		this.p_spin += (spinner / this.physical.getmass());
		if(this.p_spin > 4.5){this.p_spin = 4.5;}
		if(this.p_spin < -4.5){this.p_spin = -4.5}
	},
	
	forward: function(power){
		this.physical.addforce(power * Math.cos(this.p_direction) , power * Math.sin(this.p_direction));
	},
	
	collided: function(obj){
		this.physical.collided(obj);
		//ATTENTION, this does not allow fast movemment on planet
		//if(this.physical.getspeed() > 10){
			//destroy
		//}else{
			//land
		//}
	}

};
