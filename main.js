"use strict"
// nothing here yet
Sugar.extend();
$(init);

var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d")

function init() {
  $(".content").append($(canvas));
  
  canvas.width=1800;
  canvas.height=900;

  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.lineTo(1800,900);
  ctx.moveTo(0,900);
  ctx.lineTo(1800,0);
  ctx.stroke();

}

