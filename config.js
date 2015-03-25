//gravity in the game
var GAME_GRAVITY = 6;

//The max the game will jump on an update cycle
var MAX_TIME_OUT = 0.2;

//Global Varibles
var canv;
var ctx;

var screen = {};
screen.x = 100;
screen.y = 100;

var oldtime;

//keys pressed down
var keys = [];

var mouseplace = {};
mouseplace.x = 0;
mouseplace.y = 0;
