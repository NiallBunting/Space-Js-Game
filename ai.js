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
		var dir = this.pointat(this.p_player);
		
		var disttoplayer = calculate_distance(this.physical.getx(), this.p_player.physical.getx(), this.physical.gety(), this.p_player.physical.gety());
		
		var speeddiffrence = this.physical.getspeed() / this.p_player.physical.getspeed();
		
		console.log(speeddiffrence + " " + disttoplayer); 
		
		if(disttoplayer > 1000){
			if(dir > -0.18 && dir < 0.18){
				this.ship.up();
			}
		}
		
		if(disttoplayer > 250 && disttoplayer < 1000){
			if(dir > -0.1 && dir < 0.1){
				if(speeddiffrence < 1.04){this.ship.up(); console.log("F");}
				else{this.ship.down(); console.log("B");}
			}
		}
		
		if(disttoplayer > 30 && disttoplayer < 300){
			if(dir > -0.5 && dir < 0.5){
					this.ship.shoot();
			}
		}
		
		if(disttoplayer < 250){
			if(speeddiffrence > 0.97){
				this.ship.down();
			}
		}

	},
	
	pointat: function(obj){
		var directiontoship = Math.atan2(obj.physical.gety() - this.physical.gety(), obj.physical.getx() - this.physical.getx());
		
		var direction = directiontoship - this.ship.p_direction;
		if(direction < -Math.PI){direction += Math.PI * 2;}	
		if(direction > Math.PI){direction -= Math.PI * 2;}
		var returnval = direction;
		
		if (direction < 0 && direction < this.ship.p_power[2]){direction = this.ship.p_power[2];}
		if (direction > 0 && direction > this.ship.p_power[3]){direction = this.ship.p_power[3];}
		
		this.ship.p_direction += direction;
		return returnval;
	}
	
}

// AI state
//Friendy - Won't attack if under attack. Calls police
//Neutral - Will attack you if attacked
//Enemy- Engages you

//Need to get close
// -- Need to move forward as can't side move
//Then shoots at you
