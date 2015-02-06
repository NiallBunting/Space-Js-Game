var particle = {

	//The internal values, prefixed with a p_ (for private)
        p_mass: 10,
	p_xforce: 0,
	p_yforce: 0,
        p_x: 200,
        p_y: 200,
	p_px: 200,
	p_py: 200,
        p_drawing: 0,
	color: 0,

        create: function (x, y, col, mass) {
            var obj = Object.create(this);
	    obj.setx(x);
	    obj.sety(y);
	    obj.color = col;
	    obj.setmass(mass);
            return obj;
        },

        getx: function () {
            return this.p_x;
        },

	setx: function (value) {
	    this.p_x = this.p_px = value;
	},

        gety: function () {
            return this.p_y;
        },

	sety: function (value) {
	    this.p_y = this.p_py = value;
	},

        getmass: function () {
            return this.p_mass;
        },

        setmass: function (value) {	
	    this.p_mass = value;
        },

	update: function (time) {

		var accelx = this.p_xforce;
		var accely = this.p_yforce;

		this.p_xforce = 0;
		this.p_yforce = 0;

		this.p_x += accelx * time * time;
		this.p_y += accely * time * time;

		var x = this.p_x * 2 - this.p_px;
		var y = this.p_y * 2 - this.p_py;
		this.p_px = this.p_x;
		this.p_py = this.p_y;
		this.p_x = x;
		this.p_y = y;

	},

	gravity: function (obj) {
		var grav = 2;
		var xdist = obj.getx() - this.getx();
		var ydist = obj.gety() - this.gety();
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		var force = (grav * this.getmass() * obj.getmass()) / (dist * dist);
		this.p_xforce += force * (xdist/dist);
		this.p_yforce += force * (ydist/dist);
	},

	addforce: function (xforce, yforce) {
		this.p_xforce += xforce;
		this.p_yforce += yforce;
	},

	draw: function () {
		ctx.fillStyle= '#' + this.color;
		ctx.fillRect(this.p_x,this.p_y,40,40);		
	}

    };






