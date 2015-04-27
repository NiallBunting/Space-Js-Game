//Ai to control the ship
var shipai = {

	//10 is perfect karma
	p_karmawithplayer: 10,
	p_destinationx: 0,
	p_destinationy: 0,
	p_player: 0,
	p_previousdisttoattack: 0,
	p_previousangletoattack: 0,
		
	create: function(player){
		var dist= this.createdistance() * this.createdistance();
		var obj = Object.create(this);
		obj.ship = ship.create();
		obj.physical = obj.ship.physical;
		var targetposangle = Math.random() * 2 * Math.PI;
		obj.ship.p_hp = 50;
		obj.physical.setx((player.physical.p_x + (dist * Math.cos(targetposangle))));
		obj.physical.sety((player.physical.p_y + (dist * Math.cos(targetposangle))));
		obj.physical.p_px = (player.physical.p_px) + (dist * Math.cos(targetposangle));
		obj.physical.p_py = (player.physical.p_py) + (dist * Math.cos(targetposangle));
		obj.physical.p_mass = (Math.random() * 5) + 5;
		obj.p_player = player;
		obj.ship.weapon.p_power = 5;
		obj.ship.p_direction = Math.random() * 2 * Math.PI;
		obj.ship.p_fuel = 5000;
		obj.ship.p_player = false;
		return obj;
	},

	createdistance:function(){
		return (game.getplayer().physical.getspeed() / 6) + 100;
	},
	update: function(time){		

		if(this.ship.getfuel() < 0){
			
			this.ship.destroy();
		}		
		var shipval = this.ship.update(time);

		this.attack(this.p_player);

		return shipval;
	},

	draw: function() {
		this.ship.draw();
	},
	
	collided: function(obj){
		if(this.ship.physical.collided(obj)){
			if(obj.gettype() == "planet"){
				this.ship.damage(1);
			}
		}
	},
	
	draw: function(){
		this.ship.draw();
	},
	
	attack: function(obj){
		//this function can cause the ship to effectivly orbit
		var point = this.pointat(obj);
		
		var dir = point[0];
		
		var disttoplayer = calculate_distance(this.physical.getx(),obj.physical.getx(), this.physical.gety(), obj.physical.gety());
		
		var speeddiffrence = this.physical.getspeed() / obj.physical.getspeed();
		
		//console.log(speeddiffrence+ " " + disttoplayer + " " + dir);
		
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
		
		if(disttoplayer < 50){
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
		return [returnval, directiontoship];
	}
	
}

// AI state
//Friendy - Won't attack if under attack. Calls police
//Neutral - Will attack you if attacked
//Enemy- Engages you

//Need to get close
// -- Need to move forward as can't side move
//Then shoots at you
