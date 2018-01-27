"use strict"
// nothing here yet
Sugar.extend();
$(init);

var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d")
var note = "hrmm";
var level = {
  pegs: [],
  cogs:[]
}
var cogImage = [];

function init() {
  $(".content").append($(canvas));
  
  canvas.width=1800;
  canvas.height=900;
  waitForImages();
}


function waitForImages() {

   ctx.clearRect(0,0,canvas.width,canvas.height);
   if (imagesPending.length > 0) {
    ctx.star(randInt(2000),randInt(1000),randInt(500),1+Math.random(),randInt(20)+3,randInt(360));
    ctx.fill();
    ctx.fillText(JSON.stringify(imagesPending),10,10);

    requestAnimationFrame(waitForImages);
   } else gameInit();
  
}



function gameInit() {
  $(canvas).on("mousemove", handleMouseMove)
           .on("mouseup", handleMouseUp)
           .on("mousedown", handleMouseDown)


  cogImage[8]=Assets.cog8;
  cogImage[12]=Assets.cog12;
  cogImage[16]=Assets.cog16;
  cogImage[20]=Assets.cog20;
  cogImage[100]=Assets.cog100;
  
  let  fixedpegs=  [ 
    [0,-1000],[0,1000],[-750,-270], [-750,0], [-750, 270],[750,-270],[750,270]
  ]

  let puzzlePegs = [[-41,273] ,[-70,90] , [-90,-77], [10,-180], [135,-293] ];

  for (let [x,y] of [...fixedpegs,...puzzlePegs] ) {
    level.pegs.push(makePeg(x,y));
  }
  let pegs=level.pegs;

  let top = makeCog(pegs[0],100);
  let bottom = makeCog(pegs[1],100);
  top.fixed=true;
  bottom.fixed=true;

  level.cogs.push(top);
  level.cogs.push(bottom);

  level.cogs.push(makeCog(pegs[2],8));
  level.cogs.push(makeCog(pegs[3],12));
  level.cogs.push(makeCog(pegs[4],16));
  level.cogs.push(makeCog(pegs[5],20));
  level.cogs.push(makeCog(pegs[6],20));
/*
  for (let ty=0; ty<6; ty++) {
    for (let tx=0; tx<8; tx++) {
      if ( (tx+ty)&1 == 1 ) {
        let peg = makePeg(tx*135-500,ty*135-400);
        level.pegs.push(peg);
      }
    }
  }
  */
  update();
}

var mouseDownPosition;
var mouse;
var cogUnderMouse;

var pegUnderMouse;

var dragging=null;
var dragOffset;

function handleMouseDown(e) {
  let x=e.offsetX;
  let y=e.offsetY;
  mouseDownPosition= mouseToWorld({x,y});
  if (cogUnderMouse) {
    let cogPos = cogUnderMouse.getPosition();
    let {x,y}=mouseDownPosition;
    let dx=x-cogPos.x;
    let dy=y-cogPos.y;

    dragOffset={dx,dy};
    dragging=cogUnderMouse;

    console.log({dragging,dx,dy});
  }
}

function handleMouseUp(e) {
  if (dragging) {
    let peg = pegUnderPos(dragging.getPosition())
    if (peg) {
      dragging.setPeg(peg);
    }
  }
  dragging=false;
}

function mouseToWorld(pos) {
  let x= pos.x-canvas.width/2;
  let y= pos.y-canvas.height/2;
  return {x,y};
}

function distance(a,b) {
  let dx=a.x-b.x;
  let dy=a.y-b.y;
  return Math.sqrt(dx*dx+dy*dy);
}

function cogUnderPos(pos) {
  var best=null;
  for (let cog of level.cogs) {
    if (cog.fixed) continue;
    if (distance(pos,cog.getPeg().getPosition()) < cog.radius) {
      if (best) {
        if (cog.radius<best.radius) {
          best=cog;
        }
      } else best = cog;
    }
  }
  return best;
}

function pegUnderPos(pos) {
  for (let peg of level.pegs) {
    if (distance(pos,peg.getPosition()) < 100) {
      return peg;
    }
  }
  return null;
}


function handleMouseMove(e) {
  let x=e.offsetX;
  let y=e.offsetY;

  mouse={x,y};
  cogUnderMouse=cogUnderPos(mouseToWorld(mouse));
  pegUnderMouse=pegUnderPos(mouseToWorld(mouse));
  note=JSON.stringify(mouseToWorld(mouse));
}

function update() {
  move();
  draw();
  requestAnimationFrame(update);
}

