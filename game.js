var canv;
var ctx;

var v1; 
var v2;

function start(){
	//canvas set up	
	canv=document.getElementById("mycan");
	ctx=mycan.getContext("2d");	
	v1 = particle.create(10, 10, 999, 10);
	v2 = particle.create(300, 300, 555, 1000);
	requestAnimationFrame(paint);
}



function paint(){
	ctx.clearRect(0, 0, canv.width, canv.height);
	v1.gravity(v2);
	v1.update(1);	
	v2.update(1);
	v1.draw();
	v2.draw();
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
      v1.addforce(-1, 0);
      break; 

    // up 
    case 38:
    // action when pressing up key
      v1.addforce(0, -1);
      break; 

    // right 
    case 39:
    // action when pressing right key
      v1.addforce(1, 0);
      break; 

    // down
    case 40:
    // action when pressing down key
      v1.addforce(0, 1);
      break; 

    default: 
      break; 
  } 
}
