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
		var direction = Math.atan2(this.physical.getx() - this.p_player.physical.getx(), this.physical.gety() - this.p_player.physical.gety());
		
		console.log("D:" + direction);
		
		var normaledshipdirec = this.ship.getrotation();
		//- (Math.PI/2);
		//if(normaledshipdirec < -Math.PI){normaledshipdirec += (Math.PI * 2);}
		
		//var diffrence = direction - normaledshipdirec;
		
		
		console.log(normaledshipdirec);
		//this.ship.spin(true);
	}
	
}

// AI state
//Friendy - Won't attack if under attack. Calls police
//Neutral - Will attack you if attacked
//Enemy- Engages you

//Need to get close
// -- Need to move forward as can't side move
//Then shoots at you