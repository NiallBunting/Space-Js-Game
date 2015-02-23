//gravity in the game
var grav = 6;

//The max the game will jump on an update cycle
var MAX_TIME_OUT = 1;

//Global Varibles
var canv;
var ctx;

var screen = {};
screen.x = 100;
screen.y = 100;

var oldtime;

var debugoff = 0;

//keys pressed down
var keys = [];
