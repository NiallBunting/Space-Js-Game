//Ai to control the ship
var shipai = {

		
	create: function(){
		var obj = Object.create(this);
		obj.ship = ship.create();
		obj.physical = obj.ship.physical;
		obj.ship.physical.setx(10);
		return obj;
	},

	update: function(time){
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
	}
}