function move() {
 for (let e of [...level.pegs,...level.cogs]) {
    e.move();
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if (imagesPending.length > 0) {
    ctx.fillText(JSON.stringify(imagesPending),10,10);

    return
  }
  ctx.fillText(note,10,10);
  ctx.save();
  
  ctx.translate(canvas.width/2,canvas.height/2);

  for (let e of [...level.pegs,...level.cogs]) {
    e.draw();
  }
  ctx.restore();  
}


function makePeg(x,y) {
  function move(){}
  function draw() {
    ctx.fillStyle="#00f"
    ctx.beginPath();
    ctx.ellipse(x,y,5,5,0,0,Math.PI*2);
    ctx.fill();
    ctx.polygon(x,y,10,20,0);
    ctx.stroke();
  }
  function getPosition() {
    return {x,y}
  }
  return {move,draw,getPosition}
}

function drawSprite(image,x,y,frame=0) {
  let frameWidth = image.width;
  let frameHeight = image.height;
  let oy=0;
  let ox=0;
  if (image.framesWide) {
    frameWidth = image.width / image.framesWide;
    oy= Math.floor(frame/image.framesWide);
  }
  if (image.framesHigh) {
    frameHeight = image.height / image.framesHigh;
    ox= frame%image.framesWide;
  }
  let hx = frameWidth/2;
  let hy = frameHeight/2;

  
    ctx.drawImage(image,ox*frameWidth,oy*frameHeight,frameWidth,frameHeight,x-hx,y-hy,frameWidth,frameHeight);
    

}


function makeCog(peg,teeth) {
  let mouthFrame=0; 
  let angle=Math.random();
  let radius = (teeth*37.7)/(Math.PI*2);
  let eyeSize = radius/10;
  let rotation =(1/radius);
  
  if (Math.random()<0.5) rotation=-rotation; 
  let self = {move,draw,getPosition,radius,setPeg,getPeg};
  let ratio = (radius+20)/radius;
  //let teeth = Math.floor((radius*Math.PI*2)/38);
  var image; 
  if (cogImage[teeth]) {
    image = cogImage[teeth];//scaledImage(cogImage[teeth],radius*2.5,radius*2.5);
  } else image = scaledImage(Assets.gear2,radius*2,radius*2);
  

  function getPosition() {
    if (dragging == self) {
      let {x,y}=mouseToWorld(mouse);
      let {dx,dy} = dragOffset;
      x-=dx;
      y-=dy;
      return {x,y};
    } else {
      return peg.getPosition();
    }
  }
  function makeEyeBall(x,y) {
    let base=blankCanvas(eyeSize*2);
    let c=base.getContext("2d")

    c.fillStyle="red";

    c.polygon(base.width/2,base.height/2,eyeSize,20);
    c.fill()
    c.globalCompositeOperation="source-atop";
    let eye=Assets.eyeball;
    c.drawImage(eye,(base.width-eye.width)/2 +x, (base.height-eye.height)/2 +y); 
    return base;
  }
  function drawAt(x,y) {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle); 
    
    ctx.fillStyle="rgba(0,255,255,0.2)";
    ctx.beginPath();
    ctx.star(0,0,radius,ratio,teeth,0);
    ctx.fill();  
    if (cogUnderMouse==self) {
      ctx.lineWidth=3;
      ctx.strokeStyle="orange";
      ctx.stroke();  
    }

    drawSprite(image,0,0);
    //drawSprite(Assets.png8,0,0);
    drawSprite(Assets.blarg,0,radius/2,mouthFrame);
    //ctx.drawImage(image,-image.width/2,-image.height/2);

    let leftEye = makeEyeBall(Math.sin(angle*4)*eyeSize/3,3+Math.cos(angle*4)*eyeSize/3);
    drawSprite(leftEye,-radius/2,-radius/3)
    let rightEye = makeEyeBall(Math.sin(angle*4)*eyeSize/3,3+Math.cos(angle*4)*eyeSize/3);
    drawSprite(leftEye,radius/2,-radius/2)
    
/*
    ctx.fillStyle="rgba(250,250,192,1)";
    ctx.polygon(-radius/2,-radius/3,eyeSize,20);
    ctx.fill();
    ctx.polygon(+radius/2,-radius/2,eyeSize,20);
    ctx.fill();

    ctx.fillStyle="rgba(0,0,0,1)";
    {
      
      ctx.polygon((-radius/2)+Math.sin(angle*2)*eyeSize/3,-radius/3+Math.cos(angle*2)*eyeSize/2,eyeSize/2,20);
      ctx.fill();
      ctx.polygon((radius/2)+Math.sin(angle*2)*eyeSize/3,-radius/2+Math.cos(angle*2)*eyeSize/2,eyeSize/2,20);
      ctx.fill();
    }
*/
    ctx.restore();

  }
  function setPeg(newPeg) {
    peg=newPeg;
  }
  function getPeg() {
    return peg;
  }
  function move() {
    angle+=rotation;
    mouthFrame+=1;
    if (mouthFrame >9){mouthFrame=0}
  }
  function draw() {
      let {x,y} = getPosition();
      drawAt(x,y);    
  }
  return self;
  
}