var playerdisplay = {

	p_target: null,

	create: function(){
		var obj = Object.create(this);
		return obj;
	},

	gettarget: function (){
		return this.p_target;
	},
	
	settarget: function (id) {
		this.p_target = id;
	}

};