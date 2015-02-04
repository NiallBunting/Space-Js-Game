var square;

var canv;
var ctx;

function start(){
	//canvas set up
	canv=document.getElementById("mycan");
	ctx=mycan.getContext("2d");
	requestAnimationFrame(paint);
	square = {};
	square.x = 10;
	square.y = 10;
}



function paint(){
	canv.width=canv.width;
	ctx.fillStyle='#aaa';
	ctx.fillRect(0,0,mycan.width,mycan.height);
	ctx.fillStyle='#000';
	ctx.fillRect(square.x, square.y, 40, 40);
	//alert("paint");
	requestAnimationFrame(paint);
}


// for multiple keys: http://stackoverflow.com/questions/5203407/javascript-multiple-keys-pressed-at-once
document.onkeydown= function(event) {
  var keyCode; 
  
  if(event == null)
  {
    keyCode = window.event.keyCode; 
  }
  else 
  {
    keyCode = event.keyCode; 
  }
  console.log(keyCode);  
  
  switch(keyCode)
  {
  
    // left 
    case 37:
      square.x--;
      break; 

    // up 
    case 38:
    // action when pressing up key
      square.y--;
      break; 

    // right 
    case 39:
    // action when pressing right key
      square.x++;
      break; 

    // down
    case 40:
    // action when pressing down key
	square.y++;
      break; 

    default: 
      break; 
  } 
}
