//Ai to control the ship
var shipai = {

	//10 is perfect karma
	p_karmawithplayer: 10,
	p_destinationx: 0,
	p_destinationy: 0,
	p_player: 0,
	p_previousdisttoattack: 0,
		
	create: function(player){
		var obj = Object.create(this);
		obj.ship = ship.create();
		obj.physical = obj.ship.physical;
		obj.physical.setx(10);
		this.p_player = player;
		return obj;
	},

	update: function(time){		
		this.attack(this.p_player);
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
	
	attack: function(obj){
		//this function can cause the ship to effectivly orbit
		var dir = this.pointat(obj);
		
		var disttoplayer = calculate_distance(this.physical.getx(),obj.physical.getx(), this.physical.gety(), obj.physical.gety());
		
		var speeddiffrence = this.physical.getspeed() / obj.physical.getspeed();
		
		console.log(speeddiffrence + " " + disttoplayer + " " + dir);
		
		var speedcorrecter = 1;
		for(var i = (speeddiffrence - 1.1);i > 0;i -= 0.1){
			speedcorrecter++;
		}
		
		speedcorrecter *= speedcorrecter;
		
		if(disttoplayer > (1500 * speedcorrecter)){
			if(dir > -0.15 && dir < 0.15){
				this.ship.up();
			}
		}
		
		if(disttoplayer > (250 * speedcorrecter) && disttoplayer < (1500 * speedcorrecter)){
			if(dir > -0.1 && dir < 0.1){
				if(this.p_previousdisttoattack > disttoplayer){
					if(speeddiffrence < 1.04){this.ship.up();}
					else{this.ship.down();}
				}
				else{
					this.ship.up();
				}				
			}
			this.p_previousdisttoattack = disttoplayer;
		}
		
		if(disttoplayer > 30 && disttoplayer < 300){
			if(dir > -0.5 && dir < 0.5){
					this.ship.shoot();
			}
		}
		
		if(disttoplayer < (250 * speedcorrecter)){
				this.ship.down();
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
