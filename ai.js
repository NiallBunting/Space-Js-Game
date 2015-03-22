//Ai to control the ship
var shipai = {

	//10 is perfect karma
	p_karmawithplayer: 10,
	p_destinationx: 0,
	p_destinationy: 0,
	p_player: 0,
		
	create: function(player){
		var obj = Object.create(this);
		obj.ship = ship.create();
		obj.physical = obj.ship.physical;
		obj.physical.setx(10);
		this.p_player = player;
		return obj;
	},

	update: function(time){		
		this.attack();
		this.ship.update(time);
	},

	draw: function() {
		this.ship.draw();
	},
	
	collided: function(obj){
		this.ship.physical.collided(obj);
	},
	
	draw: function(){
		this.ship.draw();
	},
	
	attack: function(){
		var directiontoship = Math.atan2(this.p_player.physical.gety() - this.physical.gety(), this.p_player.physical.getx() - this.physical.getx());
		
		console.log("D:" + directiontoship);
		
		var direction = this.ship.getrotation() - directiontoship;	
		console.log(direction);
		if(direction < -Math.PI){direction += Math.PI * 2;}	
		if(direction > Math.PI){direction -= Math.PI * 2;}

		console.log(direction);
		
		if(direction > 0){
			console.log("false");
			this.ship.spin(false);
		}

		if(direction < 0){
			console.log("true");
			this.ship.spin(true);
		}

		//this.ship.up();

	}
	
}

// AI state
//Friendy - Won't attack if under attack. Calls police
//Neutral - Will attack you if attacked
//Enemy- Engages you

//Need to get close
// -- Need to move forward as can't side move
//Then shoots at you
